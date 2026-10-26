import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { PostCard } from '../feed/PostCard';
import { 
  Sparkles, 
  MapPin, 
  Link as LinkIcon, 
  Calendar, 
  Edit3, 
  UserPlus, 
  Check, 
  MessageSquare, 
  Grid, 
  Bookmark, 
  Heart, 
  Clapperboard, 
  UserX, 
  ShieldAlert, 
  ArrowLeft,
  Settings,
  TrendingUp,
  Folder,
  Lock,
  Pin,
  ShieldCheck
} from 'lucide-react';
import { InsightsModal } from '../creator/InsightsModal';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    viewingUserId, 
    users, 
    posts, 
    clips, 
    savedCollections,
    followedUserIds, 
    toggleFollow, 
    setIsEditProfileOpen, 
    setIsSettingsModalOpen,
    setIsCreateClipOpen,
    startOrOpenConversation, 
    blockUser, 
    unblockUser, 
    blockedUserIds, 
    openFollowersModal,
    backFromUserProfile,
    setIsAdminPortalMode
  } = useSocial();

  const [activeTab, setActiveTab] = useState<'posts' | 'clips' | 'saved' | 'collections' | 'liked'>('posts');
  const [showBlockedManager, setShowBlockedManager] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  // Identify who we are viewing
  const isMe = !viewingUserId || viewingUserId === currentUser.id;
  const targetUser = isMe 
    ? currentUser 
    : users.find((u) => u.id === viewingUserId) || currentUser;

  const isFollowing = followedUserIds.includes(targetUser.id);

  // Content for tabs (sort pinned posts first)
  const userPosts = posts
    .filter((p) => p.userId === targetUser.id)
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  const userClips = clips.filter((c) => c.userId === targetUser.id);
  const savedPosts = posts.filter((p) => p.isBookmarked);
  const likedPosts = posts.filter((p) => p.isLiked);

  return (
    <div className="w-full max-w-2xl mx-auto pb-24 md:pb-8 space-y-4">
      {/* Back button if viewing another user */}
      {!isMe && (
        <button
          onClick={backFromUserProfile}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 px-1 py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Banner with clean modern gradient */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Profile Details Container */}
        <div className="px-5 pb-5">
          {/* Avatar and Action Button Row */}
          <div className="flex items-end justify-between -mt-12 sm:-mt-14 mb-4">
            <div className="relative">
              <img
                src={targetUser.avatar}
                alt={targetUser.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white shadow-md bg-white"
              />
              {targetUser.verified && (
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center ring-2 ring-white">
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                </div>
              )}
            </div>

            {/* Actions: Edit Profile, Insights, Settings */}
            <div className="flex items-center gap-1.5 sm:gap-2 pt-2">
              {isMe ? (
                <>
                  <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Edit3 className="w-4 h-4 text-slate-500" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setShowInsights(true)}
                    className="min-h-[38px] px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Creator Insights"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span className="hidden sm:inline">Insights</span>
                  </button>

                  <button
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="min-h-[38px] p-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                    title="Settings & Privacy"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => setIsAdminPortalMode(true)}
                      className="min-h-[38px] px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                      title="Open Qevora Admin Web Control Center"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span className="hidden sm:inline">Admin Web App</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => toggleFollow(targetUser.id)}
                    className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                      isFollowing
                        ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => startOrOpenConversation(targetUser)}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message</span>
                  </button>

                  <button
                    onClick={() => blockUser(targetUser.id, targetUser.handle)}
                    className="min-h-[38px] px-2.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
                    title={`Block @${targetUser.handle}`}
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User Bio and Meta */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                  {targetUser.name}
                </h2>
                {targetUser.isPrivate && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    <Lock className="w-3 h-3" /> Private
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">@{targetUser.handle}</p>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed max-w-xl">
              {targetUser.bio}
            </p>

            {/* Location, link, join date */}
            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-500 font-medium pt-1">
              {targetUser.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{targetUser.location}</span>
                </div>
              )}
              {targetUser.website && (
                <a
                  href={targetUser.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>{targetUser.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{targetUser.joinedDate}</span>
              </div>
            </div>

            {/* Interactive Stats Bar (Clickable followers & following modal) */}
            <div className="flex items-center gap-6 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-extrabold text-slate-900 text-sm tabular-nums">
                  {userPosts.length}
                </span>
                <span className="text-slate-500">Posts</span>
              </div>

              <button
                onClick={() => openFollowersModal(targetUser, 'followers')}
                className="flex items-center gap-1.5 text-xs hover:text-blue-600 transition-colors cursor-pointer"
              >
                <span className="font-extrabold text-slate-900 text-sm tabular-nums">
                  {targetUser.followersCount.toLocaleString()}
                </span>
                <span className="text-slate-500">Followers</span>
              </button>

              <button
                onClick={() => openFollowersModal(targetUser, 'following')}
                className="flex items-center gap-1.5 text-xs hover:text-blue-600 transition-colors cursor-pointer"
              >
                <span className="font-extrabold text-slate-900 text-sm tabular-nums">
                  {targetUser.followingCount.toLocaleString()}
                </span>
                <span className="text-slate-500">Following</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content Navigation Tabs */}
        <div className="flex items-center border-t border-slate-200 bg-slate-50/50 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 min-w-[70px] py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'posts'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Posts</span>
          </button>

          <button
            onClick={() => setActiveTab('clips')}
            className={`flex-1 min-w-[70px] py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'clips'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clapperboard className="w-4 h-4" />
            <span>Clips</span>
          </button>

          {isMe && (
            <>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 min-w-[70px] py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'saved'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Saved</span>
              </button>

              <button
                onClick={() => setActiveTab('collections')}
                className={`flex-1 min-w-[80px] py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'collections'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Folder className="w-4 h-4" />
                <span>Collections</span>
              </button>

              <button
                onClick={() => setActiveTab('liked')}
                className={`flex-1 min-w-[70px] py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'liked'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Liked</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tab Content Display */}
      <div className="space-y-4">
        {activeTab === 'posts' && (
          userPosts.length > 0 ? (
            userPosts.map((p) => <PostCard key={p.id} post={p} />)
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
              <p className="text-sm font-semibold text-slate-700">No posts shared yet</p>
            </div>
          )
        )}

        {activeTab === 'clips' && (
          <div className="space-y-3">
            {isMe && (
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                <div>
                  <p className="text-xs font-bold text-slate-800">My Qevora Reels</p>
                  <p className="text-[11px] text-slate-500">Share vertical videos up to 60s</p>
                </div>
                <button
                  onClick={() => setIsCreateClipOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Clapperboard className="w-3.5 h-3.5" />
                  <span>+ Upload Reel</span>
                </button>
              </div>
            )}

            {userClips.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {userClips.map((c) => (
                  <div key={c.id} className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-slate-900 shadow-sm group">
                    {c.videoUrl.startsWith('blob:') || c.videoUrl.startsWith('data:video') || /\.(mp4|webm|mov)($|\?)/i.test(c.videoUrl) ? (
                      <video
                        src={c.videoUrl}
                        playsInline
                        muted
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <img
                        src={c.videoUrl}
                        alt={c.caption}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                      <p className="font-semibold line-clamp-1">{c.caption}</p>
                      <p className="text-[10px] text-white/70 mt-1 tabular-nums">❤️ {c.likesCount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
                <Clapperboard className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">No clips published yet</p>
                <p className="text-xs text-slate-400 mt-1 mb-4">Post vertical clips with sounds and captions.</p>
                {isMe && (
                  <button
                    onClick={() => setIsCreateClipOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Upload Your First Reel
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          savedPosts.length > 0 ? (
            savedPosts.map((p) => <PostCard key={p.id} post={p} />)
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
              <Bookmark className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No saved posts</p>
              <p className="text-xs text-slate-400 mt-1">Bookmark posts in the feed to read them anytime.</p>
            </div>
          )
        )}

        {activeTab === 'collections' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedCollections.map((col) => (
              <div
                key={col.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:border-blue-300 transition-all cursor-pointer flex items-center gap-3.5"
              >
                <img
                  src={col.coverUrl || '/src/assets/images/post_minimal_interior_1792946123767.jpg'}
                  alt={col.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{col.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{col.postIds.length} saved items</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'liked' && (
          likedPosts.length > 0 ? (
            likedPosts.map((p) => <PostCard key={p.id} post={p} />)
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
              <Heart className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">No liked posts yet</p>
            </div>
          )
        )}
      </div>

      {/* Creator Insights Modal */}
      <InsightsModal isOpen={showInsights} onClose={() => setShowInsights(false)} />
    </div>
  );
};
