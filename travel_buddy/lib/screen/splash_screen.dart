import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:travel_buddy/providers/auth_provider.dart';
import 'package:travel_buddy/screen/login_screen.dart';
import 'package:travel_buddy/screen/main_screen.dart';

import 'package:travel_buddy/theme/theme.dart';
import 'package:lottie/lottie.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    );
    
    _animationController.forward();
    
    // Navigate to login or main screen after 3 seconds
    Timer(const Duration(seconds: 3), () {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          pageBuilder: (context, animation, secondaryAnimation) => 
            authProvider.isLoggedIn ? const MainScreen() : const LoginScreen(),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            const begin = Offset(0.0, 1.0);
            const end = Offset.zero;
            const curve = Curves.easeInOutQuart;
            var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
            return SlideTransition(
              position: animation.drive(tween),
              child: child,
            );
          },
          transitionDuration: const Duration(milliseconds: 800),
        ),
      );
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    
    return Scaffold(
      body: Container(
        width: size.width,
        height: size.height,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              AppTheme.primaryColor.withOpacity(0.8),
              AppTheme.primaryColor,
            ],
          ),
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Logo & App Name
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Here you'd typically use your app's logo
                // Using a placeholder animation instead
                SizedBox(
                  height: size.height * 0.3,
                  width: size.width * 0.6,
                  child: Lottie.network(
                    'https://assets10.lottiefiles.com/packages/lf20_ea2dbpgm.json',
                    controller: _animationController,
                  ),
                ),
                const SizedBox(height: 20),
                // App name with animated fade-in
                FadeTransition(
                  opacity: Tween<double>(begin: 0, end: 1).animate(
                    CurvedAnimation(
                      parent: _animationController,
                      curve: const Interval(0.5, 1, curve: Curves.easeIn),
                    ),
                  ),
                  child: const Text(
                    'Travel Buddy',
                    style: TextStyle(
                      fontSize: 36,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: 1.2,
                      fontFamily: 'SF Pro Display',
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                // Tagline with animated fade-in
                FadeTransition(
                  opacity: Tween<double>(begin: 0, end: 1).animate(
                    CurvedAnimation(
                      parent: _animationController,
                      curve: const Interval(0.7, 1, curve: Curves.easeIn),
                    ),
                  ),
                  child: const Text(
                    'Your perfect travel companion',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white,
                      fontFamily: 'SF Pro Text',
                    ),
                  ),
                ),
              ],
            ),
            // Animated loading indicator at bottom
            Positioned(
              bottom: 50,
              child: FadeTransition(
                opacity: Tween<double>(begin: 0, end: 1).animate(
                  CurvedAnimation(
                    parent: _animationController,
                    curve: const Interval(0.3, 0.8, curve: Curves.easeIn),
                  ),
                ),
                child: const CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
