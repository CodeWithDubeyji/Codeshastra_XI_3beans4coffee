  import 'dart:convert';
  import 'package:http/http.dart' as http;
  import 'package:flutter/material.dart';
  import 'package:travel_buddy/providers/itinerary_provider.dart';

  class TripPlanningService {
    // Base URL for the API
    final String baseUrl = 'http://10.0.2.2:5000/api';
    
    // Method to get trip plan from API
    Future<String> getPlanTrip({
      required Map<String, dynamic> requestData
    }) async {
      try {
        final response = await http.post(
          Uri.parse('$baseUrl/plan-trip'),
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonEncode(requestData),
        );

        if (response.statusCode == 200) {
          return response.body;
        } else {
          throw Exception('Failed to load trip plan: ${response.statusCode} - ${response.body}');
        }
      } catch (e) {
        throw Exception('Error connecting to server: $e');
      }
    }
  }

  // Extension for ItineraryProvider to add API integration
  extension ItineraryProviderApiExtension on ItineraryProvider {
    // Method to fetch trip plan from API and update provider
    Future<void> fetchTripPlan({
      required String destination,
      required List<String> interests,
      String? budget,
      int? durationDays,
      BuildContext? context,
    }) async {
      try {
        // Show loading indicator if context is provided
        if (context != null) {
          showDialog(
            context: context,
            barrierDismissible: false,
            builder: (BuildContext context) {
              return const Center(
                child: CircularProgressIndicator(),
              );
            },
          );
        }
        
        // Create request data
        final requestData = {
          'destination': destination,
          'interests': interests,
          if (budget != null) 'budget': budget,
          if (durationDays != null) 'duration_days': durationDays,
        };
        
        // Call API
        final service = TripPlanningService();
        final responseJson = await service.getPlanTrip(requestData: requestData);
        
        // Process API response
        await processApiResponse(responseJson);
        
        // Dismiss loading indicator if context was provided
        if (context != null && context.mounted) {
          Navigator.of(context).pop();
        }
        
        return;
      } catch (e) {
        // Dismiss loading indicator if context was provided
        if (context != null && context.mounted) {
          Navigator.of(context).pop();
          
          // Show error dialog
          showDialog(
            context: context,
            builder: (BuildContext context) {
              return AlertDialog(
                title: const Text('Error'),
                content: Text('Failed to get trip plan: $e'),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text('OK'),
                  ),
                ],
              );
            },
          );
        }
        
        // Log error
        print('Error fetching trip plan: $e');
        return;
      }
    }
  }