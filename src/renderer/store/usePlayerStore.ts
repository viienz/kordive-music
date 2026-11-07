import { create } from 'zustand';
import {
  ALL_TRACKS,
  DEFAULT_EQ_BANDS,
  DEFAULT_FX_PRESETS,
  HERO_FEATURED_TRACKS,
  POPULAR_TRACKS,
  USER_PLAYLISTS,
} from '../data/mockCatalog';
import {
  EQBand,
  FxStudioPreset,
  LibraryFilterTab,
  MoodCategory,
  NavigationTab,
  Playlist,
  SettingsSection,
  SleepTimerMode,
  Track,
  UserProfile,
} from '../types/music';

interface IngestedPlaylistBanner {
  id: string;
  platform: 'spotify' | 'youtube' | 'soundcloud';
  title: string;
  creator: string;
  trackCount: number;
  url: string;
  savedToLibrary: boolean;
}

export interface ToastNotice {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning';
}

interface PlayerState {
  // Navigation & Page Context
  activeTab: NavigationTab;
  previousTab: NavigationTab;
  activeGenreSlug: string;
  activePlaylistId: string | null;
  activeAlbumId: string | null;
  libraryFilterTab: LibraryFilterTab;
  activeSettingsSection: SettingsSection;
  selectedCategory: MoodCategory;
  searchQuery: string;
  heroActiveIndex: number;

  // User Profile
  userProfile: UserProfile;

  // Playback Core & Stream Buffering
  currentTrack: Track;
  isPlaying: boolean;
  isBuffering: boolean;
  progressSec: number;
  volume: number;
  effectiveVolume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';

  // Listening History, Queue, Offline Cache & Library
  recentlyPlayedIds: string[];
  queue: Track[];
  favoriteTrackIds: string[];
  cachedTrackIds: string[];
  downloadingTrackIds: string[];
  playlists: Playlist[];
  ingestedBanner: IngestedPlaylistBanner | null;

  // FX Studio & DSP Engine
  ebuR128Enabled: boolean;
  eqEnabled: boolean;
  fxPresets: FxStudioPreset[];
  activePresetId: string;
  eqBands: EQBand[];
  bassBoostDb: number;
  spatialReverb: number;
  crossfadeSec: number;
  gaplessPlayback: boolean;
  streamingQuality: 'normal' | 'high' | 'lossless';
  downloadQuality: 'high' | 'lossless';
  ghostCacheEnabled: boolean;
  discordRpcEnabled: boolean;
  lyricsFontSize: 'normal' | 'large';

  // Sleep Timer
  sleepTimerMode: SleepTimerMode;
  sleepTimerRemainingSec: number | null;
  smartFadeOutEnabled: boolean;

  // Overlays, Modals & Global Toast
  isSleepModalOpen: boolean;
  isQueueDrawerOpen: boolean;
  isCreatePlaylistModalOpen: boolean;
  isImportPlaylistModalOpen: boolean;
  importModalInitialUrl: string;
  toastNotice: ToastNotice | null;

  // Navigation Actions
  setActiveTab: (tab: NavigationTab) => void;
  openGenreHub: (slug: string) => void;
  openGenreByCategory: (category: MoodCategory) => void;
  openPlaylistDetail: (playlistId: string) => void;
  openAlbumDetail: (albumId: string) => void;
  openTrackDetail: (track?: Track) => void;
  openHeroTarget: (track: Track) => void;
  openLibrarySection: (section: LibraryFilterTab) => void;
  openSettingsPage: (section?: SettingsSection) => void;
  goBack: () => void;

  // Profile Action
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  setSelectedCategory: (category: MoodCategory) => void;
  setSearchQuery: (query: string) => void;
  setHeroActiveIndex: (index: number) => void;
  nextHeroSlide: () => void;
  prevHeroSlide: () => void;

