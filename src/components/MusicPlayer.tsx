import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { Track } from '../types';

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'SynthWave AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon1/300/300',
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'Techno Core',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon2/300/300',
  },
  {
    id: '3',
    title: 'Midnight Drive',
    artist: 'Lo-Fi Dreams',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/neon3/300/300',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="bg-black border-2 border-[#00ffff] p-6 w-full max-w-md shadow-[0_0_20px_rgba(0,255,255,0.2)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff00ff] to-transparent animate-pulse" />
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="relative">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className={`w-20 h-20 border-2 border-[#ff00ff] object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : ''}`}
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 border-2 border-[#00ffff] animate-ping opacity-50" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[#00ffff] font-pixel text-sm truncate uppercase tracking-tighter">
            {currentTrack.title}
          </h3>
          <p className="text-[#ff00ff] text-xs font-bold mt-1">[{currentTrack.artist}]</p>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="h-2 w-full bg-[#ff00ff]/10 border border-[#ff00ff]/30 overflow-hidden">
          <div 
            className="h-full bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={handlePrev}
            className="text-[#00ffff] hover:text-[#ff00ff] transition-colors p-2"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 border-2 border-[#00ffff] bg-black text-[#00ffff] flex items-center justify-center hover:bg-[#00ffff] hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,255,0.3)]"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="text-[#00ffff] hover:text-[#ff00ff] transition-colors p-2"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
