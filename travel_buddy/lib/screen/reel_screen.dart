import 'package:flutter/material.dart';
import 'package:travel_buddy/providers/reel_provider.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';

import 'package:provider/provider.dart';
import 'package:intl/intl.dart';

class ReelScreen extends StatefulWidget {
  const ReelScreen({super.key, required ReelModel reel});

  @override
  State<ReelScreen> createState() => _ReelScreenState();
}

class _ReelScreenState extends State<ReelScreen> {
  late PageController _pageController;
  Map<int, YoutubePlayerController> _controllers = {};
  int _currentPage = 0;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: 0);
    _initializeControllers();
  }

  void _initializeControllers() {
    final reels = Provider.of<ReelsProvider>(context, listen: false).reels;
    for (int i = 0; i < reels.length; i++) {
      final youtubeId = YoutubePlayer.convertUrlToId(reels[i].videoUrl) ?? '';
      _controllers[i] = YoutubePlayerController(
        initialVideoId: youtubeId,
        flags: YoutubePlayerFlags(
          autoPlay: i == 0, // Play only the first video initially
          mute: false,
          loop: true,
          showLiveFullscreenButton: false,
        ),
      );
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    _controllers.values.forEach((controller) => controller.dispose());
    super.dispose();
  }

  void _onPageChanged(int index) {
    setState(() {
      _currentPage = index;
    });
    // Pause all videos except the current one
    _controllers.forEach((key, controller) {
      if (key == index) {
        controller.play();
      } else {
        controller.pause();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final reelsProvider = Provider.of<ReelsProvider>(context);
    final reels = reelsProvider.reels;

    return Scaffold(
      body: PageView.builder(
        scrollDirection: Axis.vertical,
        controller: _pageController,
        itemCount: reels.length,
        onPageChanged: _onPageChanged,
        itemBuilder: (context, index) {
          final reel = reels[index];
          final controller = _controllers[index]!;

          return ReelItem(
            reel: reel,
            controller: controller,
            isPlaying: _currentPage == index,
            onToggleComments: () => _showCommentsSheet(context, reel, reelsProvider),
          );
        },
      ),
    );
  }

  void _showCommentsSheet(BuildContext context, ReelModel reel, ReelsProvider provider) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.5,
        minChildSize: 0.3,
        maxChildSize: 0.9,
        builder: (context, scrollController) => Container(
          decoration: BoxDecoration(
            color: Colors.grey[900],
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
          ),
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  'Comments (${reel.commentsList.length})',
                  style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
              Expanded(
                child: ListView.builder(
                  controller: scrollController,
                  itemCount: reel.commentsList.length,
                  itemBuilder: (context, index) {
                    final comment = reel.commentsList[index];
                    return ListTile(
                      leading: CircleAvatar(
                        radius: 16,
                        backgroundImage: NetworkImage(comment.userAvatar),
                      ),
                      title: Text(
                        comment.username,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                      subtitle: Text(
                        comment.comment,
                        style: const TextStyle(color: Colors.white70),
                      ),
                      trailing: Text(
                        DateFormat('HH:mm').format(comment.timestamp),
                        style: const TextStyle(color: Colors.white54, fontSize: 12),
                      ),
                    );
                  },
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        decoration: InputDecoration(
                          hintText: 'Add a comment...',
                          hintStyle: const TextStyle(color: Colors.white54),
                          filled: true,
                          fillColor: Colors.grey[800],
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(20),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: Colors.white),
                        onSubmitted: (value) {
                          if (value.isNotEmpty) {
                            provider.addComment(reel.id, value);
                          }
                        },
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.send, color: Colors.white),
                      onPressed: () {
                        // Trigger comment submission if needed
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class ReelItem extends StatefulWidget {
  final ReelModel reel;
  final YoutubePlayerController controller;
  final bool isPlaying;
  final VoidCallback onToggleComments;

  const ReelItem({
    super.key,
    required this.reel,
    required this.controller,
    required this.isPlaying,
    required this.onToggleComments,
  });

  @override
  State<ReelItem> createState() => _ReelItemState();
}

class _ReelItemState extends State<ReelItem> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reelsProvider = Provider.of<ReelsProvider>(context);

    return Stack(
      children: [
        // Full-screen video player
        YoutubePlayer(
          controller: widget.controller,
          showVideoProgressIndicator: true,
          progressIndicatorColor: Colors.white,
          progressColors: const ProgressBarColors(
            playedColor: Colors.red,
            handleColor: Colors.white,
          ),
        ),

        // Overlay UI
        SafeArea(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Top bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back, color: Colors.white, size: 28),
                      onPressed: () => Navigator.pop(context),
                    ),
                    IconButton(
                      icon: const Icon(Icons.more_vert, color: Colors.white, size: 28),
                      onPressed: () {},
                    ),
                  ],
                ),
              ),

              // Bottom overlay
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 20,
                          backgroundImage: NetworkImage(widget.reel.userAvatar),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.reel.username,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                shadows: [Shadow(color: Colors.black, blurRadius: 4)],
                              ),
                            ),
                            GestureDetector(
                              onTap: () => reelsProvider.toggleFollow(widget.reel.id),
                              child: Text(
                                widget.reel.isFollowing ? 'Following' : 'Follow',
                                style: TextStyle(
                                  color: widget.reel.isFollowing ? Colors.grey : Colors.white,
                                  fontSize: 14,
                                  shadows: const [Shadow(color: Colors.black, blurRadius: 4)],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      widget.reel.description,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        shadows: [Shadow(color: Colors.black, blurRadius: 4)],
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),

        // Right-side interaction buttons
        Positioned(
          right: 16,
          bottom: 80,
          child: Column(
            children: [
              Column(
                children: [
                  IconButton(
                    icon: Icon(
                      widget.reel.isLiked ? Icons.favorite : Icons.favorite_border,
                      color: widget.reel.isLiked ? Colors.red : Colors.white,
                      size: 32,
                    ),
                    onPressed: () => reelsProvider.toggleLike(widget.reel.id),
                  ),
                  Text(
                    widget.reel.likes.toString(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      shadows: [Shadow(color: Colors.black, blurRadius: 4)],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Column(
                children: [
                  IconButton(
                    icon: const Icon(Icons.comment, color: Colors.white, size: 32),
                    onPressed: widget.onToggleComments,
                  ),
                  Text(
                    widget.reel.commentsList.length.toString(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      shadows: [Shadow(color: Colors.black, blurRadius: 4)],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              IconButton(
                icon: const Icon(Icons.share, color: Colors.white, size: 32),
                onPressed: () {},
              ),
            ],
          ),
        ),

        // Play/Pause button
        Center(
          child: GestureDetector(
            onTap: () {
              setState(() {
                widget.isPlaying ? widget.controller.pause() : widget.controller.play();
              });
              widget.isPlaying ? _animationController.forward() : _animationController.reverse();
            },
            child: AnimatedOpacity(
              opacity: widget.isPlaying ? 0.0 : 1.0,
              duration: const Duration(milliseconds: 200),
              child: Icon(
                widget.isPlaying ? Icons.play_arrow : Icons.pause,
                color: Colors.white.withOpacity(0.8),
                size: 60,
              ),
            ),
          ),
        ),
      ],
    );
  }
}