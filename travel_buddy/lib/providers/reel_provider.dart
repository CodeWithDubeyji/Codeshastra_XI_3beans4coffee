// lib/providers/reels_provider.dart
import 'package:flutter/material.dart';

class ReelModel {
  final String id;
  final String userId;
  final String username;
  final String userAvatar;
  final String videoUrl;
  final String description;
  final int likes;
  final int comments;
  final List<CommentModel> commentsList;
  bool isLiked;
  bool isFollowing;

  ReelModel({
    required this.id,
    required this.userId,
    required this.username,
    required this.userAvatar,
    required this.videoUrl,
    required this.description,
    required this.likes,
    required this.comments,
    required this.commentsList,
    this.isLiked = false,
    this.isFollowing = false,
  });
}

class CommentModel {
  final String id;
  final String userId;
  final String username;
  final String userAvatar;
  final String comment;
  final DateTime timestamp;

  CommentModel({
    required this.id,
    required this.userId,
    required this.username,
    required this.userAvatar,
    required this.comment,
    required this.timestamp,
  });
}

class ReelsProvider with ChangeNotifier {
  List<ReelModel> _reels = [];

  List<ReelModel> get reels => _reels;

  ReelsProvider() {
    _loadMockData();
  }

  void toggleLike(String reelId) {
    final reel = _reels.firstWhere((r) => r.id == reelId);
    reel.isLiked = !reel.isLiked;
    notifyListeners();
  }

  void toggleFollow(String reelId) {
    final reel = _reels.firstWhere((r) => r.id == reelId);
    reel.isFollowing = !reel.isFollowing;
    notifyListeners();
  }

  void addComment(String reelId, String comment) {
    final reel = _reels.firstWhere((r) => r.id == reelId);

    reel.commentsList.add(
      CommentModel(
        id: DateTime.now().toString(),
        userId: 'currentUser',
        username: 'John Traveler',
        userAvatar: 'https://i.pravatar.cc/150?img=3',
        comment: comment,
        timestamp: DateTime.now(),
      ),
    );

    notifyListeners();
  }

  void _loadMockData() {
    _reels = [
      ReelModel(
        id: 'r1',
        userId: 'u1',
        username: 'travel_addict',
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        videoUrl: 'https://www.youtube.com/shorts/oN5vQTPD_3k', // Taj Mahal Travel Vlog
        description: 'Amazing view from Taj Mahal! 😍 #India #Travel #TajMahal',
        likes: 1243,
        comments: 89,
        commentsList: [
          CommentModel(
            id: 'c1',
            userId: 'u2',
            username: 'wanderlust',
            userAvatar: 'https://i.pravatar.cc/150?img=5',
            comment: 'Wow! This is breathtaking!',
            timestamp: DateTime.now().subtract(const Duration(hours: 2)),
          ),
          CommentModel(
            id: 'c2',
            userId: 'u3',
            username: 'globetrotter',
            userAvatar: 'https://i.pravatar.cc/150?img=6',
            comment: 'I want to go there too!',
            timestamp: DateTime.now().subtract(const Duration(hours: 1)),
          ),
        ],
      ),
      ReelModel(
        id: 'r2',
        userId: 'u4',
        username: 'adventure_time',
        userAvatar: 'https://i.pravatar.cc/150?img=2',
        videoUrl: 'https://www.youtube.com/shorts/7iW9y8sQ8kQ', // Red Fort Delhi Vlog
        description:
            'Exploring the historic Red Fort in Delhi. The architecture is simply stunning! #Delhi #RedFort #Heritage',
        likes: 985,
        comments: 42,
        commentsList: [
          CommentModel(
            id: 'c3',
            userId: 'u5',
            username: 'history_buff',
            userAvatar: 'https://i.pravatar.cc/150?img=7',
            comment: 'The history behind this place is fascinating!',
            timestamp: DateTime.now().subtract(const Duration(hours: 5)),
          ),
        ],
      ),
      ReelModel(
        id: 'r3',
        userId: 'u6',
        username: 'photo_ninja',
        userAvatar: 'https://i.pravatar.cc/150?img=4',
        videoUrl: 'https://www.youtube.com/shorts/JzQ8x8z8v8w', // Qutub Minar Sunset Vlog
        description:
            'Sunset at Qutub Minar. Perfect end to a perfect day. #QutubMinar #Delhi #Sunset #Travel',
        likes: 2456,
        comments: 132,
        commentsList: [
          CommentModel(
            id: 'c4',
            userId: 'u7',
            username: 'sunset_lover',
            userAvatar: 'https://i.pravatar.cc/150?img=8',
            comment: 'Those colors are magnificent!',
            timestamp: DateTime.now().subtract(const Duration(days: 1)),
          ),
          CommentModel(
            id: 'c5',
            userId: 'u8',
            username: 'camera_pro',
            userAvatar: 'https://i.pravatar.cc/150?img=9',
            comment: 'What camera did you use for this?',
            timestamp: DateTime.now().subtract(const Duration(hours: 12)),
          ),
        ],
      ),
    ];
    notifyListeners();
  }
}