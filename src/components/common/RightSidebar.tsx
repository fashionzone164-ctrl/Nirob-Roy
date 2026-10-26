import React from 'react';
import { useSocial } from '../../context/SocialContext';
import { TRENDING_TOPICS } from '../../data/mockData';
import { Sparkles, TrendingUp, UserPlus, Check } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const { 
    users, 
    currentUser, 
    followedUserIds, 
    toggleFollow, 
    openUserProfile,
    setSearchQuery,
    setActiveScreen
  } = useSocial();

  const suggestedUsers = users.filter((u) => u.id !== currentUser.id).slice(0, 4);

  const handleTopicClick = (tag: string) => {
    setSearchQuery(tag);
    setActiveScreen('search');
  };

  return (
    <aside className="hidden lg:block w-80 h-[calc(100vh-5rem)] sticky top-20 py-4 px-3 space-y-6 select-none border-l border-slate-200">
      {/* Trending Section */}
      <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80">
        <div className="flex items-center gap-2 mb-3 text-slate-900">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold tracking-tight">Trending on Qevora</h3>
        </div>
        <div className="space-y-3">
          {TRENDING_TOPICS.map((topic) => (
            <button
              key={topic.tag}
              onClick={() => handleTopicClick(topic.tag)}
              className="w-full text-left group flex items-start justify-between py-1 hover:opacity-90"
            >
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {topic.category}
                </p>
                <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {topic.tag}
                </p>
              </div>
              <span className="text-xs text-slate-400 font-medium tabular-nums mt-1">
                {topic.postsCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Users Section */}
      <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80">
        <div className="flex items-center gap-2 mb-3 text-slate-900">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold tracking-tight">Suggested for You</h3>
        </div>
        <div className="space-y-3.5">
          {suggestedUsers.map((user) => {
            const isFollowing = followedUserIds.includes(user.id);

            return (
              <div key={user.id} className="flex items-center justify-between gap-3">
                <button
                  onClick={() => openUserProfile(user.id)}
                  className="flex items-center gap-2.5 min-w-0 text-left group flex-1"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200 group-hover:ring-blue-400 transition-all"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">@{user.handle}</p>
                  </div>
                </button>

                <button
                  onClick={() => toggleFollow(user.id)}
                  className={`min-h-[32px] px-3 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
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

      {/* Footer metadata info */}
      <div className="px-2 text-xs text-slate-600 space-y-1">
        <p className="leading-relaxed font-semibold">Qevora Web Experience</p>
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-600">
          <span>Privacy</span>
          <span>·</span>
          <span>Terms</span>
          <span>·</span>
          <span>Community Guidelines</span>
          <span>·</span>
          <span>© 2026 Qevora</span>
        </div>
      </div>
    </aside>
  );
};
