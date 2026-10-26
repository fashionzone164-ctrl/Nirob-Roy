/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SocialProvider, useSocial } from './context/SocialContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { RightSidebar } from './components/common/RightSidebar';
import { BottomNav } from './components/common/BottomNav';
import { ToastContainer } from './components/common/Toast';
import { SplashScreen } from './components/common/SplashScreen';

import { HomeFeed } from './components/feed/HomeFeed';
import { SearchView } from './components/search/SearchView';
import { ClipsFeed } from './components/clips/ClipsFeed';
import { LiveStreamingView } from './components/live/LiveStreamingView';
import { ChatView } from './components/chat/ChatView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { ProfileView } from './components/profile/ProfileView';
import { AdminPortalView } from './components/admin/AdminPortalView';

import { CreatePostModal } from './components/modals/CreatePostModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { StoryViewerModal } from './components/stories/StoryViewerModal';
import { StoryViewersModal } from './components/stories/StoryViewersModal';
import { ReportModal } from './components/modals/ReportModal';
import { ShareModal } from './components/modals/ShareModal';
import { AuthModal } from './components/auth/AuthModal';
import { SettingsModal } from './components/profile/SettingsModal';
import { FollowersModal } from './components/profile/FollowersModal';
import { CreateClipModal } from './components/clips/CreateClipModal';

const MainContent: React.FC = () => {
  const { activeScreen, viewingUserId, currentUser } = useSocial();

  // If viewing an external user profile, always show the profile view
  if (viewingUserId) {
    return <ProfileView />;
  }

  switch (activeScreen) {
    case 'home':
      return <HomeFeed />;
    case 'search':
      return <SearchView />;
    case 'clips':
      return <ClipsFeed />;
    case 'live':
      return <LiveStreamingView />;
    case 'messages':
      return <ChatView />;
    case 'notifications':
      return <NotificationsView />;
    case 'profile':
      return <ProfileView />;
    case 'admin':
      return currentUser.role === 'admin' ? <AdminPortalView /> : <HomeFeed />;
    default:
      return <HomeFeed />;
  }
};

const AppShell: React.FC = () => {
  const { 
    currentUser,
    isAuthModalOpen, 
    closeAuthModal, 
    authMode, 
    showSplash, 
    setShowSplash,
    isCreateClipOpen,
    setIsCreateClipOpen,
    isStoryViewersOpen,
    setIsStoryViewersOpen,
    activeStoryIndex,
    isAdminPortalMode,
    systemNotice,
    setSystemNotice,
  } = useSocial();

  // Show splash on initial launch
  const [initialSplash, setInitialSplash] = useState(true);

  // If in Standalone Admin Web Portal mode, render full-screen Admin Control Web App ONLY for admin
  if (isAdminPortalMode && currentUser.role === 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <AdminPortalView />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111827] flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Splash Screen */}
      {(initialSplash || showSplash) && (
        <SplashScreen
          minDurationMs={1200}
          onComplete={() => {
            setInitialSplash(false);
            setShowSplash(false);
          }}
        />
      )}

      {/* Sticky Top App Bar */}
      <Header />

      {/* Global System Announcement Banner (Admin Broadcast) */}
      {systemNotice && systemNotice.active && (
        <div
          className={`w-full py-2.5 px-4 text-xs font-semibold flex items-center justify-between border-b transition-all ${
            systemNotice.type === 'alert'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : systemNotice.type === 'warning'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : systemNotice.type === 'maintenance'
              ? 'bg-purple-50 text-purple-800 border-purple-200'
              : 'bg-blue-50 text-blue-900 border-blue-200'
          }`}
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-white/70 shadow-xs shrink-0">
                {systemNotice.type}
              </span>
              <p className="truncate text-xs">{systemNotice.message}</p>
            </div>
            <button
              onClick={() => setSystemNotice(null)}
              className="text-[11px] font-bold opacity-70 hover:opacity-100 uppercase tracking-wider shrink-0 cursor-pointer ml-2"
              title="Dismiss announcement banner"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Responsive Multi-column Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex justify-center px-2 sm:px-4 lg:px-6">
        {/* Left Desktop Navigation Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 max-w-2xl min-w-0 pt-4 px-1 sm:px-3">
          <MainContent />
        </main>

        {/* Right Desktop Discover Sidebar */}
        <RightSidebar />
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNav />

      {/* Global Modals & Overlays */}
      <CreatePostModal />
      <CreateClipModal
        isOpen={isCreateClipOpen}
        onClose={() => setIsCreateClipOpen(false)}
      />
      <EditProfileModal />
      <StoryViewerModal />
      <StoryViewersModal
        isOpen={isStoryViewersOpen}
        onClose={() => setIsStoryViewersOpen(false)}
        storyIndex={activeStoryIndex}
      />
      <SettingsModal />
      <FollowersModal />
      <ReportModal />
      <ShareModal />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <SocialProvider>
      <AppShell />
    </SocialProvider>
  );
}
