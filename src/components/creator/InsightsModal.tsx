import React from 'react';
import { useSocial } from '../../context/SocialContext';
import { 
  X, 
  TrendingUp, 
  Eye, 
  Users, 
  Heart, 
  Share2, 
  Bookmark, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface InsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InsightsModal: React.FC<InsightsModalProps> = ({ isOpen, onClose }) => {
  const { posts, currentUser } = useSocial();

  if (!isOpen) return null;

  const userPosts = posts.filter((p) => p.userId === currentUser.id);
  const totalLikes = userPosts.reduce((acc, p) => acc + p.likesCount, 0);
  const totalComments = userPosts.reduce((acc, p) => acc + p.commentsCount, 0);
  const totalSaves = userPosts.reduce((acc, p) => acc + p.bookmarksCount, 0);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <TrendingUp className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">Content & Audience Insights</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            aria-label="Close insights modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Top KPI Cards (Tabular figures) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
                Total Impressions
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-slate-900 tabular-nums">38,420</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +24%
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Last 30 days reach</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Engagement Rate
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-slate-900 tabular-nums">8.6%</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +1.2%
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Industry avg 3.8%</p>
            </div>
          </div>

          {/* Interaction Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Cumulative Post Engagements
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Heart className="w-4 h-4 text-rose-500 mx-auto mb-1 fill-rose-500" />
                <span className="text-sm font-extrabold text-slate-900 tabular-nums">{totalLikes}</span>
                <span className="text-[10px] text-slate-400 block">Likes</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Users className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <span className="text-sm font-extrabold text-slate-900 tabular-nums">{totalComments}</span>
                <span className="text-[10px] text-slate-400 block">Comments</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Bookmark className="w-4 h-4 text-indigo-500 mx-auto mb-1 fill-indigo-500" />
                <span className="text-sm font-extrabold text-slate-900 tabular-nums">{totalSaves}</span>
                <span className="text-[10px] text-slate-400 block">Saves</span>
              </div>
            </div>
          </div>

          {/* Audience Top Cities & Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Top Audience Locations
            </h4>
            <div className="space-y-2">
              {[
                { city: 'San Francisco, USA', pct: '38%' },
                { city: 'Tokyo, Japan', pct: '24%' },
                { city: 'Lisbon, Portugal', pct: '18%' },
                { city: 'London, UK', pct: '12%' },
              ].map((loc) => (
                <div key={loc.city} className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium">{loc.city}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: loc.pct }} />
                    </div>
                    <span className="text-slate-500 font-bold tabular-nums w-8 text-right">{loc.pct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
