import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Disc3,
  Link2,
  X,
  ArrowLeft,
  Plus,
  ChevronRight,
  Play,
  Disc,
  ListMusic,
  Music,
} from 'lucide-react';
import {
  ALL_SYSTEM_PLAYLISTS,
  ALL_TRACKS,
  NEW_RELEASE_ALBUMS,
} from '../../data/mockCatalog';
import { usePlayerStore } from '../../store/usePlayerStore';

export const TopBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeTab,
    activeSettingsSection,
    userProfile,
    playlists,
    setActiveTab,
    openSettingsPage,
    openTrackDetail,
    openAlbumDetail,
    openPlaylistDetail,
    playTrack,
    setCreatePlaylistModalOpen,
    openImportPlaylistModal,
    goBack,
  } = usePlayerStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSubPage =
    activeTab === 'genre-detail' ||
    activeTab === 'track-detail' ||
    activeTab === 'album-detail' ||
    activeTab === 'playlist-detail' ||
    activeTab === 'settings';

  const initials = userProfile.displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isProfileActive =
    activeTab === 'settings' && activeSettingsSection === 'profile';

  // Live Instant Search Results across Tracks, Albums, & Playlists
  const liveResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedTracks = ALL_TRACKS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedAlbums = NEW_RELEASE_ALBUMS.filter(
      (a) =>
        a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q)
    ).slice(0, 2);

    const allPl = [...playlists, ...ALL_SYSTEM_PLAYLISTS];
    const matchedPlaylists = allPl
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
      .slice(0, 2);

    return {
      tracks: matchedTracks,
      albums: matchedAlbums,
      playlists: matchedPlaylists,
      total:
        matchedTracks.length +
        matchedAlbums.length +
        matchedPlaylists.length,
    };
  }, [searchQuery, playlists]);

  return (
    <header className="w-full flex items-center justify-between gap-4 pb-3.5 shrink-0 relative z-30">
      {/* Left: Mobile Brand or Sub-Page Back Button + Universal Search */}
      <div className="flex items-center gap-3 flex-1 max-w-[580px]">
        {isSubPage ? (
          <button
            onClick={goBack}
            title="Kembali ke halaman sebelumnya"
            className="w-10 h-10 rounded-full bg-[#16161C]/90 border border-white/[0.08] hover:border-[#FB9278]/50 text-[#948F9E] hover:text-[#F8FAFC] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div
            onClick={() => setActiveTab('home')}
            className="flex md:hidden items-center gap-2 shrink-0 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#FB9278]/15 border border-[#FB9278]/40 flex items-center justify-center">
              <Disc3 className="w-3.5 h-3.5 text-[#FB9278]" />
            </div>
            <span className="text-[18px] font-bold tracking-tight text-[#F8FAFC]">
              Kordive
            </span>
          </div>
        )}

        {/* Universal Search & Playlist Import Input */}
        <div ref={searchWrapperRef} className="relative flex-1">
          <Search className="w-4 h-4 text-[#948F9E] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="kordive-global-search-input"
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchFocused(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                setIsSearchFocused(false);
                setActiveTab('explore');
              } else if (e.key === 'Escape') {
                setIsSearchFocused(false);
              }
            }}
            placeholder="Cari lagu, artis, album, atau tempel link playlist... (Ctrl+K)"
            className="w-full h-[42px] pl-11 pr-28 rounded-full bg-[#16161C]/90 border border-white/[0.08] focus:border-[#FB9278]/60 focus:outline-none text-[13px] text-[#F8FAFC] placeholder-[#6B6775] transition-colors"
          />
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchFocused(false);
              }}
              title="Bersihkan pencarian"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.08] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => openImportPlaylistModal()}
              title="Impor Playlist dari Spotify / YouTube Music / SoundCloud"
              className="hidden sm:flex items-center gap-1.5 absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-[#FB9278]/12 hover:bg-[#FB9278]/20 border border-[#FB9278]/30 text-[11px] font-medium text-[#FB9278] transition-colors cursor-pointer"
            >
              <Link2 className="w-3 h-3" />
              <span>Impor Link</span>
            </button>
          )}

          {/* Live Global Search Popover Dropdown */}
          {isSearchFocused && liveResults && (
            <div className="absolute left-0 right-0 top-[48px] rounded-[20px] velvet-glass border border-white/[0.15] p-3.5 shadow-[0_24px_60px_rgba(0,0,0,0.85)] space-y-3 max-h-[420px] overflow-y-auto z-50">
              {liveResults.total === 0 ? (
                <div className="py-5 text-center space-y-2">
                  <p className="text-[13px] text-[#948F9E]">
                    Tidak ditemukan hasil untuk "{searchQuery}"
                  </p>
                  <button
                    onClick={() => {
                      setIsSearchFocused(false);
                      openImportPlaylistModal(searchQuery);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#FB9278]/15 text-[#FB9278] text-[12px] font-semibold cursor-pointer"
                  >
                    Impor sebagai Link Playlist Eksternal
                  </button>
                </div>
              ) : (
                <>
                  {/* Matched Tracks */}
                  {liveResults.tracks.length > 0 && (
                    <div className="space-y-1">
                      <p className="px-2 text-[10.5px] font-mono uppercase text-[#6B6775]">
                        Lagu ({liveResults.tracks.length})
                      </p>
                      {liveResults.tracks.map((track) => (
                        <div
                          key={track.id}
                          onClick={() => {
                            openTrackDetail(track);
                            setIsSearchFocused(false);
                          }}
                          className="p-2 rounded-xl hover:bg-white/[0.06] flex items-center justify-between gap-3 cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-lg bg-gradient-to-br ${track.coverGradient} flex items-center justify-center shrink-0`}
                            >
                              <Music className="w-4 h-4 text-[#FB9278]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold text-[#F8FAFC] group-hover:text-[#FB9278] truncate">
                                {track.title}
                              </p>
                              <p className="text-[11px] text-[#948F9E] truncate">
                                {track.artist} · {track.album}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playTrack(track);
                              setIsSearchFocused(false);
                            }}
                            title="Putar Sekarang"
                            className="w-7 h-7 rounded-full bg-[#FB9278] text-[#0E0D12] flex items-center justify-center shrink-0 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matched Albums */}
                  {liveResults.albums.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-white/[0.06]">
                      <p className="px-2 text-[10.5px] font-mono uppercase text-[#6B6775]">
                        Album
                      </p>
                      {liveResults.albums.map((album) => (
                        <div
                          key={album.id}
                          onClick={() => {
                            openAlbumDetail(album.id);
                            setIsSearchFocused(false);
                          }}
                          className="p-2 rounded-xl hover:bg-white/[0.06] flex items-center gap-3 cursor-pointer group"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${album.coverGradient} flex items-center justify-center shrink-0`}
                          >
                            <Disc className="w-4 h-4 text-[#FB9278]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-[#F8FAFC] group-hover:text-[#FB9278] truncate">
                              {album.title}
                            </p>
                            <p className="text-[11px] text-[#948F9E] truncate">
                              Album · {album.artist} ({album.year})
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matched Playlists */}
                  {liveResults.playlists.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-white/[0.06]">
                      <p className="px-2 text-[10.5px] font-mono uppercase text-[#6B6775]">
                        Playlist
                      </p>
                      {liveResults.playlists.map((pl) => (
                        <div
                          key={pl.id}
                          onClick={() => {
                            openPlaylistDetail(pl.id);
                            setIsSearchFocused(false);
                          }}
                          className="p-2 rounded-xl hover:bg-white/[0.06] flex items-center gap-3 cursor-pointer group"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${pl.coverGradient} flex items-center justify-center shrink-0`}
                          >
                            <ListMusic className="w-4 h-4 text-[#FB9278]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-[#F8FAFC] group-hover:text-[#FB9278] truncate">
                              {pl.name}
                            </p>
                            <p className="text-[11px] text-[#948F9E] truncate">
                              Playlist · {pl.trackCount} lagu
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                    <button
                      onClick={() => {
                        setIsSearchFocused(false);
                        setActiveTab('explore');
                      }}
                      className="text-[12px] font-semibold text-[#FB9278] hover:underline cursor-pointer"
                    >
                      Lihat semua hasil di halaman Eksplorasi →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Far Right: Quick Create Playlist & Profile Pill at the rightmost edge */}
      <div className="flex items-center gap-3.5 shrink-0">
        {/* Create Playlist Quick CTA */}
        <button
          onClick={() => setCreatePlaylistModalOpen(true)}
          className="hidden lg:flex items-center gap-2 h-[40px] px-4 rounded-full bg-[#16161C]/90 hover:bg-[#FB9278]/15 border border-white/[0.08] hover:border-[#FB9278]/40 text-[12.5px] font-medium text-[#F8FAFC] hover:text-[#FB9278] transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#FB9278]" />
          <span>Buat Playlist</span>
        </button>

        {/* Subtle Divider */}
        <div className="hidden lg:block h-5 w-px bg-white/[0.08]" />

        {/* Profile Widget (Far Right) -> Opens Settings Profile Menu */}
        <button
          onClick={() => openSettingsPage('profile')}
          title="Buka Profil & Pengaturan Akun"
          className={`flex items-center gap-3 pl-2 pr-3.5 py-1.5 rounded-full border transition-all cursor-pointer group ${
            isProfileActive
              ? 'bg-[#FB9278]/15 border-[#FB9278]/55 shadow-[0_0_18px_rgba(251,146,120,0.15)]'
              : 'bg-[#16161C]/90 border-white/[0.08] hover:border-[#FB9278]/40 hover:bg-[#1B1A22]'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FB9278] via-[#E15B64] to-[#5D2A42] p-[1.5px] shadow-[0_0_12px_rgba(251,146,120,0.2)] shrink-0">
            <div className="w-full h-full rounded-full bg-[#1B1A22] flex items-center justify-center overflow-hidden">
              <div
                className={`w-full h-full bg-gradient-to-tr ${userProfile.avatarGradient} opacity-90 flex items-center justify-center text-[11px] font-bold text-[#0E0D12]`}
              >
                {initials}
              </div>
            </div>
          </div>

          <div className="hidden sm:block leading-tight text-left pr-0.5">
            <p className="text-[13px] font-semibold text-[#F8FAFC] group-hover:text-[#FB9278] transition-colors">
              {userProfile.displayName}
            </p>
            <p className="text-[10.5px] font-medium text-[#FB9278]">
              Profil & Akun
            </p>
          </div>

          <ChevronRight className="hidden sm:block w-3.5 h-3.5 text-[#6B6775] group-hover:text-[#FB9278] transition-colors" />
        </button>
      </div>
    </header>
  );
};
