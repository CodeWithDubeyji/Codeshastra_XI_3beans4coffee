import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../providers/trip_provider.dart';

class TripDetailScreen extends StatelessWidget {
  final String tripId;

  TripDetailScreen({required this.tripId});

  @override
  Widget build(BuildContext context) {
    final trip = Provider.of<TripProvider>(context).trips.firstWhere((t) => t.id == tripId);
    return Scaffold(
      appBar: AppBar(title: Text(trip.title)),
      body: SingleChildScrollView(
        child: Column(
          children: [
            SizedBox(height: 16),
            ...trip.days.asMap().entries.map((entry) {
              int idx = entry.key;
              Day day = entry.value;
              return Column(
                children: [
                  Card(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Day ${day.dayNumber}', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          ...day.activities.map((activity) => ListTile(
                                title: Text(activity.name),
                                subtitle: Text(activity.time),
                                trailing: activity.isCompleted
                                    ? Icon(Icons.check_circle, color: Colors.blue[900])
                                    : Icon(Icons.circle_outlined),
                                onTap: () => _showActivityDetails(context, tripId, idx, day.activities.indexOf(activity)),
                              )),
                        ],
                      ),
                    ),
                  ),
                  if (idx < trip.days.length - 1)
                    Container(
                      height: 50,
                      width: 2,
                      color: trip.days[idx].activities.every((a) => a.isCompleted) ? Colors.blue[900] : Colors.grey,
                    ),
                ],
              );
            }).toList(),
          ],
        ),
      ),
    );
  }

  void _showActivityDetails(BuildContext context, String tripId, int dayIndex, int activityIndex) {
    final tripProvider = Provider.of<TripProvider>(context, listen: false);
    final activity = tripProvider.trips.firstWhere((t) => t.id == tripId).days[dayIndex].activities[activityIndex];

    showModalBottomSheet(
      context: context,
      builder: (_) => Container(
        padding: EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(activity.name, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text('Time: ${activity.time}'),
            SizedBox(height: 16),
            Card(
              child: SizedBox(
                height: 200,
                child: GoogleMap(
                  initialCameraPosition: CameraPosition(
                    target: LatLng(activity.lat, activity.lng),
                    zoom: 15,
                  ),
                  markers: {
                    Marker(markerId: MarkerId(activity.name), position: LatLng(activity.lat, activity.lng)),
                  },
                ),
              ),
            ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                tripProvider.toggleActivityStatus(tripId, dayIndex, activityIndex);
                Navigator.pop(context);
              },
              child: Text('Mark as Completed'),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.blue[900]),
            ),
          ],
        ),
      ),
    );
  }
}