export type NavigationTab =
  | 'home'
  | 'explore'
  | 'genre-detail'
  | 'track-detail'
  | 'album-detail'
  | 'studio-dsp'
  | 'library'
  | 'playlist-detail'
  | 'settings';

export type LibraryFilterTab =
  | 'all'
  | 'playlists'
  | 'liked'
  | 'offline'
  | 'albums';

export type StreamSource = 'youtube' | 'soundcloud' | 'spotify-mapped' | 'local';

export type MoodCategory =
  | 'All'
  | 'Relax'
  | 'Focus'
  | 'Lo-Fi Chill'
  | 'Acoustic'
  | 'Energetic'
  | 'Late Night'
  | 'Ambient';

export interface LyricLine {
  timeSec: number;
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumId?: string;
  releaseYear?: number;
  playCountFormatted?: string;
  durationSec: number;
  durationFormatted: string;
  source: StreamSource;
  sourceLabel: string;
  codecBadge: string;
  coverGradient: string;
  coverAccent: string;
  isCachedOffline: boolean;
  localFilePath?: string;
  fileSizeMb?: number;
  category: MoodCategory;
  genreSlug?: string;
  isFeatured?: boolean;
  featuredType?: 'track' | 'album' | 'playlist';
  featuredTargetId?: string;
  featuredSubtitle?: string;
  addedAt?: string;
  lyrics: LyricLine[];
}

export interface Playlist {
  id: string;
  name: string;
  creator: string;
  description: string;
  trackCount: number;
  coverGradient: string;
  category?: MoodCategory;
  isCommunity?: boolean;
  likesCount?: string;
  trackIds: string[];
}

export interface AlbumItem {
  id: string;
  title: string;
  artist: string;
  year: number;
  description?: string;
  trackCount: number;
  coverGradient: string;
  category: MoodCategory;
  trackIds: string[];
}

export interface GenreHub {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  bannerGradient: string;
  category: MoodCategory;
  featuredPlaylists: Playlist[];
  communityPlaylists: Playlist[];
  relatedAlbums: AlbumItem[];
}

export interface EQBand {
  freqLabel: string;
  hz: number;
  gainDb: number;
}

export interface FxStudioPreset {
  id: string;
  name: string;
  author: string;
  description: string;
  gains: number[]; // 10 bands: 32Hz .. 16kHz
  bassBoostDb: number;
  spatialReverb: number;
  isCustom?: boolean;
}

export type SleepTimerMode = 'off' | '15m' | '30m' | '45m' | '60m' | 'end-of-track';

export type SettingsSection =
  | 'profile'
  | 'playback'
  | 'audio-quality'
  | 'storage'
  | 'appearance'
  | 'privacy';

export interface UserProfile {
  displayName: string;
  handle: string;
  bio: string;
  membershipTier: string;
  avatarGradient: string;
}

export interface KordiveIPCBridge {
  getServerToken: () => Promise<string>;
  resolveExternalUrl: (url: string) => Promise<{
    type: 'spotify-playlist' | 'youtube-track' | 'soundcloud-track';
    title: string;
    trackCount: number;
    sourceUrl: string;
  }>;
  selectLocalFolder: () => Promise<string | null>;
  getGhostCacheStatus: () => Promise<{
    cachedTracksCount: number;
    totalSizeGb: number;
    cacheDirectory: string;
  }>;
}

declare global {
  interface Window {
    kordiveAPI?: KordiveIPCBridge;
  }
}
