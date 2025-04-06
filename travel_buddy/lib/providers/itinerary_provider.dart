import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'dart:convert';
import 'dart:math';

// Models (unchanged from your original code)
class Activity {
  final String ageSuitability;
  final String cost;
  final String description;
  final List<String> interestMatch;
  final String timeRequired;
  final String type;
  bool isVisited;

  Activity({
    required this.ageSuitability,
    required this.cost,
    required this.description,
    required this.interestMatch,
    required this.timeRequired,
    required this.type,
    this.isVisited = false,
  });

  factory Activity.fromJson(Map<String, dynamic> json) {
    return Activity(
      ageSuitability: json['age_suitability'] ?? 'All ages',
      cost: json['cost'] ?? 'N/A',
      description: json['description'] ?? '',
      interestMatch: List<String>.from(json['interest_match'] ?? []),
      timeRequired: json['time_required'] ?? 'N/A',
      type: json['type'] ?? 'Activity',
    );
  }
}

class DiningOption {
  final String cost;
  final String cuisine;
  final String suggestion;
  final String type;

  DiningOption({
    required this.cost,
    required this.cuisine,
    required this.suggestion,
    required this.type,
  });

  factory DiningOption.fromJson(Map<String, dynamic> json) {
    return DiningOption(
      cost: json['cost'] ?? 'N/A',
      cuisine: json['cuisine'] ?? 'N/A',
      suggestion: json['suggestion'] ?? 'N/A',
      type: json['type'] ?? 'N/A',
    );
  }
}

class Transportation {
  final String betweenActivities;
  final String costBreakdown;

  Transportation({
    required this.betweenActivities,
    required this.costBreakdown,
  });

  factory Transportation.fromJson(Map<String, dynamic> json) {
    return Transportation(
      betweenActivities: json['between_activities'] ?? 'N/A',
      costBreakdown: json['cost_breakdown'] ?? 'N/A',
    );
  }
}

class Itinerary {
  final String theme;
  final List<Activity> activities;
  final List<DiningOption> diningOptions;
  final Transportation transportation;
  final String type;

  Itinerary({
    required this.theme,
    required this.activities,
    required this.diningOptions,
    required this.transportation,
    required this.type,
  });

  factory Itinerary.fromJson(Map<String, dynamic> json, String type) {
    List<DiningOption> diningOptions = [];
    if (type == 'budget' && json['dining']?['budget_options'] != null) {
      diningOptions = (json['dining']['budget_options'] as List)
          .map((item) => DiningOption.fromJson(item))
          .toList();
    } else if (type == 'luxury' && json['dining']?['luxury_options'] != null) {
      diningOptions = (json['dining']['luxury_options'] as List)
          .map((item) => DiningOption.fromJson(item))
          .toList();
    }

    return Itinerary(
      theme: json['theme'] ?? 'Itinerary',
      activities: (json['activities'] as List)
          .map((item) => Activity.fromJson(item))
          .toList(),
      diningOptions: diningOptions,
      transportation: Transportation.fromJson(json['transportation']),
      type: type,
    );
  }
}

class PersonalizedPlan {
  final String tripId;
  final Map<String, Itinerary> itineraries;
  final Map<String, String> personalizationFactors;

  PersonalizedPlan({
    required this.tripId,
    required this.itineraries,
    required this.personalizationFactors,
  });

  factory PersonalizedPlan.fromJson(Map<String, dynamic> json) {
    Map<String, Itinerary> itineraries = {};
    if (json['personalized_plan']?['itineraries'] != null) {
      final itinerariesJson = json['personalized_plan']['itineraries'];
      if (itinerariesJson['budget'] != null) {
        itineraries['budget'] = Itinerary.fromJson(itinerariesJson['budget'], 'budget');
      }
      if (itinerariesJson['luxury'] != null) {
        itineraries['luxury'] = Itinerary.fromJson(itinerariesJson['luxury'], 'luxury');
      }
    }

    Map<String, String> personalizationFactors = {};
    if (json['personalized_plan']?['personalization_factors'] != null) {
      final factorsJson = json['personalized_plan']['personalization_factors'];
      factorsJson.forEach((key, value) {
        personalizationFactors[key] = value.toString();
      });
    }

    return PersonalizedPlan(
      tripId: json['trip_id'] ?? '',
      itineraries: itineraries,
      personalizationFactors: personalizationFactors,
    );
  }
}

