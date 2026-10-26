import React from 'react';
import { useSocial } from '../../context/SocialContext';
import { Image, Tag, Globe, Sparkles, Clapperboard } from 'lucide-react';

export const CreatePostBox: React.FC = () => {
  const { currentUser, setIsCreatePostOpen, setIsCreateClipOpen } = useSocial();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
        />
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="flex-1 bg-slate-100 hover:bg-slate-200/80 transition-colors text-left py-2.5 px-4 rounded-xl text-slate-500 text-sm font-medium focus:outline-none"
        >
          What's happening, {currentUser.name.split(' ')[0]}?
        </button>
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors"
          >
            <Image className="w-4 h-4 text-blue-600" />
            <span>Photo</span>
          </button>
          <button
            onClick={() => setIsCreateClipOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Clapperboard className="w-4 h-4 text-rose-500" />
            <span className="font-bold">Upload Reel</span>
          </button>
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors"
          >
            <Tag className="w-4 h-4 text-blue-600" />
            <span>Tag</span>
          </button>
        </div>

        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm shadow-blue-500/20"
        >
          Post
        </button>
      </div>
    </div>
  );
};
