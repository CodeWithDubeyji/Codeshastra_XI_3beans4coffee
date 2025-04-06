import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:travel_buddy/providers/theme_provider.dart';
import 'package:travel_buddy/providers/reel_provider.dart';
import 'package:travel_buddy/screen/ar_screen.dart';
import 'package:travel_buddy/screen/homescreen.dart';

import 'package:travel_buddy/theme/theme.dart';
import 'package:flutter/services.dart';

import 'reel_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    _requestLocationPermission();
  }

  Future<void> _requestLocationPermission() async {
    await Future.delayed(const Duration(milliseconds: 500));
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final reelProvider = Provider.of<ReelsProvider>(context);

    SystemChrome.setSystemUIOverlayStyle(
      themeProvider.themeMode == ThemeMode.dark
          ? SystemUiOverlayStyle.light
          : SystemUiOverlayStyle.dark,
    );

    final List<Widget> _screens = [
      const HomeScreen(),
      ReelScreen(reel: reelProvider.reels[0]),
      ARScreen(),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Travel Buddy'),
        centerTitle: true,
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        child: _screens[_currentIndex],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.video_collection_outlined),
              activeIcon: Icon(Icons.video_collection),
              label: 'Reels',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.view_in_ar_outlined),
              activeIcon: Icon(Icons.view_in_ar),
              label: 'AR',
            ),
          ],
        ),
      ),
    );
  }
}
