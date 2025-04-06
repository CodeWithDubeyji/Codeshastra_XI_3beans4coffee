// ignore_for_file: avoid_print

import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
 // Ensure this is imported for FitBoundsOptions
import 'package:latlong2/latlong.dart' as latlng; // For flutter_map coordinates
import 'package:google_maps_flutter/google_maps_flutter.dart' as google; // For PlaceModel compatibility
import 'package:permission_handler/permission_handler.dart';
import 'package:travel_buddy/providers/itinerary_provider.dart';

class MapFullScreen extends StatefulWidget {
  final PlaceModel place;
  final google.LatLng userLocation; // Assuming userLocation is from google_maps_flutter

  const MapFullScreen({
    Key? key,
    required this.place,
    required this.userLocation,
  }) : super(key: key);

  @override
  State<MapFullScreen> createState() => _MapFullScreenState();
}

class _MapFullScreenState extends State<MapFullScreen> {
  late MapController _mapController;
  bool _permissionsGranted = false;
  bool _mapInitialized = false;

  // Convert Google LatLng to flutter_map LatLng
  latlng.LatLng _convertToLatLng(google.LatLng googleLatLng) {
    return latlng.LatLng(googleLatLng.latitude, googleLatLng.longitude);
  }

  @override
  void initState() {
    super.initState();
    _mapController = MapController();
    _requestPermissions();
    print('Place location: ${widget.place.location}');
    print('User location: ${widget.userLocation}');
  }

  Future<void> _requestPermissions() async {
    final locationStatus = await Permission.locationWhenInUse.request();

    if (locationStatus.isGranted) {
      setState(() {
        _permissionsGranted = true;
      });
      print('Location permission granted');
    } else if (locationStatus.isDenied) {
      print('Location permission denied');
      _showPermissionDialog('Location Permission',
          'This app needs location access to show your position on the map.');
    } else if (locationStatus.isPermanentlyDenied) {
      print('Location permission permanently denied');
      _showPermissionDialog('Location Permission',
          'Location access is permanently denied. Please enable it in Settings.');
    }
  }

  void _showPermissionDialog(String title, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              if (title == 'Location Permission' &&
                  (await Permission.locationWhenInUse.isPermanentlyDenied)) {
                openAppSettings();
              } else {
                _requestPermissions();
              }
            },
            child: const Text('Settings'),
          ),
        ],
      ),
    );
  }

  void _moveToCurrentView() {
    if (_mapController != null) {
      try {
        print('Moving map to show both markers');
        final placeLatLng = _convertToLatLng(widget.place.location);
        final userLatLng = _convertToLatLng(widget.userLocation);

        // Calculate bounds
        final southwestLat = [placeLatLng.latitude, userLatLng.latitude]
            .reduce((min, curr) => min < curr ? min : curr);
        final southwestLng = [placeLatLng.longitude, userLatLng.longitude]
            .reduce((min, curr) => min < curr ? min : curr);
        final northeastLat = [placeLatLng.latitude, userLatLng.latitude]
            .reduce((max, curr) => max > curr ? max : curr);
        final northeastLng = [placeLatLng.longitude, userLatLng.longitude]
            .reduce((max, curr) => max > curr ? max : curr);

        LatLngBounds(
          latlng.LatLng(southwestLat, southwestLng),
          latlng.LatLng(northeastLat, northeastLng),
        );

        final centerLat = (southwestLat + northeastLat) / 2;
        final centerLng = (southwestLng + northeastLng) / 2;
        final center = latlng.LatLng(centerLat, centerLng);

        _mapController.move(center, 12); // Adjust zoom level as needed

        setState(() {
          _mapInitialized = true;
        });
      } catch (e) {
        print('Error moving map: $e');
        _mapController.move(_convertToLatLng(widget.place.location), 14);
      }
    } else {
      print('Map controller is null, cannot move map');
    }
  }

  List<Marker> _createMarkers() {
    final placeLatLng = _convertToLatLng(widget.place.location);
    final userLatLng = _convertToLatLng(widget.userLocation);

    return [
      Marker(
        point: placeLatLng,
        width: 80,
        height: 80,
        child: GestureDetector(
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(widget.place.name)),
            );
          },
          child: const Icon(
            Icons.location_pin,
            color: Colors.red,
            size: 40,
          ),
        ),
      ),
      Marker(
        point: userLatLng,
        width: 80,
        height: 80,
        child: const Icon(
          Icons.person_pin_circle,
          color: Colors.blue,
          size: 40,
        ),
      ),
      Marker(
        point: userLatLng,
        width: 80,
        height: 80,
        child: GestureDetector(
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Your Location')),
            );
          },
          child: const Icon(
            Icons.person_pin_circle,
            color: Colors.blue,
            size: 40,
          ),
        ),
      )

    ];
  }

  @override
  Widget build(BuildContext context) {
    final placeLatLng = _convertToLatLng(widget.place.location);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.place.name),
      ),
      body: _permissionsGranted
          ? FlutterMap(
              mapController: _mapController,
              options:  MapOptions(
  onTap: (tapPosition, point) {
    print('Map tapped at: $point');
  },
  onMapReady: () {
    print('Map is ready');
    Future.delayed(const Duration(milliseconds: 300), () {
      _moveToCurrentView();
    });
  },
),
          

              children: [
                TileLayer(
                  urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                  subdomains: const ['a', 'b', 'c'],
                ),
                MarkerLayer(markers: _createMarkers()),
              ],
            )
          : const Center(
              child: CircularProgressIndicator(),
            ),
      floatingActionButton: _permissionsGranted
          ? Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                FloatingActionButton(
                  heroTag: 'zoom_to_place',
                  onPressed: () {
                    print('Zooming to place: ${widget.place.location}');
                    _mapController.move(_convertToLatLng(widget.place.location), 16);
                  },
                  child: const Icon(Icons.place),
                ),
                const SizedBox(height: 16),
                FloatingActionButton(
                  heroTag: 'show_both',
                  onPressed: _moveToCurrentView,
                  child: const Icon(Icons.fit_screen),
                ),
              ],
            )
          : null,
    );
  }

  @override
  void dispose() {
    _mapController.dispose();
    super.dispose();
  }
}