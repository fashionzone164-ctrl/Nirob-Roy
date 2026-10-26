import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { StoriesBar } from './StoriesBar';
import { CreatePostBox } from './CreatePostBox';
import { PostCard } from './PostCard';
import { Users, Compass, RefreshCw, Bookmark, ArrowDown } from 'lucide-react';

export const HomeFeed: React.FC = () => {
  const { posts, followedUserIds, currentUser, setActiveScreen } = useSocial();
  const [feedTab, setFeedTab] = useState<'for_you' | 'following' | 'saved'>('for_you');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter posts based on selected tab
  let filteredPosts = posts;
  if (feedTab === 'following') {
    filteredPosts = posts.filter((p) => followedUserIds.includes(p.userId) || p.userId === currentUser.id);
  } else if (feedTab === 'saved') {
    filteredPosts = posts.filter((p) => p.isBookmarked);
  }

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setIsLoadingMore(false);
    }, 400);
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-24 md:pb-8">
      {/* Feed Filter Segmented Control */}
      <div className="flex items-center justify-between mb-4 bg-slate-100 p-1 rounded-xl">
        <div className="flex items-center gap-1 flex-1">
          <button
            onClick={() => {
              setFeedTab('for_you');
              setVisibleCount(4);
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              feedTab === 'for_you'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            For You
          </button>
          <button
            onClick={() => {
              setFeedTab('following');
              setVisibleCount(4);
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              feedTab === 'following'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Following ({followedUserIds.length})
          </button>
          <button
            onClick={() => {
              setFeedTab('saved');
              setVisibleCount(4);
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              feedTab === 'saved'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Saved
          </button>
        </div>

        <button
          onClick={handleRefresh}
          className="p-2 ml-1 text-slate-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-200/60"
          aria-label="Refresh feed"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

      {/* Stories Bar (Only shown on For You and Following) */}
      {feedTab !== 'saved' && <StoriesBar />}

      {/* Create Post Prompt */}
      {feedTab !== 'saved' && <CreatePostBox />}

      {/* Posts Stream */}
      {isRefreshing ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-28 bg-slate-200 rounded" />
                  <div className="h-2 w-16 bg-slate-200 rounded" />
                </div>
              </div>
              <div className="h-4 w-5/6 bg-slate-200 rounded" />
              <div className="h-48 w-full bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="space-y-1">
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {/* Chronological Pagination Load More */}
          {hasMore && (
            <div className="pt-4 pb-2 text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-6 py-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-slate-50 active:scale-[0.99] text-xs sm:text-sm font-bold text-slate-700 shadow-sm transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-blue-600" />
                )}
                <span>Load More Posts ({filteredPosts.length - visibleCount} remaining)</span>
              </button>
            </div>
          )}

          {!hasMore && filteredPosts.length > 4 && (
            <div className="text-center py-6 text-xs text-slate-400 font-medium">
              You are all caught up on recent posts · Qevora Chronological Feed
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center my-6 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            {feedTab === 'following' ? (
              <Users className="w-6 h-6" />
            ) : feedTab === 'saved' ? (
              <Bookmark className="w-6 h-6" />
            ) : (
              <Compass className="w-6 h-6" />
            )}
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {feedTab === 'following'
              ? 'No posts from people you follow yet'
              : feedTab === 'saved'
              ? 'No bookmarked posts yet'
              : 'Your feed is quiet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            {feedTab === 'following'
              ? 'Explore suggested creators to follow and fill your feed with creative posts.'
              : feedTab === 'saved'
              ? 'Tap the bookmark icon on any post across Qevora to save it for quick viewing here.'
              : 'Share a moment or check back later for new updates.'}
          </p>
          {feedTab === 'following' && (
            <button
              onClick={() => setActiveScreen('search')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              Explore Creators
            </button>
          )}
        </div>
      )}
    </div>
  );
};