class PlaceModel {
  final String id;
  final String name;
  final String description;
  final String imageUrl;
  final LatLng location;
  final TimeOfDay startTime;
  final TimeOfDay endTime;
  final String cost;
  final String duration;
  bool isVisited;

  PlaceModel({
    required this.id,
    required this.name,
    required this.description,
    required this.imageUrl,
    required this.location,
    required this.startTime,
    required this.endTime,
    required this.cost,
    required this.duration,
    this.isVisited = false,
  });

  factory PlaceModel.fromActivity(Activity activity, String id, {LatLng? location}) {
    return PlaceModel(
      id: id,
      name: activity.type,
      description: activity.description,
      imageUrl: _getImageUrlForActivityType(activity.type),
      location: location ?? const LatLng(28.6139, 77.2090),
      startTime: const TimeOfDay(hour: 9, minute: 0),
      endTime: const TimeOfDay(hour: 12, minute: 0),
      cost: activity.cost,
      duration: activity.timeRequired,
      isVisited: activity.isVisited,
    );
  }

  static String _getImageUrlForActivityType(String type) {
    final typeToImageMap = {
      'Historical Site Visit': 'https://images.unsplash.com/photo-1576432134747-2d4d0061270a',
      'Food Tour': 'https://images.unsplash.com/photo-1583425721152-42daee7bd2bf',
      'Museum Visit': 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
      'Private Guided Tour': 'https://images.unsplash.com/photo-1564507791229-31fdc261b8f5',
      'Fine Dining Experience': 'https://images.unsplash.com/photo-1548013146-72479768bada',
      'Heritage Walk & Shopping': 'https://images.unsplash.com/photo-1572451479139-6a308a9b01fa',
      'Luxury Hotel Stay': 'https://images.unsplash.com/photo-1583425721152-42daee7bd2bf',
    };
    return typeToImageMap[type] ?? 'https://unsplash.com/photos/white-and-brown-concrete-building-near-body-of-water-during-daytime-MxabbMSLr_M';
  }
}

class DayPlan {
  final String id;
  final int dayNumber;
  final List<PlaceModel> places;
  bool isCompleted;

  DayPlan({
    required this.id,
    required this.dayNumber,
    required this.places,
    this.isCompleted = false,
  });
}

class ItineraryModel {
  final String id;
  final String name;
  final String destination;
  final DateTime startDate;
  final DateTime endDate;
  final String imageUrl;
  final List<DayPlan> days;
  final String type;
  final String theme;
  final List<DiningOption> diningOptions;
  final Transportation transportation;

  ItineraryModel({
    required this.id,
    required this.name,
    required this.destination,
    required this.startDate,
    required this.endDate,
    required this.imageUrl,
    required this.days,
    required this.type,
    required this.theme,
    required this.diningOptions,
    required this.transportation,
  });

  factory ItineraryModel.fromItinerary(Itinerary itinerary, String id, String destination) {
    List<DayPlan> days = [];
    final activitiesList = itinerary.activities;
    int dayCount = (activitiesList.length / 2).ceil();

    for (int i = 0; i < dayCount; i++) {
      List<PlaceModel> placesForDay = [];
      for (int j = i * 2; j < (i * 2) + 2 && j < activitiesList.length; j++) {
        placesForDay.add(
          PlaceModel.fromActivity(
            activitiesList[j],
            'p${j + 1}',
            location: LatLng(
              28.6139 + (0.01 * j * Random().nextDouble()),
              77.2090 + (0.01 * j * Random().nextDouble()),
            ),
          ),
        );
      }
      days.add(
        DayPlan(
          id: 'd${i + 1}',
          dayNumber: i + 1,
          places: placesForDay,
          isCompleted: false,
        ),
      );
    }

    return ItineraryModel(
      id: id,
      name: '${destination} ${itinerary.type.capitalize()} Tour',
      destination: destination,
      startDate: DateTime.now(),
      endDate: DateTime.now().add(Duration(days: dayCount)),
      imageUrl: 'https://unsplash.com/photos/white-and-brown-concrete-building-near-body-of-water-during-daytime-MxabbMSLr_M',
      days: days,
      type: itinerary.type,
      theme: itinerary.theme,
      diningOptions: itinerary.diningOptions,
      transportation: itinerary.transportation,
    );
  }
}

