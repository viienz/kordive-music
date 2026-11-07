import React from 'react';
import {
  Play,
  Pause,
  Shuffle,
  Disc,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import { ALL_TRACKS, NEW_RELEASE_ALBUMS } from '../../data/mockCatalog';
import { usePlayerStore } from '../../store/usePlayerStore';

export const AlbumDetailView: React.FC = () => {
  const {
    activeAlbumId,
    openAlbumDetail,
    currentTrack,
    isPlaying,
    playTrack,
    playPlaylist,
    togglePlay,
    openTrackDetail,
    favoriteTrackIds,
    toggleFavorite,
  } = usePlayerStore();

  const album =
    NEW_RELEASE_ALBUMS.find((a) => a.id === activeAlbumId) ||
    NEW_RELEASE_ALBUMS[0];

  const albumTracks = ALL_TRACKS.filter((t) => album.trackIds.includes(t.id));
  const otherAlbums = NEW_RELEASE_ALBUMS.filter((a) => a.id !== album.id);

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Album Hero Header */}
      <section
        className={`rounded-[24px] p-6 sm:p-8 bg-gradient-to-br ${album.coverGradient} border border-white/[0.14] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 shadow-2xl`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div
            className={`w-28 h-28 sm:w-36 sm:h-36 rounded-[20px] bg-gradient-to-tr ${album.coverGradient} border border-white/20 shadow-2xl flex items-center justify-center shrink-0`}
          >
            <Disc className="w-12 h-12 text-[#FB9278]" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-black/35 border border-white/10 text-[11px] font-mono text-[#FB9278] uppercase">
              Album Rilis · {album.year} · {album.category}
            </span>
            <h1 className="text-[26px] sm:text-[32px] font-bold text-[#F8FAFC] tracking-tight">
              {album.title}
            </h1>
            <p className="text-[14px] font-semibold text-white/90">
              Oleh {album.artist}
            </p>
            <p className="text-[13px] text-white/75 max-w-xl">
              {album.description ||
                `Koleksi rekaman studio pilihan dari ${album.artist}.`}
            </p>
            <p className="text-[12px] font-mono text-[#948F9E]">
              {albumTracks.length} lagu dalam album ini
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => playPlaylist(album.trackIds, false)}
            className="px-6 py-3 rounded-full bg-[#FB9278] hover:bg-[#FCA5A5] text-[#0E0D12] text-[13.5px] font-bold flex items-center gap-2 shadow-[0_0_24px_rgba(251,146,120,0.4)] transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Putar Album</span>
          </button>

          <button
            onClick={() => playPlaylist(album.trackIds, true)}
            className="px-5 py-3 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-[#F8FAFC] text-[13.5px] font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Shuffle className="w-4 h-4 text-[#FB9278]" />
            <span>Shuffle</span>
          </button>
        </div>
      </section>

      {/* 2. Daftar Lagu dalam Album */}
      <section className="space-y-3.5">
        <h3 className="text-[17px] font-bold text-[#F8FAFC]">
          Daftar Lagu Album "{album.title}"
        </h3>

        <div className="rounded-[20px] velvet-glass divide-y divide-white/[0.05] overflow-hidden">
          {albumTracks.map((track, idx) => {
            const isCurrent = currentTrack.id === track.id;
            const isCurrentPlaying = isCurrent && isPlaying;
            const isFav = favoriteTrackIds.includes(track.id);

            return (
              <div
                key={track.id}
                onClick={() => (isCurrent ? togglePlay() : playTrack(track))}
                className={`p-3.5 px-5 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-[#FB9278]/[0.08]'
                    : 'hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="w-5 font-mono text-[12px] text-[#6B6775]">
                    {idx + 1}
                  </span>
                  <div
                    className={`w-11 h-11 rounded-[10px] bg-gradient-to-br ${track.coverGradient} border border-white/10 flex items-center justify-center shrink-0`}
                  >
                    {isCurrentPlaying ? (
                      <Pause className="w-4 h-4 text-[#FB9278] fill-current" />
                    ) : (
                      <Play className="w-4 h-4 text-white/80 fill-current ml-0.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openTrackDetail(track);
                      }}
                      className={`text-[14px] font-semibold truncate block text-left hover:underline cursor-pointer ${
                        isCurrent ? 'text-[#FB9278]' : 'text-[#F8FAFC]'
                      }`}
                    >
                      {track.title}
                    </button>
                    <p className="text-[12px] text-[#948F9E] truncate">
                      {track.artist} · {track.playCountFormatted || '1.8M'} diputar
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {track.isCachedOffline && (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6EE7B7]/12 text-[#6EE7B7] text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      Tersedia Offline
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(track.id);
                    }}
                    className="p-1.5 text-[#948F9E] hover:text-[#FB9278] cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'fill-[#FB9278] text-[#FB9278]' : ''
                      }`}
                    />
                  </button>

                  <span className="text-[12px] font-mono text-[#948F9E] w-10 text-right">
                    {track.durationFormatted}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Album Lainnya */}
      <section className="space-y-3.5">
        <h3 className="text-[17px] font-bold text-[#F8FAFC]">
          Album & EP Lainnya untuk Dijelajahi
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {otherAlbums.map((other) => (
            <div
              key={other.id}
              onClick={() => openAlbumDetail(other.id)}
              className="group rounded-[16px] p-3 bg-[#15141B]/90 border border-white/[0.08] hover:border-[#FB9278]/50 transition-all cursor-pointer"
            >
              <div
                className={`w-full aspect-square rounded-[12px] bg-gradient-to-br ${other.coverGradient} mb-3 p-3 flex flex-col justify-between border border-white/10`}
              >
                <span className="self-start px-2 py-0.5 rounded bg-black/40 text-[10px] font-mono text-white/80">
                  {other.year}
                </span>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    playPlaylist(other.trackIds);
                  }}
                  title="Putar Langsung"
                  className="self-end w-9 h-9 rounded-full bg-[#FB9278] text-[#0E0D12] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
              <h4 className="text-[13.5px] font-semibold text-[#F8FAFC] truncate group-hover:text-[#FB9278]">
                {other.title}
              </h4>
              <p className="text-[11.5px] text-[#948F9E] truncate mt-0.5">
                {other.artist} · {other.trackCount} lagu
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
