import React, { useEffect, useState, useRef } from 'react';
import { useSocial } from '../../context/SocialContext';
import { X, ChevronLeft, ChevronRight, Send, Heart, Pause, Play } from 'lucide-react';

export const StoryViewerModal: React.FC = () => {
  const { 
    isStoryViewerOpen, 
    stories, 
    activeStoryIndex, 
    closeStoryViewer, 
    nextStory, 
    prevStory,
    sendMessage,
    startOrOpenConversation,
    addToast,
    currentUser,
    setIsStoryViewersOpen
  } = useSocial();

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const currentStory = stories[activeStoryIndex];

  // Auto-progress timer
  useEffect(() => {
    if (!isStoryViewerOpen || isPaused || !currentStory) return;

    setProgress(0);
    const duration = (currentStory.duration || 5) * 1000;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          nextStory();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isStoryViewerOpen, activeStoryIndex, isPaused, nextStory, currentStory]);

  if (!isStoryViewerOpen || !currentStory) return null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    // Send message to the story author
    startOrOpenConversation(currentStory.user);
    // Find newly opened or existing conv
    addToast(`Replied to @${currentStory.user.handle}'s story`, 'success');
    setReplyText('');
    closeStoryViewer();
  };

  const handleLikeStory = () => {
    setIsLiked(!isLiked);
    addToast(isLiked ? 'Removed reaction' : 'Sent ❤️ to story', 'info');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 select-none"
      role="dialog"
      aria-modal="true"
    >
      {/* Desktop side navigation buttons */}
      <button
        onClick={prevStory}
        disabled={activeStoryIndex === 0}
        className="hidden md:flex absolute left-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white items-center justify-center disabled:opacity-20 transition-all z-10"
        aria-label="Previous story"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextStory}
        className="hidden md:flex absolute right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white items-center justify-center transition-all z-10"
        aria-label="Next story"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Story Container */}
      <div className="relative w-full h-full sm:h-[86vh] sm:max-w-md sm:rounded-3xl overflow-hidden bg-slate-900 flex flex-col justify-between shadow-2xl">
        {/* Story Background Media */}
        <img
          src={currentStory.mediaUrl}
          alt={currentStory.caption || 'Story photo'}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient Scrims */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />

        {/* Top Controls Bar */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Progress Segments */}
          <div className="flex items-center gap-1.5 w-full">
            {stories.map((story, idx) => (
              <div key={story.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-75 ease-linear rounded-full"
                  style={{
                    width:
                      idx < activeStoryIndex
                        ? '100%'
                        : idx === activeStoryIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* User Info & Close Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStory.user.avatar}
                alt={currentStory.user.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/80"
              />
              <div className="text-white">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold leading-tight">{currentStory.user.name}</p>
                  {currentStory.privacy === 'close_friends' && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-500/90 text-white rounded-full">
                      Close Friends
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/80">
                  <span>{currentStory.createdAt}</span>
                  <span>·</span>
                  <span className="text-blue-300 font-semibold">{currentStory.expiresIn || '24h left'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* If owner, show Viewers button */}
              {currentStory.userId === currentUser.id && (
                <button
                  onClick={() => setIsStoryViewersOpen(true)}
                  className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1 hover:bg-white/30 transition-colors"
                >
                  <span>👁️ {currentStory.viewers?.length || 0}</span>
                </button>
              )}

              <button
                onClick={() => setIsPaused(!isPaused)}
                className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                aria-label={isPaused ? 'Resume story' : 'Pause story'}
              >
                {isPaused ? <Play className="w-4 h-4 ml-0.5" /> : <Pause className="w-4 h-4" />}
              </button>

              <button
                onClick={closeStoryViewer}
                className="w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
                aria-label="Close story viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tap areas for mobile prev/next */}
        <div className="absolute inset-y-20 inset-x-0 flex z-10">
          <div 
            className="w-1/3 h-full cursor-pointer" 
            onClick={prevStory} 
            title="Tap left for previous"
          />
          <div 
            className="w-2/3 h-full cursor-pointer" 
            onClick={nextStory} 
            title="Tap right for next"
          />
        </div>

        {/* Bottom Caption & Interactive Reply Bar */}
        <div className="relative z-20 p-4 space-y-3">
          {currentStory.caption && (
            <p className="text-white text-sm font-medium drop-shadow-md px-1">
              {currentStory.caption}
            </p>
          )}

          <div className="flex items-center gap-2">
            <form onSubmit={handleSendReply} className="flex-1 relative">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${currentStory.user.name}...`}
                className="w-full bg-white/20 backdrop-blur-md text-white placeholder-white/70 border border-white/30 rounded-full py-2.5 pl-4 pr-10 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white disabled:opacity-40 p-1"
                aria-label="Send story reply"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={handleLikeStory}
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-125 ${
                isLiked ? 'bg-rose-500/80 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              aria-label="React with heart"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