class ItineraryProvider with ChangeNotifier {
  List<ItineraryModel> _itineraries = [];
  PersonalizedPlan? _personalizedPlan;
  LatLng _userLocation = const LatLng(28.6139, 77.2090);

  List<ItineraryModel> get itineraries => _itineraries;
  PersonalizedPlan? get personalizedPlan => _personalizedPlan;
  LatLng get userLocation => _userLocation;

  ItineraryProvider() {
    _loadMockData();
  }

  void setUserLocation(LatLng location) {
    _userLocation = location;
    notifyListeners();
  }

  void markPlaceAsVisited(String itineraryId, String dayId, String placeId) {
    final itinerary = _itineraries.firstWhere((i) => i.id == itineraryId);
    final day = itinerary.days.firstWhere((d) => d.id == dayId);
    final place = day.places.firstWhere((p) => p.id == placeId);

    place.isVisited = true;
    if (day.places.every((place) => place.isVisited)) {
      day.isCompleted = true;
    }
    notifyListeners();
  }

  Future<void> processApiResponse(String jsonData) async {
    try {
      final Map<String, dynamic> parsedData = jsonDecode(jsonData);
      _personalizedPlan = PersonalizedPlan.fromJson(parsedData);
      _itineraries = [];
      if (_personalizedPlan != null) {
        int index = 1;
        _personalizedPlan!.itineraries.forEach((type, itinerary) {
          _itineraries.add(
            ItineraryModel.fromItinerary(itinerary, index.toString(), 'Mumbai'),
          );
          index++;
        });
      }
      notifyListeners();
    } catch (e) {
      print('Error processing API response: $e');
      _loadMockData();
    }
  }

