import 'package:flutter/material.dart';

class TripProvider with ChangeNotifier {
  List<Trip> _trips = [
    Trip(
      id: '1',
      title: 'Delhi Exploration',
      days: [
        Day(
          dayNumber: 1,
          activities: [
            Activity(name: 'Lal Qila', time: '9:00 AM', lat: 28.6562, lng: 77.2410, isCompleted: false),
            Activity(name: 'Humayun Tomb', time: '2:00 PM', lat: 28.5933, lng: 77.2507, isCompleted: false),
          ],
        ),
        Day(dayNumber: 2, activities: []),
      ],
    ),
  ];

  List<Trip> get trips => _trips;

  void toggleActivityStatus(String tripId, int dayIndex, int activityIndex) {
    _trips.firstWhere((trip) => trip.id == tripId)
        .days[dayIndex]
        .activities[activityIndex]
        .isCompleted = true;
    notifyListeners();
  }
}

class Trip {
  final String id;
  final String title;
  final List<Day> days;

  Trip({required this.id, required this.title, required this.days});
}

class Day {
  final int dayNumber;
  final List<Activity> activities;

  Day({required this.dayNumber, required this.activities});

  get places => null;
}

class Activity {
  final String name;
  final String time;
  final double lat;
  final double lng;
  bool isCompleted;

  Activity({required this.name, required this.time, required this.lat, required this.lng, required this.isCompleted});
}