import React, { createContext, useContext, useState } from 'react';
import { 
  User, 
  Post, 
  Comment, 
  CommentReply,
  Story, 
  Clip, 
  Conversation, 
  Message, 
  NotificationItem, 
  ActiveScreen, 
  ToastMessage,
  LiveStream,
  LiveChatMessage,
  ReportTicket,
  SavedCollection,
  DraftPost,
  SystemNotice,
  PlatformSettings,
  AuditLogEntry
} from '../types';
import { 
  CURRENT_USER, 
  MOCK_USERS, 
  INITIAL_POSTS, 
  INITIAL_STORIES, 
  INITIAL_CLIPS, 
  INITIAL_CONVERSATIONS, 
  INITIAL_MESSAGES, 
  INITIAL_NOTIFICATIONS,
  INITIAL_LIVE_STREAMS,
  INITIAL_REPORTS,
  INITIAL_SAVED_COLLECTIONS,
  INITIAL_DRAFTS
} from '../data/mockData';

interface ReportData {
  type: 'post' | 'user' | 'comment' | 'clip' | 'live';
  id: string;
  title: string;
}

interface ShareData {
  url: string;
  title: string;
  content?: string;
}

interface SocialContextType {
  currentUser: User;
  users: User[];
  updateCurrentUser: (updates: Partial<User>) => void;
  deleteAccount: () => void;
  exportUserData: () => void;
  
  posts: Post[];
  addPost: (
    content: string, 
    mediaUrls?: string[], 
    tags?: string[], 
    privacy?: 'public' | 'followers' | 'only_me',
    location?: string
  ) => void;
  editPost: (postId: string, newContent: string, newTags?: string[]) => void;
  deletePost: (postId: string) => void;
  togglePinPost: (postId: string) => void;
  toggleLikePost: (postId: string) => void;
  toggleBookmarkPost: (postId: string) => void;
  
  // Comments and Threaded Replies
  addComment: (postId: string, text: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  toggleLikeComment: (postId: string, commentId: string) => void;
  addCommentReply: (postId: string, commentId: string, text: string) => void;
  deleteCommentReply: (postId: string, commentId: string, replyId: string) => void;
  toggleLikeCommentReply: (postId: string, commentId: string, replyId: string) => void;
  
  // Stories
  stories: Story[];
  addStory: (mediaUrl: string, caption?: string, privacy?: 'public' | 'close_friends' | 'followers') => void;
  activeStoryIndex: number;
  isStoryViewerOpen: boolean;
  openStoryViewer: (index: number) => void;
  closeStoryViewer: () => void;
  nextStory: () => void;
  prevStory: () => void;
  isStoryViewersOpen: boolean;
  setIsStoryViewersOpen: (open: boolean) => void;

  // Clips
  clips: Clip[];
  addClip: (videoUrl: string, caption: string, soundTitle: string, tags?: string[]) => void;
  toggleLikeClip: (clipId: string) => void;
  toggleBookmarkClip: (clipId: string) => void;

  // Live Streaming (Demo mode)
  liveStreams: LiveStream[];
  activeLiveStreamId: string | null;
  joinLiveStream: (id: string) => void;
  leaveLiveStream: () => void;
  sendLiveChatMessage: (liveId: string, text: string) => void;
  startLiveStream: (title: string, category: string) => void;
  endLiveStream: (liveId: string) => void;

  // Chat
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, text: string, imageUrl?: string, audioDuration?: string) => void;
  addReaction: (conversationId: string, messageId: string, emoji: string) => void;
  startOrOpenConversation: (user: User) => void;
  createGroupChat: (name: string, members: User[]) => void;
  acceptMessageRequest: (conversationId: string) => void;
  declineMessageRequest: (conversationId: string) => void;
  toggleMuteConversation: (conversationId: string) => void;
  unreadMessagesCount: number;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markAllNotificationsAsRead: () => void;
  markNotificationRead: (id: string) => void;

  // Follow
  followedUserIds: string[];
  toggleFollow: (userId: string) => void;
  isFollowing: (userId: string) => boolean;

  // Followers / Following Modal
  isFollowersModalOpen: boolean;
  followersModalType: 'followers' | 'following';
  followersModalUser: User | null;
  openFollowersModal: (user: User, type: 'followers' | 'following') => void;
  closeFollowersModal: () => void;

