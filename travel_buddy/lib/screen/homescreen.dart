import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:travel_buddy/providers/auth_provider.dart';
import 'package:travel_buddy/providers/itinerary_provider.dart';
import 'package:travel_buddy/screen/itinerary_details.dart';
import 'package:travel_buddy/theme/theme.dart';
import 'package:intl/intl.dart';


class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0.0, 0.2),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeOutQuint,
      ),
    );
    
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final itineraryProvider = Provider.of<ItineraryProvider>(context);
    final size = MediaQuery.of(context).size;

    return Scaffold(
      /*appBar: AppBar(
        title: const Text(
          'My Itineraries',
          style: TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ,
                ),
              );
            },
            child: Container(
              margin: const EdgeInsets.only(right: 16),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: AppTheme.primaryColor,
                  width: 2,
                ),
              ),
              child: Hero(
                tag: 'profileAvatar',
                child: CircleAvatar(
                  backgroundImage: NetworkImage(
                    authProvider.currentUser?.avatarUrl ?? 'https://i.pravatar.cc/150?img=3',
                  ),
                ),
              ),
            ),
          ),
        ],
      ),*/
      body: RefreshIndicator(
        color: AppTheme.primaryColor,
        onRefresh: () async {
          // Simulate refresh
          await Future.delayed(const Duration(seconds: 1));
        },
        child: itineraryProvider.itineraries.isEmpty
            ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.backpack_outlined,
                      size: 80,
                      color: Theme.of(context).brightness == Brightness.light
                          ? AppTheme.subtitleLight
                          : AppTheme.subtitleDark,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No itineraries yet',
                      style: AppTheme.subHeadingStyle(context),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Plan your first trip on our website',
                      style: AppTheme.captionStyle(context),
                    ),
                  ],
                ),
              )
            : ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: itineraryProvider.itineraries.length,
                itemBuilder: (context, index) {
                  final itinerary = itineraryProvider.itineraries[index];
                  final startDate = DateFormat('MMM dd, yyyy').format(itinerary.startDate);
                  final endDate = DateFormat('MMM dd, yyyy').format(itinerary.endDate);
                  
                  // Calculate completion percentage
                  int totalPlaces = 0;
                  int visitedPlaces = 0;
                  
                  for (var day in itinerary.days) {
                    totalPlaces += day.places.length;
                    for (var place in day.places) {
                      if (place.isVisited) {
                        visitedPlaces++;
                      }
                    }
                  }
                  
                  final completionPercentage = totalPlaces > 0 
                      ? (visitedPlaces / totalPlaces * 100).round() 
                      : 0;
                  
                  return SlideTransition(
                    position: _slideAnimation,
                    child: GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          PageRouteBuilder(
                            pageBuilder: (context, animation, secondaryAnimation) => ItineraryDetailScreen(itinerary: itinerary),
                            transitionsBuilder: (context, animation, secondaryAnimation, child) {
                              const begin = Offset(1.0, 0.0);
                              const end = Offset.zero;
                              const curve = Curves.easeInOutQuart;
                              var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
                              return SlideTransition(
                                position: animation.drive(tween),
                                child: child,
                              );
                            },
                            transitionDuration: const Duration(milliseconds: 500),
                          ),
                        );
                      },
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 16),
                        decoration: AppTheme.cardDecoration(context),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Hero image with gradient overlay and destination text
                            Stack(
                              children: [
                                Hero(
                                  tag: 'itinerary_${itinerary.id}',
                                  child: ClipRRect(
                                    borderRadius: const BorderRadius.only(
                                      topLeft: Radius.circular(16),
                                      topRight: Radius.circular(16),
                                    ),
                                    child: Image.network(
                                      itinerary.imageUrl,
                                      height: 180,
                                      width: double.infinity,
                                      fit: BoxFit.cover,
                                      errorBuilder: (context, error, stackTrace) => Container(
                                        height: 180,
                                        color: AppTheme.primaryColor.withOpacity(0.2),
                                        child: const Center(
                                          child: Icon(Icons.image_not_supported, size: 50),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                Positioned(
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        begin: Alignment.bottomCenter,
                                        end: Alignment.topCenter,
                                        colors: [
                                          Colors.black.withOpacity(0.8),
                                          Colors.transparent,
                                        ],
                                      ),
                                    ),
                                    child: Text(
                                      itinerary.destination,
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            // Itinerary details
                            Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    itinerary.name,
                                    style: AppTheme.subHeadingStyle(context),
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      Icon(
                                        Icons.calendar_today,
                                        size: 16,
                                        color: Theme.of(context).brightness == Brightness.light
                                            ? AppTheme.subtitleLight
                                            : AppTheme.subtitleDark,
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        '$startDate - $endDate',
                                        style: AppTheme.captionStyle(context),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  // Progress bar
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            'Completion',
                                            style: AppTheme.captionStyle(context).copyWith(
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                          Text(
                                            '$completionPercentage%',
                                            style: AppTheme.captionStyle(context).copyWith(
                                              fontWeight: FontWeight.w600,
                                              color: AppTheme.primaryColor,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      ClipRRect(
                                        borderRadius: BorderRadius.circular(10),
                                        child: LinearProgressIndicator(
                                          value: completionPercentage / 100,
                                          backgroundColor: AppTheme.dividerLight,
                                          valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primaryColor),
                                          minHeight: 6,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  // Days summary
                                  Row(
                                    children: [
                                      Icon(
                                        Icons.location_on_outlined,
                                        size: 16,
                                        color: Theme.of(context).brightness == Brightness.light
                                            ? AppTheme.subtitleLight
                                            : AppTheme.subtitleDark,
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        '${itinerary.days.length} days • ${totalPlaces} places',
                                        style: AppTheme.captionStyle(context),
                                      ),
                                      const Spacer(),
                                      const Icon(
                                        Icons.arrow_forward_ios,
                                        size: 14,
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
      ),
    );
  }
}
