import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Compass,
  Library,
  Heart,
  Sliders,
  Settings,
  Disc3,
  Plus,
  ListMusic,
  Download,
  ChevronDown,
  Disc,
  Layers,
} from 'lucide-react';
import { ALL_TRACKS, NEW_RELEASE_ALBUMS } from '../../data/mockCatalog';
import { usePlayerStore } from '../../store/usePlayerStore';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    libraryFilterTab,
    setActiveTab,
    playlists,
    favoriteTrackIds,
    activePlaylistId,
    openPlaylistDetail,
    openLibrarySection,
    openSettingsPage,
    setCreatePlaylistModalOpen,
  } = usePlayerStore();

  const isLibraryActive = activeTab === 'library';
  const [isCollectionOpen, setIsCollectionOpen] = useState<boolean>(false);

  // Automatically expand dropdown when in Library, and automatically close when navigating to any other menu
  useEffect(() => {
    setIsCollectionOpen(isLibraryActive);
  }, [isLibraryActive]);

  const offlineCount = ALL_TRACKS.filter((t) => t.isCachedOffline).length;

  const handleCollectionHeaderClick = () => {
    if (!isLibraryActive) {
      setIsCollectionOpen(true);
      openLibrarySection('all');
    } else {
      setIsCollectionOpen((prev) => !prev);
    }
  };

  return (
    <>
      {/* DESKTOP VELVET GLASS SIDEBAR */}
      <aside className="hidden md:flex flex-col w-[256px] shrink-0 h-full velvet-glass rounded-[22px] p-5 justify-between select-none">
        <div className="min-h-0 flex flex-col">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 px-2 pt-1 pb-6 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-[#FB9278]/15 border border-[#FB9278]/40 flex items-center justify-center shadow-[0_0_14px_rgba(251,146,120,0.2)]">
              <Disc3 className="w-4 h-4 text-[#FB9278] group-hover:rotate-90 transition-transform duration-300" />
            </div>
            <span className="text-[21px] font-bold tracking-tight text-[#F8FAFC] group-hover:text-[#FB9278] transition-colors">
              Kordive
            </span>
          </div>

          {/* Primary Navigation */}
          <nav className="space-y-1 shrink-0">
            {/* Beranda */}
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-[12px] text-[13.5px] font-medium transition-all duration-150 cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#FB9278]/12 text-[#FB9278] border border-[#FB9278]/45 shadow-[0_0_16px_rgba(251,146,120,0.1)]'
                  : 'text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <Home
                className={`w-4 h-4 shrink-0 ${
                  activeTab === 'home' ? 'text-[#FB9278]' : 'text-[#948F9E]'
                }`}
              />
              <span>Beranda</span>
            </button>

            {/* Eksplorasi */}
            <button
              onClick={() => setActiveTab('explore')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-[12px] text-[13.5px] font-medium transition-all duration-150 cursor-pointer ${
                activeTab === 'explore' || activeTab === 'genre-detail'
                  ? 'bg-[#FB9278]/12 text-[#FB9278] border border-[#FB9278]/45 shadow-[0_0_16px_rgba(251,146,120,0.1)]'
                  : 'text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <Compass
                className={`w-4 h-4 shrink-0 ${
                  activeTab === 'explore' || activeTab === 'genre-detail'
                    ? 'text-[#FB9278]'
                    : 'text-[#948F9E]'
                }`}
              />
              <span>Eksplorasi</span>
            </button>

            {/* Koleksi Saya (Collapsible Dropdown Menu) */}
            <div className="space-y-1">
              <button
                onClick={handleCollectionHeaderClick}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-[13.5px] font-medium transition-all duration-150 cursor-pointer ${
                  isLibraryActive ||
                  activeTab === 'playlist-detail' ||
                  activeTab === 'album-detail'
                    ? 'bg-[#FB9278]/12 text-[#FB9278] border border-[#FB9278]/45 shadow-[0_0_16px_rgba(251,146,120,0.1)]'
                    : 'text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <span className="flex items-center gap-3.5">
                  <Library
                    className={`w-4 h-4 shrink-0 ${
                      isLibraryActive ||
                      activeTab === 'playlist-detail' ||
                      activeTab === 'album-detail'
                        ? 'text-[#FB9278]'
                        : 'text-[#948F9E]'
                    }`}
                  />
                  <span>Koleksi Saya</span>
                </span>

                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isCollectionOpen ? 'rotate-180 text-[#FB9278]' : 'text-[#6B6775]'
                  }`}
                />
              </button>

              {/* Animated Dropdown Sub-sections */}
              <AnimatePresence initial={false}>
                {isCollectionOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 pr-1 py-1 space-y-0.5 border-l border-white/[0.08] ml-5">
                      <button
                        onClick={() => openLibrarySection('all')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12.5px] transition-colors cursor-pointer ${
                          isLibraryActive && libraryFilterTab === 'all'
                            ? 'text-[#FB9278] bg-[#FB9278]/10 font-semibold'
                            : 'text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.03]'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Layers className="w-3.5 h-3.5 shrink-0" />
                          <span>Semua Koleksi</span>
                        </span>
                      </button>

                      <button
                        onClick={() => openLibrarySection('liked')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12.5px] transition-colors cursor-pointer ${
                          isLibraryActive && libraryFilterTab === 'liked'
                            ? 'text-[#FB9278] bg-[#FB9278]/10 font-semibold'
                            : 'text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.03]'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Heart className="w-3.5 h-3.5 shrink-0" />
                          <span>Lagu Disukai</span>
                        </span>
                        <span className="text-[10.5px] font-mono text-[#6B6775]">
                          {favoriteTrackIds.length}
                        </span>
                      </button>

                      <button
                        onClick={() => openLibrarySection('offline')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12.5px] transition-colors cursor-pointer ${
                          isLibraryActive && libraryFilterTab === 'offline'
                            ? 'text-[#6EE7B7] bg-[#6EE7B7]/10 font-semibold'
                            : 'text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.03]'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Download className="w-3.5 h-3.5 shrink-0" />
                          <span>Tersedia Offline</span>
                        </span>
                        <span className="text-[10.5px] font-mono text-[#6B6775]">
                          {offlineCount}
                        </span>
                      </button>

                      <button
                        onClick={() => openLibrarySection('playlists')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12.5px] transition-colors cursor-pointer ${
                          isLibraryActive && libraryFilterTab === 'playlists'
                            ? 'text-[#FB9278] bg-[#FB9278]/10 font-semibold'
                            : 'text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.03]'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <ListMusic className="w-3.5 h-3.5 shrink-0" />
                          <span>Playlist Pribadi</span>
                        </span>
                        <span className="text-[10.5px] font-mono text-[#6B6775]">
                          {playlists.length}
                        </span>
                      </button>

                      <button
                        onClick={() => openLibrarySection('albums')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12.5px] transition-colors cursor-pointer ${
                          isLibraryActive && libraryFilterTab === 'albums'
                            ? 'text-[#FB9278] bg-[#FB9278]/10 font-semibold'
                            : 'text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.03]'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Disc className="w-3.5 h-3.5 shrink-0" />
                          <span>Album Tersimpan</span>
                        </span>
                        <span className="text-[10.5px] font-mono text-[#6B6775]">
                          {NEW_RELEASE_ALBUMS.length}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FX Studio DSP Section */}
            <button
              onClick={() => setActiveTab('studio-dsp')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-[13.5px] font-medium transition-all duration-150 cursor-pointer ${
                activeTab === 'studio-dsp'
                  ? 'bg-[#FB9278]/12 text-[#FB9278] border border-[#FB9278]/45 shadow-[0_0_16px_rgba(251,146,120,0.1)]'
                  : 'text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <span className="flex items-center gap-3.5">
                <Sliders
                  className={`w-4 h-4 shrink-0 ${
                    activeTab === 'studio-dsp'
                      ? 'text-[#FB9278]'
                      : 'text-[#948F9E]'
                  }`}
                />
                <span>FX Studio DSP</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#FB9278]/15 text-[#FB9278]">
                EQ
              </span>
            </button>
          </nav>

          {/* User Playlists Quick List */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between px-2 mb-2 shrink-0">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#6B6775]">
                Daftar Playlist
              </span>
              <button
                onClick={() => setCreatePlaylistModalOpen(true)}
                title="Buat Playlist Baru"
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-[#FB9278]/15 text-[#948F9E] hover:text-[#FB9278] text-[11px] font-medium transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Buat</span>
              </button>
            </div>

            <ul className="space-y-1 overflow-y-auto pr-1">
              {playlists.map((pl) => {
                const isSelected =
                  activeTab === 'playlist-detail' && activePlaylistId === pl.id;
                return (
                  <li key={pl.id}>
                    <button
                      onClick={() => openPlaylistDetail(pl.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-[13px] transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-white/[0.07] text-[#FB9278] font-medium'
                          : 'text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-md bg-gradient-to-br ${pl.coverGradient} border border-white/10 flex items-center justify-center shrink-0`}
                        >
                          <ListMusic className="w-3 h-3 text-white/80" />
                        </span>
                        <span className="truncate">{pl.name}</span>
                      </span>
                      <span className="text-[10.5px] font-mono text-[#6B6775] shrink-0">
                        {pl.trackCount}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Settings Navigation Link */}
        <div className="pt-3 border-t border-white/[0.06] shrink-0">
          <button
            onClick={() => openSettingsPage()}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-[13.5px] font-medium transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#FB9278]/12 text-[#FB9278] border border-[#FB9278]/45'
                : 'text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            <span className="flex items-center gap-3">
              <Settings
                className={`w-4 h-4 ${
                  activeTab === 'settings' ? 'text-[#FB9278]' : 'text-[#948F9E]'
                }`}
              />
              <span>Pengaturan</span>
            </span>
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR (< md) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-[68px] bg-[#131218]/95 backdrop-blur-xl border-t border-white/[0.08] px-3 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 ${
            activeTab === 'home' ? 'text-[#FB9278]' : 'text-[#948F9E]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10.5px] font-medium">Beranda</span>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 ${
            activeTab === 'explore' || activeTab === 'genre-detail'
              ? 'text-[#FB9278]'
              : 'text-[#948F9E]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10.5px] font-medium">Eksplorasi</span>
        </button>

        <button
          onClick={() => setActiveTab('studio-dsp')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 ${
            activeTab === 'studio-dsp' ? 'text-[#FB9278]' : 'text-[#948F9E]'
          }`}
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[10.5px] font-medium">FX Studio</span>
        </button>

        <button
          onClick={() => openLibrarySection('all')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 ${
            activeTab === 'library' ||
            activeTab === 'playlist-detail' ||
            activeTab === 'album-detail'
              ? 'text-[#FB9278]'
              : 'text-[#948F9E]'
          }`}
        >
          <Library className="w-5 h-5" />
          <span className="text-[10.5px] font-medium">Koleksi</span>
        </button>

        <button
          onClick={() => openSettingsPage()}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] gap-1 ${
            activeTab === 'settings' ? 'text-[#FB9278]' : 'text-[#948F9E]'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10.5px] font-medium">Pengaturan</span>
        </button>
      </nav>
    </>
  );
};
