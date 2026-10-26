import React from 'react';
import { useSocial } from '../../context/SocialContext';
import { QevoraLogo } from './QevoraLogo';
import { 
  Home, 
  Compass, 
  Clapperboard, 
  MessageSquare, 
  Bell, 
  User, 
  PlusCircle, 
  Sparkles,
  LogOut,
  Radio,
  ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeScreen, 
    setActiveScreen, 
    unreadNotificationsCount, 
    unreadMessagesCount,
    currentUser,
    reports,
    setIsCreatePostOpen,
    setIsCreateClipOpen,
    viewingUserId,
    backFromUserProfile,
    openAuthModal,
    logout,
    setIsAdminPortalMode
  } = useSocial();

  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  const navItems = [
    { id: 'home', label: 'Home Feed', icon: Home },
    { id: 'search', label: 'Explore & Search', icon: Compass },
    { id: 'clips', label: 'Qevora Clips', icon: Clapperboard },
    { id: 'live', label: 'Live Broadcasts', icon: Radio, isLive: true },
    { id: 'messages', label: 'Direct Messages', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount },
    { id: 'profile', label: 'My Profile', icon: User },
    ...(currentUser.role === 'admin' ? [
      { id: 'admin', label: 'Admin Web Control', icon: ShieldCheck, badge: pendingReportsCount }
    ] : [])
  ];

  const handleNavClick = (id: string) => {
    if (viewingUserId) {
      backFromUserProfile();
    }
    if (id === 'admin') {
      setIsAdminPortalMode(true);
      return;
    }
    setActiveScreen(id as any);
  };

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 h-[calc(100vh-5rem)] sticky top-20 py-4 px-3 border-r border-slate-200 select-none">
      <div className="space-y-5">
        {/* Official Qevora Brand Lockup Card */}
        <div className="px-3 py-2.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-md flex items-center gap-3">
          <QevoraLogo variant="icon" size="sm" className="shrink-0" />
          <div className="min-w-0">
            <h1 className="text-sm font-extrabold tracking-tight text-white truncate">Qevora Network</h1>
            <p className="text-[10px] text-blue-400 font-medium tracking-wide truncate">Connect · Share · Be You</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id && !viewingUserId;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {(item as any).isLive && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-rose-500 text-white tracking-wider animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    Live
                  </span>
                )}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Primary CTA buttons */}
        <div className="pt-1 px-1 space-y-2">
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="w-full h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-500/25 transition-all"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>Create Post</span>
          </button>

          <button
            onClick={() => setIsCreateClipOpen(true)}
            className="w-full h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200/90 active:scale-[0.98] text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all group cursor-pointer"
          >
            <Clapperboard className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
            <span>Upload Reel</span>
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setIsAdminPortalMode(true)}
              className="w-full h-10 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-between transition-all group cursor-pointer border border-slate-800 shadow-sm"
              title="Open Qevora Admin Web Control Center"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="truncate">Admin Web Control</span>
              </div>
              <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                App
              </span>
            </button>
          )}
        </div>
      </div>

      {/* User profile bottom widget & Logout */}
      <div className="pt-3 border-t border-slate-200 space-y-2">
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors">
          <button
            onClick={() => {
              if (viewingUserId) backFromUserProfile();
              setActiveScreen('profile');
            }}
            className="flex items-center gap-2.5 min-w-0 text-left flex-1 group"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-blue-200"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</span>
                {currentUser.verified && (
                  <Sparkles className="w-3 h-3 text-blue-600 shrink-0 fill-blue-600" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate">@{currentUser.handle}</p>
            </div>
          </button>

          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Sign out / Switch account"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
