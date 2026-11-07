import React, { useState } from 'react';
import {
  Check,
  Play,
  Pause,
  Plus,
  Compass,
  TrendingUp,
  Disc,
  Grid,
  Link2,
  AlertTriangle,
  Heart,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import {
  ALL_TRACKS,
  GENRE_HUBS,
  NEW_RELEASE_ALBUMS,
} from '../../data/mockCatalog';
import { usePlayerStore } from '../../store/usePlayerStore';
import { validateIngestionUrl } from '../../services/kordiveBridge';

type ExploreSubTab = 'all' | 'genres' | 'charts' | 'releases' | 'import';

export const ExploreView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    ingestedBanner,
    saveIngestedToLibrary,
    currentTrack,
    isPlaying,
    playTrack,
    playPlaylist,
    togglePlay,
    openGenreHub,
    openTrackDetail,
    openAlbumDetail,
    favoriteTrackIds,
    toggleFavorite,
  } = usePlayerStore();

  const [subTab, setSubTab] = useState<ExploreSubTab>('all');

  const urlCheck =
    searchQuery.trim().startsWith('http://') ||
    searchQuery.trim().startsWith('https://')
      ? validateIngestionUrl(searchQuery)
      : null;

  const filteredTracks = ALL_TRACKS.filter((track) => {
    if (!searchQuery.trim() || searchQuery.startsWith('http')) return true;
    const q = searchQuery.toLowerCase();
    return (
      track.title.toLowerCase().includes(q) ||
      track.artist.toLowerCase().includes(q) ||
      track.album.toLowerCase().includes(q) ||
      track.category.toLowerCase().includes(q)
    );
  });

  const SUB_TABS: {
    id: ExploreSubTab;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'all', label: 'Semua Eksplorasi', icon: Compass },
    { id: 'genres', label: 'Mood & Genre', icon: Grid },
    { id: 'charts', label: 'Tangga Lagu', icon: TrendingUp },
    { id: 'releases', label: 'Rilis Baru', icon: Disc },
    { id: 'import', label: 'Impor Playlist', icon: Link2 },
  ];

  return (
    <div className="space-y-7 pb-10">
      {/* 1. Structured Sub-Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {SUB_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium flex items-center gap-2 whitespace-nowrap border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FB9278] text-[#0E0D12] border-[#FB9278] font-semibold shadow-[0_0_16px_rgba(251,146,120,0.28)]'
                    : 'bg-[#16161C]/90 border-white/[0.08] text-[#948F9E] hover:text-[#F8FAFC] hover:border-white/[0.2]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Invalid Link Alert */}
      {urlCheck && !urlCheck.isValidUrl && (
        <div className="p-4 rounded-[18px] bg-red-500/10 border border-red-500/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <h4 className="text-[13.5px] font-semibold text-red-200">
                Tautan Playlist Tidak Didukung
              </h4>
              <p className="text-[12px] text-red-300/80">
                Pastikan Anda menempelkan tautan playlist publik dari Spotify, YouTube Music, atau SoundCloud.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-200 text-[12px] font-medium cursor-pointer"
          >
            Bersihkan
          </button>
        </div>
      )}

      {/* 2. Clean Commercial Playlist Import Card */}
      {(subTab === 'all' || subTab === 'import') && ingestedBanner && (
        <section className="p-5 sm:p-6 rounded-[22px] bg-gradient-to-r from-[#26181D]/95 via-[#1B1722]/95 to-[#16161C]/95 border border-white/[0.12] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 rounded-[16px] bg-gradient-to-br from-[#642026] to-[#1A1318] border border-white/15 flex items-center justify-center shrink-0 shadow-lg">
              <Link2 className="w-6 h-6 text-[#FB9278]" />
            </div>
            <div className="space-y-1 min-w-0">
              <span className="text-[11px] font-medium text-[#FB9278]">
                Playlist Terdeteksi · {ingestedBanner.trackCount} Lagu
              </span>
              <h2 className="text-[18px] font-bold text-[#F8FAFC] truncate">
                {ingestedBanner.title}
              </h2>
              <p className="text-[12.5px] text-[#948F9E] truncate">
                Oleh {ingestedBanner.creator} · Siap ditambahkan ke koleksi Anda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => playPlaylist(ALL_TRACKS.map((t) => t.id))}
              className="px-4 py-2.5 rounded-full bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 text-[#F8FAFC] text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Putar</span>
            </button>

            <button
              onClick={saveIngestedToLibrary}
              disabled={ingestedBanner.savedToLibrary}
              className={`px-5 py-2.5 rounded-full text-[13px] font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                ingestedBanner.savedToLibrary
                  ? 'bg-[#6EE7B7]/15 text-[#6EE7B7] border border-[#6EE7B7]/40'
                  : 'bg-[#FB9278] hover:bg-[#FCA5A5] text-[#0E0D12] shadow-[0_0_20px_rgba(251,146,120,0.3)]'
              }`}
            >
              {ingestedBanner.savedToLibrary ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Tersimpan di Koleksi</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Simpan ke Koleksi</span>
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {/* 3. Mood & Genre Hub Grid (Clicks open dedicated GenreDetailView) */}
      {(subTab === 'all' || subTab === 'genres') && (
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[18px] font-bold text-[#F8FAFC]">
                Mood & Genre
              </h3>
              <p className="text-[12px] text-[#948F9E]">
                Klik kategori untuk membuka halaman kurasi lagu, playlist unggulan, dan komunitas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {GENRE_HUBS.map((hub) => (
              <button
                key={hub.slug}
                onClick={() => openGenreHub(hub.slug)}
                className={`group relative p-4.5 rounded-[18px] bg-gradient-to-br ${hub.bannerGradient} border border-white/[0.08] hover:border-[#FB9278]/50 text-left transition-all duration-150 overflow-hidden cursor-pointer flex flex-col justify-between min-h-[118px]`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className="w-2.5 h-7 rounded-full transition-transform group-hover:scale-y-110"
                    style={{ backgroundColor: hub.accent }}
                  />
                  <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-[#FB9278] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="mt-4">
                  <h4 className="text-[15px] font-bold text-[#F8FAFC] group-hover:text-[#FB9278] transition-colors">
                    {hub.title}
                  </h4>
                  <p className="text-[11.5px] text-white/65 mt-0.5 truncate">
                    {hub.subtitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 4. Rilis Album & EP Terbaru */}
      {(subTab === 'all' || subTab === 'releases') && (
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-[#F8FAFC]">
              Album & Single Rilis Baru
            </h3>
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
      )}

      {/* 5. Daftar Lagu Populer & Hasil Pencarian */}
      {(subTab === 'all' || subTab === 'charts' || subTab === 'import') && (
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-[#F8FAFC]">
              {searchQuery.trim() && !searchQuery.startsWith('http')
                ? `Hasil Pencarian untuk "${searchQuery}"`
                : 'Tangga Lagu Terpopuler'}
            </h3>
            <span className="text-[12px] text-[#948F9E]">
              {filteredTracks.length} lagu
            </span>
          </div>

          <div className="rounded-[20px] velvet-glass overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[11px] font-mono uppercase text-[#6B6775]">
                    <th className="py-3.5 px-4 w-12">#</th>
                    <th className="py-3.5 px-4">Judul & Artis</th>
                    <th className="py-3.5 px-4 hidden sm:table-cell">Album</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Pemutaran</th>
                    <th className="py-3.5 px-4 text-right">Durasi</th>
                    <th className="py-3.5 px-4 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-[13px]">
                  {filteredTracks.map((track, idx) => {
                    const isCurrent = currentTrack.id === track.id;
                    const isCurrentPlaying = isCurrent && isPlaying;
                    const isFav = favoriteTrackIds.includes(track.id);

                    return (
                      <tr
                        key={track.id}
                        onClick={() =>
                          isCurrent ? togglePlay() : playTrack(track)
                        }
                        className={`transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-[#FB9278]/[0.08]'
                            : 'hover:bg-white/[0.03]'
                        }`}
                      >
                        <td className="py-3 px-4 font-mono text-[12px] text-[#948F9E]">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${track.coverGradient} border border-white/10 shrink-0 flex items-center justify-center`}
                            >
                              {isCurrentPlaying ? (
                                <Pause className="w-3.5 h-3.5 text-[#FB9278] fill-current" />
                              ) : (
                                <Play className="w-3.5 h-3.5 text-white/80 fill-current ml-0.5" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openTrackDetail(track);
                                }}
                                className={`font-semibold hover:underline block text-left truncate cursor-pointer ${
                                  isCurrent ? 'text-[#FB9278]' : 'text-[#F8FAFC]'
                                }`}
                              >
                                {track.title}
                              </button>
                              <p className="text-[11.5px] text-[#948F9E] truncate">
                                {track.artist}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell text-[#948F9E]">
                          {track.album}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-mono text-[#948F9E]">
                              {track.playCountFormatted || '1.4M'}
                            </span>
                            {track.isCachedOffline && (
                              <span
                                title="Tersedia Offline"
                                className="text-[#6EE7B7]"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[12px] text-[#948F9E]">
                          {track.durationFormatted}
                        </td>
                        <td className="py-3 px-4 text-center">
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
