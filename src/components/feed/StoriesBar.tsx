import React, { useRef } from 'react';
import { useSocial } from '../../context/SocialContext';
import { Plus, Radio } from 'lucide-react';

export const StoriesBar: React.FC = () => {
  const { 
    stories, 
    openStoryViewer, 
    currentUser, 
    addStory,
    liveStreams,
    joinLiveStream,
    setActiveScreen
  } = useSocial();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeLives = liveStreams.filter((ls) => ls.isLive);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      addStory(fakeUrl, 'My story');
    }
  };

  const handleOpenLive = (streamId: string) => {
    joinLiveStream(streamId);
    setActiveScreen('live');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
        {/* Active Live Streams */}
        {activeLives.map((stream) => (
          <button
            key={stream.id}
            onClick={() => handleOpenLive(stream.id)}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            aria-label={`Watch live stream by ${stream.hostUser.name}`}
          >
            <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 animate-pulse">
              <div className="w-full h-full rounded-full p-0.5 bg-white">
                <img
                  src={stream.hostUser.avatar}
                  alt={stream.hostUser.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 bg-rose-600 text-white text-[9px] font-extrabold uppercase rounded-full shadow-xs tracking-wider">
                Live
              </span>
            </div>
            <span className="text-xs font-bold text-slate-900 truncate max-w-[68px]">
              {stream.hostUser.name.split(' ')[0]}
            </span>
          </button>
        ))}
        {/* Your Story (+) */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative w-16 h-16 rounded-full p-0.5 border-2 border-dashed border-blue-400 group-hover:border-blue-600 transition-colors flex items-center justify-center bg-slate-50"
            aria-label="Add to your story"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-full h-full rounded-full object-cover group-hover:scale-95 transition-transform"
            />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </button>
          <span className="text-xs font-semibold text-slate-700 truncate max-w-[68px]">
            Your Story
          </span>
        </div>

        {/* Stories from others */}
        {stories.map((story, index) => {
          return (
            <button
              key={story.id}
              onClick={() => openStoryViewer(index)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
              aria-label={`View story by ${story.user.name}`}
            >
              <div
                className={`w-16 h-16 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                  story.isViewed
                    ? 'ring-2 ring-slate-300'
                    : 'bg-gradient-to-tr from-blue-600 via-sky-400 to-indigo-500'
                }`}
              >
                <div className="w-full h-full rounded-full p-0.5 bg-white">
                  <img
                    src={story.user.avatar}
                    alt={story.user.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-700 truncate max-w-[68px]">
                {story.user.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
