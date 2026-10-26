import React, { useState } from 'react';
import { Post, Comment } from '../../types';
import { useSocial } from '../../context/SocialContext';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  Sparkles, 
  Trash2, 
  Flag, 
  UserX, 
  Send,
  Globe,
  Lock,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Pin,
  Edit,
  CornerDownRight
} from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { 
    currentUser, 
    toggleLikePost, 
    toggleBookmarkPost, 
    addComment, 
    deleteComment,
    toggleLikeComment, 
    addCommentReply,
    deleteCommentReply,
    toggleLikeCommentReply,
    deletePost, 
    editPost,
    togglePinPost,
    openReportModal, 
    blockUser,
    openUserProfile,
    openShareModal
  } = useSocial();

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Edit post state
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  // Threaded reply input state
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');

  const isAuthor = post.userId === currentUser.id;
  const mediaList = post.mediaUrls && post.mediaUrls.length > 0 ? post.mediaUrls : post.mediaUrl ? [post.mediaUrl] : [];

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput);
    setCommentInput('');
  };

  const handleReplySubmit = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    addCommentReply(post.id, commentId, replyInput);
    setReplyInput('');
    setReplyingToCommentId(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    editPost(post.id, editContent);
    setIsEditing(false);
  };

  const handleShareClick = () => {
    openShareModal({
      url: window.location.href,
      title: `${post.user.name} on Qevora`,
      content: post.content,
    });
  };

  const handleReport = () => {
    setShowMenu(false);
    openReportModal({
      type: 'post',
      id: post.id,
      title: `Post by @${post.user.handle}: "${post.content.slice(0, 40)}..."`,
    });
  };

  const handleBlock = () => {
    setShowMenu(false);
    blockUser(post.userId, post.user.handle);
  };

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-4 overflow-hidden transition-shadow hover:shadow-md">
      {/* Pinned indicator banner */}
      {post.isPinned && (
        <div className="bg-blue-50/70 border-b border-blue-100/60 px-4 py-1.5 flex items-center gap-1.5 text-[11px] font-bold text-blue-700">
          <Pin className="w-3.5 h-3.5 fill-blue-600" />
          <span>Pinned Post</span>
        </div>
      )}

      {/* Post Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => openUserProfile(post.user.id)}
            className="focus:outline-none rounded-full"
            aria-label={`View ${post.user.name}'s profile`}
          >
            <img
              src={post.user.avatar}
              alt={post.user.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 hover:ring-blue-400 transition-all"
            />
          </button>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => openUserProfile(post.user.id)}
                className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors focus:outline-none"
              >
                {post.user.name}
              </button>
              {post.user.verified && (
                <Sparkles className="w-3.5 h-3.5 text-blue-600 fill-blue-600 shrink-0" />
              )}
              <span className="text-xs text-slate-400">@{post.user.handle}</span>
            </div>
            
            {/* Metadata (Clean unboxed with typographic dots) */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-0.5 flex-wrap">
              <span>{post.createdAt}</span>
              {post.isEdited && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[11px] text-slate-500 italic">edited</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              {post.privacy === 'followers' ? (
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Followers</span>
              ) : post.privacy === 'only_me' ? (
                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Only me</span>
              ) : (
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Public</span>
              )}
              {post.location && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 text-slate-600 font-semibold truncate max-w-[200px]">
                    <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                    {post.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3-dots actions menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Post options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setShowMenu(false)} 
              />
              <div className="absolute right-0 top-9 z-30 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                {isAuthor ? (
                  <>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        togglePinPost(post.id);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                    >
                      <Pin className="w-4 h-4 text-slate-500" />
                      <span>{post.isPinned ? 'Unpin from Profile' : 'Pin to Profile'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setIsEditing(true);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-slate-500" />
                      <span>Edit Caption</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        deletePost(post.id);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Post</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleReport}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
                    >
                      <Flag className="w-4 h-4 text-slate-400" />
                      <span>Report Post</span>
                    </button>
                    <button
                      onClick={handleBlock}
                      className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                    >
                      <UserX className="w-4 h-4 text-rose-500" />
                      <span>Block @{post.user.handle}</span>
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Post Text Content or Inline Editor */}
      <div className="px-4 pb-3">
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line font-normal">
            {post.content}
          </p>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && !isEditing && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Media Carousel (Multi-photo support) */}
      {mediaList.length > 0 && (
        <div className="relative bg-slate-100 border-y border-slate-100 overflow-hidden select-none">
          <div className="w-full h-80 sm:h-96 relative flex items-center justify-center bg-slate-950">
            <img
              src={mediaList[activeMediaIndex]}
              alt={`Slide ${activeMediaIndex + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Carousel arrows */}
          {mediaList.length > 1 && (
            <>
              {activeMediaIndex > 0 && (
                <button
                  onClick={() => setActiveMediaIndex(activeMediaIndex - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {activeMediaIndex < mediaList.length - 1 && (
                <button
                  onClick={() => setActiveMediaIndex(activeMediaIndex + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Dots indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                {mediaList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === activeMediaIndex ? 'bg-white scale-125' : 'bg-white/40'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Action Metrics Bar */}
      <div className="px-4 py-3 flex items-center justify-between text-slate-500 text-xs">
        <div className="flex items-center gap-5 sm:gap-6">
          {/* Like */}
          <button
            onClick={() => toggleLikePost(post.id)}
            className={`min-h-[40px] flex items-center gap-1.5 font-semibold transition-colors group ${
              post.isLiked ? 'text-rose-600' : 'hover:text-rose-600'
            }`}
            aria-label={post.isLiked ? 'Unlike post' : 'Like post'}
          >
            <Heart
              className={`w-5 h-5 transition-transform group-active:scale-125 ${
                post.isLiked ? 'fill-rose-600 text-rose-600' : 'group-hover:text-rose-600'
              }`}
            />
            <span className="tabular-nums">{post.likesCount}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`min-h-[40px] flex items-center gap-1.5 font-semibold transition-colors hover:text-blue-600 ${
              showComments ? 'text-blue-600' : ''
            }`}
            aria-label="View or write comments"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="tabular-nums">{post.commentsCount}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShareClick}
            className="min-h-[40px] flex items-center gap-1.5 font-semibold hover:text-blue-600 transition-colors"
            aria-label="Share post"
          >
            <Share2 className="w-5 h-5" />
            <span className="tabular-nums hidden sm:inline">{post.sharesCount}</span>
          </button>
        </div>

        {/* Bookmark */}
        <button
          onClick={() => toggleBookmarkPost(post.id)}
          className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg transition-colors ${
            post.isBookmarked ? 'text-blue-600' : 'hover:text-blue-600'
          }`}
          aria-label={post.isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
        >
          <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-blue-600 text-blue-600' : ''}`} />
        </button>
      </div>

      {/* Comments Drawer / Section with Threaded Replies */}
      {showComments && (
        <div className="bg-slate-50 border-t border-slate-200/80 p-4 space-y-4">
          {/* Add main comment input */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
            />
            <div className="relative flex-1">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-3.5 pr-10 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-colors"
                aria-label="Submit comment"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Comments List */}
          {post.comments.length > 0 ? (
            <div className="space-y-3.5 pt-1">
              {post.comments.map((comment) => {
                const canDeleteComment = isAuthor || comment.userId === currentUser.id;

                return (
                  <div key={comment.id} className="space-y-2">
                    {/* Top-level comment item */}
                    <div className="flex items-start gap-2.5 group">
                      <button
                        onClick={() => openUserProfile(comment.user.id)}
                        className="focus:outline-none shrink-0"
                      >
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                        />
                      </button>
                      <div className="flex-1 bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => openUserProfile(comment.user.id)}
                            className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors"
                          >
                            {comment.user.name}
                          </button>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                            {canDeleteComment && (
                              <button
                                onClick={() => deleteComment(post.id, comment.id)}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-0.5 transition-opacity"
                                title="Delete comment"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 mt-1 leading-normal">
                          {comment.content}
                        </p>
                        
                        {/* Reply trigger button */}
                        <div className="flex items-center gap-3 mt-1.5 pt-1 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                          <button
                            onClick={() => setReplyingToCommentId(replyingToCommentId === comment.id ? null : comment.id)}
                            className="hover:text-blue-600 transition-colors flex items-center gap-1"
                          >
                            <CornerDownRight className="w-3 h-3" />
                            <span>Reply</span>
                          </button>
                          {comment.likesCount > 0 && (
                            <span className="text-slate-400 tabular-nums">· {comment.likesCount} likes</span>
                          )}
                        </div>
                      </div>

                      {/* Comment like button */}
                      <button
                        onClick={() => toggleLikeComment(post.id, comment.id)}
                        className={`shrink-0 p-1 mt-1 transition-colors ${
                          comment.isLiked ? 'text-rose-600' : 'text-slate-400 hover:text-rose-600'
                        }`}
                        aria-label="Like comment"
                      >
                        <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-rose-600' : ''}`} />
                      </button>
                    </div>

                    {/* Threaded Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="pl-8 space-y-2 border-l-2 border-slate-200 ml-3.5">
                        {comment.replies.map((reply) => {
                          const canDeleteReply = isAuthor || reply.userId === currentUser.id;

                          return (
                            <div key={reply.id} className="flex items-start gap-2 group/rep">
                              <img
                                src={reply.user.avatar}
                                alt={reply.user.name}
                                className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                              />
                              <div className="flex-1 bg-white/90 rounded-xl p-2 border border-slate-200 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-900">{reply.user.name}</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-slate-400">{reply.createdAt}</span>
                                    {canDeleteReply && (
                                      <button
                                        onClick={() => deleteCommentReply(post.id, comment.id, reply.id)}
                                        className="opacity-0 group-hover/rep:opacity-100 text-slate-400 hover:text-rose-600 p-0.5"
                                        title="Delete reply"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-slate-700 mt-0.5">{reply.content}</p>
                              </div>

                              <button
                                onClick={() => toggleLikeCommentReply(post.id, comment.id, reply.id)}
                                className={`shrink-0 p-1 mt-0.5 transition-colors ${
                                  reply.isLiked ? 'text-rose-600' : 'text-slate-400 hover:text-rose-600'
                                }`}
                                aria-label="Like reply"
                              >
                                <Heart className={`w-3 h-3 ${reply.isLiked ? 'fill-rose-600' : ''}`} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Inline reply composer */}
                    {replyingToCommentId === comment.id && (
                      <form
                        onSubmit={(e) => handleReplySubmit(e, comment.id)}
                        className="pl-8 flex items-center gap-2 pt-1 animate-in fade-in duration-100"
                      >
                        <input
                          type="text"
                          value={replyInput}
                          onChange={(e) => setReplyInput(e.target.value)}
                          placeholder={`Replying to @${comment.user.handle}...`}
                          className="flex-1 bg-white border border-blue-300 rounded-xl py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={!replyInput.trim()}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 disabled:bg-slate-200 text-white text-xs font-semibold"
                        >
                          Send
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplyingToCommentId(null)}
                          className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-600"
                        >
                          Cancel
                        </button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">
              No comments yet. Be the first to start the conversation!
            </p>
          )}
        </div>
      )}
    </article>
  );
};
