import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { X, Copy, Check, Send, MessageCircle } from 'lucide-react';

export const ShareModal: React.FC = () => {
  const { 
    isShareModalOpen, 
    closeShareModal, 
    shareData, 
    conversations, 
    sendMessage, 
    addToast 
  } = useSocial();

  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen || !shareData) return null;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareData.url);
    setCopied(true);
    addToast('Link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToFriend = (convId: string, name: string) => {
    sendMessage(convId, `Shared from Qevora: "${shareData.title}" - ${shareData.url}`);
    addToast(`Sent to ${name} in messages`, 'success');
    closeShareModal();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Share to Friends</h3>
          <button
            onClick={closeShareModal}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            aria-label="Close share dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Send directly to Qevora connections */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-700">Quick Send on Qevora</p>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSendToFriend(conv.id, conv.participant.name)}
                  className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-200 group-hover:ring-blue-500 transition-all">
                    <img
                      src={conv.participant.avatar}
                      alt={conv.participant.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[64px]">
                    {conv.participant.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Copy link input bar */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-slate-700">Share Link</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareData.url}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 truncate focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
