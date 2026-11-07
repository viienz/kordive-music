import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Moon,
  ListMusic,
  Music,
  Heart,
  Shuffle,
  Repeat,
  Mic2,
  Sliders,
  Loader2,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { formatDuration } from '../../utils/formatters';

export const PlayerDock: React.FC = () => {
  const {
    activeTab,
    currentTrack,
    isPlaying,
    isBuffering,
    progressSec,
    volume,
    effectiveVolume,
    isMuted,
    isShuffle,
    repeatMode,
    eqEnabled,
    sleepTimerMode,
    sleepTimerRemainingSec,
    favoriteTrackIds,
    cachedTrackIds,
    downloadingTrackIds,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    toggleFavorite,
    toggleTrackOffline,
    openTrackDetail,
    setActiveTab,
    setSleepModalOpen,
    setQueueDrawerOpen,
  } = usePlayerStore();

  const progressPercent =
    currentTrack.durationSec > 0
      ? Math.min(100, (progressSec / currentTrack.durationSec) * 100)
      : 0;

  const isLiked = favoriteTrackIds.includes(currentTrack.id);
  const isOffline = cachedTrackIds.includes(currentTrack.id);
  const isDownloading = downloadingTrackIds.includes(currentTrack.id);

  const isFadingOut =
    sleepTimerRemainingSec !== null &&
    sleepTimerRemainingSec <= 30 &&
    sleepTimerRemainingSec > 0;

  return (
    <>
      {/* DESKTOP STICKY BOTTOM PLAYER DOCK */}
      <footer className="hidden md:flex items-center justify-between h-[84px] px-5 rounded-[20px] velvet-glass shrink-0 select-none gap-6">
        {/* Left: Mini Cover + Track Info + Like & Offline Buttons */}
        <div className="flex items-center gap-3.5 min-w-[260px] max-w-[340px]">
          <button
            onClick={() => openTrackDetail()}
            title="Lihat Halaman Lagu & Lirik"
            className={`w-12 h-12 rounded-[12px] bg-gradient-to-br ${currentTrack.coverGradient} border border-white/[0.12] flex items-center justify-center shrink-0 relative group overflow-hidden cursor-pointer shadow-md`}
          >
            <Music className="w-5 h-5 text-[#FB9278] group-hover:scale-110 transition-transform" />
          </button>

          <div className="min-w-0 flex-1">
            <button
              onClick={() => openTrackDetail()}
              className="text-[13.5px] font-semibold text-[#F8FAFC] hover:text-[#FB9278] transition-colors truncate block text-left max-w-full cursor-pointer"
            >
              {currentTrack.title}
            </button>
            <p className="text-[11.5px] text-[#948F9E] truncate mt-0.5">
              {currentTrack.artist} · {currentTrack.album}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => toggleFavorite(currentTrack.id)}
              title={
                isLiked
                  ? 'Hapus dari Lagu Disukai (L)'
                  : 'Tambah ke Lagu Disukai (L)'
              }
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isLiked
                  ? 'text-[#FB9278]'
                  : 'text-[#6B6775] hover:text-[#F8FAFC]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#FB9278]' : ''}`} />
            </button>

            <button
              onClick={() => toggleTrackOffline(currentTrack.id)}
              title={
                isOffline
                  ? 'Tersedia Offline (Klik untuk hapus salinan lokal)'
                  : 'Simpan untuk Pemutaran Offline'
              }
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isOffline
                  ? 'text-[#6EE7B7]'
                  : 'text-[#6B6775] hover:text-[#F8FAFC]'
              }`}
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 text-[#FB9278] animate-spin" />
              ) : isOffline ? (
                <CheckCircle2 className="w-4 h-4 text-[#6EE7B7]" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Center: Playback Controls & Precision Scrubber */}
        <div className="flex-1 max-w-[520px] flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-5">
            <button
              onClick={toggleShuffle}
              title="Acak Antrean (Shuffle)"
              className={`p-1 transition-colors cursor-pointer ${
                isShuffle
                  ? 'text-[#FB9278]'
                  : 'text-[#6B6775] hover:text-[#F8FAFC]'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={prevTrack}
              title="Lagu Sebelumnya (Shift + Panah Kiri)"
              className="text-[#948F9E] hover:text-[#F8FAFC] transition-colors p-1 cursor-pointer"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              title={isPlaying ? 'Jeda (Spasi)' : 'Putar (Spasi)'}
              className="w-10 h-10 rounded-full bg-[#FB9278] hover:bg-[#FCA5A5] text-[#0E0D12] flex items-center justify-center shadow-[0_0_20px_rgba(251,146,120,0.4)] transition-all active:scale-95 cursor-pointer"
            >
              {isBuffering ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#0E0D12]" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              title="Lagu Berikutnya (Shift + Panah Kanan)"
              className="text-[#948F9E] hover:text-[#F8FAFC] transition-colors p-1 cursor-pointer"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={cycleRepeatMode}
              title={`Mode Ulang: ${repeatMode.toUpperCase()}`}
              className={`relative p-1 transition-colors cursor-pointer ${
                repeatMode !== 'off'
                  ? 'text-[#FB9278]'
                  : 'text-[#6B6775] hover:text-[#F8FAFC]'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              {repeatMode === 'one' && (
                <span className="absolute -top-0.5 -right-1 text-[8px] font-mono font-bold text-[#FB9278]">
                  1
                </span>
              )}
            </button>
          </div>

          {/* Scrubber Timeline */}
          <div className="w-full flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#948F9E] w-8 text-right">
              {formatDuration(progressSec)}
            </span>

            <div className="relative flex-1 h-4 flex items-center">
              <div className="w-full h-1.5 rounded-full bg-[#262430] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FB9278] to-[#FCA5A5] transition-all duration-150"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={currentTrack.durationSec}
                value={progressSec}
                onChange={(e) => seekTo(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <span className="text-[11px] font-mono text-[#948F9E] w-8">
              {currentTrack.durationFormatted}
            </span>
          </div>
        </div>

        {/* Right: Lyrics, Sleep Timer, Queue, FX Studio, Volume */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Lyrics & Track Detail Button */}
          <button
            onClick={() => openTrackDetail()}
            title="Lirik & Detail Lagu"
            className={`w-8 h-8 rounded-[9px] border flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'track-detail'
                ? 'bg-[#FB9278]/15 border-[#FB9278]/60 text-[#FB9278]'
                : 'bg-[#1B1A22] border-white/[0.08] text-[#948F9E] hover:text-[#F8FAFC] hover:border-white/[0.2]'
            }`}
          >
            <Mic2 className="w-3.5 h-3.5" />
          </button>

          {/* Sleep Timer Button */}
          <button
            onClick={() => setSleepModalOpen(true)}
            title="Timer Tidur (Sleep Timer)"
            className={`h-8 px-2.5 rounded-[9px] border flex items-center gap-1.5 text-[11px] font-mono transition-all cursor-pointer ${
              sleepTimerMode !== 'off'
                ? 'bg-[#F59E0B]/15 border-[#F59E0B]/60 text-[#FCD34D]'
                : 'bg-[#1B1A22] border-white/[0.08] text-[#948F9E] hover:text-[#F8FAFC] hover:border-white/[0.2]'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-[#FB9278]" />
            {sleepTimerRemainingSec !== null && (
              <span>{formatDuration(sleepTimerRemainingSec)}</span>
            )}
          </button>

          {/* Queue Drawer Button */}
          <button
            onClick={() => setQueueDrawerOpen(true)}
            title="Antrean Lagu"
            className="w-8 h-8 rounded-[9px] bg-[#1B1A22] border border-white/[0.08] hover:border-white/[0.2] text-[#948F9E] hover:text-[#F8FAFC] flex items-center justify-center transition-colors cursor-pointer"
          >
            <ListMusic className="w-3.5 h-3.5" />
          </button>

          {/* Dedicated FX Studio DSP Button */}
          <button
            onClick={() => setActiveTab('studio-dsp')}
            title="Buka FX Studio & Equalizer"
            className={`h-8 px-2.5 rounded-[9px] border flex items-center gap-1.5 text-[10.5px] font-mono font-semibold tracking-tight transition-all cursor-pointer ${
              activeTab === 'studio-dsp'
                ? 'bg-[#FB9278]/15 border-[#FB9278]/60 text-[#FB9278]'
                : eqEnabled
                ? 'bg-[#1B1A22] border-white/[0.15] text-[#F8FAFC] hover:border-[#FB9278]/60'
                : 'bg-[#1B1A22] border-white/[0.06] text-[#6B6775]'
            }`}
          >
            <Sliders className="w-3 h-3 text-[#FB9278]" />
            <span>FX STUDIO</span>
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2 pl-1">
            <button
              onClick={toggleMute}
              title={isMuted ? 'Suarakan (M)' : 'Bisukan (M)'}
              className="text-[#948F9E] hover:text-[#F8FAFC] transition-colors cursor-pointer"
            >
              {isMuted || effectiveVolume === 0 ? (
                <VolumeX className="w-4 h-4 text-[#FB9278]" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <div className="relative w-[70px] h-4 flex items-center">
              <div className="w-full h-1 rounded-full bg-[#262430] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isFadingOut ? 'bg-[#F59E0B]' : 'bg-[#FB9278]'
                  }`}
                  style={{ width: `${isMuted ? 0 : effectiveVolume}%` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </footer>

      {/* MOBILE FLOATING MINI PLAYER BAR (< md) */}
      <div className="md:hidden fixed bottom-[76px] left-3 right-3 z-30 h-[62px] rounded-[18px] velvet-glass px-3.5 flex items-center justify-between shadow-2xl overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#262430]">
          <div
            className="h-full bg-[#FB9278] transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Left: Cover + Track Title (Clicks go to TrackDetailView) */}
        <div
          onClick={() => openTrackDetail()}
          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
        >
          <div
            className={`w-10 h-10 rounded-[10px] bg-gradient-to-br ${currentTrack.coverGradient} border border-white/[0.1] flex items-center justify-center shrink-0`}
          >
            <Music className="w-4 h-4 text-[#FB9278]" />
          </div>
          <div className="min-w-0 pr-2">
            <p className="text-[13px] font-semibold text-[#F8FAFC] truncate">
              {currentTrack.title}
            </p>
            <p className="text-[11px] text-[#948F9E] truncate">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Right: Sleep Timer, Play/Pause, Next */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setSleepModalOpen(true)}
            title="Sleep Timer"
            className={`w-9 h-9 rounded-full flex items-center justify-center ${
              sleepTimerMode !== 'off'
                ? 'bg-[#F59E0B]/20 text-[#FB9278]'
                : 'text-[#948F9E] hover:text-[#FB9278]'
            }`}
          >
            <Moon className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[#FB9278] text-[#0E0D12] flex items-center justify-center shadow-[0_0_16px_rgba(251,146,120,0.4)]"
          >
            {isBuffering ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0E0D12]" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={nextTrack}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#948F9E] active:text-[#F8FAFC]"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </>
  );
};
