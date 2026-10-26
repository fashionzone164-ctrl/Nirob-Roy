import React, { useState, useRef, useEffect } from 'react';
import { useSocial } from '../../context/SocialContext';
import { 
  Send, 
  Image as ImageIcon, 
  Mic, 
  ArrowLeft, 
  Search, 
  CheckCheck, 
  Sparkles,
  Phone,
  Video,
  Info,
  Users,
  MoreVertical,
  VolumeX,
  Volume2,
  Flag,
  UserX,
  Plus,
  X
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    messages, 
    sendMessage, 
    addReaction,
    currentUser,
    users,
    openUserProfile,
    createGroupChat,
    acceptMessageRequest,
    declineMessageRequest,
    toggleMuteConversation,
    openReportModal,
    blockUser,
    addToast
  } = useSocial();

  const [inputText, setInputText] = useState('');
  const [chatSearch, setChatSearch] = useState('');
  const [chatFolder, setChatFolder] = useState<'primary' | 'general' | 'requests'>('primary');
  const [isRecordingMock, setIsRecordingMock] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [groupNameInput, setGroupNameInput] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const currentMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  // Filter conversations by folder & search
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.isGroup 
      ? (c.groupName || '').toLowerCase().includes(chatSearch.toLowerCase())
      : c.participant.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
        c.participant.handle.toLowerCase().includes(chatSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (chatFolder === 'requests') return Boolean(c.isRequest);
    if (chatFolder === 'general') return c.isGroup;
    return !c.isRequest && !c.isGroup;
  });

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, activeConversationId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationId) return;
    sendMessage(activeConversationId, inputText);
    setInputText('');
  };

  const handleImageSend = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeConversationId) {
      const fakeUrl = URL.createObjectURL(file);
      sendMessage(activeConversationId, 'Sent an image attachment', fakeUrl);
    }
  };

  const handleVoiceNoteMock = () => {
    if (!activeConversationId) return;
    setIsRecordingMock(true);
    addToast('Recording voice note...', 'info');
    setTimeout(() => {
      setIsRecordingMock(false);
      sendMessage(activeConversationId, '🎙️ Voice note', undefined, '0:14');
      addToast('Voice message sent', 'success');
    }, 1500);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupNameInput.trim() || selectedGroupMembers.length === 0) return;
    const memberUsers = users.filter((u) => selectedGroupMembers.includes(u.id));
    createGroupChat(groupNameInput.trim(), memberUsers);
    setShowNewGroupModal(false);
    setGroupNameInput('');
    setSelectedGroupMembers([]);
    setChatFolder('general');
  };

  const reactionEmojis = ['❤️', '🔥', '👏', '😂'];

  return (
    <div className="w-full max-w-5xl mx-auto h-[calc(100vh-8.5rem)] md:h-[calc(100vh-7rem)] bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row pb-16 md:pb-0">
      {/* Left List of Conversations */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col h-full bg-slate-50/50 ${
          activeConversationId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Inbox Header */}
        <div className="p-4 border-b border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Direct Messages</h2>
            <button
              onClick={() => setShowNewGroupModal(true)}
              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center gap-1 text-xs font-bold transition-colors"
              title="Create Group Chat"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Group</span>
            </button>
          </div>

          {/* Search Chats */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              placeholder="Search chats or groups..."
              className="w-full bg-slate-100 border border-transparent rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:bg-white focus:border-slate-300 focus:outline-none transition-all"
            />
          </div>

          {/* Folder Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {(['primary', 'general', 'requests'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setChatFolder(tab)}
                className={`flex-1 py-1.5 text-xs font-bold capitalize rounded-lg transition-all ${
                  chatFolder === tab
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversationId;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-blue-50/80' : 'hover:bg-white'
                  }`}
                >
                  <div className="relative shrink-0">
                    {conv.isGroup ? (
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        <Users className="w-5 h-5" />
                      </div>
                    ) : (
                      <>
                        <img
                          src={conv.participant.avatar}
                          alt={conv.participant.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        {conv.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {conv.isGroup ? conv.groupName : conv.participant.name}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {conv.lastMessage.createdAt}
                      </span>
                    </div>

                    <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                      {conv.lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                      {conv.lastMessage.text}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No conversations in this folder.
            </div>
          )}
        </div>
      </div>

      {/* Right Conversation View */}
      <div
        className={`flex-1 flex flex-col h-full bg-white ${
          !activeConversationId ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activeConv ? (
          <>
            {/* Conversation Header */}
            <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveConversationId(null)}
                  className="md:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                  aria-label="Back to inbox"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2.5 text-left">
                  <div className="relative">
                    {activeConv.isGroup ? (
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                    ) : (
                      <>
                        <img
                          src={activeConv.participant.avatar}
                          alt={activeConv.participant.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        {activeConv.isOnline && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                        )}
                      </>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {activeConv.isGroup ? activeConv.groupName : activeConv.participant.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {activeConv.isGroup 
                        ? `${activeConv.groupMembers?.length || 4} members` 
                        : activeConv.isOnline ? 'Active now' : activeConv.lastActive || 'Offline'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Call & More Options Menu */}
              <div className="flex items-center gap-1 text-slate-500 relative">
                <button
                  onClick={() => toggleMuteConversation(activeConv.id)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  title={activeConv.isMuted ? 'Unmute' : 'Mute'}
                >
                  {activeConv.isMuted ? <VolumeX className="w-4 h-4 text-amber-600" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  title="More actions"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-9 z-30 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 animate-in fade-in duration-100">
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          openReportModal({
                            type: 'user',
                            id: activeConv.participant.id,
                            title: `Conversation with @${activeConv.participant.handle}`,
                          });
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                      >
                        <Flag className="w-4 h-4 text-slate-400" />
                        <span>Report Chat</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          blockUser(activeConv.participant.id, activeConv.participant.handle);
                          setActiveConversationId(null);
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <UserX className="w-4 h-4 text-rose-500" />
                        <span>Block @{activeConv.participant.handle}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Message Request Action Banner */}
            {activeConv.isRequest && (
              <div className="p-3 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">
                  {activeConv.participant.name} wants to connect with you.
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => acceptMessageRequest(activeConv.id)}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => declineMessageRequest(activeConv.id)}
                    className="px-2.5 py-1 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-white"
                  >
                    Decline
                  </button>
                </div>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
              {currentMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[80%] sm:max-w-[70%]">
                      {!isMe && (
                        <img
                          src={activeConv.participant.avatar}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover shrink-0 mb-1"
                        />
                      )}

                      <div className="relative">
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-xs'
                              : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                          }`}
                        >
                          {msg.imageUrl && (
                            <img
                              src={msg.imageUrl}
                              alt="attachment"
                              referrerPolicy="no-referrer"
                              className="rounded-xl max-h-48 w-full object-cover mb-2"
                            />
                          )}
                          {msg.audioDuration && (
                            <div className="flex items-center gap-2 py-1">
                              <span className="text-base">▶️</span>
                              <div className="h-1.5 w-24 bg-white/40 rounded-full" />
                              <span className="text-[10px] font-mono">{msg.audioDuration}</span>
                            </div>
                          )}
                          <p>{msg.text}</p>
                        </div>

                        {/* Reaction Display */}
                        {msg.reaction && (
                          <div
                            className={`absolute -bottom-2 text-xs bg-white rounded-full px-1.5 py-0.5 border border-slate-200 shadow-xs ${
                              isMe ? 'right-2' : 'left-2'
                            }`}
                          >
                            {msg.reaction}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Quick Emoji Bar on Hover */}
                    <div className="flex items-center gap-2 mt-1 px-1">
                      <span className="text-[10px] text-slate-400 tabular-nums">
                        {msg.createdAt}
                      </span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-600" />}

                      {/* Emoji reaction picker on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-white border border-slate-200 rounded-full px-1 py-0.5 shadow-xs">
                        {reactionEmojis.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addReaction(activeConv.id, msg.id, emoji)}
                            className="hover:scale-125 transition-transform text-xs p-0.5"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSend}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-100"
                aria-label="Attach image"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleVoiceNoteMock}
                className={`p-2 transition-colors rounded-lg hover:bg-slate-100 ${
                  isRecordingMock ? 'text-rose-600 animate-pulse' : 'text-slate-400 hover:text-blue-600'
                }`}
                aria-label="Send voice memo"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-100 border border-transparent rounded-xl py-2 px-3 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-slate-300 focus:outline-none transition-all"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-9 h-9 rounded-xl bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">Your Direct Messages</h3>
            <p className="text-xs max-w-xs">
              Select an existing chat or create a group conversation with Qevora creators.
            </p>
          </div>
        )}
      </div>

      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Create Group Chat</h3>
              <button
                onClick={() => setShowNewGroupModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Group Name</label>
                <input
                  type="text"
                  value={groupNameInput}
                  onChange={(e) => setGroupNameInput(e.target.value)}
                  placeholder="e.g. Photography Circle"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Add Members</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {users.filter((u) => u.id !== currentUser.id).map((u) => {
                    const isSelected = selectedGroupMembers.includes(u.id);

                    return (
                      <div
                        key={u.id}
                        onClick={() => {
                          setSelectedGroupMembers(
                            isSelected
                              ? selectedGroupMembers.filter((id) => id !== u.id)
                              : [...selectedGroupMembers, u.id]
                          );
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer text-xs ${
                          isSelected ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={u.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                          <span className="font-bold text-slate-900">{u.name}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="accent-blue-600"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewGroupModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!groupNameInput.trim() || selectedGroupMembers.length === 0}
                  className="px-5 py-2 rounded-xl bg-blue-600 disabled:bg-slate-200 text-white text-xs font-bold shadow-sm"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
