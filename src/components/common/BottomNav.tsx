import React from 'react';
import { useSocial } from '../../context/SocialContext';
import { Home, Compass, Plus, Clapperboard, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { 
    activeScreen, 
    setActiveScreen, 
    setIsCreatePostOpen, 
    currentUser, 
    viewingUserId, 
    backFromUserProfile 
  } = useSocial();

  const handleNav = (screen: any) => {
    if (viewingUserId) backFromUserProfile();
    setActiveScreen(screen);
  };

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {/* Home */}
        <button
          onClick={() => handleNav('home')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
            activeScreen === 'home' && !viewingUserId ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Home feed"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Home</span>
        </button>

        {/* Explore */}
        <button
          onClick={() => handleNav('search')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
            activeScreen === 'search' && !viewingUserId ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Explore and search"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Explore</span>
        </button>

        {/* Center Qevora Action Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="w-11 h-11 rounded-2xl overflow-hidden shadow-md shadow-blue-500/30 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center bg-black ring-2 ring-blue-500/40"
            aria-label="Create new post with Qevora"
          >
            <img
              src="/qevora-logo.png"
              alt="Q"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </button>
        </div>

        {/* Clips */}
        <button
          onClick={() => handleNav('clips')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
            activeScreen === 'clips' && !viewingUserId ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Short video clips"
        >
          <Clapperboard className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Clips</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => handleNav('profile')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
            activeScreen === 'profile' && !viewingUserId ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="My profile"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className={`w-5 h-5 rounded-full object-cover ring-2 ${
                activeScreen === 'profile' && !viewingUserId ? 'ring-blue-600' : 'ring-transparent'
              }`}
            />
          </div>
          <span className="text-[10px] font-semibold mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};
