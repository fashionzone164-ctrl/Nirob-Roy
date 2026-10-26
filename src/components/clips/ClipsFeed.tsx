import React, { useState, useRef, useEffect } from 'react';
import { useSocial } from '../../context/SocialContext';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Music, 
  ChevronUp, 
  ChevronDown, 
  UserPlus, 
  Check, 
  Volume2, 
  VolumeX,
  Sparkles,
  Send,
  X
} from 'lucide-react';

export const ClipsFeed: React.FC = () => {
  const { 
    clips, 
    toggleLikeClip, 
    toggleBookmarkClip, 
    followedUserIds, 
    toggleFollow, 
    openUserProfile,
    openShareModal,
    setIsCreateClipOpen
  } = useSocial();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [clipComments, setClipComments] = useState<Record<string, Array<{ id: string; user: string; text: string; time: string }>>>({
    clip_1: [
      { id: '1', user: 'elena', text: 'Shibuya neon reflections are always hypnotic!', time: '1h ago' },
      { id: '2', user: 'marcus', text: 'The atmosphere in this cut is incredible.', time: '40m ago' }
    ],
    clip_2: [
      { id: '3', user: 'maya', text: 'Clean kickflip catch! Proper technique.', time: '2h ago' }
    ]
  });

  const currentClip = clips[activeIndex] || clips[0];
  const isFollowing = currentClip ? followedUserIds.includes(currentClip.userId) : false;

  const handleNext = () => {
    if (activeIndex < clips.length - 1) setActiveIndex(activeIndex + 1);
  };

  const handlePrev = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentClip) return;
    const newEntry = {
      id: Date.now().toString(),
      user: 'alexvance',
      text: commentText.trim(),
      time: 'Just now',
    };
    setClipComments((prev) => ({
      ...prev,
      [currentClip.id]: [newEntry, ...(prev[currentClip.id] || [])],
    }));
    setCommentText('');
  };

  if (!currentClip) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-center text-slate-500">
        <p>No clips available</p>
      </div>
    );
  }

  const isVideoMedia = currentClip?.videoUrl?.startsWith('blob:') || 
    currentClip?.videoUrl?.startsWith('data:video') || 
    /\.(mp4|webm|mov|ogg)($|\?)/i.test(currentClip?.videoUrl || '');

  const videoElementRef = useRef<HTMLVideoElement>(null);

  // Sync play/pause with state
  useEffect(() => {
    if (isVideoMedia && videoElementRef.current) {
      if (isPlaying) {
        videoElementRef.current.play().catch(() => {});
      } else {
        videoElementRef.current.pause();
      }
    }
  }, [isPlaying, isVideoMedia, activeIndex]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentComments = clipComments[currentClip.id] || [];

  return (
    <div className="relative w-full max-w-md mx-auto h-[calc(100vh-10rem)] md:h-[calc(100vh-7rem)] flex items-center justify-center pb-16 md:pb-4">
      {/* Clip Container */}
      <div className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden bg-slate-900 shadow-xl flex flex-col justify-between">
        {/* Visual Media (Video player or Visual simulation) */}
        {isVideoMedia ? (
          <video
            ref={videoElementRef}
            src={currentClip.videoUrl}
            playsInline
            loop
            muted={isMuted}
            autoPlay
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            onClick={togglePlayPause}
          />
        ) : (
          <img
            src={currentClip.videoUrl}
            alt={currentClip.caption}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            onClick={togglePlayPause}
          />
        )}

        {/* Cinematic gradient scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />

        {/* Play/Pause overlay indicator when paused */}
        {!isPlaying && (
          <div 
            onClick={togglePlayPause}
            className="absolute inset-0 flex items-center justify-center z-15 cursor-pointer bg-black/30 backdrop-blur-2xs"
          >
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-2xl scale-105 transition-transform">
              <span className="text-xl font-bold ml-1">▶</span>
            </div>
          </div>
        )}

        {/* Top bar controls */}
        <div className="relative z-20 flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-extrabold text-sm tracking-tight flex items-center gap-1.5 drop-shadow">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              Qevora Reels
            </span>
            <button
              onClick={() => setIsCreateClipOpen(true)}
              className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/30 transition-all cursor-pointer"
              aria-label="Upload new reel"
            >
              <span className="text-sm">+</span>
              <span>Upload Reel</span>
            </button>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-9 h-9 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 backdrop-blur-md transition-colors"
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Right Action Bar */}
        <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4 text-white">
          {/* Creator Avatar with Follow button */}
          <div className="relative mb-2">
            <button
              onClick={() => openUserProfile(currentClip.userId)}
              className="w-11 h-11 rounded-full p-0.5 bg-white overflow-hidden shadow-lg"
              aria-label={`View ${currentClip.user.name}'s profile`}
            >
              <img
                src={currentClip.user.avatar}
                alt={currentClip.user.name}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            </button>
            <button
              onClick={() => toggleFollow(currentClip.userId)}
              className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center shadow-md transition-all ${
                isFollowing ? 'bg-slate-300 text-slate-800' : 'bg-blue-600 text-white'
              }`}
              aria-label={isFollowing ? 'Following creator' : 'Follow creator'}
            >
              {isFollowing ? <Check className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
            </button>
          </div>

          {/* Like */}
          <button
            onClick={() => toggleLikeClip(currentClip.id)}
            className="flex flex-col items-center gap-1 group"
            aria-label={currentClip.isLiked ? 'Unlike clip' : 'Like clip'}
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-transform group-active:scale-125 ${
              currentClip.isLiked ? 'bg-rose-500/80 text-white' : 'bg-black/40 text-white hover:bg-black/60'
            }`}>
              <Heart className={`w-6 h-6 ${currentClip.isLiked ? 'fill-white' : ''}`} />
            </div>
            <span className="text-[11px] font-bold drop-shadow tabular-nums">
              {currentClip.likesCount.toLocaleString()}
            </span>
          </button>

          {/* Comments */}
          <button
            onClick={() => setShowComments(true)}
            className="flex flex-col items-center gap-1 group"
            aria-label="View comments"
          >
            <div className="w-11 h-11 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold drop-shadow tabular-nums">
              {(currentClip.commentsCount + currentComments.length).toLocaleString()}
            </span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => toggleBookmarkClip(currentClip.id)}
            className="flex flex-col items-center gap-1 group"
            aria-label="Save clip"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
              currentClip.isBookmarked ? 'bg-blue-600 text-white' : 'bg-black/40 text-white hover:bg-black/60'
            }`}>
              <Bookmark className={`w-5 h-5 ${currentClip.isBookmarked ? 'fill-white' : ''}`} />
            </div>
          </button>

          {/* Share */}
          <button
            onClick={() => openShareModal({
              url: window.location.href,
              title: `Clip by ${currentClip.user.name}`,
              content: currentClip.caption,
            })}
            className="flex flex-col items-center gap-1 group"
            aria-label="Share clip"
          >
            <div className="w-11 h-11 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md hover:bg-black/60 transition-colors">
              <Share2 className="w-5 h-5" />
            </div>
          </button>

          {/* Spinning Sound Vinyl */}
          <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-white/80 flex items-center justify-center animate-[spin_6s_linear_infinite] mt-2 shadow-lg">
            <Music className="w-4 h-4 text-blue-400" />
          </div>
        </div>

        {/* Bottom Caption & Sound Info */}
        <div className="relative z-20 p-4 space-y-2 max-w-[80%]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => openUserProfile(currentClip.userId)}
              className="text-sm font-bold text-white hover:text-blue-300 transition-colors drop-shadow"
            >
              @{currentClip.user.handle}
            </button>
            {currentClip.user.verified && (
              <Sparkles className="w-3.5 h-3.5 text-blue-400 fill-blue-400 shrink-0" />
            )}
          </div>

          <p className="text-xs sm:text-sm text-white/95 leading-snug drop-shadow line-clamp-3">
            {currentClip.caption}
          </p>

          <div className="flex items-center gap-2 text-white/80 text-xs pt-1">
            <Music className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate drop-shadow">{currentClip.soundTitle}</span>
          </div>
        </div>

        {/* Desktop Vertical Up/Down Navigation Floating Arrows */}
        <div className="hidden lg:flex flex-col gap-2 absolute -right-16 top-1/2 -translate-y-1/2">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 shadow-md flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 transition-all"
            aria-label="Previous clip"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={activeIndex === clips.length - 1}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 shadow-md flex items-center justify-center hover:bg-slate-50 disabled:opacity-30 transition-all"
            aria-label="Next clip"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slide-Up Comments Drawer */}
      {showComments && (
        <div className="absolute inset-0 z-30 bg-black/50 backdrop-blur-sm rounded-2xl md:rounded-3xl flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-4 max-h-[65%] flex flex-col animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="text-sm font-bold text-slate-900">
                Comments ({currentComments.length + currentClip.commentsCount})
              </h4>
              <button
                onClick={() => setShowComments(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                aria-label="Close comments"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {currentComments.map((c) => (
                <div key={c.id} className="text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <span>@{c.user}</span>
                    <span className="text-[10px] text-slate-400 font-normal">· {c.time}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleAddComment} className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="w-8 h-8 rounded-xl bg-blue-600 disabled:bg-slate-200 text-white flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
