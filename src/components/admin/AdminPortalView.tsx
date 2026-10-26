import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { QevoraLogo } from '../common/QevoraLogo';
import { User, Post, Clip, LiveStream, PlatformSettings } from '../../types';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Video,
  Radio,
  FileText,
  AlertTriangle,
  Settings,
  Activity,
  Search,
  CheckCircle,
  XCircle,
  Trash2,
  Lock,
  Unlock,
  BadgeCheck,
  Megaphone,
  RefreshCw,
  LogOut,
  ExternalLink,
  Plus,
  Play,
  Eye,
  Sliders,
  Filter,
  Download,
  AlertOctagon,
  Pin,
  Clock,
  Sparkles
} from 'lucide-react';

export const AdminPortalView: React.FC = () => {
  const {
    currentUser,
    users,
    posts,
    clips,
    liveStreams,
    reports,
    resolveReport,
    dismissReport,
    deleteHarmfulPost,
    deleteClip,
    banUser,
    unbanUser,
    toggleUserVerification,
    changeUserRole,
    createNewUser,
    killLiveStream,
    systemNotice,
    setSystemNotice,
    adminSettings,
    updateAdminSettings,
    auditLogs,
    addAuditLog,
    togglePinPost,
    setIsAdminPortalMode,
    setActiveScreen,
    addToast,
    openAuthModal
  } = useSocial();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'content' | 'livestreams' | 'broadcast' | 'reports' | 'settings' | 'audit'
  >('overview');

  // Search & Filter States
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [contentFilterType, setContentFilterType] = useState<'all' | 'posts' | 'reels'>('all');
  const [reportFilterStatus, setReportFilterStatus] = useState<'all' | 'pending' | 'resolved'>('all');

  // Modals / Inputs
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserHandle, setNewUserHandle] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'user' | 'creator' | 'moderator' | 'admin'>('user');

  // Broadcast Announcement State
  const [broadcastMessage, setBroadcastMessage] = useState(systemNotice?.message || '');
  const [broadcastType, setBroadcastType] = useState<'info' | 'warning' | 'alert' | 'maintenance'>(
    systemNotice?.type || 'info'
  );
  const [isBroadcastActive, setIsBroadcastActive] = useState(systemNotice?.active ?? true);

  // Check Admin Authorization strictly for admin
  const hasAdminAccess = currentUser.role === 'admin';

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Access Restricted</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              The Qevora Central Admin Web App is restricted strictly to authorized platform administrators. Log in with the registered admin credentials (<span className="text-blue-400 font-mono">roynirobn@gmail.com</span>) to access this console.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsAdminPortalMode(false);
                setActiveScreen('home');
                openAuthModal('login');
              }}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Sign In with Admin Account
            </button>
            <button
              onClick={() => {
                setIsAdminPortalMode(false);
                setActiveScreen('home');
              }}
              className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Return to Qevora Social App
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.handle.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(userSearchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (userRoleFilter === 'banned') return u.isBanned;
    if (userRoleFilter === 'verified') return u.verified;
    if (userRoleFilter !== 'all') return u.role === userRoleFilter;
    return true;
  });

  // Filtered Reports
  const filteredReports = reports.filter((r) => {
    if (reportFilterStatus === 'all') return true;
    return r.status === reportFilterStatus;
  });

  // Handle Create User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserHandle.trim()) {
      addToast('Name and handle are required', 'warning');
      return;
    }
    createNewUser({
      name: newUserName.trim(),
      handle: newUserHandle.trim(),
      email: newUserEmail.trim() || undefined,
      role: newUserRole,
      verified: newUserRole === 'creator' || newUserRole === 'admin',
    });
    setNewUserName('');
    setNewUserHandle('');
    setNewUserEmail('');
    setShowAddUserModal(false);
  };

  // Handle Save Broadcast Announcement
  const handleSaveBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) {
      addToast('Broadcast message cannot be empty', 'warning');
      return;
    }
    const newNotice = {
      id: `notice_${Date.now()}`,
      active: isBroadcastActive,
      message: broadcastMessage.trim(),
      type: broadcastType,
      publishedAt: 'Active now',
      publishedBy: `${currentUser.handle} (${currentUser.role})`,
    };
    setSystemNotice(newNotice);
    addAuditLog('SYSTEM_BROADCAST', 'Global Alert Banner', 'medium', `Updated notice: "${broadcastMessage.trim()}"`);
    addToast('System broadcast successfully published across Qevora', 'success');
  };

  // Handle Clear Broadcast
  const handleClearBroadcast = () => {
    setSystemNotice(null);
    setBroadcastMessage('');
    setIsBroadcastActive(false);
    addAuditLog('SYSTEM_BROADCAST_CLEARED', 'Global Alert Banner', 'low', 'Retracted active announcement');
    addToast('Global broadcast retracted', 'info');
  };

  // Export Audit Logs as JSON
  const handleExportAuditLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `qevora-audit-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Audit log JSON exported', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Standalone Admin Web Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <QevoraLogo variant="icon" size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-white">
                Qevora <span className="text-blue-500 font-extrabold">Control Web</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">
                SuperAdmin
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Dedicated Platform Administration & Community Governance Center
            </p>
          </div>
        </div>

        {/* Header Right Status & Switcher */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium text-[11px]">Engine: Healthy</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-300 text-[11px]">Logged in as @{currentUser.handle}</span>
          </div>

          {/* Master Switch to Public Social Web App */}
          <button
            onClick={() => {
              setIsAdminPortalMode(false);
              setActiveScreen('home');
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-900/20 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Launch User App</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar Navigation */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Admin Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900/90 border-r border-slate-800/80 p-3 sm:p-4 shrink-0 flex md:flex-col justify-between overflow-x-auto md:overflow-x-visible">
          <div className="flex md:flex-col gap-1 w-full">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 hidden md:block">
              Navigation
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span>Platform Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>User Accounts</span>
              <span className="ml-auto px-1.5 py-0.2 rounded-md bg-slate-800 text-[10px] text-slate-300 font-mono">
                {users.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Video className="w-4 h-4 shrink-0" />
              <span>Posts & Reels</span>
              <span className="ml-auto px-1.5 py-0.2 rounded-md bg-slate-800 text-[10px] text-slate-300 font-mono">
                {posts.length + clips.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('livestreams')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'livestreams'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Radio className="w-4 h-4 shrink-0" />
              <span>Live Broadcasts</span>
              <span className="ml-auto px-1.5 py-0.2 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-mono">
                {liveStreams.filter((s) => s.isLive).length} Live
              </span>
            </button>

            <button
              onClick={() => setActiveTab('broadcast')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'broadcast'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Megaphone className="w-4 h-4 shrink-0" />
              <span>Global Broadcast</span>
              {systemNotice?.active && (
                <span className="w-2 h-2 rounded-full bg-amber-400 ml-auto" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Incident Queue</span>
              {reports.filter((r) => r.status === 'pending').length > 0 && (
                <span className="ml-auto px-1.5 py-0.2 rounded-md bg-rose-600 text-white text-[10px] font-mono">
                  {reports.filter((r) => r.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Platform Config</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>Audit Trail</span>
            </button>
          </div>

          {/* Bottom Security Info Card */}
          <div className="hidden md:block mt-6 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero-Trust Rules Active</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Granular permission validation guarding users, posts, and roles.
            </p>
          </div>
        </aside>

        {/* Admin Main Work Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-7xl">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 border border-blue-500/20 p-6 sm:p-8">
                <div className="relative z-10 max-w-2xl space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Executive Command Station</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Welcome to Qevora Central Control
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    You have master administrative authority over users, photo posts, short video reels, live streaming rooms, and platform-wide communications.
                  </p>
                </div>
              </div>

              {/* Key KPI Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Accounts</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-black text-white tabular-nums">{users.length}</p>
                  <p className="text-[11px] text-slate-400">
                    {users.filter((u) => u.verified).length} verified · {users.filter((u) => u.isBanned).length} suspended
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Published Content</span>
                    <Video className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-2xl font-black text-white tabular-nums">{posts.length + clips.length}</p>
                  <p className="text-[11px] text-slate-400">
                    {posts.length} posts · {clips.length} reels
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Active Broadcasts</span>
                    <Radio className="w-4 h-4 text-rose-400" />
                  </div>
                  <p className="text-2xl font-black text-white tabular-nums">
                    {liveStreams.filter((s) => s.isLive).length}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {liveStreams.reduce((acc, curr) => (curr.isLive ? acc + curr.viewerCount : acc), 0)} live viewers
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Open Incidents</span>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-2xl font-black text-white tabular-nums">
                    {reports.filter((r) => r.status === 'pending').length}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {reports.filter((r) => r.status === 'resolved').length} resolved tickets
                  </p>
                </div>
              </div>

              {/* Quick Actions & Live Stream Emergency Switch */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Broadcast Alert Card */}
                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
                      <h3 className="text-sm font-bold text-white">Live Broadcast Command</h3>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {liveStreams.filter((s) => s.isLive).length} Active Streams
                    </span>
                  </div>

                  {liveStreams.filter((s) => s.isLive).length > 0 ? (
                    <div className="space-y-3">
                      {liveStreams
                        .filter((s) => s.isLive)
                        .map((stream) => (
                          <div
                            key={stream.id}
                            className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/80 flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{stream.title}</p>
                              <p className="text-[11px] text-slate-400 truncate">
                                Broadcaster: @{stream.hostUser.handle} · {stream.viewerCount} watching
                              </p>
                            </div>
                            <button
                              onClick={() => killLiveStream(stream.id)}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                            >
                              <AlertOctagon className="w-3.5 h-3.5" />
                              <span>Force Kill</span>
                            </button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center rounded-2xl bg-slate-800/30 border border-slate-800 text-slate-500 text-xs">
                      No live broadcasts are currently active.
                    </div>
                  )}
                </div>

                {/* System Notice Status Card */}
                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Megaphone className="w-5 h-5 text-blue-400" />
                      <h3 className="text-sm font-bold text-white">Global App Broadcast</h3>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        systemNotice?.active
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {systemNotice?.active ? 'Broadcasting Active' : 'Idle / Inactive'}
                    </span>
                  </div>

                  {systemNotice?.active ? (
                    <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-blue-300">
                        <span className="uppercase tracking-wider text-[10px]">Type: {systemNotice.type}</span>
                        <span className="text-slate-400 text-[10px]">{systemNotice.publishedAt}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        "{systemNotice.message}"
                      </p>
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={() => setActiveTab('broadcast')}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Edit Broadcast
                        </button>
                        <button
                          onClick={handleClearBroadcast}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Retract
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center rounded-2xl bg-slate-800/30 border border-slate-800 text-slate-500 text-xs space-y-3">
                      <p>No global broadcast banner is currently displayed to users.</p>
                      <button
                        onClick={() => setActiveTab('broadcast')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Create Broadcast Banner
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Audit Activities Snapshot */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <h3 className="text-sm font-bold text-white">Recent Security Audit Events</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                  >
                    View All ({auditLogs.length}) →
                  </button>
                </div>

                <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-2xl overflow-hidden">
                  {auditLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-400">{log.action}</span>
                          <span className="text-slate-400">target: {log.target}</span>
                        </div>
                        {log.details && <p className="text-[11px] text-slate-400 truncate">{log.details}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            log.severity === 'critical'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : log.severity === 'high'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {log.severity}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-0.5">{log.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">User Account Control</h2>
                  <p className="text-xs text-slate-400">
                    Manage permissions, toggle verification blue checkmarks, change user roles, or suspend abusive accounts.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-blue-900/20 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register User</span>
                </button>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    placeholder="Search by name, handle (@username), or email..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {(['all', 'user', 'creator', 'moderator', 'admin', 'verified', 'banned'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setUserRoleFilter(r)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl capitalize transition-all cursor-pointer shrink-0 ${
                        userRoleFilter === r
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Joined</th>
                        <th className="py-3 px-4">Stats</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-700"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-white truncate">{user.name}</span>
                                  {user.verified && (
                                    <BadgeCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                  )}
                                </div>
                                <span className="text-slate-400 text-[11px]">@{user.handle}</span>
                              </div>
                            </div>
                          </td>

                          {/* Role Selector */}
                          <td className="py-3 px-4">
                            <select
                              value={user.role || 'user'}
                              onChange={(e) =>
                                changeUserRole(
                                  user.id,
                                  e.target.value as 'user' | 'creator' | 'moderator' | 'admin'
                                )
                              }
                              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                              <option value="user">User</option>
                              <option value="creator">Creator</option>
                              <option value="moderator">Moderator</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>

                          {/* Verification & Ban Status */}
                          <td className="py-3 px-4">
                            {user.isBanned ? (
                              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                                Suspended
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                                Active
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-slate-400 text-[11px]">
                            {user.joinedDate}
                          </td>

                          <td className="py-3 px-4 text-slate-300 text-[11px]">
                            {user.postsCount} posts · {user.followersCount} followers
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Toggle Verified */}
                              <button
                                onClick={() => toggleUserVerification(user.id)}
                                title={user.verified ? 'Remove Verification' : 'Verify Account'}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  user.verified
                                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 hover:bg-blue-500/30'
                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                                }`}
                              >
                                <BadgeCheck className="w-3.5 h-3.5" />
                              </button>

                              {/* Ban / Unban Toggle */}
                              {user.isBanned ? (
                                <button
                                  onClick={() => unbanUser(user.id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Unlock className="w-3 h-3" />
                                  <span>Unsuspend</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => banUser(user.id)}
                                  disabled={user.id === currentUser.id}
                                  className="px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <Lock className="w-3 h-3" />
                                  <span>Suspend</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add User Modal */}
              {showAddUserModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <h3 className="text-base font-bold text-white">Register New Platform Member</h3>
                      <button
                        onClick={() => setShowAddUserModal(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleCreateUser} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Full Display Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          placeholder="e.g. Jordan Lee"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Handle (@username)
                        </label>
                        <input
                          type="text"
                          required
                          value={newUserHandle}
                          onChange={(e) => setNewUserHandle(e.target.value)}
                          placeholder="e.g. jordanlee"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          placeholder="jordan@qevora.network"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Assign Initial Role
                        </label>
                        <select
                          value={newUserRole}
                          onChange={(e) =>
                            setNewUserRole(e.target.value as 'user' | 'creator' | 'moderator' | 'admin')
                          }
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="user">Regular User</option>
                          <option value="creator">Verified Creator</option>
                          <option value="moderator">Community Moderator</option>
                          <option value="admin">System Administrator</option>
                        </select>
                      </div>

                      <div className="pt-3 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddUserModal(false)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Confirm & Create
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONTENT & REELS MODERATION */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Feed Posts & Video Reels Moderation
                  </h2>
                  <p className="text-xs text-slate-400">
                    Purge toxic content, manage pinned announcements, or inspect user captions and media.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
                  {(['all', 'posts', 'reels'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setContentFilterType(t)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${
                        contentFilterType === t
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Standard Posts */}
                {(contentFilterType === 'all' || contentFilterType === 'posts') &&
                  posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-lg"
                    >
                      <div>
                        {/* Media Thumbnail */}
                        {post.mediaUrl && (
                          <div className="w-full h-44 bg-slate-950 overflow-hidden relative">
                            <img
                              src={post.mediaUrl}
                              alt="Post media"
                              className="w-full h-full object-cover"
                            />
                            {post.isPinned && (
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                                <Pin className="w-3 h-3" /> Pinned
                              </span>
                            )}
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-mono">
                              Photo Post
                            </span>
                          </div>
                        )}

                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={post.user.avatar}
                              alt={post.user.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-xs font-bold text-white truncate">
                              @{post.user.handle}
                            </span>
                            <span className="text-[10px] text-slate-500 ml-auto">{post.createdAt}</span>
                          </div>

                          <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                            {post.content}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 font-mono">
                            <span>❤️ {post.likesCount}</span>
                            <span>💬 {post.commentsCount}</span>
                            <span>🔖 {post.bookmarksCount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content Action Controls */}
                      <div className="p-3 bg-slate-800/60 border-t border-slate-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => togglePinPost(post.id)}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                            post.isPinned
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          <Pin className="w-3 h-3" />
                          <span>{post.isPinned ? 'Unpin' : 'Pin'}</span>
                        </button>

                        <button
                          onClick={() => deleteHarmfulPost(post.id)}
                          className="px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Purge</span>
                        </button>
                      </div>
                    </div>
                  ))}

                {/* Reels / Short Clips */}
                {(contentFilterType === 'all' || contentFilterType === 'reels') &&
                  clips.map((clip) => (
                    <div
                      key={clip.id}
                      className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-lg"
                    >
                      <div>
                        {/* Video Preview */}
                        <div className="w-full h-44 bg-slate-950 overflow-hidden relative flex items-center justify-center">
                          {clip.videoUrl.endsWith('.mp4') || clip.videoUrl.startsWith('blob:') ? (
                            <video
                              src={clip.videoUrl}
                              className="w-full h-full object-cover opacity-80"
                              muted
                              loop
                            />
                          ) : (
                            <div className="w-full h-full bg-indigo-950/60 flex items-center justify-center text-indigo-400">
                              <Video className="w-10 h-10" />
                            </div>
                          )}
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-mono">
                            Reel Clip
                          </span>
                        </div>

                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={clip.user.avatar}
                              alt={clip.user.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-xs font-bold text-white truncate">
                              @{clip.user.handle}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {clip.caption}
                          </p>

                          <p className="text-[10px] text-blue-400 font-mono">
                            🎵 {clip.soundTitle}
                          </p>
                        </div>
                      </div>

                      {/* Reel Purge Control */}
                      <div className="p-3 bg-slate-800/60 border-t border-slate-800 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-slate-400">
                          ❤️ {clip.likesCount} · 💬 {clip.commentsCount}
                        </span>

                        <button
                          onClick={() => deleteClip(clip.id)}
                          className="px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Purge Reel</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: LIVE BROADCASTS COMMAND */}
          {activeTab === 'livestreams' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Live Broadcasts Command Center</h2>
                  <p className="text-xs text-slate-400">
                    Monitor active video streams, inspect room moderation, or execute emergency terminations.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={stream.hostUser.avatar}
                          alt={stream.hostUser.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-white">{stream.title}</h3>
                          <p className="text-xs text-slate-400">
                            Host: @{stream.hostUser.handle} · Category: {stream.category}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                          stream.isLive
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {stream.isLive ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            LIVE NOW
                          </>
                        ) : (
                          'SCHEDULED'
                        )}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 text-[11px]">Current Audience:</span>
                        <p className="font-bold text-white text-sm tabular-nums">
                          {stream.viewerCount} concurrent viewers
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px]">Chat Activity:</span>
                        <p className="font-bold text-white text-sm tabular-nums">
                          {stream.chatMessages.length} messages
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      {stream.isLive ? (
                        <button
                          onClick={() => killLiveStream(stream.id)}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-rose-900/20 cursor-pointer"
                        >
                          <AlertOctagon className="w-4 h-4" />
                          <span>Force Kill Broadcast</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Scheduled for later</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GLOBAL SYSTEM BROADCAST */}
          {activeTab === 'broadcast' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Global System Broadcast</h2>
                <p className="text-xs text-slate-400">
                  Publish high-priority announcement banners that will appear at the top of every user's feed across Qevora.
                </p>
              </div>

              <form onSubmit={handleSaveBroadcast} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Severity / Notification Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { type: 'info', label: 'Info (Blue)' },
                      { type: 'warning', label: 'Warning (Amber)' },
                      { type: 'alert', label: 'Critical Alert (Red)' },
                      { type: 'maintenance', label: 'Maintenance (Purple)' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.type}
                        onClick={() => setBroadcastType(item.type as any)}
                        className={`p-2.5 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                          broadcastType === item.type
                            ? 'bg-blue-600/30 border-blue-500 text-white shadow-sm'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Broadcast Message Body
                  </label>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="e.g. Qevora video reels upload is now open to all creators! Tap to share your first clip."
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="broadcastActive"
                    checked={isBroadcastActive}
                    onChange={(e) => setIsBroadcastActive(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-700 cursor-pointer"
                  />
                  <label htmlFor="broadcastActive" className="text-xs font-bold text-slate-200 cursor-pointer">
                    Enable Banner Immediately (Visible to All Users)
                  </label>
                </div>

                {/* Live Preview Box */}
                <div className="pt-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Live Banner Preview (As seen in User App):
                  </span>
                  <div
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                      broadcastType === 'alert'
                        ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                        : broadcastType === 'warning'
                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                        : broadcastType === 'maintenance'
                        ? 'bg-purple-950/40 border-purple-500/40 text-purple-200'
                        : 'bg-blue-950/40 border-blue-500/40 text-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Megaphone className="w-4 h-4 shrink-0" />
                      <p className="text-xs font-medium leading-relaxed truncate">
                        {broadcastMessage || 'Sample broadcast message will appear here...'}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold shrink-0">
                      DISMISS
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleClearBroadcast}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Retract / Turn Off
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-900/20 cursor-pointer"
                  >
                    Save & Dispatch Broadcast
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: INCIDENT REPORTS QUEUE */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Incident Reports Queue</h2>
                  <p className="text-xs text-slate-400">
                    Review and triage user-reported posts, clips, comments, and abusive behaviors.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
                  {(['all', 'pending', 'resolved'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setReportFilterStatus(s)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer ${
                        reportFilterStatus === s
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-slate-800/80 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-blue-400">
                            {report.id}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold uppercase text-slate-300">
                            {report.targetType}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              report.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {report.status}
                          </span>
                        </div>

                        <p className="text-xs font-bold text-white">Reason: {report.reason}</p>
                        {report.details && (
                          <p className="text-xs text-slate-400 italic">"{report.details}"</p>
                        )}
                        <p className="text-[11px] text-slate-500">
                          Target: {report.targetTitle} (ID: {report.targetId}) · Reported by user_{report.reportedBy}
                        </p>
                      </div>

                      {/* Resolution Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {report.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => {
                                if (report.targetType === 'post') {
                                  deleteHarmfulPost(report.targetId);
                                } else if (report.targetType === 'clip') {
                                  deleteClip(report.targetId);
                                }
                                resolveReport(report.id, 'Content removed');
                              }}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Purge Content</span>
                            </button>

                            <button
                              onClick={() => resolveReport(report.id, 'Notice dispatched')}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                              Resolve
                            </button>

                            <button
                              onClick={() => dismissReport(report.id)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                            >
                              Dismiss
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No incident reports match this filter.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: PLATFORM SETTINGS & RULES */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Platform Configuration & Controls</h2>
                <p className="text-xs text-slate-400">
                  Configure feature flags, video upload constraints, and inspect declarative security rules.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
                    Feature Availability Flags
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Allow New Member Registrations</p>
                      <p className="text-[11px] text-slate-400">Allow public visitors to create new accounts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={adminSettings.allowSignups}
                      onChange={(e) => updateAdminSettings({ allowSignups: e.target.checked })}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-700 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Allow Short Video / Reel Uploads</p>
                      <p className="text-[11px] text-slate-400">Enable video transcoding and MP4/WebM uploads</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={adminSettings.allowReelUploads}
                      onChange={(e) => updateAdminSettings({ allowReelUploads: e.target.checked })}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-700 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Allow Live Broadcasting</p>
                      <p className="text-[11px] text-slate-400">Allow creators to launch real-time video sessions</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={adminSettings.allowLiveBroadcasts}
                      onChange={(e) => updateAdminSettings({ allowLiveBroadcasts: e.target.checked })}
                      className="w-5 h-5 rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-700 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Maintenance Mode (Read-Only)</p>
                      <p className="text-[11px] text-slate-400">Disable write operations platform-wide during updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={adminSettings.maintenanceMode}
                      onChange={(e) => updateAdminSettings({ maintenanceMode: e.target.checked })}
                      className="w-5 h-5 rounded text-rose-600 focus:ring-0 bg-slate-800 border-slate-700 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <label className="block text-xs font-bold text-white">
                    Maximum Video Upload File Size Limit
                  </label>
                  <div className="flex items-center gap-2">
                    {[15, 25, 50, 100].map((mb) => (
                      <button
                        key={mb}
                        type="button"
                        onClick={() => updateAdminSettings({ maxUploadSizeMB: mb })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          adminSettings.maxUploadSizeMB === mb
                            ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {mb} MB
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zero-Trust Rules Reference */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Declared Security Rules Status</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Zero-trust declarative access control is defined in <code className="text-blue-300 bg-slate-900 px-1 py-0.5 rounded">firestore.rules</code>. Users can never edit roles, elevate privileges, or write to another user's documents.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Security Audit Log</h2>
                  <p className="text-xs text-slate-400">
                    Tamper-evident record of all administrative commands, suspensions, and content purges.
                  </p>
                </div>

                <button
                  onClick={handleExportAuditLogs}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer self-start sm:self-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>Export JSON</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Admin</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Target</th>
                        <th className="py-3 px-4">Details</th>
                        <th className="py-3 px-4 text-right">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                            {log.timestamp}
                          </td>
                          <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                            @{log.adminHandle}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-blue-400 whitespace-nowrap">
                            {log.action}
                          </td>
                          <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                            {log.target}
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs truncate">
                            {log.details || '-'}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                log.severity === 'critical'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  : log.severity === 'high'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {log.severity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
