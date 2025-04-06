import 'package:flutter/material.dart';
import 'package:travel_buddy/screen/map_Full_screen.dart';

import 'package:travel_buddy/theme/theme.dart';
import 'package:travel_buddy/providers/itinerary_provider.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';


class PlaceDetailScreen extends StatefulWidget {
  final PlaceModel place;
  final int itineraryDay;

  const PlaceDetailScreen({
    Key? key,
    required this.place,
    required this.itineraryDay,
  }) : super(key: key);

  @override
  State<PlaceDetailScreen> createState() => _PlaceDetailScreenState();
}

class _PlaceDetailScreenState extends State<PlaceDetailScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late GoogleMapController _mapController;
  LatLng _userLocation = const LatLng(28.6129, 77.2295);
  bool _hasLoadedMap = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOut),
    );
    _animationController.forward();

    // Get user location from provider if available
    final itineraryProvider = Provider.of<ItineraryProvider>(context, listen: false);
    _userLocation = itineraryProvider.userLocation;

    // Mock location update
    Future.delayed(const Duration(milliseconds: 500), () {
      setState(() => _userLocation = itineraryProvider.userLocation);
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    if (_hasLoadedMap) _mapController.dispose();
    super.dispose();
  }

  void _onMapCreated(GoogleMapController controller) {
    _mapController = controller;
    _hasLoadedMap = true;
    if (Theme.of(context).brightness == Brightness.dark) {
      // Implement dark map style if needed
    }
  }

  @override
  Widget build(BuildContext context) {
    final itineraryProvider = context.read<ItineraryProvider>();
    final distance = '2.4 km'; // Mock distance calculation

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 240.0,
            flexibleSpace: _buildAppBarContent(),
            actions: _buildAppBarActions(),
          ),
          SliverToBoxAdapter(
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildPlaceHeader(itineraryProvider),
                    const SizedBox(height: 16),
                    _buildTimeAndDuration(),
                    const SizedBox(height: 24),
                    _buildDescriptionSection(),
                    const SizedBox(height: 24),
                    _buildPhotoGallery(),
                    const SizedBox(height: 24),
                    _buildMapSection(),
                    const SizedBox(height: 24),
                    _buildInfoSections(),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAppBarContent() {
    return FlexibleSpaceBar(
      background: Stack(
        fit: StackFit.expand,
        children: [
          Image.network(
            widget.place.imageUrl,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) => Container(
              color: AppTheme.primaryColor.withOpacity(0.2),
              child: const Center(child: Icon(Icons.image_not_supported, size: 50)),
            ),
          ),
          DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.bottomCenter,
                end: Alignment.topCenter,
                colors: [
                  Colors.black.withOpacity(0.7),
                  Colors.transparent,
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildAppBarActions() {
    return [
      IconButton(
        icon: const Icon(Icons.bookmark_border),
        onPressed: () => _handleBookmark(),
      ),
      IconButton(
        icon: const Icon(Icons.share_outlined),
        onPressed: () => _handleShare(),
      ),
    ];
  }

  Widget _buildPlaceHeader(ItineraryProvider provider) {
    return Row(
      children: [
        Expanded(
          child: Text(
            widget.place.name,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold),
          ),
        ),
        
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: widget.place.isVisited
                ? Colors.green.withOpacity(0.1)
                : AppTheme.primaryColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                widget.place.isVisited ? Icons.check_circle : Icons.radio_button_unchecked,
                size: 18,
                color: widget.place.isVisited ? Colors.green : AppTheme.primaryColor,
              ),
              const SizedBox(width: 6),
              Text(
                widget.place.isVisited ? 'Visited' : 'Mark Visited',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  color: widget.place.isVisited ? Colors.green : AppTheme.primaryColor,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildTimeAndDuration() {
    // Format the TimeOfDay objects to display time
    final startTimeFormatted = _formatTimeOfDay(widget.place.startTime);
    final endTimeFormatted = _formatTimeOfDay(widget.place.endTime);
    
    // Calculate duration string (e.g., "3 hours")
    final durationMinutes = (widget.place.endTime.hour * 60 + widget.place.endTime.minute) - 
                           (widget.place.startTime.hour * 60 + widget.place.startTime.minute);
    final durationHours = durationMinutes ~/ 60;
    final remainingMinutes = durationMinutes % 60;
    final durationText = remainingMinutes > 0 
        ? '$durationHours hrs $remainingMinutes mins'
        : '$durationHours hours';
    
    return Row(
      children: [
        Icon(Icons.access_time, size: 20, color: Theme.of(context).textTheme.bodySmall?.color),
        const SizedBox(width: 8),
        Text(
          'Day ${widget.itineraryDay} • $startTimeFormatted-$endTimeFormatted',
          style: AppTheme.captionStyle(context).copyWith(fontWeight: FontWeight.w600),
        ),
        const SizedBox(width: 16),
        Icon(Icons.timelapse, size: 20, color: Theme.of(context).textTheme.bodySmall?.color),
        const SizedBox(width: 8),
        Text(
          durationText,
          style: AppTheme.captionStyle(context).copyWith(fontWeight: FontWeight.w600),
        ),
      ],
    );
  }

  String _formatTimeOfDay(TimeOfDay time) {
    final now = DateTime.now();
    final dateTime = DateTime(now.year, now.month, now.day, time.hour, time.minute);
    return DateFormat('h:mm a').format(dateTime);
  }

  Widget _buildDescriptionSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('About', style: AppTheme.subHeadingStyle(context)),
        const SizedBox(height: 8),
        Text(widget.place.description, style: AppTheme.bodyStyle(context)),
      ],
    );
  }

  Widget _buildPhotoGallery() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Photos', style: AppTheme.subHeadingStyle(context)),
        const SizedBox(height: 12),
        SizedBox(
          height: 100,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: 5,
            itemBuilder: (context, index) => Container(
              width: 100,
              margin: const EdgeInsets.only(right: 12),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                image: DecorationImage(
                  image: NetworkImage(widget.place.imageUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMapSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Location', style: AppTheme.subHeadingStyle(context)),
        const SizedBox(height: 12),
        GestureDetector(
          onTap: () => Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => MapFullScreen(
                place: widget.place,
                userLocation: _userLocation,
              ),
            ),
          ),
          child: Container(
            height: 200,
            decoration: AppTheme.cardDecoration(context),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Stack(
                children: [
                  GoogleMap(
                    onMapCreated: _onMapCreated,
                    initialCameraPosition: CameraPosition(
                      target: widget.place.location,
                      zoom: 14,
                    ),
                    markers: {
                      Marker(
                        markerId: MarkerId(widget.place.id),
                        position: widget.place.location,
                        infoWindow: InfoWindow(title: widget.place.name),
                      ),
                      Marker(
                        markerId: const MarkerId('user_location'),
                        position: _userLocation,
                        icon: BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueAzure),
                        infoWindow: const InfoWindow(title: 'Your Location'),
                      ),
                    },
                  ),
                  _buildMapOverlay(),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMapOverlay() {
    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          border: Border(top: BorderSide(color: Theme.of(context).dividerColor)),
        ),
        child: Row(
          children: [
            Icon(Icons.location_pin, size: 18, color: AppTheme.primaryColor),
            const SizedBox(width: 8),
            Text(
              '2.4 km',
              style: TextStyle(
                color: Theme.of(context).brightness == Brightness.light
                    ? AppTheme.textLight
                    : AppTheme.textDark,
                fontWeight: FontWeight.w600,
              ),
            ),
            const Spacer(),
            TextButton.icon(
              icon: Icon(Icons.open_in_new, size: 16, color: AppTheme.primaryColor),
              label: Text('Open Map', 
                style: TextStyle(color: AppTheme.primaryColor, fontWeight: FontWeight.w600)),
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => MapFullScreen(
                    place: widget.place,
                    userLocation: _userLocation,
                    ),
                  ),
                ),
              ),
            
          ],
        ),
      ),
    );
  }

  Widget _buildInfoSections() {
    // Since we're using PlaceModel which might not have these fields directly,
    // we'll show some default/mock values for demonstration
    return Column(
      children: [
        _buildInfoSection(
          icon: Icons.credit_card,
          title: 'Entry Fee',
          value: 'INR 50', // Default value or can be determined from place type
        ),
        _buildInfoSection(
          icon: Icons.accessibility_new,
          title: 'Accessibility',
          value: 'Wheelchair Friendly',
        ),
        _buildInfoSection(
          icon: Icons.star_rate,
          title: 'Rating',
          value: '4.5/5 (250 reviews)', // Mock value
        ),
      ],
    );
  }

  Widget _buildInfoSection({required IconData icon, required String title, required String value}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Theme.of(context).textTheme.bodySmall?.color),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: AppTheme.captionStyle(context)),
              const SizedBox(height: 4),
              Text(value, 
                style: AppTheme.bodyStyle(context).copyWith(fontWeight: FontWeight.w600)),
            ],
          ),
        ],
      ),
    );
  }

  void _handleBookmark() {
    // Implement bookmark functionality
  }

  
  void _handleShare() {
    // Implement share functionality
  }
}