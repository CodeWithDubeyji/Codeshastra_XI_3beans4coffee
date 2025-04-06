import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';
import 'package:travel_buddy/providers/auth_provider.dart';
import 'package:travel_buddy/providers/itinerary_provider.dart';
import 'package:travel_buddy/providers/reel_provider.dart';
import 'package:travel_buddy/providers/theme_provider.dart';
import 'package:travel_buddy/providers/trip_provider.dart';
import 'package:travel_buddy/screen/homescreen.dart';
import 'package:travel_buddy/screen/itinerary_screen.dart';
import 'package:travel_buddy/screen/main_screen.dart';
import 'package:travel_buddy/screen/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  if (defaultTargetPlatform == TargetPlatform.android) {
    AndroidGoogleMapsFlutter.useAndroidViewSurface = true;
  }
  
  runApp(MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => TripProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => ItineraryProvider()),
        ChangeNotifierProvider(create: (_) => ReelsProvider()),

        //ChangeNotifierProvider(create: (_) => ReelProvider()),
      ],
      child: const MyApp()
    ),);
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: MainScreen()
    );
  }
}

