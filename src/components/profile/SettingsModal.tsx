import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { 
  X, 
  Lock, 
  Bell, 
  ShieldAlert, 
  Download, 
  Trash2, 
  Check, 
  Globe, 
  Mail, 
  Eye, 
  Sliders
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { 
    isSettingsModalOpen, 
    setIsSettingsModalOpen, 
    currentUser, 
    updateCurrentUser, 
    exportUserData, 
    deleteAccount,
    addToast
  } = useSocial();

  const [activeTab, setActiveTab] = useState<'privacy' | 'notifications' | 'account'>('privacy');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isSettingsModalOpen) return null;

  const handleTogglePrivate = () => {
    const nextVal = !currentUser.isPrivate;
    updateCurrentUser({ isPrivate: nextVal });
    addToast(nextVal ? 'Account set to Private. New followers require approval.' : 'Account set to Public.', 'info');
  };

  const handleFilterChange = (val: 'standard' | 'less' | 'strict') => {
    updateCurrentUser({ sensitiveContentFilter: val });
    addToast(`Content filter set to ${val}`, 'info');
  };

  const handleNotificationToggle = (key: keyof NonNullable<typeof currentUser.notificationSettings>) => {
    const current = currentUser.notificationSettings || {
      likes: true,
      comments: true,
      follows: true,
      messages: true,
      live: true,
    };
    updateCurrentUser({
      notificationSettings: {
        ...current,
        [key]: !current[key],
      }
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Settings & Privacy</h3>
          </div>
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            aria-label="Close settings dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab strip */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50">
          {(['privacy', 'notifications', 'account'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-bold capitalize transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              {/* Private account toggle */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-slate-700" />
                    <span className="text-xs font-bold text-slate-900">Private Account</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    When active, only users you approve can view your photos, clips, and followers.
                  </p>
                </div>
                <button
                  onClick={handleTogglePrivate}
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                    currentUser.isPrivate ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle private account"
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                      currentUser.isPrivate ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Sensitive content filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Sensitive Content Filter
                </label>
                <div className="space-y-1.5">
                  {(['standard', 'less', 'strict'] as const).map((lvl) => (
                    <label
                      key={lvl}
                      onClick={() => handleFilterChange(lvl)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                        (currentUser.sensitiveContentFilter || 'standard') === lvl
                          ? 'border-blue-500 bg-blue-50/60 text-blue-900'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="capitalize">{lvl} Filter</span>
                      {(currentUser.sensitiveContentFilter || 'standard') === lvl && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                In-App & Push Alerts
              </p>
              {[
                { key: 'likes', label: 'Likes on posts and clips' },
                { key: 'comments', label: 'Comments & threaded replies' },
                { key: 'follows', label: 'New followers & requests' },
                { key: 'messages', label: 'Direct messages' },
                { key: 'live', label: 'Live broadcast notifications' },
              ].map((item) => {
                const isEnabled = currentUser.notificationSettings?.[item.key as keyof typeof currentUser.notificationSettings] ?? true;

                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <span className="text-xs font-semibold text-slate-800">{item.label}</span>
                    <button
                      onClick={() => handleNotificationToggle(item.key as any)}
                      className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${
                        isEnabled ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              {/* Account Data Export */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-slate-900">Download Account Data</h4>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Export an offline JSON archive containing your Qevora profile, posts, saved collections, and drafts.
                </p>
                <button
                  onClick={exportUserData}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors shadow-xs"
                >
                  Download Data Package
                </button>
              </div>

              {/* Danger Zone: Account Deletion */}
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                <div className="flex items-center gap-2 text-rose-700">
                  <Trash2 className="w-4 h-4" />
                  <h4 className="text-xs font-bold">Delete Qevora Account</h4>
                </div>
                <p className="text-xs text-rose-800/80 leading-normal">
                  Permanently erase your profile, published posts, and saved collections. This action cannot be reversed.
                </p>

                {showDeleteConfirm ? (
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setIsSettingsModalOpen(false);
                        deleteAccount();
                      }}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                    >
                      Yes, Delete My Account
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs"
                  >
                    Start Deletion Workflow
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
