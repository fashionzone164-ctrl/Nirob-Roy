import React from 'react';
import { useSocial } from '../../context/SocialContext';
import { QevoraLogo } from './QevoraLogo';
import { Bell, MessageSquare, ShieldCheck, LogIn, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeScreen, 
    setActiveScreen, 
    unreadNotificationsCount, 
    unreadMessagesCount,
    viewingUserId,
    backFromUserProfile,
    openAuthModal,
    setShowSplash,
    currentUser,
    setIsAdminPortalMode
  } = useSocial();

  const getScreenTitle = () => {
    if (viewingUserId) return 'Profile';
    switch (activeScreen) {
      case 'home': return 'Home';
      case 'search': return 'Explore';
      case 'clips': return 'Clips';
      case 'live': return 'Live Stream';
      case 'messages': return 'Messages';
      case 'notifications': return 'Notifications';
      case 'profile': return 'My Profile';
      case 'admin': return currentUser.role === 'admin' ? 'Admin Moderation' : 'Home';
      default: return 'Qevora';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Demo status banner */}
      <div className="bg-slate-100/90 text-slate-600 text-[11px] font-medium py-1 px-4 flex items-center justify-between border-b border-slate-200/60">
        <div className="flex items-center gap-1.5 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate">Demo Mode · Client-side state only · No server credentials</span>
        </div>
        <button
          onClick={() => setShowSplash(true)}
          className="shrink-0 text-blue-600 hover:text-blue-800 font-semibold tracking-tight text-[10px] uppercase flex items-center gap-1 cursor-pointer"
          title="Preview Splash Screen"
        >
          <Sparkles className="w-3 h-3" />
          <span>Splash Screen</span>
        </button>
      </div>

      {/* Main Top Bar */}
      <div className="flex items-center justify-between px-3 sm:px-6 h-14 max-w-7xl mx-auto">
        {/* Left: Official Qevora Brand Logo Artwork */}
        <div className="flex items-center gap-3">
          {viewingUserId ? (
            <button
              onClick={backFromUserProfile}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
            >
              <span className="text-base font-bold">←</span> Back
            </button>
          ) : (
            <button
              onClick={() => setActiveScreen('home')}
              className="focus:outline-none"
              aria-label="Qevora Home"
            >
              <QevoraLogo variant="header" />
            </button>
          )}

          {/* Current view indicator on mobile */}
          <span className="md:hidden text-xs font-semibold text-slate-400 pl-1 border-l border-slate-200">
            {getScreenTitle()}
          </span>
        </div>

        {/* Right contextual shortcuts */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Admin Web App Switcher for Authorized Admin only */}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setIsAdminPortalMode(true)}
              className="min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border border-slate-800"
              title="Open Qevora Admin Web Control Center"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Admin Web App</span>
              <span className="sm:hidden text-[11px]">Admin</span>
            </button>
          )}

          {/* Notifications shortcut */}
          <button
            onClick={() => setActiveScreen('notifications')}
            className={`relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors ${
              activeScreen === 'notifications'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Messages shortcut */}
          <button
            onClick={() => setActiveScreen('messages')}
            className={`relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors ${
              activeScreen === 'messages'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            aria-label="View direct messages"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Login / Sign Up Trigger */}
          <button
            onClick={() => openAuthModal('login')}
            className="min-h-[40px] px-3 py-1.5 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Open Login & Signup"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In / Switch</span>
          </button>
        </div>
      </div>
    </header>
  );
};
