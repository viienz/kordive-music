import React from 'react';
import {
  Play,
  Pause,
  Heart,
  Clock,
  TrendingUp,
  Sparkles,
  Disc,
  ArrowUpRight,
  CheckCircle2,
  ListMusic,
} from 'lucide-react';
import { HeroCoverFlow } from '../home/HeroCoverFlow';
import {
  MOOD_CATEGORIES,
  ALL_TRACKS,
  DAILY_MIXES,
  NEW_RELEASE_ALBUMS,
} from '../../data/mockCatalog';
import { usePlayerStore } from '../../store/usePlayerStore';

export const HomeView: React.FC = () => {
  const {
    selectedCategory,
    openGenreByCategory,
    currentTrack,
    isPlaying,
    playTrack,
    playPlaylist,
    togglePlay,
    openTrackDetail,
    openPlaylistDetail,
    openAlbumDetail,
    openLibrarySection,
    recentlyPlayedIds,
    favoriteTrackIds,
    toggleFavorite,
    setActiveTab,
  } = usePlayerStore();

  const recentlyPlayedTracks = recentlyPlayedIds
    .map((id) => ALL_TRACKS.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const quickPickTracks = ALL_TRACKS.filter((t) =>
    favoriteTrackIds.includes(t.id)
  )
    .concat(
      ALL_TRACKS.filter((t) => !favoriteTrackIds.includes(t.id)).slice(0, 4)
    )
    .slice(0, 6);

  const trendingTracks = [...ALL_TRACKS].slice(0, 6);

  return (
    <div className="space-y-8 pb-10">
      {/* 1. 3D Stacked Cover Flow Hero Section (Supports Swipe/Drag & Direct Page Routing) */}
      <HeroCoverFlow />

      {/* 2. Mood & Genre Quick Chips (Clicks navigate to GenreDetailView) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[17px] font-bold text-[#F8FAFC] tracking-tight">
              Jelajahi Mood & Suasana
            </h3>
            <p className="text-[12px] text-[#948F9E]">
              Pilih suasana untuk membuka halaman kurasi lagu, playlist komunitas, dan album terkait
            </p>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="text-[12px] font-medium text-[#FB9278] hover:text-[#FCA5A5] flex items-center gap-1 cursor-pointer"
          >
            <span>Lihat Semua Genre</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {MOOD_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => openGenreByCategory(category)}
                className={`px-5 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-150 cursor-pointer border ${
                  isActive
                    ? 'bg-[#FB9278]/15 border-[#FB9278] text-[#FB9278] shadow-[0_0_14px_rgba(251,146,120,0.18)]'
                    : 'bg-[#16161C]/85 border-white/[0.09] text-[#948F9E] hover:text-[#F8FAFC] hover:border-[#FB9278]/50'
                }`}
              >
                {category === 'All' ? 'Semua' : category}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Sering Diputar & Favorit Anda (Quick Picks 2-Column Grid) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#FB9278]" />
            <h3 className="text-[17px] font-bold text-[#F8FAFC] tracking-tight">
              Favorit & Sering Anda Putar
            </h3>
          </div>
          <button
            onClick={() => openLibrarySection('liked')}
            className="text-[12px] font-medium text-[#FB9278] hover:text-[#FCA5A5] transition-colors cursor-pointer"
          >
            Buka Lagu Disukai
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickPickTracks.map((track) => {
            const isCurrent = currentTrack.id === track.id;
            const isCurrentPlaying = isCurrent && isPlaying;
            const isFav = favoriteTrackIds.includes(track.id);

            return (
              <div
                key={`qp-${track.id}`}
                onClick={() => openTrackDetail(track)}
                className={`group flex items-center justify-between gap-3 p-2.5 rounded-[14px] bg-[#15141B]/90 border transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-[#FB9278]/50 bg-[#FB9278]/[0.07]'
                    : 'border-white/[0.07] hover:border-white/[0.18] hover:bg-[#1B1A22]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      isCurrent ? togglePlay() : playTrack(track);
                    }}
                    title={isCurrentPlaying ? 'Jeda' : 'Putar'}
                    className={`relative w-12 h-12 rounded-[10px] bg-gradient-to-br ${track.coverGradient} border border-white/10 flex items-center justify-center shrink-0 overflow-hidden`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full bg-[#FB9278] text-[#0E0D12] flex items-center justify-center transition-opacity ${
                        isCurrentPlaying
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {isCurrentPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-[13.5px] font-semibold truncate group-hover:text-[#FB9278] transition-colors ${
                        isCurrent ? 'text-[#FB9278]' : 'text-[#F8FAFC]'
                      }`}
                    >
                      {track.title}
                    </p>
                    <p className="text-[11.5px] text-[#948F9E] truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(track.id);
                  }}
                  className="p-2 text-[#948F9E] hover:text-[#FB9278] shrink-0 cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFav ? 'fill-[#FB9278] text-[#FB9278]' : ''
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Baru Diputar (Listening History — Click Card opens TrackDetailView) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FB9278]" />
            <h3 className="text-[17px] font-bold text-[#F8FAFC] tracking-tight">
              Baru Saja Didengarkan
            </h3>
          </div>
          <span className="text-[11.5px] text-[#6B6775]">
            Klik kartu untuk detail lagu atau tombol Play untuk memutar
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {recentlyPlayedTracks.slice(0, 6).map((track) => {
            const isThisTrack = currentTrack.id === track.id;
            const isThisPlaying = isThisTrack && isPlaying;

            return (
              <div
                key={`recent-${track.id}`}
                onClick={() => openTrackDetail(track)}
                className={`group relative rounded-[16px] p-3 bg-[#15141B]/90 border transition-all duration-150 hover:scale-[1.02] cursor-pointer flex flex-col justify-between ${
                  isThisTrack
                    ? 'border-[#FB9278]/60 shadow-[0_0_20px_rgba(251,146,120,0.14)]'
                    : 'border-white/[0.08] hover:border-white/[0.2]'
                }`}
              >
                <div
                  className={`relative w-full aspect-square rounded-[12px] bg-gradient-to-br ${track.coverGradient} mb-3 overflow-hidden flex items-center justify-center border border-white/[0.06]`}
                >
                  {track.isCachedOffline && (
                    <span
                      title="Tersedia Offline"
                      className="absolute top-2 left-2 p-1 rounded-full bg-black/45 backdrop-blur-md text-[#6EE7B7]"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isThisTrack ? togglePlay() : playTrack(track);
                    }}
                    title={isThisPlaying ? 'Jeda' : 'Putar'}
                    className={`w-10 h-10 rounded-full bg-[#FB9278] text-[#0E0D12] flex items-center justify-center shadow-lg transition-all duration-150 cursor-pointer ${
                      isThisPlaying
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'
                    }`}
                  >
                    {isThisPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                <div>
                  <h4 className="text-[13.5px] font-semibold text-[#F8FAFC] truncate group-hover:text-[#FB9278] transition-colors">
                    {track.title.replace(' (Acoustic)', '')}
                  </h4>
                  <p className="text-[11.5px] text-[#948F9E] truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Sedang Hits & Banyak Didengarkan (Trending Charts) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#FB9278]" />
            <h3 className="text-[17px] font-bold text-[#F8FAFC] tracking-tight">
              Sedang Hits & Banyak Didengarkan
            </h3>
          </div>
          <button
            onClick={() => openGenreByCategory('All')}
            className="text-[12px] font-medium text-[#FB9278] hover:text-[#FCA5A5] cursor-pointer"
          >
            Lihat Top 50 Chart
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {trendingTracks.map((track, idx) => {
            const isCurrent = currentTrack.id === track.id;
            const isCurrentPlaying = isCurrent && isPlaying;

            return (
              <div
                key={`trend-${track.id}`}
                onClick={() => openTrackDetail(track)}
                className={`p-3 rounded-[15px] velvet-glass-subtle flex items-center justify-between gap-3 transition-all cursor-pointer group ${
                  isCurrent
                    ? 'border-[#FB9278]/50 bg-[#FB9278]/[0.08]'
                    : 'hover:border-white/[0.16]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-6 text-center font-mono text-[14px] font-bold text-[#FB9278]">
                    0{idx + 1}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      isCurrent ? togglePlay() : playTrack(track);
                    }}
                    className={`w-11 h-11 rounded-[10px] bg-gradient-to-br ${track.coverGradient} border border-white/10 shrink-0 flex items-center justify-center cursor-pointer`}
                  >
                    {isCurrentPlaying ? (
                      <Pause className="w-4 h-4 text-[#FB9278] fill-current" />
                    ) : (
                      <Play className="w-4 h-4 text-white/80 fill-current ml-0.5" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <p
                      className={`text-[13.5px] font-semibold truncate group-hover:text-[#FB9278] transition-colors ${
                        isCurrent ? 'text-[#FB9278]' : 'text-[#F8FAFC]'
                      }`}
                    >
                      {track.title}
                    </p>
                    <p className="text-[11.5px] text-[#948F9E] truncate">
                      {track.artist} · {track.playCountFormatted || '2.1M'} diputar
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11.5px] font-mono text-[#6B6775]">
                    {track.durationFormatted}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Mix Pilihan Untukmu (Clicks navigate directly to PlaylistDetailView!) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FB9278]" />
            <h3 className="text-[17px] font-bold text-[#F8FAFC] tracking-tight">
              Mix Pilihan Untukmu
            </h3>
          </div>
          <span className="text-[11.5px] text-[#6B6775]">
            Klik mix untuk melihat daftar seluruh lagu di dalamnya
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DAILY_MIXES.map((mix) => (
            <div
              key={mix.id}
              onClick={() => openPlaylistDetail(mix.id)}
              className="group rounded-[18px] p-4 bg-[#15141B]/90 border border-white/[0.08] hover:border-[#FB9278]/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div
                className={`relative w-full h-32 rounded-[14px] bg-gradient-to-br ${mix.coverGradient} p-3.5 flex flex-col justify-between mb-3.5 border border-white/10`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-mono text-[#FB9278]">
                    {mix.trackCount} lagu
                  </span>
                  <ListMusic className="w-4 h-4 text-white/70" />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-[11px] font-medium text-white/80">
                    {mix.creator}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playPlaylist(mix.trackIds);
                    }}
                    title="Putar Langsung"
                    className="w-9 h-9 rounded-full bg-[#FB9278] text-[#0E0D12] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-[14px] font-bold text-[#F8FAFC] group-hover:text-[#FB9278] transition-colors">
                  {mix.name}
                </h4>
                <p className="text-[11.5px] text-[#948F9E] line-clamp-2 mt-1">
                  {mix.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Rilis Album & EP Terbaru (Clicks navigate directly to AlbumDetailView!) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Disc className="w-4 h-4 text-[#FB9278]" />
            <h3 className="text-[17px] font-bold text-[#F8FAFC] tracking-tight">
              Rilis Album & EP Terbaru
            </h3>
          </div>
          <span className="text-[11.5px] text-[#6B6775]">
            Klik album untuk membuka halaman lagu album terkait
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {NEW_RELEASE_ALBUMS.map((album) => (
            <div
              key={album.id}
              onClick={() => openAlbumDetail(album.id)}
              className="group rounded-[16px] p-3 bg-[#15141B]/90 border border-white/[0.08] hover:border-[#FB9278]/50 transition-all cursor-pointer"
            >
              <div
                className={`w-full aspect-square rounded-[12px] bg-gradient-to-br ${album.coverGradient} mb-3 p-3 flex flex-col justify-between border border-white/10`}
              >
                <span className="self-start px-2 py-0.5 rounded bg-black/40 text-[10px] font-mono text-white/80">
                  {album.year}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playPlaylist(album.trackIds);
                  }}
                  title="Putar Album"
                  className="self-end w-9 h-9 rounded-full bg-[#FB9278] text-[#0E0D12] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
              <h4 className="text-[13.5px] font-semibold text-[#F8FAFC] truncate group-hover:text-[#FB9278]">
                {album.title}
              </h4>
              <p className="text-[11.5px] text-[#948F9E] truncate mt-0.5">
                {album.artist} · {album.trackCount} lagu
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
