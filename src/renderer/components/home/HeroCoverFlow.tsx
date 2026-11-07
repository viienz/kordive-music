import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowUpRight,
  Disc,
  ListMusic,
  Music2,
} from 'lucide-react';
import { HERO_FEATURED_TRACKS } from '../../data/mockCatalog';
import { usePlayerStore } from '../../store/usePlayerStore';
import { Track } from '../../types/music';

export const HeroCoverFlow: React.FC = () => {
  const {
    heroActiveIndex,
    setHeroActiveIndex,
    nextHeroSlide,
    prevHeroSlide,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    openHeroTarget,
  } = usePlayerStore();

  const pointerStartX = useRef<number | null>(null);
  const didDrag = useRef(false);

  const total = HERO_FEATURED_TRACKS.length;

  const getRelativeOffset = (index: number): number => {
    let diff = index - heroActiveIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
    didDrag.current = false;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const deltaX = e.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (Math.abs(deltaX) > 42) {
      didDrag.current = true;
      if (deltaX < 0) {
        nextHeroSlide();
      } else {
        prevHeroSlide();
      }
    }
  };

  const handleCardClick = (track: Track, index: number, offset: number) => {
    if (didDrag.current) {
      didDrag.current = false;
      return;
    }
    if (offset !== 0) {
      setHeroActiveIndex(index);
    } else {
      // Clicking the active center card navigates to its Album, Playlist, or Track page
      openHeroTarget(track);
    }
  };

  const handlePlayButtonClick = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    if (currentTrack.id === track.id) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  const getTypeBadge = (track: Track) => {
    if (track.featuredType === 'album') {
      return { label: 'ALBUM UNGGULAN', icon: Disc, actionLabel: 'Buka Album' };
    }
    if (track.featuredType === 'playlist') {
      return {
        label: 'PLAYLIST PILIHAN',
        icon: ListMusic,
        actionLabel: 'Buka Playlist',
      };
    }
    return {
      label: 'SINGLE EKSKLUSIF',
      icon: Music2,
      actionLabel: 'Buka Detail Lagu',
    };
  };

  return (
    <section className="relative w-full py-1 select-none">
      {/* Carousel Stage with Pointer Drag/Swipe Support */}
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative w-full h-[275px] sm:h-[296px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {/* Left Navigation Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevHeroSlide();
          }}
          title="Geser ke Kiri"
          className="hidden sm:flex absolute left-1 z-30 w-9 h-9 rounded-full bg-[#16161C]/90 hover:bg-[#FB9278]/20 border border-white/[0.15] hover:border-[#FB9278] text-[#F8FAFC] items-center justify-center transition-all cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* 5-Card 3D Stacked Cover Flow */}
        <div className="relative w-full max-w-[940px] h-full flex items-center justify-center">
          {HERO_FEATURED_TRACKS.map((track, index) => {
            const offset = getRelativeOffset(index);
            const isCenter = offset === 0;
            const isCurrentPlaying =
              currentTrack.id === track.id && isPlaying;
            const badgeInfo = getTypeBadge(track);
            const BadgeIcon = badgeInfo.icon;

            const xTranslate =
              offset === 0
                ? 0
                : offset === -1
                ? -165
                : offset === 1
                ? 165
                : offset === -2
                ? -295
                : 295;

            const scale =
              offset === 0
                ? 1
                : Math.abs(offset) === 1
                ? 0.86
                : 0.74;

            const zIndex =
              offset === 0
                ? 20
                : Math.abs(offset) === 1
                ? 15
                : 10;

            const opacity =
              offset === 0
                ? 1
                : Math.abs(offset) === 1
                ? 0.82
                : 0.52;

            return (
              <motion.div
                key={track.id}
                onClick={() => handleCardClick(track, index, offset)}
                initial={false}
                animate={{
                  x: xTranslate,
                  scale,
                  opacity,
                  zIndex,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 26,
                  mass: 0.9,
                }}
                style={{ zIndex }}
                className={`group absolute w-[285px] sm:w-[310px] h-[255px] sm:h-[272px] rounded-[22px] bg-gradient-to-br ${track.coverGradient} p-6 flex flex-col justify-between cursor-pointer overflow-hidden transition-shadow ${
                  isCenter
                    ? 'border border-white/[0.26] shadow-[0_20px_50px_rgba(0,0,0,0.75)]'
                    : 'border border-white/[0.1] shadow-xl hover:border-white/[0.22]'
                }`}
              >
                {/* Ambient Decorative Glow */}
                <div
                  className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl opacity-25 pointer-events-none"
                  style={{ backgroundColor: track.coverAccent }}
                />

                {/* Top Badge & Direct Page Link Indicator */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  {isCenter ? (
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono font-semibold uppercase tracking-[0.12em] text-[#FB9278]">
                      <BadgeIcon className="w-3.5 h-3.5" />
                      {badgeInfo.label}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-white/45 uppercase">
                      {track.category}
                    </span>
                  )}

                  {isCenter && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/35 border border-white/15 text-[10.5px] font-medium text-white/90 group-hover:border-[#FB9278] group-hover:text-[#FB9278] transition-colors">
                      <span>{badgeInfo.actionLabel}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* Bottom Title, Subtitle & Play Button */}
                <div className="relative z-10 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h2
                      className={`font-bold text-[#F8FAFC] tracking-tight truncate group-hover:text-[#FB9278] transition-colors ${
                        isCenter ? 'text-[22px]' : 'text-[15px] text-white/85'
                      }`}
                    >
                      {track.title}
                    </h2>
                    <p
                      className={`truncate mt-0.5 ${
                        isCenter
                          ? 'text-[12.5px] text-white/75'
                          : 'text-[11.5px] text-white/50'
                      }`}
                    >
                      {isCenter
                        ? track.featuredSubtitle || track.artist
                        : track.artist}
                    </p>
                  </div>

                  {isCenter && (
                    <button
                      onClick={(e) => handlePlayButtonClick(e, track)}
                      title={isCurrentPlaying ? 'Jeda' : 'Putar Sekarang'}
                      className="w-12 h-12 rounded-full bg-[#FB9278] hover:bg-[#FCA5A5] text-[#0E0D12] flex items-center justify-center shrink-0 shadow-[0_0_24px_rgba(251,146,120,0.5)] transition-transform active:scale-95 cursor-pointer"
                    >
                      {isCurrentPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Navigation Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextHeroSlide();
          }}
          title="Geser ke Kanan"
          className="hidden sm:flex absolute right-1 z-30 w-9 h-9 rounded-full bg-[#16161C]/90 hover:bg-[#FB9278]/20 border border-white/[0.15] hover:border-[#FB9278] text-[#F8FAFC] items-center justify-center transition-all cursor-pointer shadow-lg"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Pagination Indicators */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {HERO_FEATURED_TRACKS.map((t, idx) => {
          const active = idx === heroActiveIndex;
          return (
            <button
              key={t.id}
              onClick={() => setHeroActiveIndex(idx)}
              title={t.title}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                active
                  ? 'w-6 bg-[#FB9278]'
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
};
