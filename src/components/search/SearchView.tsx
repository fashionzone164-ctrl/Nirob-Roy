import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { PostCard } from '../feed/PostCard';
import { TRENDING_TOPICS } from '../../data/mockData';
import { Search, Sparkles, TrendingUp, UserPlus, Check, X } from 'lucide-react';

export const SearchView: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    posts, 
    users, 
    currentUser, 
    followedUserIds, 
    toggleFollow, 
    openUserProfile 
  } = useSocial();

  const [filterType, setFilterType] = useState<'all' | 'posts' | 'people' | 'tags'>('all');

  const query = searchQuery.trim().toLowerCase();

  // Matched Posts
  const matchingPosts = posts.filter((post) => {
    if (!query) return true;
    const matchContent = post.content.toLowerCase().includes(query);
    const matchAuthor = post.user.name.toLowerCase().includes(query) || post.user.handle.toLowerCase().includes(query);
    const matchTag = post.tags?.some((t) => t.toLowerCase().includes(query.replace('#', '')));
    return matchContent || matchAuthor || matchTag;
  });

  // Matched Users
  const matchingUsers = users.filter((u) => {
    if (u.id === currentUser.id) return false;
    if (!query) return true;
    return (
      u.name.toLowerCase().includes(query) ||
      u.handle.toLowerCase().includes(query) ||
      u.bio.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full max-w-2xl mx-auto pb-24 md:pb-8 space-y-4">
      {/* Search Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Qevora by keywords, @users, or #hashtags..."
            className="w-full bg-slate-100 border border-transparent rounded-xl py-2.5 pl-11 pr-10 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {(['all', 'posts', 'people', 'tags'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* When no query typed: Trending Discovery */}
      {!query && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-slate-900">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold">Trending Topics</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {TRENDING_TOPICS.map((topic) => (
              <button
                key={topic.tag}
                onClick={() => setSearchQuery(topic.tag)}
                className="text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-100 transition-colors group flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {topic.category}
                  </span>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {topic.tag}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium tabular-nums">
                  {topic.postsCount}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* People Results */}
      {(filterType === 'all' || filterType === 'people') && matchingUsers.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            People ({matchingUsers.length})
          </h3>
          <div className="space-y-3">
            {matchingUsers.map((user) => {
              const isFollowing = followedUserIds.includes(user.id);

              return (
                <div key={user.id} className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => openUserProfile(user.id)}
                    className="flex items-center gap-3 text-left min-w-0 flex-1 group"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {user.name}
                        </span>
                        {user.verified && (
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 fill-blue-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">@{user.handle}</p>
                      <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{user.bio}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => toggleFollow(user.id)}
                    className={`min-h-[36px] px-3.5 rounded-xl text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 ${
                      isFollowing
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Posts Results */}
      {(filterType === 'all' || filterType === 'posts') && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Posts ({matchingPosts.length})
          </h3>
          {matchingPosts.length > 0 ? (
            matchingPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-800">No matching posts found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for other keywords or explore trending hashtags.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