  // Playback Actions
  playTrack: (track: Track) => void;
  playPlaylist: (trackIds: string[], shuffle?: boolean) => void;
  togglePlay: () => void;
  setBuffering: (buffering: boolean) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (seconds: number) => void;
  seekRelative: (deltaSeconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  toggleFavorite: (trackId: string) => void;
  removeFromQueue: (trackId: string) => void;
  addToQueue: (track: Track) => void;

  // Offline Download Actions
  toggleTrackOffline: (trackId: string) => void;
  downloadTracksOffline: (trackIds: string[], label?: string) => void;

  // Playlist Management Actions (Full CRUD)
  createCustomPlaylist: (
    name: string,
    description: string,
    coverGradient: string,
    initialTrackIds?: string[]
  ) => void;
  updateCustomPlaylist: (
    playlistId: string,
    name: string,
    description: string
  ) => void;
  deleteCustomPlaylist: (playlistId: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  importExternalPlaylist: (
    url: string,
    customTitle?: string,
    platform?: 'spotify' | 'youtube' | 'soundcloud'
  ) => void;
  saveIngestedToLibrary: () => void;

  // FX Studio & DSP Actions
  toggleEbuR128: () => void;
  toggleEq: () => void;
  selectFxPreset: (presetId: string) => void;
  setEqBandGain: (index: number, gainDb: number) => void;
  setBassBoostDb: (db: number) => void;
  setSpatialReverb: (val: number) => void;
  setCrossfadeSec: (sec: number) => void;
  toggleGaplessPlayback: () => void;
  setStreamingQuality: (q: 'normal' | 'high' | 'lossless') => void;
  setDownloadQuality: (q: 'high' | 'lossless') => void;
  toggleGhostCache: () => void;
  toggleDiscordRpc: () => void;
  setLyricsFontSize: (size: 'normal' | 'large') => void;
  importFxPresetJson: (jsonString: string) => { success: boolean; message: string };
  saveCurrentAsCustomPreset: (name: string, description: string) => void;
  deleteCustomPreset: (presetId: string) => void;

  // Sleep Timer Actions
  setSleepTimer: (mode: SleepTimerMode) => void;
  toggleSmartFadeOut: () => void;

  // Modal & Toast Actions
  setSleepModalOpen: (open: boolean) => void;
  setQueueDrawerOpen: (open: boolean) => void;
  setCreatePlaylistModalOpen: (open: boolean) => void;
  openImportPlaylistModal: (initialUrl?: string) => void;
  closeImportPlaylistModal: () => void;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  clearToast: () => void;

  // Real-time 1s tick
  tickSecond: () => void;
}

const CATEGORY_TO_GENRE_SLUG: Record<MoodCategory, string> = {
  All: 'top-chart-global',
  Relax: 'deep-chill-lofi',
  Focus: 'focus-coding',
  'Lo-Fi Chill': 'deep-chill-lofi',
  Acoustic: 'acoustic-warmth',
  Energetic: 'gaming-energy',
  'Late Night': 'night-drive',
  Ambient: 'ambient-sanctuary',
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  activeTab: 'home',
  previousTab: 'home',
  activeGenreSlug: 'focus-coding',
  activePlaylistId: 'pl-1',
  activeAlbumId: 'alb-1',
  libraryFilterTab: 'all',
  activeSettingsSection: 'profile',
  selectedCategory: 'All',
  searchQuery: '',
  heroActiveIndex: 2, // Center card: Echoes of Midnight

  userProfile: {
    displayName: 'Molly Hunter',
    handle: '@mollyhunter',
    bio: 'Pecinta musik akustik senja, vinyl lo-fi, dan sesi koding malam.',
    membershipTier: 'Kordive Studio Member',
    avatarGradient: 'from-[#642026] to-[#FB9278]',
  },

  currentTrack: POPULAR_TRACKS[0],
  isPlaying: false,
  isBuffering: false,
  progressSec: 84,
  volume: 82,
  effectiveVolume: 82,
  isMuted: false,
  isShuffle: false,
  repeatMode: 'off',

  recentlyPlayedIds: ['pop-1', 'feat-3', 'pop-2', 'pop-4', 'feat-1', 'pop-3'],
  queue: [...POPULAR_TRACKS, ...HERO_FEATURED_TRACKS],
  favoriteTrackIds: ['feat-3', 'pop-1', 'pop-2', 'pop-4'],
  cachedTrackIds: ALL_TRACKS.filter((t) => t.isCachedOffline).map((t) => t.id),
  downloadingTrackIds: [],
  playlists: USER_PLAYLISTS,
  ingestedBanner: {
    id: 'ing-default',
    platform: 'spotify',
    title: "Today's Top Hits & Late Night Vibes",
    creator: 'Spotify Public Editorial',
    trackCount: 50,
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
    savedToLibrary: false,
  },

  ebuR128Enabled: true,
  eqEnabled: true,
  fxPresets: DEFAULT_FX_PRESETS,
  activePresetId: 'preset-lofi-warmth',
  eqBands: DEFAULT_EQ_BANDS,
  bassBoostDb: 4.0,
  spatialReverb: 25,
  crossfadeSec: 4,
  gaplessPlayback: true,
  streamingQuality: 'lossless',
  downloadQuality: 'lossless',
  ghostCacheEnabled: true,
  discordRpcEnabled: true,
  lyricsFontSize: 'normal',

  sleepTimerMode: 'off',
  sleepTimerRemainingSec: null,
  smartFadeOutEnabled: true,

  isSleepModalOpen: false,
  isQueueDrawerOpen: false,
  isCreatePlaylistModalOpen: false,
  isImportPlaylistModalOpen: false,
  importModalInitialUrl: '',
  toastNotice: null,

  setActiveTab: (tab) =>
    set((state) => ({
      previousTab: state.activeTab !== tab ? state.activeTab : state.previousTab,
      activeTab: tab,
    })),

  openGenreHub: (slug) =>
    set((state) => ({
      previousTab: state.activeTab,
      activeGenreSlug: slug,
      activeTab: 'genre-detail',
    })),

  openGenreByCategory: (category) => {
    if (category === 'All') {
      set({ selectedCategory: 'All' });
      return;
    }
    const slug = CATEGORY_TO_GENRE_SLUG[category] || 'focus-coding';
    set((state) => ({
      selectedCategory: category,
      previousTab: state.activeTab,
      activeGenreSlug: slug,
      activeTab: 'genre-detail',
    }));
  },

  openPlaylistDetail: (playlistId) =>
    set((state) => ({
      previousTab: state.activeTab,
      activePlaylistId: playlistId,
      activeTab: 'playlist-detail',
    })),

  openAlbumDetail: (albumId) =>
    set((state) => ({
      previousTab: state.activeTab,
      activeAlbumId: albumId,
      activeTab: 'album-detail',
    })),

  openTrackDetail: (track) =>
    set((state) => {
      if (track) {
        const updatedRecent = [
          track.id,
          ...state.recentlyPlayedIds.filter((id) => id !== track.id),
        ].slice(0, 10);
        return {
          currentTrack: track,
          isPlaying: true,
          progressSec: 0,
          recentlyPlayedIds: updatedRecent,
          previousTab: state.activeTab,
          activeTab: 'track-detail',
        };
      }
      return {
        previousTab: state.activeTab,
        activeTab: 'track-detail',
      };
    }),

  openHeroTarget: (track) => {
    const { openAlbumDetail, openPlaylistDetail, openTrackDetail } = get();
    if (track.featuredType === 'album' && track.featuredTargetId) {
      openAlbumDetail(track.featuredTargetId);
    } else if (track.featuredType === 'playlist' && track.featuredTargetId) {
      openPlaylistDetail(track.featuredTargetId);
    } else {
      openTrackDetail(track);
    }
  },

  openLibrarySection: (section) =>
    set((state) => ({
      previousTab: state.activeTab,
      libraryFilterTab: section,
      activeTab: 'library',
    })),

  openSettingsPage: (section) =>
    set((state) => ({
      previousTab: state.activeTab,
      activeSettingsSection: section || state.activeSettingsSection,
      activeTab: 'settings',
    })),

  goBack: () =>
    set((state) => ({
      activeTab: state.previousTab || 'home',
    })),

  updateUserProfile: (updates) => {
    set((state) => ({
      userProfile: { ...state.userProfile, ...updates },
    }));
    get().showToast('Profil pengguna berhasil diperbarui.', 'success');
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    const trimmed = query.trim();
    if (
      trimmed.includes('open.spotify.com/') ||
      trimmed.includes('youtube.com/') ||
      trimmed.includes('youtu.be/') ||
      trimmed.includes('soundcloud.com/')
    ) {
      set({
        isImportPlaylistModalOpen: true,
        importModalInitialUrl: trimmed,
      });
    }
  },

  setHeroActiveIndex: (index) => set({ heroActiveIndex: index }),
  nextHeroSlide: () =>
    set((state) => ({
      heroActiveIndex: (state.heroActiveIndex + 1) % HERO_FEATURED_TRACKS.length,
    })),
  prevHeroSlide: () =>
    set((state) => ({
      heroActiveIndex:
        (state.heroActiveIndex - 1 + HERO_FEATURED_TRACKS.length) %
        HERO_FEATURED_TRACKS.length,
    })),

  playTrack: (track) => {
    set((state) => {
      const updatedRecent = [
        track.id,
        ...state.recentlyPlayedIds.filter((id) => id !== track.id),
      ].slice(0, 10);
      return {
        currentTrack: track,
        isPlaying: true,
        isBuffering: true,
        progressSec: 0,
        effectiveVolume: state.volume,
        recentlyPlayedIds: updatedRecent,
      };
    });
    setTimeout(() => {
      set({ isBuffering: false });
    }, 320);
  },

  playPlaylist: (trackIds, shuffle = false) => {
    const tracks = ALL_TRACKS.filter((t) => trackIds.includes(t.id));
    if (tracks.length === 0) return;
    const ordered = shuffle
      ? [...tracks].sort(() => Math.random() - 0.5)
      : tracks;
    const first = ordered[0];
    set((state) => ({
      queue: ordered,
      currentTrack: first,
      isPlaying: true,
      isBuffering: true,
      isShuffle: shuffle,
      progressSec: 0,
      recentlyPlayedIds: [
        first.id,
        ...state.recentlyPlayedIds.filter((id) => id !== first.id),
      ].slice(0, 10),
    }));
    setTimeout(() => {
      set({ isBuffering: false });
    }, 320);
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setBuffering: (buffering) => set({ isBuffering: buffering }),

  nextTrack: () => {
    const { queue, currentTrack, isShuffle, recentlyPlayedIds } = get();
    if (queue.length === 0) return;
    let next: Track;
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      next = queue[randomIndex];
    } else {
      const idx = queue.findIndex((t) => t.id === currentTrack.id);
      const nextIdx = (idx + 1) % queue.length;
      next = queue[nextIdx];
    }
    set({
      currentTrack: next,
      progressSec: 0,
      isPlaying: true,
      isBuffering: true,
      recentlyPlayedIds: [
        next.id,
        ...recentlyPlayedIds.filter((id) => id !== next.id),
      ].slice(0, 10),
    });
    setTimeout(() => {
      set({ isBuffering: false });
    }, 280);
  },

  prevTrack: () => {
    const { queue, currentTrack, progressSec } = get();
    if (progressSec > 5) {
      set({ progressSec: 0 });
      return;
    }
    if (queue.length === 0) return;
    const idx = queue.findIndex((t) => t.id === currentTrack.id);
    const prevIdx = (idx - 1 + queue.length) % queue.length;
    set({
      currentTrack: queue[prevIdx],
      progressSec: 0,
      isPlaying: true,
      isBuffering: true,
    });
    setTimeout(() => {
      set({ isBuffering: false });
    }, 280);
  },

  seekTo: (seconds) =>
    set((state) => ({
      progressSec: Math.max(0, Math.min(seconds, state.currentTrack.durationSec)),
    })),

  seekRelative: (deltaSeconds) =>
    set((state) => ({
      progressSec: Math.max(
        0,
        Math.min(state.currentTrack.durationSec, state.progressSec + deltaSeconds)
      ),
    })),

  setVolume: (vol) =>
    set({
      volume: vol,
      effectiveVolume: vol,
      isMuted: vol === 0,
    }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
  cycleRepeatMode: () =>
    set((state) => ({
      repeatMode:
        state.repeatMode === 'off'
          ? 'all'
          : state.repeatMode === 'all'
          ? 'one'
          : 'off',
    })),

  toggleFavorite: (trackId) => {
    const state = get();
    const exists = state.favoriteTrackIds.includes(trackId);
    const targetTrack = ALL_TRACKS.find((t) => t.id === trackId);
    set({
      favoriteTrackIds: exists
        ? state.favoriteTrackIds.filter((id) => id !== trackId)
        : [...state.favoriteTrackIds, trackId],
    });
    if (targetTrack) {
      get().showToast(
        exists
          ? `"${targetTrack.title}" dihapus dari Lagu Disukai.`
          : `"${targetTrack.title}" ditambahkan ke Lagu Disukai.`,
        exists ? 'info' : 'success'
      );
    }
  },

  removeFromQueue: (trackId) =>
    set((state) => ({
      queue: state.queue.filter((t) => t.id !== trackId),
    })),

  addToQueue: (track) => {
    set((state) => {
      if (state.queue.some((t) => t.id === track.id)) return state;
      return { queue: [...state.queue, track] };
    });
    get().showToast(`"${track.title}" ditambahkan ke antrean putar.`, 'info');
  },

  toggleTrackOffline: (trackId) => {
    const { cachedTrackIds, downloadingTrackIds, showToast } = get();
    if (downloadingTrackIds.includes(trackId)) return;

    const track = ALL_TRACKS.find((t) => t.id === trackId);
    if (cachedTrackIds.includes(trackId)) {
      set({
        cachedTrackIds: cachedTrackIds.filter((id) => id !== trackId),
      });
      if (track) {
        track.isCachedOffline = false;
        showToast(
          `Salinan offline "${track.title}" telah dihapus dari perangkat.`,
          'info'
        );
      }
      return;
    }

    set({ downloadingTrackIds: [...downloadingTrackIds, trackId] });
    showToast(
      `Mengunduh "${track?.title || 'lagu'}" untuk pemutaran offline...`,
      'info'
    );

    setTimeout(() => {
      set((state) => ({
        downloadingTrackIds: state.downloadingTrackIds.filter(
          (id) => id !== trackId
        ),
        cachedTrackIds: state.cachedTrackIds.includes(trackId)
          ? state.cachedTrackIds
          : [...state.cachedTrackIds, trackId],
      }));
      if (track) {
        track.isCachedOffline = true;
      }
      get().showToast(
        `"${track?.title || 'Lagu'}" kini Tersedia Offline.`,
        'success'
      );
    }, 900);
  },

  downloadTracksOffline: (trackIds, label = 'Koleksi') => {
    const { cachedTrackIds, downloadingTrackIds, showToast } = get();
    const toDownload = trackIds.filter(
      (id) => !cachedTrackIds.includes(id) && !downloadingTrackIds.includes(id)
    );
    if (toDownload.length === 0) {
      showToast(`Seluruh lagu di ${label} sudah Tersedia Offline.`, 'info');
      return;
    }
    set({
      downloadingTrackIds: [...downloadingTrackIds, ...toDownload],
    });
    showToast(
      `Menyimpan ${toDownload.length} lagu dari "${label}" ke penyimpanan offline...`,
      'info'
    );

    setTimeout(() => {
      toDownload.forEach((id) => {
        const tr = ALL_TRACKS.find((t) => t.id === id);
        if (tr) tr.isCachedOffline = true;
      });
      set((state) => ({
        downloadingTrackIds: state.downloadingTrackIds.filter(
          (id) => !toDownload.includes(id)
        ),
        cachedTrackIds: Array.from(
          new Set([...state.cachedTrackIds, ...toDownload])
        ),
      }));
      get().showToast(
        `${toDownload.length} lagu dari "${label}" kini Tersedia Offline!`,
        'success'
      );
    }, 1100);
  },

  createCustomPlaylist: (
    name,
    description,
    coverGradient,
    initialTrackIds = ['pop-1', 'feat-3']
  ) => {
    const newPl: Playlist = {
      id: `pl-custom-${Date.now()}`,
      name: name.trim() || 'Playlist Baru Saya',
      creator: get().userProfile.displayName,
      description:
        description.trim() || 'Koleksi lagu pilihan pribadi di Kordive.',
      trackCount: initialTrackIds.length,
      coverGradient,
      trackIds: initialTrackIds,
    };
    set((state) => ({
      playlists: [newPl, ...state.playlists],
      activePlaylistId: newPl.id,
      activeTab: 'playlist-detail',
      isCreatePlaylistModalOpen: false,
    }));
    get().showToast(`Playlist "${newPl.name}" berhasil dibuat.`, 'success');
  },

  updateCustomPlaylist: (playlistId, name, description) => {
    set((state) => ({
      playlists: state.playlists.map((pl) =>
        pl.id === playlistId
          ? {
              ...pl,
              name: name.trim() || pl.name,
              description: description.trim() || pl.description,
            }
          : pl
      ),
    }));
    get().showToast('Detail playlist berhasil diperbarui.', 'success');
  },

  deleteCustomPlaylist: (playlistId) => {
    const target = get().playlists.find((p) => p.id === playlistId);
    set((state) => {
      const remaining = state.playlists.filter((p) => p.id !== playlistId);
      return {
        playlists: remaining,
        activePlaylistId: remaining[0]?.id || null,
        activeTab: 'library',
        libraryFilterTab: 'playlists',
      };
    });
    if (target) {
      get().showToast(`Playlist "${target.name}" telah dihapus.`, 'info');
    }
  },

  addTrackToPlaylist: (playlistId, trackId) => {
    const pl = get().playlists.find((p) => p.id === playlistId);
    const tr = ALL_TRACKS.find((t) => t.id === trackId);
    set((state) => ({
      playlists: state.playlists.map((item) => {
        if (item.id !== playlistId) return item;
        if (item.trackIds.includes(trackId)) return item;
        const nextIds = [...item.trackIds, trackId];
        return {
          ...item,
          trackIds: nextIds,
          trackCount: nextIds.length,
        };
      }),
    }));
    if (pl && tr) {
      get().showToast(
        `"${tr.title}" ditambahkan ke "${pl.name}".`,
        'success'
      );
    }
  },

  removeTrackFromPlaylist: (playlistId, trackId) => {
    const pl = get().playlists.find((p) => p.id === playlistId);
    const tr = ALL_TRACKS.find((t) => t.id === trackId);
    set((state) => ({
      playlists: state.playlists.map((item) => {
        if (item.id !== playlistId) return item;
        const nextIds = item.trackIds.filter((id) => id !== trackId);
        return {
          ...item,
          trackIds: nextIds,
          trackCount: nextIds.length,
        };
      }),
    }));
    if (pl && tr) {
      get().showToast(
        `"${tr.title}" dihapus dari "${pl.name}".`,
        'info'
      );
    }
  },

  importExternalPlaylist: (url, customTitle, platform = 'spotify') => {
    const defaultTitles: Record<string, string> = {
      spotify: 'Spotify Imported · Midnight Vibes',
      youtube: 'YouTube Music · Acoustic & Chill Mix',
      soundcloud: 'SoundCloud · Bedroom Beats',
    };
    const title = customTitle?.trim() || defaultTitles[platform];
    const selectedIds = ALL_TRACKS.slice(0, 6).map((t) => t.id);
    const newPl: Playlist = {
      id: `pl-import-${Date.now()}`,
      name: title,
      creator: `Impor ${platform.toUpperCase()} · ${get().userProfile.displayName}`,
      description: `Diimpor dari tautan ${url.slice(0, 48)}...`,
      trackCount: selectedIds.length,
      coverGradient:
        platform === 'spotify'
          ? 'from-[#164E3B] to-[#14141B]'
          : platform === 'youtube'
          ? 'from-[#642026] to-[#18151C]'
          : 'from-[#6B3410] to-[#15141B]',
      trackIds: selectedIds,
    };

    set((state) => ({
      playlists: [newPl, ...state.playlists],
      activePlaylistId: newPl.id,
      activeTab: 'playlist-detail',
      isImportPlaylistModalOpen: false,
      importModalInitialUrl: '',
      searchQuery: '',
    }));
    get().showToast(
      `Playlist "${newPl.name}" (${newPl.trackCount} lagu) berhasil diimpor!`,
      'success'
    );
  },

  saveIngestedToLibrary: () =>
    set((state) => {
      if (!state.ingestedBanner || state.ingestedBanner.savedToLibrary) return state;
      const newPlaylist: Playlist = {
        id: `pl-ingested-${Date.now()}`,
        name: state.ingestedBanner.title,
        creator: state.ingestedBanner.creator,
        description: `Diimpor dari ${state.ingestedBanner.platform.toUpperCase()}`,
        trackCount: ALL_TRACKS.length,
        coverGradient: 'from-[#642026] to-[#18151C]',
        trackIds: ALL_TRACKS.map((t) => t.id),
      };
      return {
        playlists: [newPlaylist, ...state.playlists],
        ingestedBanner: { ...state.ingestedBanner, savedToLibrary: true },
      };
    }),

  toggleEbuR128: () => set((state) => ({ ebuR128Enabled: !state.ebuR128Enabled })),
  toggleEq: () => set((state) => ({ eqEnabled: !state.eqEnabled })),

  selectFxPreset: (presetId) => {
    const preset = get().fxPresets.find((p) => p.id === presetId);
    if (!preset) return;
    set((state) => ({
      activePresetId: preset.id,
      bassBoostDb: preset.bassBoostDb,
      spatialReverb: preset.spatialReverb,
      eqBands: state.eqBands.map((band, idx) => ({
        ...band,
        gainDb: preset.gains[idx] ?? 0,
      })),
    }));
    get().showToast(`Preset DSP "${preset.name}" diaktifkan.`, 'info');
  },

  setEqBandGain: (index, gainDb) =>
    set((state) => {
      const updated = [...state.eqBands];
      if (updated[index]) {
        updated[index] = { ...updated[index], gainDb };
      }
      return { eqBands: updated };
    }),

  setBassBoostDb: (db) => set({ bassBoostDb: db }),
  setSpatialReverb: (val) => set({ spatialReverb: val }),
  setCrossfadeSec: (sec) => set({ crossfadeSec: sec }),
  toggleGaplessPlayback: () =>
    set((state) => ({ gaplessPlayback: !state.gaplessPlayback })),
  setStreamingQuality: (q) => set({ streamingQuality: q }),
  setDownloadQuality: (q) => set({ downloadQuality: q }),
  toggleGhostCache: () =>
    set((state) => ({ ghostCacheEnabled: !state.ghostCacheEnabled })),
  toggleDiscordRpc: () =>
    set((state) => ({ discordRpcEnabled: !state.discordRpcEnabled })),
  setLyricsFontSize: (size) => set({ lyricsFontSize: size }),

  importFxPresetJson: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (
        !parsed ||
        typeof parsed.name !== 'string' ||
        !Array.isArray(parsed.gains) ||
        parsed.gains.length !== 10
      ) {
        return {
          success: false,
          message:
            'Format tidak valid. Pastikan JSON memiliki "name" dan array "gains" (10 nilai dB).',
        };
      }
      const sanitizedGains = parsed.gains.map((v: unknown) =>
        Math.max(-12, Math.min(12, Number(v) || 0))
      );
      const newPreset: FxStudioPreset = {
        id: `fx-custom-${Date.now()}`,
        name: parsed.name.slice(0, 40),
        author:
          typeof parsed.author === 'string'
            ? parsed.author.slice(0, 30)
            : 'Imported FX Preset',
        description:
          typeof parsed.description === 'string'
            ? parsed.description.slice(0, 100)
            : 'Preset hasil import pengguna.',
        gains: sanitizedGains,
        bassBoostDb: Math.max(0, Math.min(12, Number(parsed.bassBoostDb) || 0)),
        spatialReverb: Math.max(
          0,
          Math.min(100, Number(parsed.spatialReverb) || 20)
        ),
        isCustom: true,
      };
      set((state) => ({
        fxPresets: [newPreset, ...state.fxPresets],
        activePresetId: newPreset.id,
        bassBoostDb: newPreset.bassBoostDb,
        spatialReverb: newPreset.spatialReverb,
        eqBands: state.eqBands.map((band, idx) => ({
          ...band,
          gainDb: newPreset.gains[idx] ?? 0,
        })),
      }));
      get().showToast(`Preset "${newPreset.name}" berhasil diimpor.`, 'success');
      return {
        success: true,
        message: `Preset "${newPreset.name}" berhasil diimpor dan diaktifkan.`,
      };
    } catch {
      return {
        success: false,
        message: 'Gagal membaca JSON preset. Periksa kembali tanda kurung atau kutip.',
      };
    }
  },

  saveCurrentAsCustomPreset: (name, description) => {
    const newPreset: FxStudioPreset = {
      id: `fx-user-${Date.now()}`,
      name: name.trim() || 'Custom FX Preset',
      author: get().userProfile.displayName,
      description:
        description.trim() || 'Konfigurasi frekuensi kustom FX Studio.',
      gains: get().eqBands.map((b) => b.gainDb),
      bassBoostDb: get().bassBoostDb,
      spatialReverb: get().spatialReverb,
      isCustom: true,
    };
    set((state) => ({
      fxPresets: [newPreset, ...state.fxPresets],
      activePresetId: newPreset.id,
    }));
    get().showToast(`Preset "${newPreset.name}" disimpan.`, 'success');
  },

  deleteCustomPreset: (presetId) =>
    set((state) => {
      const remaining = state.fxPresets.filter((p) => p.id !== presetId);
      const nextActive =
        state.activePresetId === presetId
          ? remaining[0]?.id || 'preset-lofi-warmth'
          : state.activePresetId;
      return {
        fxPresets: remaining,
        activePresetId: nextActive,
      };
    }),

  setSleepTimer: (mode) => {
    const { currentTrack, progressSec, volume } = get();
    if (mode === 'off') {
      set({
        sleepTimerMode: 'off',
        sleepTimerRemainingSec: null,
        effectiveVolume: volume,
      });
      get().showToast('Sleep Timer dinonaktifkan.', 'info');
      return;
    }
    if (mode === 'end-of-track') {
      const remaining = Math.max(1, currentTrack.durationSec - progressSec);
      set({
        sleepTimerMode: 'end-of-track',
        sleepTimerRemainingSec: remaining,
        effectiveVolume: volume,
      });
      get().showToast('Sleep Timer diatur hingga akhir lagu ini.', 'success');
      return;
    }
    const minutesMap: Record<string, number> = {
      '15m': 15 * 60,
      '30m': 30 * 60,
      '45m': 45 * 60,
      '60m': 60 * 60,
    };
    set({
      sleepTimerMode: mode,
      sleepTimerRemainingSec: minutesMap[mode] ?? 900,
      effectiveVolume: volume,
    });
    get().showToast(`Sleep Timer diaktifkan (${mode}).`, 'success');
  },

  toggleSmartFadeOut: () =>
    set((state) => ({ smartFadeOutEnabled: !state.smartFadeOutEnabled })),

  setSleepModalOpen: (open) => set({ isSleepModalOpen: open }),
  setQueueDrawerOpen: (open) => set({ isQueueDrawerOpen: open }),
  setCreatePlaylistModalOpen: (open) => set({ isCreatePlaylistModalOpen: open }),
  openImportPlaylistModal: (initialUrl = '') =>
    set({
      isImportPlaylistModalOpen: true,
      importModalInitialUrl: initialUrl,
    }),
  closeImportPlaylistModal: () =>
    set({
      isImportPlaylistModalOpen: false,
      importModalInitialUrl: '',
    }),

  showToast: (text, type = 'info') => {
    const id = `toast-${Date.now()}`;
    set({ toastNotice: { id, text, type } });
    setTimeout(() => {
      if (get().toastNotice?.id === id) {
        set({ toastNotice: null });
      }
    }, 3200);
  },

  clearToast: () => set({ toastNotice: null }),

  tickSecond: () => {
    const state = get();
    if (!state.isPlaying) return;

    let nextSleepRem = state.sleepTimerRemainingSec;
    let nextEffectiveVol = state.volume;

    if (nextSleepRem !== null) {
      nextSleepRem = Math.max(0, nextSleepRem - 1);
      if (state.smartFadeOutEnabled && nextSleepRem <= 30 && nextSleepRem > 0) {
        const ratio = Math.pow(nextSleepRem / 30, 1.8);
        nextEffectiveVol = Math.max(1, Math.round(state.volume * ratio));
      }
      if (nextSleepRem === 0) {
        set({
          isPlaying: false,
          sleepTimerMode: 'off',
          sleepTimerRemainingSec: null,
          effectiveVolume: state.volume,
        });
        return;
      }
    }

    const nextProgress = state.progressSec + 1;
    if (nextProgress >= state.currentTrack.durationSec) {
      if (state.repeatMode === 'one') {
        set({
          progressSec: 0,
          sleepTimerRemainingSec: nextSleepRem,
          effectiveVolume: nextEffectiveVol,
        });
      } else {
        get().nextTrack();
        set({
          sleepTimerRemainingSec: nextSleepRem,
          effectiveVolume: nextEffectiveVol,
        });
      }
    } else {
      set({
        progressSec: nextProgress,
        sleepTimerRemainingSec: nextSleepRem,
        effectiveVolume: nextEffectiveVol,
      });
    }
  },
}));
