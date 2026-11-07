import React, { useState, useMemo } from 'react';
import {
  Plus,
  CheckCircle2,
  Play,
  Pause,
  Heart,
  Disc,
  FolderPlus,
  Search,
  Shuffle,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { ALL_TRACKS, NEW_RELEASE_ALBUMS } from '../../data/mockCatalog';
import { usePlayerStore } from '../../store/usePlayerStore';
import { LibraryFilterTab } from '../../types/music';

type SortOption = 'recent' | 'title' | 'artist';

export const LibraryView: React.FC = () => {
  const {
    libraryFilterTab,
    openLibrarySection,
    playlists,
    favoriteTrackIds,
    toggleFavorite,
    currentTrack,
    isPlaying,
    playTrack,
    playPlaylist,
    togglePlay,
    openPlaylistDetail,
    openAlbumDetail,
    openTrackDetail,
    setCreatePlaylistModalOpen,
    addTrackToPlaylist,
  } = usePlayerStore();

  const [addingTrackId, setAddingTrackId] = useState<string | null>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [localFilterQuery, setLocalFilterQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const offlineTracks = ALL_TRACKS.filter((t) => t.isCachedOffline);
  const likedTracks = ALL_TRACKS.filter((t) => favoriteTrackIds.includes(t.id));

  const baseTracks =
    libraryFilterTab === 'liked'
      ? likedTracks
      : libraryFilterTab === 'offline'
      ? offlineTracks
      : ALL_TRACKS;

  const displayedTracks = useMemo(() => {
    const q = localFilterQuery.trim().toLowerCase();
    const filtered = q
      ? baseTracks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.artist.toLowerCase().includes(q) ||
            t.album.toLowerCase().includes(q)
        )
      : [...baseTracks];

    if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'artist') {
      filtered.sort((a, b) => a.artist.localeCompare(b.artist));
    }
    return filtered;
  }, [baseTracks, localFilterQuery, sortBy]);

  const filteredPlaylists = useMemo(() => {
    const q = localFilterQuery.trim().toLowerCase();
    if (!q) return playlists;
    return playlists.filter(
      (pl) =>
        pl.name.toLowerCase().includes(q) ||
        pl.description.toLowerCase().includes(q)
    );
  }, [playlists, localFilterQuery]);

  const filteredAlbums = useMemo(() => {
    const q = localFilterQuery.trim().toLowerCase();
    if (!q) return NEW_RELEASE_ALBUMS;
    return NEW_RELEASE_ALBUMS.filter(
      (al) =>
        al.title.toLowerCase().includes(q) ||
        al.artist.toLowerCase().includes(q)
    );
  }, [localFilterQuery]);

  const handleAddTrackToPl = (
    playlistId: string,
    playlistName: string,
    trackId: string
  ) => {
    addTrackToPlaylist(playlistId, trackId);
    setAddingTrackId(null);
    setAddedToast(`Ditambahkan ke playlist "${playlistName}"`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const sectionHeaderInfo = () => {
    switch (libraryFilterTab) {
      case 'liked':
        return {
          title: 'Lagu Disukai',
          subtitle: `${likedTracks.length} lagu favorit yang Anda tandai dengan ikon hati.`,
        };
      case 'offline':
        return {
          title: 'Tersedia Offline',
          subtitle: `${offlineTracks.length} lagu telah tersimpan di perangkat dan siap diputar tanpa koneksi internet.`,
        };
      case 'playlists':
        return {
          title: 'Playlist Pribadi',
          subtitle: `${playlists.length} koleksi playlist yang Anda susun atau impor.`,
        };
      case 'albums':
        return {
          title: 'Album Tersimpan',
          subtitle: `${NEW_RELEASE_ALBUMS.length} rilisan album dan EP di perpustakaan Anda.`,
        };
      default:
        return {
          title: 'Koleksi Musik Saya',
          subtitle:
            'Ringkasan seluruh playlist pribadi, album tersimpan, dan perpustakaan lagu Anda.',
        };
    }
  };

  const headerInfo = sectionHeaderInfo();

  return (
    <div className="space-y-7 pb-10">
      {/* 1. Header & Action Bar (Tanpa Duplikasi Tab Sidebar di Desktop) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[24px] font-bold text-[#F8FAFC] tracking-tight">
              {headerInfo.title}
            </h2>
            <p className="text-[13px] text-[#948F9E] mt-0.5">
              {headerInfo.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {displayedTracks.length > 0 &&
              libraryFilterTab !== 'playlists' &&
              libraryFilterTab !== 'albums' && (
                <>
                  <button
                    onClick={() =>
                      playPlaylist(
                        displayedTracks.map((t) => t.id),
                        false
                      )
                    }
                    className="px-4 py-2.5 rounded-full bg-[#FB9278] hover:bg-[#FCA5A5] text-[#0E0D12] text-[13px] font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(251,146,120,0.3)] transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Putar Semua</span>
                  </button>

                  <button
                    onClick={() =>
                      playPlaylist(
                        displayedTracks.map((t) => t.id),
                        true
                      )
                    }
                    title="Acak Koleksi"
                    className="px-4 py-2.5 rounded-full bg-[#16161C]/90 hover:bg-white/[0.06] border border-white/[0.1] text-[#F8FAFC] text-[13px] font-medium flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-[#FB9278]" />
                    <span className="hidden sm:inline">Shuffle</span>
                  </button>
                </>
              )}

            <button
              onClick={() => setCreatePlaylistModalOpen(true)}
              className="px-4 py-2.5 rounded-full bg-[#1B1A22] hover:bg-[#FB9278]/15 border border-white/[0.1] hover:border-[#FB9278]/45 text-[#F8FAFC] hover:text-[#FB9278] text-[13px] font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#FB9278]" />
              <span>Buat Playlist Baru</span>
            </button>
          </div>
        </div>

        {/* Mobile-Only Section Switcher (< md, since Desktop uses Sidebar Dropdown) */}
        <div className="flex md:hidden items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all' as LibraryFilterTab, label: 'Semua' },
            { id: 'liked' as LibraryFilterTab, label: 'Disukai' },
            { id: 'offline' as LibraryFilterTab, label: 'Offline' },
            { id: 'playlists' as LibraryFilterTab, label: 'Playlist' },
            { id: 'albums' as LibraryFilterTab, label: 'Album' },
          ].map((tab) => {
            const isSelected = libraryFilterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => openLibrarySection(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FB9278] text-[#0E0D12] border-[#FB9278] font-semibold'
                    : 'bg-[#16161C]/90 border-white/[0.08] text-[#948F9E]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Practical Library Filter & Sort Bar (Replacing Redundant Category Buttons) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-white/[0.07] pb-4">
          <div className="relative flex-1 min-w-[220px] max-w-[380px]">
            <Search className="w-3.5 h-3.5 text-[#948F9E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={localFilterQuery}
              onChange={(e) => setLocalFilterQuery(e.target.value)}
              placeholder="Filter lagu, artis, atau playlist di koleksi ini..."
              className="w-full h-9 pl-9 pr-8 rounded-xl bg-[#16161C]/90 border border-white/[0.08] focus:border-[#FB9278]/50 focus:outline-none text-[12.5px] text-[#F8FAFC] placeholder-[#6B6775]"
            />
            {localFilterQuery && (
              <button
                onClick={() => setLocalFilterQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#948F9E] hover:text-[#F8FAFC] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#FB9278]" />
            <span className="text-[12px] text-[#948F9E]">Urutkan:</span>
            <div className="flex items-center gap-1 bg-[#16161C]/90 p-1 rounded-xl border border-white/[0.07]">
              {[
                { id: 'recent' as SortOption, label: 'Terbaru' },
                { id: 'title' as SortOption, label: 'Judul A-Z' },
                { id: 'artist' as SortOption, label: 'Artis A-Z' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11.5px] font-medium transition-colors cursor-pointer ${
                    sortBy === opt.id
                      ? 'bg-[#FB9278]/20 text-[#FB9278]'
                      : 'text-[#948F9E] hover:text-[#F8FAFC]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {addedToast && (
          <div className="px-4 py-2.5 rounded-xl bg-[#6EE7B7]/15 border border-[#6EE7B7]/40 text-[#6EE7B7] text-[12.5px] font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{addedToast}</span>
          </div>
        )}
      </section>

      {/* 2. Koleksi Playlist Saya Grid */}
      {(libraryFilterTab === 'all' || libraryFilterTab === 'playlists') && (
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] font-bold text-[#F8FAFC]">
              Playlist Pribadi ({filteredPlaylists.length})
            </h3>
            <span className="text-[12px] text-[#948F9E]">
              Klik playlist untuk membuka daftar lagu di dalamnya
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Buat Playlist Baru Card */}
            <button
              onClick={() => setCreatePlaylistModalOpen(true)}
              className="group p-4 rounded-[18px] bg-[#15141B]/70 border border-dashed border-white/[0.15] hover:border-[#FB9278] transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[148px] gap-2.5"
            >
              <div className="w-11 h-11 rounded-full bg-[#FB9278]/15 text-[#FB9278] flex items-center justify-center group-hover:scale-110 transition-transform">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[13.5px] font-bold text-[#F8FAFC] group-hover:text-[#FB9278]">
                  Buat Playlist Baru
                </p>
                <p className="text-[11px] text-[#948F9E] mt-0.5">
                  Susun lagu sesuai suasana Anda
                </p>
              </div>
            </button>

            {filteredPlaylists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => openPlaylistDetail(pl.id)}
                className={`group p-4 rounded-[18px] bg-gradient-to-br ${pl.coverGradient} border border-white/[0.08] hover:border-[#FB9278]/50 transition-all cursor-pointer flex flex-col justify-between min-h-[148px]`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/40 text-[10.5px] font-mono text-[#FB9278]">
                    {pl.trackCount} lagu
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playPlaylist(pl.trackIds);
                    }}
                    title="Putar Playlist"
                    className="w-8 h-8 rounded-full bg-[#FB9278] text-[#0E0D12] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </button>
                </div>
                <div className="mt-4">
                  <h4 className="text-[14.5px] font-bold text-[#F8FAFC] group-hover:text-[#FB9278] transition-colors truncate">
                    {pl.name}
                  </h4>
                  <p className="text-[11.5px] text-white/70 line-clamp-2 mt-0.5">
                    {pl.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Album Tersimpan Grid (Clicks open AlbumDetailView) */}
      {(libraryFilterTab === 'all' || libraryFilterTab === 'albums') && (
        <section className="space-y-3.5">
          <div className="flex items-center gap-2">
            <Disc className="w-4 h-4 text-[#FB9278]" />
            <h3 className="text-[17px] font-bold text-[#F8FAFC]">
              Album Tersimpan ({filteredAlbums.length})
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredAlbums.map((album) => (
              <div
                key={album.id}
                onClick={() => openAlbumDetail(album.id)}
                className="group rounded-[16px] p-3 bg-[#15141B]/90 border border-white/[0.08] hover:border-[#FB9278]/50 transition-all cursor-pointer"
              >
                <div
                  className={`w-full aspect-square rounded-[12px] bg-gradient-to-br ${album.coverGradient} mb-3 p-3 flex items-end justify-end border border-white/10`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playPlaylist(album.trackIds);
                    }}
                    title="Putar Album"
                    className="w-9 h-9 rounded-full bg-[#FB9278] text-[#0E0D12] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                </div>
                <h4 className="text-[13.5px] font-semibold text-[#F8FAFC] truncate group-hover:text-[#FB9278]">
                  {album.title}
                </h4>
                <p className="text-[11.5px] text-[#948F9E] truncate mt-0.5">
                  {album.artist} · {album.year}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Daftar Lagu Tersimpan */}
      {libraryFilterTab !== 'playlists' && libraryFilterTab !== 'albums' && (
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[17px] font-bold text-[#F8FAFC]">
              {libraryFilterTab === 'liked'
                ? `Daftar Lagu Disukai (${displayedTracks.length})`
                : libraryFilterTab === 'offline'
                ? `Daftar Lagu Offline (${displayedTracks.length})`
                : `Semua Lagu di Koleksi (${displayedTracks.length})`}
            </h3>
          </div>

          <div className="rounded-[20px] velvet-glass overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[11px] font-mono uppercase text-[#6B6775]">
                    <th className="py-3.5 px-4 w-12">#</th>
                    <th className="py-3.5 px-4">Judul Lagu</th>
                    <th className="py-3.5 px-4 hidden sm:table-cell">Album</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">
                      Ditambahkan
                    </th>
                    <th className="py-3.5 px-4">Status Offline</th>
                    <th className="py-3.5 px-4 text-right">Durasi</th>
                    <th className="py-3.5 px-4 text-right w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-[13px]">
                  {displayedTracks.map((track, idx) => {
                    const isCurrent = currentTrack.id === track.id;
                    const isCurrentPlaying = isCurrent && isPlaying;
                    const isFav = favoriteTrackIds.includes(track.id);

                    return (
                      <tr
                        key={track.id}
                        onClick={() => openTrackDetail(track)}
                        className={`transition-colors cursor-pointer group ${
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
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                isCurrent ? togglePlay() : playTrack(track);
                              }}
                              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${track.coverGradient} border border-white/10 flex items-center justify-center shrink-0 cursor-pointer`}
                            >
                              {isCurrentPlaying ? (
                                <Pause className="w-3.5 h-3.5 text-[#FB9278] fill-current" />
                              ) : (
                                <Play className="w-3.5 h-3.5 text-white/80 fill-current ml-0.5" />
                              )}
                            </button>
                            <div className="min-w-0">
                              <p
                                className={`font-semibold group-hover:text-[#FB9278] truncate ${
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
                        </td>

                        <td className="py-3 px-4 hidden sm:table-cell text-[#948F9E]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (track.albumId) openAlbumDetail(track.albumId);
                            }}
                            className="hover:text-[#FB9278] hover:underline cursor-pointer"
                          >
                            {track.album}
                          </button>
                        </td>

                        <td className="py-3 px-4 hidden md:table-cell text-[12px] text-[#6B6775]">
                          {track.addedAt || 'Baru saja'}
                        </td>

                        <td className="py-3 px-4">
                          {track.isCachedOffline ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6EE7B7]/12 border border-[#6EE7B7]/35 text-[#6EE7B7] text-[11px] font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              Tersedia Offline
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] text-[#948F9E] text-[11px]">
                              Streaming
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right font-mono text-[12px] text-[#948F9E]">
                          {track.durationFormatted}
                        </td>

                        <td className="py-3 px-4 text-right relative">
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5"
                          >
                            <button
                              onClick={() =>
                                setAddingTrackId(
                                  addingTrackId === track.id ? null : track.id
                                )
                              }
                              title="Tambahkan ke Playlist"
                              className="p-1.5 rounded-lg text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.06] cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => toggleFavorite(track.id)}
                              title="Suka"
                              className="p-1.5 rounded-lg text-[#948F9E] hover:text-[#FB9278] cursor-pointer"
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  isFav ? 'fill-[#FB9278] text-[#FB9278]' : ''
                                }`}
                              />
                            </button>

                            {addingTrackId === track.id && (
                              <div className="absolute right-4 top-11 z-30 w-52 rounded-xl velvet-glass p-2 shadow-2xl border border-white/15 text-left space-y-1">
                                <p className="px-2 py-1 text-[10.5px] font-mono uppercase text-[#6B6775]">
                                  Simpan ke Playlist:
                                </p>
                                {playlists.map((pl) => (
                                  <button
                                    key={pl.id}
                                    onClick={() =>
                                      handleAddTrackToPl(pl.id, pl.name, track.id)
                                    }
                                    className="w-full px-2.5 py-1.5 rounded-lg text-[12px] text-[#F8FAFC] hover:bg-[#FB9278]/20 hover:text-[#FB9278] text-left truncate block cursor-pointer"
                                  >
                                    {pl.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
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
