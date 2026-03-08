import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Activity, Cpu, ShieldAlert } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#00ffff] font-mono selection:bg-[#ff00ff]/30 relative">
      {/* Visual Overlays */}
      <div className="scanlines" />
      <div className="noise-bg" />
      
      {/* Header / System Status */}
      <header className="relative z-10 border-b-2 border-[#ff00ff] bg-black/80 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#00ffff] flex items-center justify-center bg-black shadow-[0_0_15px_#00ffff]">
            <Terminal className="w-8 h-8 text-[#00ffff]" />
          </div>
          <div>
            <h1 className="text-3xl font-pixel tracking-tighter glitch" data-text="NEON_RHYTHM_v3.1">
              NEON_RHYTHM_v3.1
            </h1>
            <p className="text-xs text-[#ff00ff] font-bold animate-pulse">
              [SYSTEM_STATUS: UNSTABLE] [ENCRYPTION: ACTIVE]
            </p>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-12 text-sm font-bold uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2 text-[#ff00ff]">
            <Activity className="w-4 h-4" />
            <span>CPU_LOAD: 88%</span>
          </div>
          <div className="flex items-center gap-2 text-[#00ffff]">
            <Cpu className="w-4 h-4" />
            <span>MEM_SYNC: OK</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: System Logs */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="border-2 border-[#ff00ff] p-4 bg-black/60 shadow-[inset_0_0_20px_rgba(255,0,255,0.2)]">
            <h3 className="text-xs font-pixel text-[#ff00ff] mb-4 border-b border-[#ff00ff] pb-2">SYSTEM_LOGS</h3>
            <div className="space-y-2 text-[10px] leading-tight font-mono opacity-80">
              <p className="text-white/40">[09:47:12] INITIALIZING_CORE...</p>
              <p className="text-[#00ffff]">[09:47:15] AUDIO_DRIVERS_LOADED</p>
              <p className="text-[#ff00ff]">[09:47:18] WARNING: BUFFER_OVERFLOW_DETECTED</p>
              <p className="text-white/40">[09:47:20] RETRYING_CONNECTION...</p>
              <p className="text-[#00ffff]">[09:47:22] SYNC_COMPLETE</p>
            </div>
          </div>
          
          <div className="border-2 border-[#00ffff] p-4 bg-black/60 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#00ffff]/5 group-hover:bg-[#00ffff]/10 transition-colors" />
            <ShieldAlert className="w-12 h-12 text-[#ff00ff] mb-4 animate-bounce" />
            <h4 className="text-xs font-pixel text-[#00ffff] mb-2">SECURITY_PROTOCOL</h4>
            <p className="text-[10px] leading-relaxed">
              DO NOT ATTEMPT TO DISCONNECT. THE MACHINE REQUIRES INPUT. FEED THE SNAKE. MAINTAIN THE RHYTHM.
            </p>
          </div>
        </aside>

        {/* Center: The Game Interface */}
        <section className="lg:col-span-6 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative p-2 border-4 border-[#ff00ff] bg-black shadow-[0_0_30px_rgba(255,0,255,0.3)]"
          >
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-4 border-l-4 border-[#00ffff]" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-4 border-r-4 border-[#00ffff]" />
            <SnakeGame />
          </motion.div>
        </section>

        {/* Right Sidebar: Audio Control */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="border-2 border-[#00ffff] p-6 bg-black/80 relative">
            <div className="absolute top-0 right-0 p-1 bg-[#00ffff] text-black text-[8px] font-pixel">LIVE_FEED</div>
            <h3 className="text-xs font-pixel text-[#00ffff] mb-6 tracking-widest">SONIC_MANIPULATOR</h3>
            <MusicPlayer />
          </div>

          <div className="border-2 border-[#ff00ff] p-4 bg-black/60">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-pixel text-[#ff00ff]">SIGNAL_STRENGTH</span>
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-[#ff00ff]" />
                <div className="w-1 h-4 bg-[#ff00ff]" />
                <div className="w-1 h-2 bg-[#ff00ff] opacity-30" />
                <div className="w-1 h-5 bg-[#ff00ff]" />
              </div>
            </div>
            <div className="h-1 w-full bg-[#ff00ff]/20">
              <div className="h-full w-3/4 bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]" />
            </div>
          </div>
        </aside>
      </main>

      {/* Footer / Legal */}
      <footer className="relative z-10 mt-12 py-8 border-t-2 border-[#00ffff] bg-black text-center">
        <p className="text-[10px] font-pixel tracking-[0.5em] text-[#00ffff]/40">
          TERMINAL_ID: 0x7F_SNAKE_RHYTHM // NO_EXIT_FOUND
        </p>
      </footer>
    </div>
  );
}
