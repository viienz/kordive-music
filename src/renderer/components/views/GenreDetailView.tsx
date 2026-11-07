import React from 'react';
import {
  Play,
  Pause,
  Shuffle,
  Users,
  Sparkles,
  Disc,
  Heart,
  CheckCircle2,
  ListMusic,
  Music2,
} from 'lucide-react';
import { ALL_TRACKS, GENRE_HUBS } from '../../data/mockCatalog';
import { usePlayerStore } from '../../store/usePlayerStore';

export const GenreDetailView: React.FC = () => {
  const {
    activeGenreSlug,
    openGenreHub,
    currentTrack,
    isPlaying,
    playTrack,
    playPlaylist,
    togglePlay,
    openTrackDetail,
    openPlaylistDetail,
    openAlbumDetail,
    favoriteTrackIds,
    toggleFavorite,
  } = usePlayerStore();

  const genre =
    GENRE_HUBS.find((g) => g.slug === activeGenreSlug) || GENRE_HUBS[0];

  const genreTracks = ALL_TRACKS.filter(
    (t) =>
      t.genreSlug === genre.slug ||
      (genre.category !== 'All' && t.category === genre.category)
  );
  const displayTracks =
    genreTracks.length >= 3 ? genreTracks : ALL_TRACKS.slice(0, 6);

  return (
    <div className="space-y-8 pb-10">
      {/* Quick Genre Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {GENRE_HUBS.map((hub) => {
          const isCurrentHub = hub.slug === genre.slug;
          return (
            <button
              key={hub.slug}
              onClick={() => openGenreHub(hub.slug)}
              className={`px-4 py-1.5 rounded-full text-[12.5px] font-medium whitespace-nowrap border transition-all cursor-pointer ${
                isCurrentHub
                  ? 'bg-[#FB9278] text-[#0E0D12] border-[#FB9278] font-semibold'
                  : 'bg-[#16161C]/90 border-white/[0.08] text-[#948F9E] hover:text-[#F8FAFC]'
              }`}
            >
              {hub.title}
            </button>
          );
        })}
      </div>

      {/* 1. Genre Hero Header */}
      <section
        className={`relative rounded-[24px] p-6 sm:p-8 bg-gradient-to-br ${genre.bannerGradient} border border-white/[0.12] overflow-hidden shadow-2xl`}
      >
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: genre.accent }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/35 border border-white/10 text-[11px] font-mono text-[#FB9278] uppercase tracking-wider">
              <Music2 className="w-3.5 h-3.5" />
              Mood & Genre Hub
            </span>
            <h1 className="text-[28px] sm:text-[34px] font-bold text-[#F8FAFC] tracking-tight leading-tight">
              {genre.title}
            </h1>
            <p className="text-[13.5px] text-white/80 leading-relaxed">
              {genre.description}
            </p>
            <p className="text-[12px] font-mono text-[#948F9E]">
              {genre.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() =>
                playPlaylist(
                  displayTracks.map((t) => t.id),
                  false
                )
              }
              className="px-6 py-3 rounded-full bg-[#FB9278] hover:bg-[#FCA5A5] text-[#0E0D12] text-[13.5px] font-bold flex items-center gap-2 shadow-[0_0_24px_rgba(251,146,120,0.4)] transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Putar Semua</span>
            </button>

            <button
              onClick={() =>
                playPlaylist(
                  displayTracks.map((t) => t.id),
                  true
                )
              }
              className="px-5 py-3 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-[#F8FAFC] text-[13.5px] font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Shuffle className="w-4 h-4 text-[#FB9278]" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Lagu Pilihan di Genre Ini */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-[#F8FAFC]">
            Lagu Terpopuler di {genre.title}
          </h3>
          <span className="text-[12px] text-[#948F9E]">
            {displayTracks.length} lagu pilihan
          </span>
        </div>

        <div className="rounded-[20px] velvet-glass divide-y divide-white/[0.05] overflow-hidden">
          {displayTracks.map((track, idx) => {
            const isCurrent = currentTrack.id === track.id;
            const isCurrentPlaying = isCurrent && isPlaying;
            const isFav = favoriteTrackIds.includes(track.id);

            return (
              <div
                key={track.id}
                onClick={() => openTrackDetail(track)}
                className={`p-3.5 px-5 flex items-center justify-between gap-4 transition-colors cursor-pointer group ${
                  isCurrent
                    ? 'bg-[#FB9278]/[0.08]'
                    : 'hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="w-5 font-mono text-[12px] text-[#6B6775]">
                    {idx + 1}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isCurrent ? togglePlay() : playTrack(track);
                    }}
                    className={`w-11 h-11 rounded-[10px] bg-gradient-to-br ${track.coverGradient} border border-white/10 flex items-center justify-center shrink-0 cursor-pointer`}
                  >
                    {isCurrentPlaying ? (
                      <Pause className="w-4 h-4 text-[#FB9278] fill-current" />
                    ) : (
                      <Play className="w-4 h-4 text-white/80 fill-current ml-0.5" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <p
                      className={`text-[14px] font-semibold truncate group-hover:text-[#FB9278] ${
                        isCurrent ? 'text-[#FB9278]' : 'text-[#F8FAFC]'
                      }`}
                    >
                      {track.title}
                    </p>
                    <p className="text-[12px] text-[#948F9E] truncate">
                      {track.artist} · {track.album}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {track.isCachedOffline && (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6EE7B7]/12 text-[#6EE7B7] text-[11px] font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Offline
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

      {/* 3. Playlist Unggulan & Playlist Komunitas (Clicks open PlaylistDetailView) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="space-y-3.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FB9278]" />
            <h3 className="text-[17px] font-bold text-[#F8FAFC]">
              Playlist Unggulan
            </h3>
          </div>

          <div className="space-y-3">
            {genre.featuredPlaylists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => openPlaylistDetail(pl.id)}
                className="group p-4 rounded-[18px] velvet-glass hover:border-[#FB9278]/50 flex items-center justify-between gap-4 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-16 h-16 rounded-[14px] bg-gradient-to-br ${pl.coverGradient} border border-white/10 flex items-center justify-center shrink-0`}
                  >
                    <ListMusic className="w-6 h-6 text-[#FB9278]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10.5px] font-mono text-[#FB9278] uppercase">
                      {pl.creator} · {pl.trackCount} lagu
                    </span>
                    <h4 className="text-[15px] font-bold text-[#F8FAFC] group-hover:text-[#FB9278] transition-colors truncate">
                      {pl.name}
                    </h4>
                    <p className="text-[12px] text-[#948F9E] line-clamp-1 mt-0.5">
                      {pl.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playPlaylist(pl.trackIds);
                  }}
                  title="Putar Playlist"
                  className="w-10 h-10 rounded-full bg-[#FB9278] text-[#0E0D12] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3.5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#6EE7B7]" />
            <h3 className="text-[17px] font-bold text-[#F8FAFC]">
              Playlist dari Komunitas
            </h3>
          </div>

          <div className="space-y-3">
            {genre.communityPlaylists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => openPlaylistDetail(pl.id)}
                className="group p-4 rounded-[18px] velvet-glass hover:border-[#6EE7B7]/50 flex items-center justify-between gap-4 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-16 h-16 rounded-[14px] bg-gradient-to-br ${pl.coverGradient} border border-white/10 flex items-center justify-center shrink-0`}
                  >
                    <Users className="w-6 h-6 text-[#6EE7B7]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-[#6EE7B7]">
                        {pl.creator}
                      </span>
                      {pl.likesCount && (
                        <span className="text-[10.5px] font-mono text-[#6B6775]">
                          · {pl.likesCount} disukai
                        </span>
                      )}
                    </div>
                    <h4 className="text-[15px] font-bold text-[#F8FAFC] group-hover:text-[#6EE7B7] transition-colors truncate">
                      {pl.name}
                    </h4>
                    <p className="text-[12px] text-[#948F9E] line-clamp-1 mt-0.5">
                      {pl.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playPlaylist(pl.trackIds);
                  }}
                  title="Putar Playlist"
                  className="w-10 h-10 rounded-full bg-white/[0.08] group-hover:bg-[#6EE7B7] text-[#F8FAFC] group-hover:text-[#0E0D12] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 4. Album & EP Terkait (Clicks open AlbumDetailView) */}
      <section className="space-y-3.5">
        <div className="flex items-center gap-2">
          <Disc className="w-4 h-4 text-[#FB9278]" />
          <h3 className="text-[17px] font-bold text-[#F8FAFC]">
            Album & Rilis Terkait di {genre.title}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {genre.relatedAlbums.map((album) => (
            <div
              key={album.id}
              onClick={() => openAlbumDetail(album.id)}
              className="group p-3.5 rounded-[18px] bg-[#15141B]/90 border border-white/[0.08] hover:border-[#FB9278]/50 transition-all cursor-pointer"
            >
              <div
                className={`w-full aspect-square rounded-[12px] bg-gradient-to-br ${album.coverGradient} mb-3 p-3 flex items-end justify-end border border-white/10`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playPlaylist(album.trackIds);
                  }}
                  className="w-9 h-9 rounded-full bg-[#FB9278] text-[#0E0D12] flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
              <h4 className="text-[14px] font-bold text-[#F8FAFC] truncate group-hover:text-[#FB9278]">
                {album.title}
              </h4>
              <p className="text-[12px] text-[#948F9E] truncate mt-0.5">
                {album.artist} · {album.year}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
