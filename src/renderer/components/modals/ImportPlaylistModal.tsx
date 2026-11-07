import React, { useState, useEffect } from 'react';
import {
  Link2,
  X,
  CheckCircle2,
  ListMusic,
  Sparkles,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { ALL_TRACKS } from '../../data/mockCatalog';
import { usePlayerStore } from '../../store/usePlayerStore';

export const ImportPlaylistModal: React.FC = () => {
  const {
    isImportPlaylistModalOpen,
    importModalInitialUrl,
    closeImportPlaylistModal,
    importExternalPlaylist,
  } = usePlayerStore();

  const [urlInput, setUrlInput] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [resolvedPlatform, setResolvedPlatform] = useState<
    'spotify' | 'youtube' | 'soundcloud' | null
  >(null);

  useEffect(() => {
    if (isImportPlaylistModalOpen) {
      const initial =
        importModalInitialUrl ||
        'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M';
      setUrlInput(initial);
      detectPlatform(initial);
    }
  }, [isImportPlaylistModalOpen, importModalInitialUrl]);

  const detectPlatform = (val: string) => {
    const lower = val.toLowerCase();
    if (lower.includes('spotify.com')) {
      setResolvedPlatform('spotify');
      if (!customTitle) setCustomTitle('Spotify · Midnight Acoustic & Chill');
    } else if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
      setResolvedPlatform('youtube');
      if (!customTitle) setCustomTitle('YouTube Music · Deep Focus Mix');
    } else if (lower.includes('soundcloud.com')) {
      setResolvedPlatform('soundcloud');
      if (!customTitle) setCustomTitle('SoundCloud · Underground Lo-Fi');
    } else {
      setResolvedPlatform('spotify');
    }
  };

  if (!isImportPlaylistModalOpen) return null;

  const handleImportNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setIsResolving(true);
    setTimeout(() => {
      setIsResolving(false);
      importExternalPlaylist(
        urlInput.trim(),
        customTitle.trim(),
        resolvedPlatform || 'spotify'
      );
      setCustomTitle('');
    }, 550);
  };

  const sampleLinks = [
    {
      label: 'Spotify Editorial',
      url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
      title: 'Spotify · Late Night Vibes',
      platform: 'spotify' as const,
    },
    {
      label: 'YouTube Music Mix',
      url: 'https://music.youtube.com/playlist?list=RDCLAK5uy_k',
      title: 'YT Music · Coding & Focus',
      platform: 'youtube' as const,
    },
    {
      label: 'SoundCloud Sets',
      url: 'https://soundcloud.com/discover/sets/chill-lofi',
      title: 'SoundCloud · Bedroom Beats',
      platform: 'soundcloud' as const,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="w-full max-w-[520px] rounded-[24px] velvet-glass border border-white/[0.15] p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FB9278]/15 border border-[#FB9278]/40 flex items-center justify-center shrink-0">
              <Link2 className="w-5 h-5 text-[#FB9278]" />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#F8FAFC]">
                Impor Playlist dari Tautan Eksternal
              </h3>
              <p className="text-[12px] text-[#948F9E]">
                Tempel link Spotify, YouTube Music, atau SoundCloud untuk menyalin daftar lagu ke Kordive.
              </p>
            </div>
          </div>

          <button
            onClick={closeImportPlaylistModal}
            className="p-1.5 rounded-full text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.08] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Sample Pills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase text-[#6B6775]">
            Contoh Tautan Cepat:
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleLinks.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setUrlInput(item.url);
                  setCustomTitle(item.title);
                  setResolvedPlatform(item.platform);
                }}
                className="px-3 py-1 rounded-full bg-[#16161C] hover:bg-[#FB9278]/15 border border-white/[0.1] hover:border-[#FB9278]/40 text-[11.5px] text-[#F8FAFC] hover:text-[#FB9278] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleImportNow} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#948F9E] block">
              URL Playlist (Spotify / YouTube Music / SoundCloud)
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                detectPlatform(e.target.value);
              }}
              placeholder="https://open.spotify.com/playlist/..."
              className="w-full h-11 px-4 rounded-xl bg-[#0E0D12] border border-white/[0.12] focus:border-[#FB9278] focus:outline-none text-[13px] text-[#F8FAFC] font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#948F9E] block">
              Nama Playlist di Koleksi Anda
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Contoh: Koleksi Impor Favorit"
              className="w-full h-11 px-4 rounded-xl bg-[#0E0D12] border border-white/[0.12] focus:border-[#FB9278] focus:outline-none text-[13px] text-[#F8FAFC]"
            />
          </div>

          {/* Preview of Matched Tracks */}
          <div className="rounded-2xl bg-[#121118] border border-white/[0.08] p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-[11.5px]">
              <span className="inline-flex items-center gap-1.5 text-[#6EE7B7] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  Platform Terdeteksi:{' '}
                  <strong className="uppercase">
                    {resolvedPlatform || 'SPOTIFY'}
                  </strong>
                </span>
              </span>
              <span className="font-mono text-[#948F9E]">
                6 lagu siap dicocokkan
              </span>
            </div>

            <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
              {ALL_TRACKS.slice(0, 4).map((tr, i) => (
                <div
                  key={tr.id}
                  className="flex items-center justify-between text-[12px] py-1 px-2 rounded-lg bg-white/[0.02]"
                >
                  <span className="text-[#F8FAFC] truncate">
                    {i + 1}. {tr.title} —{' '}
                    <span className="text-[#948F9E]">{tr.artist}</span>
                  </span>
                  <span className="text-[10.5px] font-mono text-[#FB9278]">
                    {tr.durationFormatted}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={closeImportPlaylistModal}
              className="px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-[13px] font-medium text-[#948F9E] hover:text-[#F8FAFC] cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isResolving}
              className="px-6 py-2.5 rounded-full bg-[#FB9278] hover:bg-[#FCA5A5] text-[#0E0D12] text-[13px] font-bold flex items-center gap-2 shadow-[0_0_24px_rgba(251,146,120,0.4)] cursor-pointer disabled:opacity-60"
            >
              {isResolving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengimpor Lagu...</span>
                </>
              ) : (
                <>
                  <ListMusic className="w-4 h-4" />
                  <span>Simpan ke Koleksi Saya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