  // Block & Safety
  blockedUserIds: string[];
  blockUser: (userId: string, userName: string) => void;
  unblockUser: (userId: string) => void;
  isBlocked: (userId: string) => boolean;

  // Reports & Moderation
  reports: ReportTicket[];
  submitReport: (reason: string, details?: string) => void;
  resolveReport: (reportId: string, actionNote?: string) => void;
  dismissReport: (reportId: string) => void;
  deleteHarmfulPost: (postId: string) => void;

  // Saved Collections & Drafts
  savedCollections: SavedCollection[];
  createCollection: (name: string) => void;
  addToCollection: (collectionId: string, postId: string) => void;
  drafts: DraftPost[];
  saveDraft: (content: string, mediaUrls: string[], tags: string[], location?: string) => void;
  deleteDraft: (draftId: string) => void;

  // Navigation & User profiles
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  viewingUserId: string | null;
  openUserProfile: (userId: string) => void;
  backFromUserProfile: () => void;

  // Modals
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (open: boolean) => void;
  isCreateClipOpen: boolean;
  setIsCreateClipOpen: (open: boolean) => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  reportData: ReportData | null;
  openReportModal: (data: ReportData) => void;
  closeReportModal: () => void;
  isShareModalOpen: boolean;
  shareData: ShareData | null;
  openShareModal: (data: ShareData) => void;
  closeShareModal: () => void;

  // Auth & Splash
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup' | 'forgot_password';
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot_password') => void;
  closeAuthModal: () => void;
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  logout: () => void;

