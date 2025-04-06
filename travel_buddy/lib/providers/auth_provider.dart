// lib/providers/auth_provider.dart
import 'package:flutter/material.dart';

class UserModel {
  final String id;
  final String name;
  final String email;
  final String avatarUrl;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.avatarUrl,
  });
}

class AuthProvider with ChangeNotifier {
  bool _isLoggedIn = false;
  UserModel? _currentUser;

  bool get isLoggedIn => _isLoggedIn;
  UserModel? get currentUser => _currentUser;

  // Mock users
  final List<Map<String, String>> _mockUsers = [
    {
      'id': '1',
      'name': 'John Traveler',
      'email': 'john@example.com',
      'password': 'john123',
      'avatarUrl': 'https://i.pravatar.cc/150?img=3',
    },
    {
      'id': '2',
      'name': 'Alice Coder',
      'email': 'alice@example.com',
      'password': 'alice123',
      'avatarUrl': 'https://i.pravatar.cc/150?img=5',
    },
    {
      'id': '3',
      'name': 'Bob Designer',
      'email': 'bob@example.com',
      'password': 'bob123',
      'avatarUrl': 'https://i.pravatar.cc/150?img=8',
    },
  ];

  void login(String email, String password) {
    final user = _mockUsers.firstWhere(
      (user) => user['email'] == email && user['password'] == password,
      orElse: () => {},
    );

    if (user.isNotEmpty) {
      _isLoggedIn = true;
      _currentUser = UserModel(
        id: user['id']!,
        name: user['name']!,
        email: user['email']!,
        avatarUrl: user['avatarUrl']!,
      );
      notifyListeners();
    } else {
      // Optional: handle login error
      throw Exception('Invalid email or password');
    }
  }

  void logout() {
    _isLoggedIn = false;
    _currentUser = null;
    notifyListeners();
  }
}
