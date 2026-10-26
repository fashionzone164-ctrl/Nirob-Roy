import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  AtSign, 
  CheckCheck, 
  Bell,
  Sparkles 
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markAllNotificationsAsRead, 
    markNotificationRead, 
    openUserProfile,
    setActiveScreen
  } = useSocial();

  const [activeTab, setActiveTab] = useState<'all' | 'mentions' | 'likes' | 'follows'>('all');

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'mentions') return item.type === 'mention';
    if (activeTab === 'likes') return item.type === 'like';
    if (activeTab === 'follows') return item.type === 'follow';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-emerald-500" />;
      case 'mention':
        return <AtSign className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  const getNotificationText = (item: any) => {
    switch (item.type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return 'commented on your post';
      case 'follow':
        return 'started following you';
      case 'mention':
        return 'mentioned you in a post';
      default:
        return 'interacted with your content';
    }
  };

  const handleClick = (item: any) => {
    markNotificationRead(item.id);
    if (item.type === 'follow') {
      openUserProfile(item.user.id);
    } else {
      setActiveScreen('home');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-24 md:pb-8">
      {/* Header & Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Notifications</h2>
            <span className="text-xs text-slate-400 font-medium">Activity</span>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'mentions', 'likes', 'follows'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item)}
              className={`p-4 flex items-start gap-3.5 cursor-pointer transition-colors ${
                !item.isRead ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50'
              }`}
            >
              {/* Type Badge Icon */}
              <div className="relative shrink-0">
                <img
                  src={item.user.avatar}
                  alt={item.user.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                  {getIcon(item.type)}
                </div>
              </div>

              {/* Notification Content */}
              <div className="flex-1 min-w-0 text-xs leading-relaxed">
                <p className="text-slate-800">
                  <span className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    {item.user.name}
                  </span>{' '}
                  {getNotificationText(item)}
                </p>

                {item.postSnippet && (
                  <p className="text-slate-500 font-medium mt-1 truncate italic">
                    "{item.postSnippet}"
                  </p>
                )}

                <span className="text-[10px] text-slate-400 mt-1 block">
                  {item.createdAt}
                </span>
              </div>

              {!item.isRead && (
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2" />
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No notifications here</p>
            <p className="text-xs text-slate-400 mt-1">When someone interacts with you, you'll see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
