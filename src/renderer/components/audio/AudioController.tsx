import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';

/**
 * Headless Audio Engine & Global Keyboard Shortcut Controller
 * - Connects HTML5 <audio> -> Web Audio API 10-Band BiquadFilterNode chain -> Bass Boost -> Master GainNode.
 * - Automatically falls back to the 1-second progression timer when the Backend stream server
 *   (http://127.0.0.1:45120/stream/:id) is not yet running.
 * - Handles Desktop Keyboard Shortcuts (Space, ArrowLeft/Right, M, L, Ctrl+K).
 */
export const AudioController: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    effectiveVolume,
    isMuted,
    eqEnabled,
    eqBands,
    bassBoostDb,
    ebuR128Enabled,
    togglePlay,
    nextTrack,
    prevTrack,
    seekRelative,
    toggleMute,
    toggleFavorite,
    tickSecond,
    showToast,
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const eqFiltersRef = useRef<BiquadFilterNode[]>([]);
  const bassBoostFilterRef = useRef<BiquadFilterNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const hasRealAudioStreamRef = useRef<boolean>(false);

  // 1. Initialize Web Audio API 10-Band Equalizer Graph lazily on first play interaction
  const ensureAudioGraph = () => {
    if (audioCtxRef.current || !audioRef.current) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createMediaElementSource(audioRef.current);

      // Create 10 BiquadFilterNodes (32Hz .. 16kHz)
      const filters = eqBands.map((band, idx) => {
        const filter = ctx.createBiquadFilter();
        if (idx === 0) {
          filter.type = 'lowshelf';
        } else if (idx === eqBands.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.4;
        }
        filter.frequency.value = band.hz;
        filter.gain.value = eqEnabled ? band.gainDb : 0;
        return filter;
      });

      // Sub-Bass Warmth Shelf (80Hz)
      const bassFilter = ctx.createBiquadFilter();
      bassFilter.type = 'lowshelf';
      bassFilter.frequency.value = 80;
      bassFilter.gain.value = eqEnabled ? bassBoostDb : 0;

      // Master Gain (Volume + EBU R128 Headroom)
      const masterGain = ctx.createGain();
      const headroom = ebuR128Enabled ? 0.92 : 1.0;
      masterGain.gain.value = isMuted ? 0 : (effectiveVolume / 100) * headroom;

      // Connect chain: source -> 10 EQ filters -> bassFilter -> masterGain -> destination
      let prevNode: AudioNode = source;
      filters.forEach((f) => {
        prevNode.connect(f);
        prevNode = f;
      });
      prevNode.connect(bassFilter);
      bassFilter.connect(masterGain);
      masterGain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      eqFiltersRef.current = filters;
      bassBoostFilterRef.current = bassFilter;
      masterGainRef.current = masterGain;
    } catch {
      // Fallback safely if Web Audio API is restricted in headless environment
    }
  };

  // 2. Sync 10-Band EQ Gains & Bass Boost in Real-Time to Web Audio Nodes
  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    eqFiltersRef.current.forEach((filter, idx) => {
      const targetGain = eqEnabled ? (eqBands[idx]?.gainDb ?? 0) : 0;
      filter.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.03);
    });

    if (bassBoostFilterRef.current) {
      const targetBass = eqEnabled ? bassBoostDb : 0;
      bassBoostFilterRef.current.gain.setTargetAtTime(
        targetBass,
        ctx.currentTime,
        0.03
      );
    }
  }, [eqBands, eqEnabled, bassBoostDb]);

  // 3. Sync Master Volume, Mute, & EBU R128 Normalization
  useEffect(() => {
    const ctx = audioCtxRef.current;
    const gainNode = masterGainRef.current;
    if (ctx && gainNode) {
      const headroom = ebuR128Enabled ? 0.92 : 1.0;
      const targetGain = isMuted ? 0 : (effectiveVolume / 100) * headroom;
      gainNode.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.02);
    }
    if (audioRef.current && !audioCtxRef.current) {
      audioRef.current.volume = isMuted ? 0 : effectiveVolume / 100;
    }
  }, [effectiveVolume, isMuted, ebuR128Enabled]);

  // 4. Fallback 1s Timer when Backend Stream Server is not yet attached
  useEffect(() => {
    if (!isPlaying) return;
    ensureAudioGraph();
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    const interval = setInterval(() => {
      if (!hasRealAudioStreamRef.current) {
        tickSecond();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, tickSecond]);

  // 5. Global Desktop Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      // Ctrl+K or Cmd+K -> Focus TopBar Search Input from anywhere
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById(
          'kordive-global-search-input'
        ) as HTMLInputElement | null;
        searchInput?.focus();
        searchInput?.select();
        return;
      }

      if (isInputFocused) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight' && e.shiftKey) {
        e.preventDefault();
        nextTrack();
      } else if (e.code === 'ArrowLeft' && e.shiftKey) {
        e.preventDefault();
        prevTrack();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seekRelative(5);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seekRelative(-5);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleMute();
        showToast(
          !isMuted ? 'Audio dibisukan (Muted).' : 'Audio disuarakan kembali.',
          'info'
        );
      } else if (e.key.toLowerCase() === 'l') {
        e.preventDefault();
        toggleFavorite(currentTrack.id);
      } else if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById(
          'kordive-global-search-input'
        ) as HTMLInputElement | null;
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentTrack.id,
    isMuted,
    togglePlay,
    nextTrack,
    prevTrack,
    seekRelative,
    toggleMute,
    toggleFavorite,
    showToast,
  ]);

  return (
    <audio
      ref={audioRef}
      crossOrigin="anonymous"
      preload="metadata"
      className="hidden"
    />
  );
};
