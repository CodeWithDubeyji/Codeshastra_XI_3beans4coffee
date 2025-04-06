import 'package:flutter/material.dart';
import 'package:travel_buddy/screen/map_Full_screen.dart';
import 'package:travel_buddy/screen/place_details.dart';
import 'package:travel_buddy/theme/theme.dart';
import 'package:travel_buddy/providers/itinerary_provider.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

class ItineraryDetailScreen extends StatefulWidget {
  final ItineraryModel itinerary;

  const ItineraryDetailScreen({
    super.key,
    required this.itinerary,
  });

  @override
  State<ItineraryDetailScreen> createState() => _ItineraryDetailScreenState();
}

class _ItineraryDetailScreenState extends State<ItineraryDetailScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  late AnimationController _fadeController;
  late Animation<double> _fadeAnimation;
  late ScrollController _scrollController;

  bool _showAppBarTitle = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: widget.itinerary.days.length, vsync: this);
    _fadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeIn),
    );
    _fadeController.forward();
    _scrollController = ScrollController()
      ..addListener(() {
        setState(() {
          _showAppBarTitle = _scrollController.offset > 140;
        });
      });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _fadeController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final startDate = DateFormat('MMM dd, yyyy').format(widget.itinerary.startDate);
    final endDate = DateFormat('MMM dd, yyyy').format(widget.itinerary.endDate);

    return Scaffold(
      body: NestedScrollView(
        controller: _scrollController,
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            SliverAppBar(
              expandedHeight: 200.0,
              floating: false,
              pinned: true,
              elevation: 0,
              backgroundColor: Theme.of(context).scaffoldBackgroundColor,
              flexibleSpace: FlexibleSpaceBar(
                title: _showAppBarTitle
                    ? Text(
                        widget.itinerary.destination,
                        style: TextStyle(
                          color: Theme.of(context).textTheme.titleLarge?.color,
                          fontWeight: FontWeight.bold,
                        ),
                      )
                    : null,
                background: Hero(
                  tag: 'itinerary_${widget.itinerary.id}',
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      Image.network(
                        widget.itinerary.imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          color: AppTheme.primaryColor.withOpacity(0.2),
                          child: const Center(child: Icon(Icons.image_not_supported, size: 50)),
                        ),
                      ),
                      Positioned.fill(
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.bottomCenter,
                              end: Alignment.topCenter,
                              colors: [Colors.black.withOpacity(0.7), Colors.transparent],
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        bottom: 16,
                        left: 16,
                        right: 16,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.itinerary.name,
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                const Icon(Icons.calendar_today, size: 16, color: Colors.white70),
                                const SizedBox(width: 8),
                                Text(
                                  '$startDate - $endDate',
                                  style: const TextStyle(color: Colors.white70, fontSize: 14),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Theme: ${widget.itinerary.theme}',
                              style: const TextStyle(color: Colors.white70, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              leading: GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Container(
                  margin: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Theme.of(context).cardColor.withOpacity(0.7),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.arrow_back, color: Theme.of(context).iconTheme.color),
                ),
              ),
              actions: [
                GestureDetector(
                  onTap: () {},
                  child: Container(
                    margin: const EdgeInsets.all(8),
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Theme.of(context).cardColor.withOpacity(0.7),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.share_outlined, color: Theme.of(context).iconTheme.color),
                  ),
                ),
              ],
            ),
            SliverPersistentHeader(
              delegate: _SliverAppBarDelegate(
                TabBar(
                  controller: _tabController,
                  isScrollable: true,
                  labelColor: AppTheme.primaryColor,
                  unselectedLabelColor: Theme.of(context).brightness == Brightness.light
                      ? AppTheme.subtitleLight
                      : AppTheme.subtitleDark,
                  indicatorColor: AppTheme.primaryColor,
                  tabs: widget.itinerary.days.map((day) {
                    final totalPlaces = day.places.length;
                    final visitedPlaces = day.places.where((place) => place.isVisited).length;
                    final isComplete = totalPlaces > 0 && visitedPlaces == totalPlaces;

                    return Tab(
                      child: Row(
                        children: [
                          Text('Day ${day.dayNumber}'),
                          if (isComplete) ...[
                            const SizedBox(width: 4),
                            const Icon(Icons.check_circle, size: 16, color: Colors.green),
                          ],
                        ],
                      ),
                    );
                  }).toList(),
                ),
                backgroundColor: Theme.of(context).scaffoldBackgroundColor,
              ),
              pinned: true,
            ),
          ];
        },
        body: FadeTransition(
          opacity: _fadeAnimation,
          child: TabBarView(
            controller: _tabController,
            children: widget.itinerary.days.map((day) => _buildDayContent(day)).toList(),
          ),
        ),
      ),
    );
  }

  Widget _buildDayContent(DayPlan day) {
    final isPreviousDaysCompleted = _isPreviousDaysCompleted(day.dayNumber);

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: ListView(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                DateFormat('EEEE, MMMM d').format(
                  widget.itinerary.startDate.add(Duration(days: day.dayNumber - 1)),
                ),
                style: AppTheme.subHeadingStyle(context),
              ),
              Row(
                children: [
                  Icon(Icons.wb_sunny_outlined, size: 20, color: AppTheme.primaryColor),
                  const SizedBox(width: 4),
                  Text(
                    '28°C', // Could be dynamic with weather API
                    style: AppTheme.captionStyle(context).copyWith(fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Places
          ...day.places.map((place) {
            final now = TimeOfDay.now();
            final isTimeInPast = place.endTime.hour < now.hour ||
                (place.endTime.hour == now.hour && place.endTime.minute < now.minute);
            Color statusColor = place.isVisited
                ? Colors.green
                : !isPreviousDaysCompleted
                    ? Colors.grey
                    : isTimeInPast && !place.isVisited
                        ? Colors.red
                        : AppTheme.primaryColor;

            return GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  PageRouteBuilder(
                    pageBuilder: (context, animation, secondaryAnimation) => PlaceDetailScreen(
                      place: place,
                      itineraryDay: day.dayNumber,
                    ),
                    transitionsBuilder: (context, animation, secondaryAnimation, child) {
                      const begin = Offset(0.0, 0.1);
                      const end = Offset.zero;
                      const curve = Curves.easeOutQuint;
                      var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
                      return SlideTransition(
                        position: animation.drive(tween),
                        child: FadeTransition(opacity: animation, child: child),
                      );
                    },
                    transitionDuration: const Duration(milliseconds: 400),
                  ),
                );
              },
              child: Padding(
                padding: const EdgeInsets.only(bottom: 8.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Column(
                      children: [
                        Container(
                          width: 16,
                          height: 16,
                          decoration: BoxDecoration(
                            color: statusColor,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: Theme.of(context).scaffoldBackgroundColor,
                              width: 2,
                            ),
                          ),
                        ),
                        if (place != day.places.last)
                          Container(
                            width: 2,
                            height: 120,
                            color: place.isVisited ? AppTheme.primaryColor : Colors.grey.withOpacity(0.3),
                          ),
                      ],
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Container(
                        decoration: AppTheme.cardDecoration(context),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            ClipRRect(
                              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                              child: Image.network(
                                place.imageUrl,
                                height: 120,
                                width: double.infinity,
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) => Container(
                                  height: 120,
                                  color: AppTheme.primaryColor.withOpacity(0.2),
                                  child: const Center(child: Icon(Icons.image_not_supported, size: 30)),
                                ),
                              ),
                            ),
                            Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Expanded(
                                        child: Text(
                                          place.name,
                                          style: AppTheme.subHeadingStyle(context),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ),
                                      if (place.isVisited)
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: Colors.green.withOpacity(0.1),
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              const Icon(Icons.check_circle_outline, color: Colors.green, size: 16),
                                              const SizedBox(width: 4),
                                              Text(
                                                'Visited',
                                                style: AppTheme.captionStyle(context)
                                                    .copyWith(color: Colors.green, fontWeight: FontWeight.w600),
                                              ),
                                            ],
                                          ),
                                        ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      Icon(Icons.access_time, size: 16, color: AppTheme.subtitleLight),
                                      const SizedBox(width: 8),
                                      Text(
                                        '${place.startTime.format(context)} - ${place.endTime.format(context)}',
                                        style: AppTheme.captionStyle(context),
                                      ),
                                      const SizedBox(width: 16),
                                      Icon(Icons.monetization_on, size: 16, color: AppTheme.subtitleLight),
                                      const SizedBox(width: 8),
                                      Text(
                                        place.cost,
                                        style: AppTheme.captionStyle(context),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    'Duration: ${place.duration}',
                                    style: AppTheme.captionStyle(context),
                                  ),
                                  const SizedBox(height: 12),
                                  Text(
                                    place.description,
                                    style: AppTheme.bodyStyle(context),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 8),
                                  ElevatedButton.icon(
                                    onPressed: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => MapFullScreen(
                                            place: place,
                                            userLocation: Provider.of<ItineraryProvider>(context, listen: false).userLocation,
                                          ),
                                        ),
                                      );
                                    },
                                    icon: const Icon(Icons.map),
                                    label: const Text('View on Map'),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppTheme.primaryColor,
                                      foregroundColor: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
          const SizedBox(height: 16),
          // Dining Options
          Text('Dining Options', style: AppTheme.subHeadingStyle(context)),
          const SizedBox(height: 8),
          ...widget.itinerary.diningOptions.map((option) => Card(
                child: ListTile(
                  title: Text(option.suggestion, style: AppTheme.subHeadingStyle(context)),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Cuisine: ${option.cuisine}', style: AppTheme.captionStyle(context)),
                      Text('Cost: ${option.cost}', style: AppTheme.captionStyle(context)),
                      Text('Type: ${option.type}', style: AppTheme.captionStyle(context)),
                    ],
                  ),
                ),
              )),
          const SizedBox(height: 16),
          // Transportation
          Text('Transportation', style: AppTheme.subHeadingStyle(context)),
          const SizedBox(height: 8),
          Card(
            child: ListTile(
              title: Text(widget.itinerary.transportation.betweenActivities, style: AppTheme.subHeadingStyle(context)),
              subtitle: Text('Cost: ${widget.itinerary.transportation.costBreakdown}', style: AppTheme.captionStyle(context)),
            ),
          ),
        ],
      ),
    );
  }

  bool _isPreviousDaysCompleted(int currentDayNumber) {
    if (currentDayNumber == 1) return true;
    for (int i = 0; i < currentDayNumber - 1; i++) {
      final previousDay = widget.itinerary.days[i];
      if (!previousDay.places.every((place) => place.isVisited)) return false;
    }
    return true;
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar tabBar;
  final Color backgroundColor;

  _SliverAppBarDelegate(this.tabBar, {required this.backgroundColor});

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(color: backgroundColor, child: tabBar);
  }

  @override
  double get maxExtent => tabBar.preferredSize.height;

  @override
  double get minExtent => tabBar.preferredSize.height;

  @override
  bool shouldRebuild(covariant _SliverAppBarDelegate oldDelegate) {
    return tabBar != oldDelegate.tabBar;
  }
}