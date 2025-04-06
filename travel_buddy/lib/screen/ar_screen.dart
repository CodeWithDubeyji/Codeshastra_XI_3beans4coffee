import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:travel_buddy/theme/theme.dart';
import 'package:http/http.dart' as http;

class ARScreen extends StatefulWidget {
  const ARScreen({super.key});

  @override
  _ARScreenState createState() => _ARScreenState();
}

class _ARScreenState extends State<ARScreen> with SingleTickerProviderStateMixin {
  List<CameraDescription>? cameras;
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _initializeCamera();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _initializeCamera() async {
    try {
      cameras = await availableCameras();
      if (mounted) setState(() {});
    } catch (e) {
      print('Error initializing cameras: $e');
    }
  }

  void _openCamera() {
    if (cameras != null && cameras!.isNotEmpty) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => CameraPreviewScreen(camera: cameras!.first),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('No camera available'),
          backgroundColor: Colors.redAccent,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppTheme.primaryColor.withOpacity(0.9),
              Colors.white.withOpacity(0.9),
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: FadeTransition(
                  opacity: _fadeAnimation,
                  child: Column(
                    children: [
                      Text(
                        'Augmented Reality',
                        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1.2,
                            ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Explore the world through your camera with AR',
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                              color: Colors.white70,
                              fontStyle: FontStyle.italic,
                            ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
              const Spacer(),
              FadeTransition(
                opacity: _fadeAnimation,
                child: ElevatedButton(
                  onPressed: _openCamera,
                  style: ElevatedButton.styleFrom(
                    foregroundColor: Colors.white,
                    backgroundColor: AppTheme.accentColor,
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                    elevation: 8,
                    shadowColor: Colors.black.withOpacity(0.3),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.camera_alt, size: 24),
                      const SizedBox(width: 12),
                      Text(
                        'Launch AR Camera',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.w600,
                            ),
                      ),
                    ],
                  ),
                ),
              ),
              const Spacer(),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  'Point your camera at landmarks or text to identify what\'s in front of you',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Colors.white60,
                        fontSize: 12,
                      ),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class CameraPreviewScreen extends StatefulWidget {
  final CameraDescription camera;

  const CameraPreviewScreen({super.key, required this.camera});

  @override
  State<CameraPreviewScreen> createState() => _CameraPreviewScreenState();
}

class _CameraPreviewScreenState extends State<CameraPreviewScreen> {
  late CameraController _controller;
  bool _isInitialized = false;
  bool _isDetecting = false;
  
  // Detection mode
  DetectionMode _currentMode = DetectionMode.all;
  
  // Detection results
  String? _landmarkName;
  String? _landmarkLocation;
  List<String> _detectedTexts = [];
  List<String> _labeledObjects = [];

  // Google Cloud Vision API key
  static const String _apiKey = 'AIzaSyAgdzRdSj4GFi9a_VQzpFmRA76wjh8cIcI';

  @override
  void initState() {
    super.initState();
    _initializeCameraController();
  }

  Future<void> _initializeCameraController() async {
    _controller = CameraController(widget.camera, ResolutionPreset.high);
    try {
      await _controller.initialize();
      if (mounted) {
        setState(() {
          _isInitialized = true;
        });
      }
    } catch (e) {
      print('Error initializing camera: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Camera error: $e')),
        );
      }
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _analyzeImage() async {
    if (!_isInitialized || _isDetecting) return;

    setState(() {
      _isDetecting = true;
      _landmarkName = null;
      _landmarkLocation = null;
      _detectedTexts = [];
      _labeledObjects = [];
    });

    try {
      final XFile imageFile = await _controller.takePicture();
      final String base64Image = base64Encode(await File(imageFile.path).readAsBytes());

      // Use different API calls based on the current mode
      if (_currentMode == DetectionMode.landmark || _currentMode == DetectionMode.all) {
        await _detectLandmark(base64Image);
      }
      
      if (_currentMode == DetectionMode.text || _currentMode == DetectionMode.all) {
        await _detectText(base64Image);
      }
      
      if (_currentMode == DetectionMode.label || _currentMode == DetectionMode.all) {
        await _detectLabels(base64Image);
      }
    } catch (e) {
      print('Error analyzing image: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error analyzing image: $e')),
      );
    } finally {
      setState(() {
        _isDetecting = false;
      });
    }
  }

  Future<void> _detectLandmark(String base64Image) async {
    try {
      final response = await _callGoogleVisionApi(base64Image, 'LANDMARK_DETECTION');
      final landmarks = response['responses']?[0]?['landmarkAnnotations'];

      if (landmarks != null && landmarks.isNotEmpty) {
        setState(() {
          _landmarkName = landmarks[0]['description'];
          _landmarkLocation = landmarks[0]['locations']?[0]?['latLng'] != null
              ? 'Lat: ${landmarks[0]['locations'][0]['latLng']['latitude']}, Lon: ${landmarks[0]['locations'][0]['latLng']['longitude']}'
              : 'Location not available';
        });
      } else {
        setState(() {
          _landmarkName = 'No landmark detected';
          _landmarkLocation = '';
        });
      }
    } catch (e) {
      print('Error detecting landmark: $e');
    }
  }

  Future<void> _detectText(String base64Image) async {
    try {
      final response = await _callGoogleVisionApi(base64Image, 'TEXT_DETECTION');
      final textAnnotations = response['responses']?[0]?['textAnnotations'];

      if (textAnnotations != null && textAnnotations.isNotEmpty) {
        // Skip the first one as it contains all text
        final texts = textAnnotations.skip(1).map<String>((annotation) {
          return annotation['description'] as String;
        }).toList();
        
        setState(() {
          _detectedTexts = texts;
        });
      } else {
        setState(() {
          _detectedTexts = ['No text detected'];
        });
      }
    } catch (e) {
      print('Error detecting text: $e');
    }
  }

  Future<void> _detectLabels(String base64Image) async {
    try {
      final response = await _callGoogleVisionApi(base64Image, 'LABEL_DETECTION');
      final labelAnnotations = response['responses']?[0]?['labelAnnotations'];

      if (labelAnnotations != null && labelAnnotations.isNotEmpty) {
        final labels = labelAnnotations.map<String>((annotation) {
          final score = (annotation['score'] * 100).toStringAsFixed(1);
          return '${annotation['description']} (${score}%)';
        }).toList();
        
        setState(() {
          _labeledObjects = labels;
        });
      } else {
        setState(() {
          _labeledObjects = ['No objects detected'];
        });
      }
    } catch (e) {
      print('Error detecting labels: $e');
    }
  }

  Future<Map<String, dynamic>> _callGoogleVisionApi(String base64Image, String featureType) async {
    final String url = 'https://vision.googleapis.com/v1/images:annotate?key=$_apiKey';
    final Map<String, dynamic> requestBody = {
      'requests': [
        {
          'image': {'content': base64Image},
          'features': [
            {'type': featureType, 'maxResults': featureType == 'LABEL_DETECTION' ? 5 : 10}
          ],
        }
      ],
    };

    final response = await http.post(
      Uri.parse(url),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(requestBody),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to call Google Vision API: ${response.statusCode}');
    }
  }

  void _switchDetectionMode(DetectionMode mode) {
    setState(() {
      _currentMode = mode;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Camera Preview
          if (_isInitialized)
            Positioned.fill(
              child: CameraPreview(_controller),
            )
          else
            const Center(child: CircularProgressIndicator(color: Colors.white)),

          // Overlay UI
          SafeArea(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Top bar
                Container(
                  padding: const EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.black.withOpacity(0.7), Colors.transparent],
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back, color: Colors.white, size: 28),
                        onPressed: () => Navigator.pop(context),
                      ),
                      Text(
                        'AR Mode: ${_getModeText()}',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.info_outline, color: Colors.white, size: 28),
                        onPressed: () => _showInfoDialog(context),
                      ),
                    ],
                  ),
                ),

                // Detection mode selector
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.6),
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _buildModeButton(DetectionMode.all, 'All', Icons.search),
                        _buildModeButton(DetectionMode.landmark, 'Landmarks', Icons.location_on),
                        _buildModeButton(DetectionMode.text, 'Text', Icons.text_fields),
                        _buildModeButton(DetectionMode.label, 'Objects', Icons.label),
                      ],
                    ),
                  ),
                ),

                // Bottom controls
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      // Detection results card
                      Container(
                        padding: const EdgeInsets.all(16),
                        margin: const EdgeInsets.only(bottom: 16),
                        width: double.infinity,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(12),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.2),
                              blurRadius: 8,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: _isDetecting
                            ? const Center(
                                child: Padding(
                                  padding: EdgeInsets.all(24.0),
                                  child: CircularProgressIndicator(),
                                ),
                              )
                            : Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Show landmark section if detected or in landmark mode
                                  if (_currentMode == DetectionMode.landmark || 
                                      _currentMode == DetectionMode.all ||
                                      _landmarkName != null)
                                    _buildDetectionSection(
                                      title: 'Landmark',
                                      icon: Icons.location_on,
                                      content: _landmarkName ?? 'No landmark detected',
                                      subtitle: _landmarkLocation,
                                    ),
                                    
                                  // Show text section if detected or in text mode
                                  if (_currentMode == DetectionMode.text || 
                                      _currentMode == DetectionMode.all ||
                                      _detectedTexts.isNotEmpty)
                                    _buildDetectionSection(
                                      title: 'Text',
                                      icon: Icons.text_fields,
                                      content: _detectedTexts.isEmpty 
                                          ? 'No text detected' 
                                          : _detectedTexts.join(', '),
                                    ),
                                    
                                  // Show labeled objects if detected or in label mode
                                  if (_currentMode == DetectionMode.label || 
                                      _currentMode == DetectionMode.all ||
                                      _labeledObjects.isNotEmpty)
                                    _buildDetectionSection(
                                      title: 'Objects',
                                      icon: Icons.label,
                                      content: _labeledObjects.isEmpty 
                                          ? 'No objects detected' 
                                          : _labeledObjects.join(', '),
                                    ),
                                ],
                              ),
                      ),

                      // Control buttons
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildControlButton(
                            icon: Icons.flip_camera_android,
                            onPressed: _switchCamera,
                          ),
                          _buildControlButton(
                            icon: Icons.camera,
                            onPressed: _analyzeImage,
                            isPrimary: true,
                          ),
                          _buildControlButton(
                            icon: Icons.settings,
                            onPressed: () {},
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _getModeText() {
    switch (_currentMode) {
      case DetectionMode.landmark:
        return 'Landmarks';
      case DetectionMode.text:
        return 'Text';
      case DetectionMode.label:
        return 'Objects';
      case DetectionMode.all:
      default:
        return 'All';
    }
  }

  Widget _buildModeButton(DetectionMode mode, String label, IconData icon) {
    final bool isSelected = _currentMode == mode;
    
    return InkWell(
      onTap: () => _switchDetectionMode(mode),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.accentColor : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          children: [
            Icon(
              icon, 
              color: Colors.white, 
              size: 16,
            ),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(
                color: Colors.white,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetectionSection({
    required String title,
    required IconData icon,
    required String content,
    String? subtitle,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, color: AppTheme.primaryColor),
            const SizedBox(width: 8),
            Text(
              title,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: AppTheme.primaryColor,
                  ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          content,
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: Colors.black87,
              ),
        ),
        if (subtitle != null && subtitle.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Text(
              subtitle,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.grey[600],
                  ),
            ),
          ),
        const SizedBox(height: 12),
        const Divider(),
        const SizedBox(height: 4),
      ],
    );
  }

  Future<void> _switchCamera() async {
    final cameras = await availableCameras();
    if (cameras.length < 2) return;

    final newCamera = cameras.firstWhere(
      (cam) => cam.lensDirection != widget.camera.lensDirection,
      orElse: () => widget.camera,
    );

    if (newCamera != widget.camera) {
      await _controller.dispose();
      setState(() {
        _isInitialized = false;
      });
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => CameraPreviewScreen(camera: newCamera),
        ),
      );
    }
  }

  Widget _buildControlButton({
    required IconData icon,
    required VoidCallback onPressed,
    bool isPrimary = false,
  }) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        foregroundColor: Colors.white,
        backgroundColor: isPrimary ? AppTheme.accentColor : Colors.grey[800],
        shape: const CircleBorder(),
        padding: const EdgeInsets.all(16),
        elevation: 4,
      ),
      child: Icon(icon, size: 28),
    );
  }

  void _showInfoDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          'AR Instructions',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                color: AppTheme.primaryColor,
                fontWeight: FontWeight.bold,
              ),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Point your camera and press the camera button to identify:',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 12),
            _buildInfoItem(Icons.location_on, 'Landmarks - Famous places and monuments'),
            _buildInfoItem(Icons.text_fields, 'Text - Signs, labels and written content'),
            _buildInfoItem(Icons.label, 'Objects - Common items and scenery'),
            const SizedBox(height: 12),
            Text(
              'Switch between detection modes using the buttons at the top.',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Got it',
              style: Theme.of(context).textTheme.labelLarge?.copyWith(
                    color: AppTheme.accentColor,
                  ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildInfoItem(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppTheme.primaryColor),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }
}

enum DetectionMode {
  all,
  landmark,
  text,
  label,
}