  void _loadMockData() {
    final random = Random();
    final destinations = ['Pune', 'Mumbai', 'Jaipur', 'Agra'];
    final activityTypes = [
      'Historical Site Visit',
      'Food Tour',
      'Museum Visit',
      'Heritage Walk & Shopping',
    ];
    final luxuryActivityTypes = [
      'Private Guided Tour',
      'Fine Dining Experience',
      'Luxury Hotel Stay',
    ];
    final diningCuisines = ['Indian', 'Chinese', 'Italian', 'Street Food'];
    final transportModes = ['Metro', 'Auto-rickshaws', 'Private Car', 'Taxi'];

    _itineraries = [
      // Budget Itinerary
      ItineraryModel(
        id: '1',
        name: '${destinations[random.nextInt(destinations.length)]} Budget Tour',
        destination: destinations[random.nextInt(destinations.length)],
        startDate: DateTime.now(),
        endDate: DateTime.now().add(Duration(days: random.nextInt(3) + 2)),
        imageUrl: 'https://unsplash.com/photos/white-and-brown-concrete-building-near-body-of-water-during-daytime-MxabbMSLr_M',
        type: 'budget',
        theme: 'Explore ${destinations[random.nextInt(destinations.length)]} on a Budget',
        diningOptions: List.generate(
          random.nextInt(2) + 1,
          (index) => DiningOption(
            cost: 'INR ${random.nextInt(300) + 100}',
            cuisine: diningCuisines[random.nextInt(diningCuisines.length)],
            suggestion: 'Local ${diningCuisines[random.nextInt(diningCuisines.length)]} Eatery',
            type: ['Breakfast', 'Lunch', 'Dinner'][random.nextInt(3)],
          ),
        ),
        transportation: Transportation(
          betweenActivities: transportModes[random.nextInt(transportModes.length)],
          costBreakdown: 'INR ${random.nextInt(500) + 200}',
        ),
        days: List.generate(
          random.nextInt(3) + 1,
          (dayIndex) => DayPlan(
            id: 'd${dayIndex + 1}',
            dayNumber: dayIndex + 1,
            places: List.generate(
              random.nextInt(3) + 1,
              (placeIndex) => PlaceModel(
                id: 'p${dayIndex * 3 + placeIndex + 1}',
                name: activityTypes[random.nextInt(activityTypes.length)],
                description: 'Experience ${activityTypes[random.nextInt(activityTypes.length)]} in ${destinations[random.nextInt(destinations.length)]}.',
                imageUrl: PlaceModel._getImageUrlForActivityType(activityTypes[random.nextInt(activityTypes.length)]),
                location: LatLng(
                  28.6139 + (random.nextDouble() * 0.05),
                  77.2090 + (random.nextDouble() * 0.05),
                ),
                startTime: TimeOfDay(hour: 9 + placeIndex * 3, minute: 0),
                endTime: TimeOfDay(hour: 12 + placeIndex * 3, minute: 0),
                cost: 'INR ${random.nextInt(500) + 100}',
                duration: '${random.nextInt(3) + 1} hours',
              ),
            ),
            isCompleted: false,
          ),
        ),
      ),
      // Luxury Itinerary
      ItineraryModel(
        id: '2',
        name: '${destinations[random.nextInt(destinations.length)]} Luxury Tour',
        destination: destinations[random.nextInt(destinations.length)],
        startDate: DateTime.now(),
        endDate: DateTime.now().add(Duration(days: random.nextInt(3) + 3)),
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada',
        type: 'luxury',
        theme: 'Luxury Getaway in ${destinations[random.nextInt(destinations.length)]}',
        diningOptions: List.generate(
          random.nextInt(2) + 1,
          (index) => DiningOption(
            cost: 'INR ${random.nextInt(2000) + 1000}',
            cuisine: diningCuisines[random.nextInt(diningCuisines.length)],
            suggestion: 'Fine Dining at ${diningCuisines[random.nextInt(diningCuisines.length)]} Restaurant',
            type: ['Lunch', 'Dinner'][random.nextInt(2)],
          ),
        ),
        transportation: Transportation(
          betweenActivities: 'Private Car',
          costBreakdown: 'INR ${random.nextInt(2000) + 1000}',
        ),
        days: List.generate(
          random.nextInt(3) + 2,
          (dayIndex) => DayPlan(
            id: 'd${dayIndex + 1}',
            dayNumber: dayIndex + 1,
            places: List.generate(
              random.nextInt(3) + 1,
              (placeIndex) => PlaceModel(
                id: 'p${dayIndex * 3 + placeIndex + 1}',
                name: luxuryActivityTypes[random.nextInt(luxuryActivityTypes.length)],
                description: 'Indulge in ${luxuryActivityTypes[random.nextInt(luxuryActivityTypes.length)]} in ${destinations[random.nextInt(destinations.length)]}.',
                imageUrl: PlaceModel._getImageUrlForActivityType(luxuryActivityTypes[random.nextInt(luxuryActivityTypes.length)]),
                location: LatLng(
                  28.6139 + (random.nextDouble() * 0.05),
                  77.2090 + (random.nextDouble() * 0.05),
                ),
                startTime: TimeOfDay(hour: 9 + placeIndex * 3, minute: 0),
                endTime: TimeOfDay(hour: 12 + placeIndex * 3, minute: 0),
                cost: 'INR ${random.nextInt(2000) + 1000}',
                duration: '${random.nextInt(4) + 2} hours',
              ),
            ),
            isCompleted: false,
          ),
        ),
      ),
    ];
    notifyListeners();
  }
}

extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${substring(1)}";
  }
}