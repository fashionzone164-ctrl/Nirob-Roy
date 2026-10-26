import React, { useState, useRef, useEffect } from 'react';
import { useSocial } from '../../context/SocialContext';
import { 
  X, 
  Clapperboard, 
  Music, 
  AlertCircle, 
  UploadCloud, 
  Sparkles, 
  Film, 
  Check, 
  Sliders, 
  Clock, 
  FileVideo,
  Play,
  RotateCcw
} from 'lucide-react';

interface CreateClipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PresetClip {
  title: string;
  category: string;
  videoUrl: string;
  defaultCaption: string;
  defaultSound: string;
  tags: string[];
}

const PRESET_CLIPS: PresetClip[] = [
  {
    title: 'Neon Shibuya Walk',
    category: 'Urban',
    videoUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1080&auto=format&fit=crop&q=80',
    defaultCaption: 'Night walks under rainy Shibuya neon reflections 🌧️✨ #tokyo #cyberpunk #neon',
    defaultSound: 'Midnight Lo-Fi · Tokyo Chill',
    tags: ['tokyo', 'neon', 'cyberpunk', 'reels']
  },
  {
    title: 'Street Skate Kickflip',
    category: 'Action',
    videoUrl: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=1080&auto=format&fit=crop&q=80',
    defaultCaption: 'Landed the catch cleanly after 20 attempts! Never stop pushing 🛹🔥',
    defaultSound: 'Raw Concrete · Skateboard Sounds',
    tags: ['skate', 'action', 'trick', 'street']
  },
  {
    title: 'Golden Hour Coastline',
    category: 'Cinematic',
    videoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1080&auto=format&fit=crop&q=80',
    defaultCaption: 'Golden hour waves on the Pacific coast. Sound on for pure relaxation 🌊🌅',
    defaultSound: 'Pacific Tides · Ambient Ocean',
    tags: ['ocean', 'sunset', 'cinematic', 'nature']
  },
  {
    title: 'Coffee Roasting Art',
    category: 'Lifestyle',
    videoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1080&auto=format&fit=crop&q=80',
    defaultCaption: 'Morning ritual: dialing in Ethiopian washed beans. That aroma is unreal ☕',
    defaultSound: 'Acoustic Morning · Indie Breeze',
    tags: ['coffee', 'barista', 'morning', 'lifestyle']
  }
];

const SOUND_TRACKS = [
  'Original Audio - Qevora',
  'Midnight Lo-Fi · Tokyo Chill',
  'Synthwave Sunset · Neon Pulse',
  'Acoustic Morning · Indie Breeze',
  'Raw Concrete · Skateboard Sounds',
  'Summer Groove · Upbeat Tropical'
];

const TRENDING_TAGS = ['reels', 'qevora', 'viral', 'lifestyle', 'creators', 'tokyo', 'cinematic'];