  // Admin Web Portal & Master Control
  banUser: (userId: string, reason?: string) => void;
  unbanUser: (userId: string) => void;
  toggleUserVerification: (userId: string) => void;
  changeUserRole: (userId: string, role: 'user' | 'creator' | 'moderator' | 'admin') => void;
  createNewUser: (userData: Partial<User>) => void;
  deleteClip: (clipId: string) => void;
  killLiveStream: (streamId: string) => void;
  systemNotice: SystemNotice | null;
  setSystemNotice: (notice: SystemNotice | null) => void;
  adminSettings: PlatformSettings;
  updateAdminSettings: (updates: Partial<PlatformSettings>) => void;
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: string, target: string, severity?: 'low' | 'medium' | 'high' | 'critical', details?: string) => void;
  isAdminPortalMode: boolean;
  setIsAdminPortalMode: (val: boolean) => void;

  // Toasts & Search
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState<boolean>(false);
  const [isStoryViewersOpen, setIsStoryViewersOpen] = useState<boolean>(false);
  const [clips, setClips] = useState<Clip[]>(INITIAL_CLIPS);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>(INITIAL_LIVE_STREAMS);
  const [activeLiveStreamId, setActiveLiveStreamId] = useState<string | null>(null);

  // Platform Admin & Master Control States
  const [systemNotice, setSystemNotice] = useState<SystemNotice | null>({
    id: 'notice_1',
    active: true,
    message: 'Welcome to Qevora! Reel uploads, Live streams, and Central Admin Control Web App are online.',
    type: 'info',
    publishedAt: 'Active now',
    publishedBy: 'alexvance (admin)',
  });

  const [adminSettings, setAdminSettings] = useState<PlatformSettings>({
    allowSignups: true,
    allowReelUploads: true,
    allowLiveBroadcasts: true,
    maintenanceMode: false,
    maxUploadSizeMB: 50,
    strictAutoModeration: false,
    requireEmailVerification: true,
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log_boot_1',
      adminId: 'user_me',
      adminHandle: 'alexvance',
      action: 'PLATFORM_BOOT',
      target: 'Qevora Core Engine',
      details: 'Client-side prototype initialized with verified admin session.',
      timestamp: '1 hour ago',
      severity: 'low',
    },
    {
      id: 'log_rules_2',
      adminId: 'user_me',
      adminHandle: 'alexvance',
      action: 'SECURITY_RULES_AUDIT',
      target: 'firestore.rules',
      details: 'Zero-trust declarative access control active against unauthorized privilege tampering.',
      timestamp: '35m ago',
      severity: 'medium',
    },
    {
      id: 'log_init_3',
      adminId: 'user_me',
      adminHandle: 'alexvance',
      action: 'SYSTEM_BROADCAST',
      target: 'Global Banner',
      details: 'Dispatched launch notice to client apps.',
      timestamp: '10m ago',
      severity: 'low',
    },
  ]);

  const [isAdminPortalMode, setIsAdminPortalMode] = useState<boolean>(false);

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [followedUserIds, setFollowedUserIds] = useState<string[]>(['user_elena', 'user_marcus']);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [reports, setReports] = useState<ReportTicket[]>(INITIAL_REPORTS);
  const [savedCollections, setSavedCollections] = useState<SavedCollection[]>(INITIAL_SAVED_COLLECTIONS);
  const [drafts, setDrafts] = useState<DraftPost[]>(INITIAL_DRAFTS);

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);

  // Modals state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateClipOpen, setIsCreateClipOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<ShareData | null>(null);

  // Followers Modal
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [followersModalType, setFollowersModalType] = useState<'followers' | 'following'>('followers');
  const [followersModalUser, setFollowersModalUser] = useState<User | null>(null);

  // Auth & Splash
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [showSplash, setShowSplash] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Toast Helpers
  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Profile & Account Management
  const updateCurrentUser = (updates: Partial<User>) => {
    // Only roynirobn@gmail.com can hold admin role
    const effectiveEmail = (updates.email || currentUser.email || '').toLowerCase().trim();
    if (updates.role === 'admin' && effectiveEmail !== 'roynirobn@gmail.com') {
      updates.role = 'user';
    }
    setCurrentUser((prev) => ({ ...prev, ...updates }));
    addToast('Profile updated successfully', 'success');
  };

  const exportUserData = () => {
    const dataBlob = {
      profile: currentUser,
      posts: posts.filter((p) => p.userId === currentUser.id),
      collections: savedCollections,
      drafts,
      followedCount: followedUserIds.length,
      exportedAt: new Date().toISOString(),
      platform: 'Qevora Social Platform',
    };
    const jsonStr = JSON.stringify(dataBlob, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qevora_export_${currentUser.handle}_${Date.now()}.json`;
    link.click();
    addToast('Account archive downloaded', 'success');
  };

  const deleteAccount = () => {
    setPosts((prev) => prev.filter((p) => p.userId !== currentUser.id));
    addToast('Your account and personal data have been removed from Qevora.', 'info');
    openAuthModal('signup');
  };

  // Posts
  const addPost = (
    content: string, 
    mediaUrls: string[] = [], 
    tags: string[] = [], 
    privacy: 'public' | 'followers' | 'only_me' = 'public',
    location?: string
  ) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      content,
      mediaUrl: mediaUrls[0] || undefined,
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
      mediaType: mediaUrls.length > 0 ? 'image' : undefined,
      location,
      createdAt: 'Just now',
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      bookmarksCount: 0,
      isLiked: false,
      isBookmarked: false,
      comments: [],
      tags,
      privacy,
    };
    setPosts((prev) => [newPost, ...prev]);
    setCurrentUser((prev) => ({ ...prev, postsCount: prev.postsCount + 1 }));
    addToast('Post published to Qevora', 'success');
  };

  const editPost = (postId: string, newContent: string, newTags?: string[]) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            content: newContent,
            tags: newTags || p.tags,
            isEdited: true,
          };
        }
        return p;
      })
    );
    addToast('Post updated', 'success');
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    addToast('Post removed', 'info');
  };

  const togglePinPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const willPin = !p.isPinned;
          addToast(willPin ? 'Post pinned to your profile' : 'Post unpinned', 'info');
          return { ...p, isPinned: willPin };
        }
        return p;
      })
    );
  };

  const toggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const willLike = !post.isLiked;
          return {
            ...post,
            isLiked: willLike,
            likesCount: willLike ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      })
    );
  };

  const toggleBookmarkPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const willBookmark = !post.isBookmarked;
          if (willBookmark) {
            addToast('Saved to your bookmarks', 'info');
          } else {
            addToast('Removed from bookmarks', 'info');
          }
          return {
            ...post,
            isBookmarked: willBookmark,
            bookmarksCount: willBookmark ? post.bookmarksCount + 1 : Math.max(0, post.bookmarksCount - 1),
          };
        }
        return post;
      })
    );
  };

  // Comments & Threaded Replies
  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      userId: currentUser.id,
      user: currentUser,
      content: text.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
      replies: [],
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
    addToast('Comment added', 'success');
  };

  const deleteComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const commentToRemove = post.comments.find((c) => c.id === commentId);
          const replyCount = commentToRemove?.replies?.length || 0;
          return {
            ...post,
            commentsCount: Math.max(0, post.commentsCount - (1 + replyCount)),
            comments: post.comments.filter((c) => c.id !== commentId),
          };
        }
        return post;
      })
    );
    addToast('Comment deleted', 'info');
  };

  const toggleLikeComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((c) => {
              if (c.id === commentId) {
                const willLike = !c.isLiked;
                return {
                  ...c,
                  isLiked: willLike,
                  likesCount: willLike ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
                };
              }
              return c;
            }),
          };
        }
        return post;
      })
    );
  };

  const addCommentReply = (postId: string, commentId: string, text: string) => {
    if (!text.trim()) return;
    const newReply: CommentReply = {
      id: `reply_${Date.now()}`,
      commentId,
      userId: currentUser.id,
      user: currentUser,
      content: text.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: post.comments.map((c) => {
              if (c.id === commentId) {
                return {
                  ...c,
                  replies: [...(c.replies || []), newReply],
                };
              }
              return c;
            }),
          };
        }
        return post;
      })
    );
    addToast('Reply sent', 'success');
  };

  const deleteCommentReply = (postId: string, commentId: string, replyId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: Math.max(0, post.commentsCount - 1),
            comments: post.comments.map((c) => {
              if (c.id === commentId) {
                return {
                  ...c,
                  replies: (c.replies || []).filter((r) => r.id !== replyId),
                };
              }
              return c;
            }),
          };
        }
        return post;
      })
    );
    addToast('Reply deleted', 'info');
  };

  const toggleLikeCommentReply = (postId: string, commentId: string, replyId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((c) => {
              if (c.id === commentId) {
                return {
                  ...c,
                  replies: (c.replies || []).map((r) => {
                    if (r.id === replyId) {
                      const willLike = !r.isLiked;
                      return {
                        ...r,
                        isLiked: willLike,
                        likesCount: willLike ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
                      };
                    }
                    return r;
                  }),
                };
              }
              return c;
            }),
          };
        }
        return post;
      })
    );
  };

  // Stories
  const addStory = (
    mediaUrl: string, 
    caption?: string, 
    privacy: 'public' | 'close_friends' | 'followers' = 'public'
  ) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      mediaUrl,
      caption,
      createdAt: 'Just now',
      expiresIn: '24h left',
      isViewed: false,
      duration: 5,
      privacy,
      viewers: [],
    };
    setStories((prev) => [newStory, ...prev]);
    addToast('Story uploaded (active for 24h)', 'success');
  };

  const openStoryViewer = (index: number) => {
    setActiveStoryIndex(index);
    setIsStoryViewerOpen(true);
    if (stories[index]) {
      setStories((prev) =>
        prev.map((s, idx) => {
          if (idx === index) {
            const alreadyInViewers = s.viewers?.some((v) => v.id === currentUser.id);
            const updatedViewers = alreadyInViewers ? s.viewers : [...(s.viewers || []), currentUser];
            return { ...s, isViewed: true, viewers: updatedViewers };
          }
          return s;
        })
      );
    }
  };

  const closeStoryViewer = () => {
    setIsStoryViewerOpen(false);
    setIsStoryViewersOpen(false);
  };

  const nextStory = () => {
    if (activeStoryIndex < stories.length - 1) {
      const nextIdx = activeStoryIndex + 1;
      setActiveStoryIndex(nextIdx);
      setStories((prev) =>
        prev.map((s, idx) => (idx === nextIdx ? { ...s, isViewed: true } : s))
      );
    } else {
      closeStoryViewer();
    }
  };

  const prevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  // Clips
  const addClip = (videoUrl: string, caption: string, soundTitle: string, tags: string[] = []) => {
    const newClip: Clip = {
      id: `clip_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      videoUrl,
      caption,
      soundTitle: soundTitle || 'Original Audio - Qevora',
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isBookmarked: false,
      tags,
    };
    setClips((prev) => [newClip, ...prev]);
    addToast('Clip published to Qevora Reels feed', 'success');
  };

  const toggleLikeClip = (clipId: string) => {
    setClips((prev) =>
      prev.map((clip) => {
        if (clip.id === clipId) {
          const willLike = !clip.isLiked;
          return {
            ...clip,
            isLiked: willLike,
            likesCount: willLike ? clip.likesCount + 1 : Math.max(0, clip.likesCount - 1),
          };
        }
        return clip;
      })
    );
  };

  const toggleBookmarkClip = (clipId: string) => {
    setClips((prev) =>
      prev.map((clip) => {
        if (clip.id === clipId) {
          const willBookmark = !clip.isBookmarked;
          addToast(willBookmark ? 'Clip saved to collection' : 'Clip removed from collection', 'info');
          return {
            ...clip,
            isBookmarked: willBookmark,
          };
        }
        return clip;
      })
    );
  };

  // Live Streaming (Simulated Demo with real interactive chat and controls)
  const joinLiveStream = (id: string) => {
    setActiveLiveStreamId(id);
    setActiveScreen('live');
  };

  const leaveLiveStream = () => {
    setActiveLiveStreamId(null);
  };

  const sendLiveChatMessage = (liveId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg: LiveChatMessage = {
      id: `lmsg_${Date.now()}`,
      user: currentUser,
      text: text.trim(),
      timestamp: 'Just now',
    };
    setLiveStreams((prev) =>
      prev.map((ls) => {
        if (ls.id === liveId) {
          return {
            ...ls,
            chatMessages: [...ls.chatMessages, newMsg],
          };
        }
        return ls;
      })
    );
  };

  const startLiveStream = (title: string, category: string) => {
    const newLive: LiveStream = {
      id: `live_${Date.now()}`,
      hostUser: currentUser,
      title,
      category,
      viewerCount: 1,
      isLive: true,
      chatMessages: [
        {
          id: 'init_msg',
          user: currentUser,
          text: 'Welcome to the broadcast! Live streaming demo active.',
          timestamp: 'Just now',
          isPinned: true,
        }
      ]
    };
    setLiveStreams((prev) => [newLive, ...prev]);
    setActiveLiveStreamId(newLive.id);
    setActiveScreen('live');
    addToast('Broadcast started in Demo Mode', 'info');
  };

  const endLiveStream = (liveId: string) => {
    setLiveStreams((prev) => prev.filter((ls) => ls.id !== liveId));
    setActiveLiveStreamId(null);
    addToast('Live broadcast ended', 'info');
  };

  // Chat & Messaging
  const sendMessage = (conversationId: string, text: string, imageUrl?: string, audioDuration?: string) => {
    if (!text.trim() && !imageUrl && !audioDuration) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      text: text.trim(),
      imageUrl,
      audioDuration,
      createdAt: 'Just now',
      isRead: true,
    };

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: newMsg,
          };
        }
        return conv;
      })
    );

    // Simulated responsive reply for non-group chats
    const conv = conversations.find((c) => c.id === conversationId);
    if (conv && !conv.isGroup && conv.participant.id !== currentUser.id) {
      setTimeout(() => {
        const replyTexts = [
          'Awesome, thanks for sharing!',
          'Totally agree with you on this.',
          'Love how clean the new Qevora layout is!',
          'Sounds great! Catch up soon.',
          'Checking this out right now.'
        ];
        const randomReply = replyTexts[Math.floor(Math.random() * replyTexts.length)];
        const replyMsg: Message = {
          id: `msg_reply_${Date.now()}`,
          conversationId,
          senderId: conv.participant.id,
          text: randomReply,
          createdAt: 'Just now',
          isRead: false,
        };

        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), replyMsg],
        }));

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === conversationId) {
              return {
                ...c,
                lastMessage: replyMsg,
                unreadCount: activeConversationId === conversationId ? 0 : c.unreadCount + 1,
              };
            }
            return c;
          })
        );
      }, 2000);
    }
  };

  const addReaction = (conversationId: string, messageId: string, emoji: string) => {
    setMessages((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map((m) =>
        m.id === messageId ? { ...m, reaction: m.reaction === emoji ? undefined : emoji } : m
      ),
    }));
  };

  const startOrOpenConversation = (targetUser: User) => {
    const existing = conversations.find((c) => !c.isGroup && c.participant.id === targetUser.id);
    if (existing) {
      setActiveConversationId(existing.id);
      setActiveScreen('messages');
    } else {
      const newConvId = `conv_${targetUser.id}`;
      const dummyMsg: Message = {
        id: `msg_init_${Date.now()}`,
        conversationId: newConvId,
        senderId: currentUser.id,
        text: `Say hi to ${targetUser.name}!`,
        createdAt: 'Just now',
        isRead: true,
      };
      const newConv: Conversation = {
        id: newConvId,
        participant: targetUser,
        unreadCount: 0,
        isOnline: true,
        lastActive: 'Active now',
        lastMessage: dummyMsg,
      };
      setConversations((prev) => [newConv, ...prev]);
      setMessages((prev) => ({
        ...prev,
        [newConvId]: [dummyMsg],
      }));
      setActiveConversationId(newConvId);
      setActiveScreen('messages');
    }
  };

  const createGroupChat = (name: string, members: User[]) => {
    const newConvId = `conv_grp_${Date.now()}`;
    const initialMsg: Message = {
      id: `msg_grp_${Date.now()}`,
      conversationId: newConvId,
      senderId: currentUser.id,
      text: `${currentUser.name} created the group "${name}".`,
      createdAt: 'Just now',
      isRead: true,
    };
    const newGroup: Conversation = {
      id: newConvId,
      participant: members[0] || currentUser,
      isGroup: true,
      groupName: name,
      groupMembers: [currentUser, ...members],
      unreadCount: 0,
      isOnline: true,
      lastMessage: initialMsg,
    };
    setConversations((prev) => [newGroup, ...prev]);
    setMessages((prev) => ({
      ...prev,
      [newConvId]: [initialMsg],
    }));
    setActiveConversationId(newConvId);
    addToast(`Group "${name}" created`, 'success');
  };

  const acceptMessageRequest = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, isRequest: false } : c))
    );
    addToast('Message request accepted', 'success');
  };

  const declineMessageRequest = (convId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    addToast('Message request declined', 'info');
  };

  const toggleMuteConversation = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          const willMute = !c.isMuted;
          addToast(willMute ? 'Conversation muted' : 'Conversation unmuted', 'info');
          return { ...c, isMuted: willMute };
        }
        return c;
      })
    );
  };

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.isRequest ? 0 : c.unreadCount), 0);

  // Notifications
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast('All notifications marked as read', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Follow
  const toggleFollow = (userId: string) => {
    if (followedUserIds.includes(userId)) {
      setFollowedUserIds((prev) => prev.filter((id) => id !== userId));
      addToast('Unfollowed user', 'info');
    } else {
      setFollowedUserIds((prev) => [...prev, userId]);
      addToast('Following user', 'success');
    }
  };

  const isFollowing = (userId: string) => followedUserIds.includes(userId);

  const openFollowersModal = (user: User, type: 'followers' | 'following') => {
    setFollowersModalUser(user);
    setFollowersModalType(type);
    setIsFollowersModalOpen(true);
  };

  const closeFollowersModal = () => {
    setIsFollowersModalOpen(false);
    setFollowersModalUser(null);
  };

  // Block
  const blockUser = (userId: string, userName: string) => {
    if (!blockedUserIds.includes(userId)) {
      setBlockedUserIds((prev) => [...prev, userId]);
      setFollowedUserIds((prev) => prev.filter((id) => id !== userId));
      addToast(`Blocked @${userName}. Their posts are hidden from your feed.`, 'warning');
    }
  };

  const unblockUser = (userId: string) => {
    setBlockedUserIds((prev) => prev.filter((id) => id !== userId));
    addToast('User unblocked', 'info');
  };

  const isBlocked = (userId: string) => blockedUserIds.includes(userId);

  // Reports & Moderation
  const openReportModal = (data: ReportData) => {
    setReportData(data);
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setReportData(null);
  };

  const submitReport = (reason: string, details?: string) => {
    if (!reportData) return;
    const newTicket: ReportTicket = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      targetType: reportData.type,
      targetId: reportData.id,
      targetTitle: reportData.title,
      reportedBy: currentUser.id,
      reason,
      details,
      status: 'pending',
      createdAt: 'Just now',
    };
    setReports((prev) => [newTicket, ...prev]);
    closeReportModal();
    addToast(`Report ${newTicket.id} submitted. Thank you for keeping Qevora safe.`, 'success');
  };

  const resolveReport = (reportId: string, actionNote?: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r))
    );
    addToast(`Report ${reportId} marked as resolved ${actionNote ? `(${actionNote})` : ''}`, 'success');
  };

  const dismissReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'dismissed' } : r))
    );
    addToast(`Report ${reportId} dismissed`, 'info');
  };

  const addAuditLog = (
    action: string,
    target: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low',
    details?: string
  ) => {
    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      adminId: currentUser.id,
      adminHandle: currentUser.handle,
      action,
      target,
      details,
      timestamp: 'Just now',
      severity,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const deleteHarmfulPost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    addAuditLog('DELETE_POST', postId, 'high', 'Removed harmful post from public feed');
    addToast('Harmful post removed by administrator', 'warning');
  };

  const deleteClip = (clipId: string) => {
    setClips((prev) => prev.filter((c) => c.id !== clipId));
    addAuditLog('DELETE_REEL', clipId, 'high', 'Purged reel video from Qevora');
    addToast('Reel purged by administrator', 'warning');
  };

  const banUser = (userId: string, reason?: string) => {
    const fallbackReason = reason || 'Violation of Qevora community standards';
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBanned: true, banReason: fallbackReason } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, isBanned: true, banReason: fallbackReason }));
    }
    const target = users.find((u) => u.id === userId);
    addAuditLog('BAN_USER', target ? `@${target.handle}` : userId, 'high', fallbackReason);
    addToast(`Account @${target?.handle || userId} suspended`, 'warning');
  };

  const unbanUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBanned: false, banReason: undefined } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, isBanned: false, banReason: undefined }));
    }
    const target = users.find((u) => u.id === userId);
    addAuditLog('UNBAN_USER', target ? `@${target.handle}` : userId, 'medium', 'Account reinstated by admin');
    addToast(`Account @${target?.handle || userId} reinstated`, 'success');
  };

  const toggleUserVerification = (userId: string) => {
    let nextVerified = false;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          nextVerified = !u.verified;
          return { ...u, verified: nextVerified };
        }
        return u;
      })
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, verified: !prev.verified }));
    }
    const target = users.find((u) => u.id === userId);
    addAuditLog('TOGGLE_VERIFY', target ? `@${target.handle}` : userId, 'low', `Verified status: ${nextVerified}`);
    addToast(`Verification updated for @${target?.handle || userId}`, 'info');
  };

  const changeUserRole = (userId: string, role: 'user' | 'creator' | 'moderator' | 'admin') => {
    if (currentUser.role !== 'admin') {
      addToast('Unauthorized: Only SuperAdmin can modify member roles.', 'error');
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, role }));
    }
    const target = users.find((u) => u.id === userId);
    addAuditLog('CHANGE_ROLE', target ? `@${target.handle}` : userId, 'high', `Role updated to ${role}`);
    addToast(`Role for @${target?.handle || userId} set to ${role.toUpperCase()}`, 'success');
  };

  const createNewUser = (userData: Partial<User>) => {
    const handleClean = (userData.handle || `user_${Date.now()}`).replace('@', '');
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name || 'New Member',
      handle: handleClean,
      email: userData.email || `${handleClean}@qevora.network`,
      isEmailVerified: true,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      bio: userData.bio || 'New member on Qevora.',
      joinedDate: 'Joined today',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      verified: userData.verified ?? false,
      role: userData.role || 'user',
      isBanned: false,
    };
    setUsers((prev) => [newUser, ...prev]);
    addAuditLog('CREATE_USER', `@${newUser.handle}`, 'medium', 'Created via Admin Web Portal');
    addToast(`User @${newUser.handle} registered`, 'success');
  };

  const killLiveStream = (streamId: string) => {
    setLiveStreams((prev) =>
      prev.map((s) => (s.id === streamId ? { ...s, isLive: false, viewerCount: 0 } : s))
    );
    if (activeLiveStreamId === streamId) {
      setActiveLiveStreamId(null);
    }
    addAuditLog('TERMINATE_STREAM', streamId, 'critical', 'Force terminated active broadcast');
    addToast('Live broadcast terminated by administrator', 'error');
  };

  const updateAdminSettings = (updates: Partial<PlatformSettings>) => {
    setAdminSettings((prev) => ({ ...prev, ...updates }));
    addAuditLog('UPDATE_SETTINGS', 'Platform Config', 'medium', `Modified: ${Object.keys(updates).join(', ')}`);
    addToast('Platform configuration saved', 'success');
  };

  // Saved Collections & Drafts
  const createCollection = (name: string) => {
    if (!name.trim()) return;
    const newCol: SavedCollection = {
      id: `col_${Date.now()}`,
      name: name.trim(),
      postIds: [],
    };
    setSavedCollections((prev) => [...prev, newCol]);
    addToast(`Collection "${name}" created`, 'success');
  };

  const addToCollection = (collectionId: string, postId: string) => {
    setSavedCollections((prev) =>
      prev.map((col) => {
        if (col.id === collectionId) {
          const already = col.postIds.includes(postId);
          return {
            ...col,
            postIds: already ? col.postIds.filter((id) => id !== postId) : [...col.postIds, postId],
          };
        }
        return col;
      })
    );
    addToast('Updated collection items', 'info');
  };

  const saveDraft = (content: string, mediaUrls: string[], tags: string[], location?: string) => {
    const newDraft: DraftPost = {
      id: `draft_${Date.now()}`,
      content,
      mediaUrls,
      tags,
      location,
      savedAt: 'Just now',
    };
    setDrafts((prev) => [newDraft, ...prev]);
    addToast('Saved to post drafts', 'info');
  };

  const deleteDraft = (draftId: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    addToast('Draft discarded', 'info');
  };

  // Navigation & User profiles
  const openUserProfile = (userId: string) => {
    setViewingUserId(userId);
    setActiveScreen('profile');
  };

  const backFromUserProfile = () => {
    setViewingUserId(null);
  };

  // Modals
  const openShareModal = (data: ShareData) => {
    setShareData(data);
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setShareData(null);
  };

  const openAuthModal = (mode: 'login' | 'signup' | 'forgot_password' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setIsAdminPortalMode(false);
    setCurrentUser(CURRENT_USER);
    addToast('Signed out of Qevora', 'info');
    openAuthModal('login');
  };

  return (
    <SocialContext.Provider
      value={{
        currentUser,
        users,
        updateCurrentUser,
        deleteAccount,
        exportUserData,
        posts: posts.filter((p) => !blockedUserIds.includes(p.userId)),
        addPost,
        editPost,
        deletePost,
        togglePinPost,
        toggleLikePost,
        toggleBookmarkPost,
        addComment,
        deleteComment,
        toggleLikeComment,
        addCommentReply,
        deleteCommentReply,
        toggleLikeCommentReply,
        stories: stories.filter((s) => !blockedUserIds.includes(s.userId)),
        addStory,
        activeStoryIndex,
        isStoryViewerOpen,
        openStoryViewer,
        closeStoryViewer,
        nextStory,
        prevStory,
        isStoryViewersOpen,
        setIsStoryViewersOpen,
        clips: clips.filter((c) => !blockedUserIds.includes(c.userId)),
        addClip,
        toggleLikeClip,
        toggleBookmarkClip,
        liveStreams,
        activeLiveStreamId,
        joinLiveStream,
        leaveLiveStream,
        sendLiveChatMessage,
        startLiveStream,
        endLiveStream,
        conversations: conversations.filter((c) => !blockedUserIds.includes(c.participant.id)),
        activeConversationId,
        setActiveConversationId,
        messages,
        sendMessage,
        addReaction,
        startOrOpenConversation,
        createGroupChat,
        acceptMessageRequest,
        declineMessageRequest,
        toggleMuteConversation,
        unreadMessagesCount,
        notifications,
        unreadNotificationsCount,
        markAllNotificationsAsRead,
        markNotificationRead,
        followedUserIds,
        toggleFollow,
        isFollowing,
        isFollowersModalOpen,
        followersModalType,
        followersModalUser,
        openFollowersModal,
        closeFollowersModal,
        blockedUserIds,
        blockUser,
        unblockUser,
        isBlocked,
        reports,
        submitReport,
        resolveReport,
        dismissReport,
        deleteHarmfulPost,
        savedCollections,
        createCollection,
        addToCollection,
        drafts,
        saveDraft,
        deleteDraft,
        activeScreen,
        setActiveScreen,
        viewingUserId,
        openUserProfile,
        backFromUserProfile,
        isCreatePostOpen,
        setIsCreatePostOpen,
        isCreateClipOpen,
        setIsCreateClipOpen,
        isEditProfileOpen,
        setIsEditProfileOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isReportModalOpen,
        reportData,
        openReportModal,
        closeReportModal,
        isShareModalOpen,
        shareData,
        openShareModal,
        closeShareModal,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        showSplash,
        setShowSplash,
        // Admin Web Portal & Master Control
        banUser,
        unbanUser,
        toggleUserVerification,
        changeUserRole,
        createNewUser,
        deleteClip,
        killLiveStream,
        systemNotice,
        setSystemNotice,
        adminSettings,
        updateAdminSettings,
        auditLogs,
        addAuditLog,
        isAdminPortalMode,
        setIsAdminPortalMode,
        logout,
        toasts,
        addToast,
        removeToast,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
