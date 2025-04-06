import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:travel_buddy/providers/api_service.dart';
import 'package:travel_buddy/providers/itinerary_provider.dart';

class PlanTripForm extends StatefulWidget {
  const PlanTripForm({Key? key}) : super(key: key);

  @override
  State<PlanTripForm> createState() => _PlanTripFormState();
}

class _PlanTripFormState extends State<PlanTripForm> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _destinationController = TextEditingController();
  
  final List<String> _availableInterests = [
    'historical places',
    'food',
    'culture',
    'adventure',
    'nature',
    'shopping',
    'relaxation'
  ];
  
  final List<String> _selectedInterests = [];
  String _selectedBudget = 'medium'; // default value
  int _durationDays = 3; // default value
  
  @override
  void dispose() {
    _destinationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Plan Your Trip',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 16),
              
              // Destination input
              TextFormField(
                controller: _destinationController,
                decoration: const InputDecoration(
                  labelText: 'Destination',
                  hintText: 'e.g., Delhi, India',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a destination';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              
              // Interests selection
              Text(
                'Select Your Interests',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8.0,
                children: _availableInterests.map((interest) {
                  final isSelected = _selectedInterests.contains(interest);
                  return FilterChip(
                    label: Text(interest),
                    selected: isSelected,
                    onSelected: (selected) {
                      setState(() {
                        if (selected) {
                          _selectedInterests.add(interest);
                        } else {
                          _selectedInterests.remove(interest);
                        }
                      });
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),
              
              // Budget selection
              Text(
                'Budget',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              SegmentedButton<String>(
                segments: const [
                  ButtonSegment(value: 'budget', label: Text('Budget')),
                  ButtonSegment(value: 'medium', label: Text('Medium')),
                  ButtonSegment(value: 'luxury', label: Text('Luxury')),
                ],
                selected: {_selectedBudget},
                onSelectionChanged: (selection) {
                  setState(() {
                    _selectedBudget = selection.first;
                  });
                },
              ),
              const SizedBox(height: 16),
              
              // Duration selection
              Text(
                'Duration (Days): $_durationDays',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              Slider(
                min: 1,
                max: 7,
                divisions: 6,
                value: _durationDays.toDouble(),
                label: _durationDays.toString(),
                onChanged: (value) {
                  setState(() {
                    _durationDays = value.round();
                  });
                },
              ),
              const SizedBox(height: 24),
              
              // Submit button
              Center(
                child: ElevatedButton(
                  onPressed: _submitForm,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                  ),
                  child: const Text('Get Trip Plans'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      if (_selectedInterests.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please select at least one interest')),
        );
        return;
      }
      
      // Get the provider
      final provider = Provider.of<ItineraryProvider>(context, listen: false);
      
      // Call the API
      provider.fetchTripPlan(
        destination: _destinationController.text,
        interests: _selectedInterests,
        budget: _selectedBudget,
        durationDays: _durationDays,
        context: context,
      );
    }
  }
}



class ItineraryScreen extends StatelessWidget {
  const ItineraryScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Trip Planner'),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Form to plan a new trip
            const PlanTripForm(),
            
            // Display itineraries
            Consumer<ItineraryProvider>(
              builder: (context, provider, _) {
                if (provider.itineraries.isEmpty) {
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.all(32.0),
                      child: Text(
                        'No itineraries yet. Plan your trip above!',
                        style: TextStyle(fontSize: 16),
                      ),
                    ),
                  );
                }
                
                return ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: provider.itineraries.length,
                  itemBuilder: (context, index) {
                    final itinerary = provider.itineraries[index];
                    return ItineraryCard(itinerary: itinerary);
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class ItineraryCard extends StatelessWidget {
  final ItineraryModel itinerary;
  
  const ItineraryCard({
    Key? key,
    required this.itinerary,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(16.0),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Itinerary image
          AspectRatio(
            aspectRatio: 16 / 9,
            child: Image.network(
              itinerary.imageUrl,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return Container(
                  color: Colors.grey[300],
                  alignment: Alignment.center,
                  child: const Icon(Icons.image, size: 50),
                );
              },
            ),
          ),
          
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Title section
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        itinerary.name,
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                    ),
                    Chip(
                      label: Text(
                        itinerary.type.toUpperCase(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      backgroundColor: itinerary.type == 'luxury' 
                        ? Colors.purple 
                        : Colors.green,
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                
                // Theme
                Text(
                  itinerary.theme,
                  style: const TextStyle(
                    fontStyle: FontStyle.italic,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 16),
                
                // Date range
                Row(
                  children: [
                    const Icon(Icons.calendar_today, size: 16),
                    const SizedBox(width: 8),
                    Text(
                      '${_formatDate(itinerary.startDate)} - ${_formatDate(itinerary.endDate)}',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                
                // Transportation
                Row(
                  children: [
                    const Icon(Icons.directions_car, size: 16),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        itinerary.transportation.betweenActivities,
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                
                // View details button
                Center(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => ItineraryDetailsScreen(itinerary: itinerary),
                        ),
                      );
                    },
                    child: const Text('View Details'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}

// Placeholder for the details screen
class ItineraryDetailsScreen extends StatelessWidget {
  final ItineraryModel itinerary;
  
  const ItineraryDetailsScreen({
    Key? key,
    required this.itinerary,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(itinerary.name),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Implementation of details screen...
            // You would display days, places, dining options, etc. here
          ],
        ),
      ),
    );
  }
}