import React from 'react';
import { useSocial } from '../../context/SocialContext';
import { X, Eye, Sparkles } from 'lucide-react';

interface StoryViewersModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyIndex: number;
}

export const StoryViewersModal: React.FC<StoryViewersModalProps> = ({
  isOpen,
  onClose,
  storyIndex,
}) => {
  const { stories, openUserProfile } = useSocial();

  if (!isOpen) return null;

  const story = stories[storyIndex];
  const viewers = story?.viewers || [];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[70vh]">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Story Viewers ({viewers.length})
            </h4>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {viewers.length > 0 ? (
            viewers.map((viewer) => (
              <div
                key={viewer.id}
                onClick={() => {
                  onClose();
                  openUserProfile(viewer.id);
                }}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <img
                  src={viewer.avatar}
                  alt={viewer.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">{viewer.name}</span>
                    {viewer.verified && (
                      <Sparkles className="w-3 h-3 text-blue-600 fill-blue-600" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block truncate">@{viewer.handle}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">
              No viewers yet on this story.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
