export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  location?: string;
  website?: string;
  email?: string;
  isEmailVerified?: boolean;
  joinedDate: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  verified?: boolean;
  isPrivate?: boolean;
  role?: 'user' | 'creator' | 'moderator' | 'admin';
  isBanned?: boolean;
  banReason?: string;
  closeFriendsIds?: string[];
  sensitiveContentFilter?: 'standard' | 'less' | 'strict';
  notificationSettings?: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
    messages: boolean;
    live: boolean;
  };
}

export interface SystemNotice {
  id: string;
  active: boolean;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'maintenance';
  publishedAt: string;
  publishedBy: string;
}

export interface PlatformSettings {
  allowSignups: boolean;
  allowReelUploads: boolean;
  allowLiveBroadcasts: boolean;
  maintenanceMode: boolean;
  maxUploadSizeMB: number;
  strictAutoModeration: boolean;
  requireEmailVerification: boolean;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminHandle: string;
  action: string;
  target: string;
  details?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface CommentReply {
  id: string;
  commentId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  replies?: CommentReply[];
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  content: string;
  mediaUrl?: string; // Single media
  mediaUrls?: string[]; // Multi-photo carousel
  mediaType?: 'image' | 'video';
  location?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  bookmarksCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isPinned?: boolean;
  isEdited?: boolean;
  comments: Comment[];
  tags?: string[];
  privacy?: 'public' | 'followers' | 'only_me';
  collectionName?: string;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  mediaUrl: string;
  caption?: string;
  createdAt: string;
  expiresIn?: string;
  isViewed: boolean;
  duration?: number;
  privacy?: 'public' | 'close_friends' | 'followers';
  viewers?: User[];
}

export interface Clip {
  id: string;
  userId: string;
  user: User;
  videoUrl: string;
  caption: string;
  soundTitle: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
}

export interface LiveChatMessage {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  isPinned?: boolean;
}

export interface LiveStream {
  id: string;
  hostUser: User;
  title: string;
  category: string;
  viewerCount: number;
  isLive: boolean;
  scheduledFor?: string;
  coverImage?: string;
  chatMessages: LiveChatMessage[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  audioDuration?: string;
  createdAt: string;
  isRead: boolean;
  reaction?: string;
}

export interface Conversation {
  id: string;
  participant: User;
  isGroup?: boolean;
  groupName?: string;
  groupMembers?: User[];
  lastMessage: Message;
  unreadCount: number;
  isOnline: boolean;
  lastActive?: string;
  isRequest?: boolean; // Message requests tab
  isMuted?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'reply' | 'follow' | 'mention' | 'live';
  user: User;
  postId?: string;
  postSnippet?: string;
  createdAt: string;
  isRead: boolean;
}

export interface DraftPost {
  id: string;
  content: string;
  mediaUrls: string[];
  tags: string[];
  location?: string;
  savedAt: string;
}

export interface ReportTicket {
  id: string;
  targetType: 'post' | 'user' | 'comment' | 'clip' | 'live';
  targetId: string;
  targetTitle: string;
  reportedBy: string;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface SavedCollection {
  id: string;
  name: string;
  coverUrl?: string;
  postIds: string[];
}

export type ActiveScreen = 
  | 'home' 
  | 'search' 
  | 'create' 
  | 'clips' 
  | 'live' 
  | 'messages' 
  | 'notifications' 
  | 'profile'
  | 'insights'
  | 'admin';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}
