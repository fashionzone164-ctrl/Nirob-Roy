import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { 
  Radio, 
  Users, 
  Send, 
  Heart, 
  Sparkles, 
  Calendar, 
  Video, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  AlertCircle,
  Pin,
  X,
  Play
} from 'lucide-react';

export const LiveStreamingView: React.FC = () => {
  const { 
    liveStreams, 
    activeLiveStreamId, 
    joinLiveStream, 
    leaveLiveStream, 
    sendLiveChatMessage, 
    startLiveStream, 
    endLiveStream, 
    currentUser, 
    addToast 
  } = useSocial();

  const [chatInput, setChatInput] = useState('');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Creative & Design');
  const [showStudioModal, setShowStudioModal] = useState(false);

  const activeStream = liveStreams.find((ls) => ls.id === activeLiveStreamId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeLiveStreamId) return;
    sendLiveChatMessage(activeLiveStreamId, chatInput);
    setChatInput('');
  };

  const handleStartBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    startLiveStream(newTitle.trim(), newCategory);
    setShowStudioModal(false);
    setNewTitle('');
  };

  const handleHeartReaction = () => {
    addToast('Sent ❤️ to stream', 'info');
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-24 md:pb-8 space-y-4">
      {/* Disclaimer / Demo Notice */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1 leading-relaxed">
          <span className="font-bold">Live Streaming Prototype Notice:</span> This interface models Qevora's real-time live video and audience chat workflow. Real multi-peer video streaming requires configuring an external provider (such as WebRTC SFU, Agora, LiveKit, or Amazon IVS) and dedicated credentials. No live transmission is broadcast to external servers.
        </div>
      </div>

      {/* Active Stream Viewer (If user has joined a stream) */}
      {activeStream ? (
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col lg:flex-row h-[78vh]">
          {/* Main Video Screen */}
          <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
            <img
              src={activeStream.coverImage || '/src/assets/images/post_aerial_coast_1792946122681.jpg'}
              alt={activeStream.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

            {/* Top Bar with Live Tag & Viewer Count */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 animate-pulse shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  Live
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span className="tabular-nums">{activeStream.viewerCount.toLocaleString()}</span>
                </span>
              </div>

              <button
                onClick={leaveLiveStream}
                className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
                aria-label="Exit live stream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Stream Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between">
              <div className="space-y-1 max-w-md">
                <div className="flex items-center gap-2">
                  <img
                    src={activeStream.hostUser.avatar}
                    alt={activeStream.hostUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white"
                  />
                  <div>
                    <p className="text-xs font-bold text-white drop-shadow">{activeStream.hostUser.name}</p>
                    <p className="text-[10px] text-blue-300 font-semibold">{activeStream.category}</p>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white drop-shadow line-clamp-2">
                  {activeStream.title}
                </h3>
              </div>

              {/* Host Controls */}
              {activeStream.hostUser.id === currentUser.id && (
                <button
                  onClick={() => endLiveStream(activeStream.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg"
                >
                  End Broadcast
                </button>
              )}
            </div>
          </div>

          {/* Right Live Chat Stream */}
          <div className="w-full lg:w-80 bg-slate-950 flex flex-col border-t lg:border-t-0 lg:border-l border-slate-800">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-bold tracking-tight">Live Chat</h4>
              </div>
              <span className="text-[10px] text-slate-400">Moderated</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {activeStream.chatMessages.map((msg) => (
                <div key={msg.id} className="text-xs leading-relaxed flex items-start gap-2">
                  <img
                    src={msg.user.avatar}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-slate-300 mr-1.5">
                      {msg.user.name.split(' ')[0]}:
                    </span>
                    <span className="text-slate-100">{msg.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-slate-800 bg-slate-900/50 flex items-center gap-2">
              <form onSubmit={handleSendMessage} className="flex-1 relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Say something live..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-3 pr-8 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-blue-400 disabled:opacity-30 p-1"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              <button
                onClick={handleHeartReaction}
                className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors"
                title="Send Heart"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Broadcast Launch & Scheduled Streams Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Go Live Studio CTA */}
        <div className="md:col-span-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-5 text-white flex flex-col justify-between shadow-md">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-3">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-extrabold mb-1">Host a Live Broadcast</h3>
            <p className="text-xs text-blue-100 leading-relaxed mb-4">
              Share real-time discussions, tutorials, or behind-the-scenes streams with your Qevora audience.
            </p>
          </div>

          <button
            onClick={() => setShowStudioModal(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 transition-colors shadow-sm text-center"
          >
            Start Broadcast Studio
          </button>
        </div>

        {/* Live and Scheduled Streams List */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Broadcasts & Scheduled Sessions</span>
            </h3>
            <span className="text-xs text-slate-400">Qevora Live Hub</span>
          </div>

          <div className="space-y-3">
            {liveStreams.map((stream) => (
              <div
                key={stream.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={stream.hostUser.avatar}
                      alt={stream.hostUser.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-200"
                    />
                    {stream.isLive && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-rose-600 rounded-full border-2 border-white animate-pulse" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900 truncate">{stream.title}</p>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      Hosted by {stream.hostUser.name} · {stream.category}
                    </p>
                    {stream.scheduledFor && (
                      <p className="text-[10px] text-blue-600 font-semibold flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{stream.scheduledFor}</span>
                      </p>
                    )}
                  </div>
                </div>

                {stream.isLive ? (
                  <button
                    onClick={() => joinLiveStream(stream.id)}
                    className="min-h-[36px] px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Join Live</span>
                  </button>
                ) : (
                  <button
                    onClick={() => addToast(`Reminder set for "${stream.title}"`, 'info')}
                    className="min-h-[36px] px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold shrink-0 transition-colors"
                  >
                    Notify Me
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Broadcast Studio Modal */}
      {showStudioModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Broadcast Setup Studio</h3>
              <button
                onClick={() => setShowStudioModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStartBroadcast} className="p-5 space-y-4">
              {/* Camera Preview Simulation */}
              <div className="relative h-44 rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-white overflow-hidden">
                <Video className="w-10 h-10 text-slate-500 mb-2" />
                <p className="text-xs font-medium text-slate-300">Camera Preview Ready</p>
                <div className="absolute bottom-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCameraOn(!isCameraOn)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCameraOn ? 'bg-white/20 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {isCameraOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isMicOn ? 'bg-white/20 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Broadcast Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Creative Review & Live Q&A"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Creative & Design">Creative & Design</option>
                  <option value="Photography & Drone">Photography & Drone</option>
                  <option value="Architecture & Living">Architecture & Living</option>
                  <option value="Tech & Engineering">Tech & Engineering</option>
                  <option value="Community Hangout">Community Hangout</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowStudioModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  Launch Live Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