export const CreateClipModal: React.FC<CreateClipModalProps> = ({ isOpen, onClose }) => {
  const { addClip, setActiveScreen, addToast } = useSocial();

  const [caption, setCaption] = useState('');
  const [soundTitle, setSoundTitle] = useState('Original Audio - Qevora');
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isVideoFile, setIsVideoFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>(['reels', 'qevora']);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'presets'>('upload');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStatus('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError(`File size is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Limit is 50MB.`);
        return;
      }
      setError(null);
      setSelectedFile(file);
      setIsVideoFile(file.type.startsWith('video/'));
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleSelectPreset = (preset: PresetClip) => {
    setVideoPreview(preset.videoUrl);
    setIsVideoFile(false);
    setSelectedFile(null);
    setCaption(preset.defaultCaption);
    setSoundTitle(preset.defaultSound);
    setTags(preset.tags);
    setActiveTab('upload');
    setError(null);
    addToast(`Loaded preset clip: "${preset.title}"`, 'info');
  };

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoPreview) {
      setError('Please choose or upload a video clip for your reel.');
      return;
    }
    if (!caption.trim()) {
      setError('Please write a caption for your reel.');
      return;
    }

    // Realistic upload and video compression simulation
    setIsUploading(true);
    setUploadProgress(15);
    setUploadStatus('Analyzing video stream & frame rate...');

    setTimeout(() => {
      setUploadProgress(45);
      setUploadStatus('Encoding vertical 1080x1920 MP4 clip...');
    }, 400);

    setTimeout(() => {
      setUploadProgress(80);
      setUploadStatus('Syncing soundtrack and generating waveform...');
    }, 800);

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStatus('Finalizing reel publish!');
    }, 1100);

    setTimeout(() => {
      addClip(videoPreview, caption.trim(), soundTitle.trim(), tags);
      setIsUploading(false);
      onClose();
      setActiveScreen('clips');
    }, 1300);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <Clapperboard className="w-5 h-5 shrink-0" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">Create Qevora Reel</h3>
              <p className="text-[11px] text-slate-500 font-medium">Vertical short-form video creator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40 transition-colors"
            aria-label="Close reels creator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Mode Selector */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50/70 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload My Video</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'presets'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Pick Sample Clip</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Upload Progress Overlay */}
          {isUploading && (
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                <span className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  {uploadStatus}
                </span>
                <span className="tabular-nums">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-blue-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-blue-700">
                Your reel will appear directly at the top of the Qevora Reels stream with interactive audio and comments.
              </p>
            </div>
          )}

          {activeTab === 'presets' ? (
            /* Presets Grid */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700">
                  Select a ready-to-publish vertical sample clip:
                </p>
                <span className="text-[10px] text-slate-400">High definition</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {PRESET_CLIPS.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="group relative rounded-2xl overflow-hidden aspect-[9/14] border-2 border-slate-200 hover:border-blue-500 text-left transition-all hover:scale-[1.01] shadow-xs"
                  >
                    <img
                      src={preset.videoUrl}
                      alt={preset.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider">
                      {preset.category}
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <p className="text-xs font-bold leading-tight drop-shadow">{preset.title}</p>
                      <p className="text-[10px] text-white/80 truncate mt-0.5">{preset.defaultSound}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Upload Zone and Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleVideoSelect}
                accept="video/mp4,video/webm,video/quicktime,video/x-matroska,video/*,image/*"
                className="hidden"
              />

              {/* Video Preview or Drag & Drop Zone */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Video Media File <span className="text-rose-500">*</span>
                  </label>
                  {videoPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setVideoPreview(null);
                        setSelectedFile(null);
                      }}
                      className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Choose Different Video</span>
                    </button>
                  )}
                </div>

                {videoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 h-64 flex items-center justify-center shadow-inner group">
                    {isVideoFile ? (
                      <video
                        ref={videoPlayerRef}
                        src={videoPreview}
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img
                        src={videoPreview}
                        alt="Reel preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    )}

                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5">
                      <FileVideo className="w-3.5 h-3.5 text-blue-400" />
                      <span>{selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1080x1920 Reel'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-md backdrop-blur-xs transition-colors"
                    >
                      Replace
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-52 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/30 flex flex-col items-center justify-center cursor-pointer transition-all p-5 text-center group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to browse or drop vertical video here
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports MP4, WebM, MOV up to 60 seconds (max 50MB)
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-600">
                        9:16 Aspect Ratio
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-600">
                        1080p Ready
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Caption</label>
                  <span className="text-[10px] text-slate-400 tabular-nums">{caption.length}/300</span>
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value.slice(0, 300))}
                  placeholder="Describe your clip, tag collaborators or ask questions..."
                  rows={3}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors"
                />
              </div>

              {/* Quick Hashtags */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Quick Hashtags
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {TRENDING_TAGS.map((tag) => {
                    const isSelected = tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sound / Audio Track */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Audio / Soundtrack Track
                </label>
                <div className="relative">
                  <Music className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={soundTitle}
                    onChange={(e) => setSoundTitle(e.target.value)}
                    placeholder="Sound title or artist"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* Preset Sound suggestions */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {SOUND_TRACKS.map((track) => (
                    <button
                      key={track}
                      type="button"
                      onClick={() => setSoundTitle(track)}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 transition-colors ${
                        soundTitle === track
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {track}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUploading || !videoPreview || !caption.trim()}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Clapperboard className="w-4 h-4" />
                  <span>Publish Reel</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
