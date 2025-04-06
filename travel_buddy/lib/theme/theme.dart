// lib/theme/theme.dart
import 'package:flutter/material.dart';

class AppTheme {
  // Colors
  static const Color primaryColor = Color(0xFF1E88E5); // Blue
  static const Color primaryDarkColor = Color(0xFF1565C0);
  static const Color accentColor = Color(0xFF42A5F5);
  static const Color backgroundLight = Color(0xFFF5F9FF);
  static const Color backgroundDark = Color(0xFF121212);
  static const Color cardLight = Colors.white;
  static const Color cardDark = Color(0xFF1E1E1E);
  static const Color textLight = Color(0xFF333333);
  static const Color textDark = Color(0xFFF5F5F5);
  static const Color subtitleLight = Color(0xFF757575);
  static const Color subtitleDark = Color(0xFFAAAAAA);
  static const Color dividerLight = Color(0xFFE0E0E0);
  static const Color dividerDark = Color(0xFF424242);
  static const Color successColor = Color(0xFF4CAF50);
  
  // Text Styles
  static TextStyle headingStyle(BuildContext context) => TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Theme.of(context).brightness == Brightness.light ? textLight : textDark,
    fontFamily: 'SF Pro Display',
  );
  
  static TextStyle subHeadingStyle(BuildContext context) => TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    color: Theme.of(context).brightness == Brightness.light ? textLight : textDark,
    fontFamily: 'SF Pro Display',
  );
  
  static TextStyle bodyStyle(BuildContext context) => TextStyle(
    fontSize: 16,
    color: Theme.of(context).brightness == Brightness.light ? textLight : textDark,
    fontFamily: 'SF Pro Text',
  );
  
  static TextStyle captionStyle(BuildContext context) => TextStyle(
    fontSize: 14,
    color: Theme.of(context).brightness == Brightness.light ? subtitleLight : subtitleDark,
    fontFamily: 'SF Pro Text',
  );
  
  // Card Decoration
  static BoxDecoration cardDecoration(BuildContext context) => BoxDecoration(
    color: Theme.of(context).brightness == Brightness.light ? cardLight : cardDark,
    borderRadius: BorderRadius.circular(16),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.05),
        blurRadius: 10,
        offset: const Offset(0, 4),
      ),
    ],
  );
  
  // Button Styles
  static ButtonStyle primaryButtonStyle = ElevatedButton.styleFrom(
    backgroundColor: primaryColor,
    foregroundColor: Colors.white,
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
  );
  
  static ButtonStyle secondaryButtonStyle(BuildContext context) => OutlinedButton.styleFrom(
    foregroundColor: primaryColor,
    side: const BorderSide(color: primaryColor),
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
  );
  
  // App Bar Theme
  static AppBarTheme appBarThemeLight = const AppBarTheme(
    backgroundColor: Colors.white,
    foregroundColor: textLight,
    elevation: 0,
    centerTitle: true,
    iconTheme: IconThemeData(color: primaryColor),
  );
  
  static AppBarTheme appBarThemeDark = const AppBarTheme(
    backgroundColor: backgroundDark,
    foregroundColor: textDark,
    elevation: 0,
    centerTitle: true,
    iconTheme: IconThemeData(color: accentColor),
  );
  
  // Bottom Navigation Bar Theme
  static BottomNavigationBarThemeData bottomNavThemeLight = const BottomNavigationBarThemeData(
    backgroundColor: Colors.white,
    selectedItemColor: primaryColor,
    unselectedItemColor: subtitleLight,
    showSelectedLabels: true,
    showUnselectedLabels: true,
    type: BottomNavigationBarType.fixed,
  );
  
  static BottomNavigationBarThemeData bottomNavThemeDark = const BottomNavigationBarThemeData(
    backgroundColor: cardDark,
    selectedItemColor: accentColor,
    unselectedItemColor: subtitleDark,
    showSelectedLabels: true,
    showUnselectedLabels: true,
    type: BottomNavigationBarType.fixed,
  );
  
  // Input Decoration Theme
  static InputDecorationTheme inputDecorationThemeLight = InputDecorationTheme(
    filled: true,
    fillColor: backgroundLight,
    contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: BorderSide.none,
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: BorderSide.none,
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: primaryColor, width: 1),
    ),
    hintStyle: const TextStyle(color: subtitleLight),
  );
  
  static InputDecorationTheme inputDecorationThemeDark = InputDecorationTheme(
    filled: true,
    fillColor: cardDark,
    contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: BorderSide.none,
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: BorderSide.none,
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: accentColor, width: 1),
    ),
    hintStyle: const TextStyle(color: subtitleDark),
  );
  
  // Light Theme
  static final ThemeData lightTheme = ThemeData(
    brightness: Brightness.light,
    primaryColor: primaryColor,
    colorScheme: const ColorScheme.light(
      primary: primaryColor,
      secondary: accentColor,
      background: backgroundLight,
    ),
    scaffoldBackgroundColor: backgroundLight,
    cardColor: cardLight,
    dividerColor: dividerLight,
    fontFamily: 'SF Pro Text',
    appBarTheme: appBarThemeLight,
    bottomNavigationBarTheme: bottomNavThemeLight,
    inputDecorationTheme: inputDecorationThemeLight,
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: primaryButtonStyle,
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: primaryColor,
        side: const BorderSide(color: primaryColor),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    ),
  );
  
  // Dark Theme
  static final ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    primaryColor: primaryDarkColor,
    colorScheme: const ColorScheme.dark(
      primary: primaryDarkColor,
      secondary: accentColor,
      background: backgroundDark,
    ),
    scaffoldBackgroundColor: backgroundDark,
    cardColor: cardDark,
    dividerColor: dividerDark,
    fontFamily: 'SF Pro Text',
    appBarTheme: appBarThemeDark,
    bottomNavigationBarTheme: bottomNavThemeDark,
    inputDecorationTheme: inputDecorationThemeDark,
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: primaryButtonStyle,
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: accentColor,
        side: const BorderSide(color: accentColor),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    ),
  );
}