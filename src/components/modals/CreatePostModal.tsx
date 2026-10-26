import React, { useState, useRef } from 'react';
import { useSocial } from '../../context/SocialContext';
import { 
  X, 
  Image as ImageIcon, 
  Tag, 
  Globe, 
  Users, 
  Lock, 
  MapPin, 
  Sparkles, 
  AlertCircle,
  FileText,
  Plus,
  Clapperboard
} from 'lucide-react';

export const CreatePostModal: React.FC = () => {
  const { 
    isCreatePostOpen, 
    setIsCreatePostOpen, 
    setIsCreateClipOpen,
    addPost, 
    saveDraft, 
    drafts, 
    deleteDraft, 
    currentUser 
  } = useSocial();
  
  const [content, setContent] = useState('');
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState<'public' | 'followers' | 'only_me'>('public');
  const [showDraftsList, setShowDraftsList] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxChars = 500;

  if (!isCreatePostOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        newUrls.push(URL.createObjectURL(files[i]));
      }
      setMediaPreviews([...mediaPreviews, ...newUrls]);
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaPreviews(mediaPreviews.filter((_, i) => i !== index));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSaveAsDraft = () => {
    if (!content.trim() && mediaPreviews.length === 0) return;
    saveDraft(content, mediaPreviews, tags, location);
    setIsCreatePostOpen(false);
  };

  const handleLoadDraft = (draft: any) => {
    setContent(draft.content);
    setMediaPreviews(draft.mediaUrls || []);
    setTags(draft.tags || []);
    setLocation(draft.location || '');
    setShowDraftsList(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaPreviews.length === 0) {
      setError('Please add text or an image to publish your post.');
      return;
    }
    setError(null);
    addPost(content.trim(), mediaPreviews, tags, privacy, location || undefined);
    
    // Reset state & close
    setContent('');
    setMediaPreviews([]);
    setTags([]);
    setTagInput('');
    setLocation('');
    setIsCreatePostOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Create New Post</h3>
            {drafts.length > 0 && (
              <button
                type="button"
                onClick={() => setShowDraftsList(!showDraftsList)}
                className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
              >
                Drafts ({drafts.length})
              </button>
            )}
          </div>
          <button
            onClick={() => setIsCreatePostOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Type Selector */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50/70 p-1">
          <button
            type="button"
            className="flex-1 py-1.5 text-xs font-bold rounded-xl bg-white text-blue-600 shadow-xs flex items-center justify-center gap-1.5"
          >
            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Photo / Carousel Post</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCreatePostOpen(false);
              setIsCreateClipOpen(true);
            }}
            className="flex-1 py-1.5 text-xs font-bold rounded-xl text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-colors group cursor-pointer"
          >
            <Clapperboard className="w-3.5 h-3.5 text-rose-500 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-rose-600">Switch to Reel Upload</span>
          </button>
        </div>

        {/* Drafts Drawer */}
        {showDraftsList && (
          <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
            <p className="text-xs font-bold text-slate-700">Saved Drafts</p>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {drafts.map((d) => (
                <div
                  key={d.id}
                  className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:border-blue-400"
                >
                  <span
                    onClick={() => handleLoadDraft(d)}
                    className="truncate flex-1 font-medium cursor-pointer text-slate-800"
                  >
                    {d.content || 'Untitled Draft with media'}
                  </span>
                  <button
                    onClick={() => deleteDraft(d.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* User info & privacy selector */}
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div>
              <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value as any)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-1 px-2 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="public">🌐 Public</option>
                  <option value="followers">👥 Followers only</option>
                  <option value="only_me">🔒 Only me</option>
                </select>
              </div>
            </div>
          </div>

          {/* Text Area */}
          <div className="space-y-1">
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value.slice(0, maxChars));
                if (error) setError(null);
              }}
              placeholder={`What's inspiring you today, ${currentUser.name.split(' ')[0]}?`}
              rows={4}
              className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none resize-none leading-relaxed"
            />

            {/* Character Counter */}
            <div className="flex justify-end text-[11px] font-medium text-slate-400 tabular-nums">
              {content.length}/{maxChars}
            </div>
          </div>

          {/* Location Input */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location (e.g. Sardinia, Italy)..."
              className="w-full bg-transparent text-xs text-slate-800 focus:outline-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Media Carousel Previews */}
          {mediaPreviews.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Attached Media ({mediaPreviews.length})
              </p>
              <div className="grid grid-cols-3 gap-2">
                {mediaPreviews.map((url, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden aspect-square bg-slate-100 border border-slate-200 group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(idx)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags management */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tags (press Enter)..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Media selector options & Draft Save */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>Upload Photos</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAsDraft}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-semibold"
              >
                <FileText className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!content.trim() && mediaPreviews.length === 0}
              className="px-5 py-2.5 rounded-xl bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
            >
              Post to Qevora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
