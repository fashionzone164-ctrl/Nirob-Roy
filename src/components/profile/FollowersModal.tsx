import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { X, Search, UserPlus, Check, Sparkles } from 'lucide-react';

export const FollowersModal: React.FC = () => {
  const { 
    isFollowersModalOpen, 
    closeFollowersModal, 
    followersModalType, 
    followersModalUser, 
    users, 
    followedUserIds, 
    toggleFollow, 
    openUserProfile 
  } = useSocial();

  const [search, setSearch] = useState('');

  if (!isFollowersModalOpen || !followersModalUser) return null;

  // Filter users
  const listUsers = users.filter((u) => u.id !== followersModalUser.id);
  const filtered = listUsers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.handle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 capitalize">
            {followersModalType} ({listUsers.length})
          </h3>
          <button
            onClick={closeFollowersModal}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people..."
              className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.map((user) => {
            const isFollowing = followedUserIds.includes(user.id);

            return (
              <div key={user.id} className="flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    closeFollowersModal();
                    openUserProfile(user.id);
                  }}
                  className="flex items-center gap-2.5 min-w-0 text-left flex-1 group"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-blue-400"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                        {user.name}
                      </span>
                      {user.verified && (
                        <Sparkles className="w-3 h-3 text-blue-600 fill-blue-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 truncate block">@{user.handle}</span>
                  </div>
                </button>

                <button
                  onClick={() => toggleFollow(user.id)}
                  className={`min-h-[34px] px-3.5 rounded-xl text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 ${
                    isFollowing
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
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
    </div>
  );
};
