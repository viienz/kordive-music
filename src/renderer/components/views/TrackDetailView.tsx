import React from 'react';
import {
  Play,
  Pause,
  Heart,
  Mic2,
  Disc3,
  Sliders,
  CheckCircle2,
  ListPlus,
  Sparkles,
} from 'lucide-react';
import { ALL_TRACKS } from '../../data/mockCatalog';
import { usePlayerStore } from '../../store/usePlayerStore';
import { formatDuration } from '../../utils/formatters';

export const TrackDetailView: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    progressSec,
    togglePlay,
    playTrack,
    seekTo,
    favoriteTrackIds,
    toggleFavorite,
    openGenreByCategory,
    setActiveTab,
    setQueueDrawerOpen,
    lyricsFontSize,
    setLyricsFontSize,
  } = usePlayerStore();

  const isLiked = favoriteTrackIds.includes(currentTrack.id);

  // Determine active lyric index based on current progressSec
  const activeLyricIndex = currentTrack.lyrics.reduce(
    (acc, line, index) => (progressSec >= line.timeSec ? index : acc),
    0
  );

  const relatedTracks = ALL_TRACKS.filter(
    (t) =>
      t.id !== currentTrack.id &&
      (t.category === currentTrack.category || t.artist === currentTrack.artist)
  ).concat(
    ALL_TRACKS.filter(
      (t) =>
        t.id !== currentTrack.id &&
        t.category !== currentTrack.category &&
        t.artist !== currentTrack.artist
    )
  ).slice(0, 4);

  return (
    <div className="space-y-8 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (5 cols): Artwork, Song Actions & Credits */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Album Artwork Showcase Card */}
          <div
            className={`relative rounded-[24px] p-7 bg-gradient-to-br ${currentTrack.coverGradient} border border-white/[0.14] overflow-hidden shadow-2xl flex flex-col justify-between min-h-[360px]`}
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => openGenreByCategory(currentTrack.category)}
                className="px-3 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/10 text-[11px] font-medium text-[#FB9278] hover:border-[#FB9278] transition-colors cursor-pointer"
              >
                {currentTrack.category}
              </button>

              {currentTrack.isCachedOffline && (
                <span className="px-2.5 py-1 rounded-full bg-black/35 text-[11px] font-medium text-[#6EE7B7] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Tersedia Offline
                </span>
              )}
            </div>

            {/* Center Vinyl Disc */}
            <div className="my-6 flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-full bg-[#0E0D12]/85 border-4 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.65)] flex items-center justify-center relative">
                <Disc3
                  className={`w-20 h-20 text-white/10 absolute ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                />
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-tr ${currentTrack.coverGradient} border border-[#FB9278]/50 flex items-center justify-center relative z-10`}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-[#0E0D12]" />
                </div>
              </div>

              <h1 className="text-[24px] font-bold text-[#F8FAFC] mt-5 tracking-tight">
                {currentTrack.title}
              </h1>
              <p className="text-[14px] text-white/75 mt-1">
                {currentTrack.artist} · {currentTrack.album}
              </p>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={togglePlay}
                className="px-6 py-2.5 rounded-full bg-[#FB9278] hover:bg-[#FCA5A5] text-[#0E0D12] text-[13.5px] font-bold flex items-center gap-2 shadow-[0_0_24px_rgba(251,146,120,0.4)] transition-all cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Jeda Lagu</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Putar Sekarang</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleFavorite(currentTrack.id)}
                title="Simpan ke Lagu Disukai"
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  isLiked
                    ? 'bg-[#FB9278]/20 border-[#FB9278] text-[#FB9278]'
                    : 'bg-black/35 border-white/15 text-white/80 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#FB9278]' : ''}`} />
              </button>

              <button
                onClick={() => setQueueDrawerOpen(true)}
                title="Lihat Antrean"
                className="w-10 h-10 rounded-full bg-black/35 border border-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ListPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Informasi Lagu & Kredit */}
          <div className="rounded-[20px] velvet-glass p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-[14.5px] font-bold text-[#F8FAFC]">
                Informasi & Kredit Lagu
              </h3>
              <button
                onClick={() => setActiveTab('studio-dsp')}
                className="text-[11.5px] font-mono text-[#FB9278] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Atur di FX Studio</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[12.5px]">
              <div className="p-3 rounded-xl bg-[#1B1A22]/80 border border-white/[0.05]">
                <span className="text-[11px] text-[#6B6775] block">
                  Artis Utama
                </span>
                <span className="font-semibold text-[#F8FAFC]">
                  {currentTrack.artist}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#1B1A22]/80 border border-white/[0.05]">
                <span className="text-[11px] text-[#6B6775] block">Album</span>
                <span className="font-semibold text-[#F8FAFC] truncate block">
                  {currentTrack.album}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#1B1A22]/80 border border-white/[0.05]">
                <span className="text-[11px] text-[#6B6775] block">
                  Tahun & Pemutaran
                </span>
                <span className="font-semibold text-[#F8FAFC]">
                  {currentTrack.releaseYear || 2025} ·{' '}
                  {currentTrack.playCountFormatted || '2.1M'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#1B1A22]/80 border border-white/[0.05]">
                <span className="text-[11px] text-[#6B6775] block">
                  Kualitas Audio
                </span>
                <span className="font-mono text-[11.5px] font-semibold text-[#6EE7B7]">
                  {currentTrack.codecBadge}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (7 cols): Synchronized Lyrics & Related Songs */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Synchronized Karaoke Lyrics Card */}
          <div className="rounded-[24px] velvet-glass p-6 flex flex-col justify-between min-h-[360px]">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <Mic2 className="w-4 h-4 text-[#FB9278]" />
                <h3 className="text-[16px] font-bold text-[#F8FAFC]">
                  Lirik Sinkron
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setLyricsFontSize(
                      lyricsFontSize === 'normal' ? 'large' : 'normal'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-[#1B1A22] border border-white/10 text-[11px] font-mono text-[#948F9E] hover:text-[#F8FAFC] cursor-pointer"
                >
                  Ukuran Teks: {lyricsFontSize === 'large' ? 'Besar' : 'Standar'}
                </button>
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[290px] pr-2">
              {currentTrack.lyrics.map((line, index) => {
                const isActive = index === activeLyricIndex;
                return (
                  <button
                    key={`${line.timeSec}-${index}`}
                    onClick={() => seekTo(line.timeSec)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer ${
                      isActive
                        ? 'bg-[#FB9278]/15 border border-[#FB9278]/40 text-[#FB9278] font-bold shadow-[0_0_16px_rgba(251,146,120,0.16)]'
                        : 'text-[#948F9E]/80 hover:text-[#F8FAFC] hover:bg-white/[0.03]'
                    } ${
                      lyricsFontSize === 'large'
                        ? isActive
                          ? 'text-[17px]'
                          : 'text-[15px]'
                        : isActive
                        ? 'text-[15px]'
                        : 'text-[13.5px]'
                    }`}
                  >
                    <span>{line.text}</span>
                    <span className="text-[11px] font-mono opacity-60 shrink-0">
                      {formatDuration(line.timeSec)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lagu Serupa & Rekomendasi Selanjutnya */}
          <div className="rounded-[22px] velvet-glass p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FB9278]" />
                <h3 className="text-[15px] font-bold text-[#F8FAFC]">
                  Lagu Serupa dengan "{currentTrack.title}"
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedTracks.map((track) => (
                <div
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className="p-3 rounded-[14px] bg-[#1B1A22]/85 hover:bg-[#22202B] border border-white/[0.06] hover:border-[#FB9278]/40 flex items-center justify-between gap-3 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${track.coverGradient} border border-white/10 flex items-center justify-center shrink-0`}
                    >
                      <Play className="w-3.5 h-3.5 text-white/80 group-hover:text-[#FB9278] fill-current ml-0.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#F8FAFC] group-hover:text-[#FB9278] truncate">
                        {track.title}
                      </p>
                      <p className="text-[11px] text-[#948F9E] truncate">
                        {track.artist} · {track.durationFormatted}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
