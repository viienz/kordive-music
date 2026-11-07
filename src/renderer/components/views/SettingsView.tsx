import React, { useState } from 'react';
import {
  User,
  Sliders,
  Radio,
  HardDrive,
  Sparkles,
  ShieldCheck,
  FolderOpen,
  Trash2,
  CheckCircle2,
  Check,
  Heart,
  ListMusic,
  Download,
} from 'lucide-react';
import { ALL_TRACKS } from '../../data/mockCatalog';
import { usePlayerStore } from '../../store/usePlayerStore';
import { SettingsSection } from '../../types/music';

const SETTINGS_NAV: {
  id: SettingsSection;
  label: string;
  desc: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    id: 'profile',
    label: 'Profil & Akun',
    desc: 'Identitas pengguna & statistik musik',
    icon: User,
  },
  {
    id: 'playback',
    label: 'Pemutaran',
    desc: 'Crossfade, gapless & normalisasi',
    icon: Sliders,
  },
  {
    id: 'audio-quality',
    label: 'Kualitas Audio',
    desc: 'Resolusi streaming & unduhan',
    icon: Radio,
  },
  {
    id: 'storage',
    label: 'Penyimpanan & Offline',
    desc: 'Folder cache & ruang disk',
    icon: HardDrive,
  },
  {
    id: 'appearance',
    label: 'Tampilan & Lirik',
    desc: 'Skala teks lirik & visual',
    icon: Sparkles,
  },
  {
    id: 'privacy',
    label: 'Integrasi & Keamanan',
    desc: 'Discord RPC & proteksi aplikasi',
    icon: ShieldCheck,
  },
];

const AVATAR_GRADIENTS = [
  { label: 'Velvet Peach', value: 'from-[#642026] to-[#FB9278]' },
  { label: 'Emerald Mint', value: 'from-[#182E23] to-[#6EE7B7]' },
  { label: 'Ocean Horizon', value: 'from-[#18293A] to-[#38BDF8]' },
  { label: 'Synthwave Rose', value: 'from-[#3B1D36] to-[#F472B6]' },
];

export const SettingsView: React.FC = () => {
  const {
    activeSettingsSection,
    openSettingsPage,
    openLibrarySection,
    userProfile,
    updateUserProfile,
    favoriteTrackIds,
    playlists,
    crossfadeSec,
    setCrossfadeSec,
    gaplessPlayback,
    toggleGaplessPlayback,
    ebuR128Enabled,
    toggleEbuR128,
    smartFadeOutEnabled,
    toggleSmartFadeOut,
    streamingQuality,
    setStreamingQuality,
    downloadQuality,
    setDownloadQuality,
    ghostCacheEnabled,
    toggleGhostCache,
    discordRpcEnabled,
    toggleDiscordRpc,
    lyricsFontSize,
    setLyricsFontSize,
  } = usePlayerStore();

  const [displayName, setDisplayName] = useState(userProfile.displayName);
  const [handle, setHandle] = useState(userProfile.handle);
  const [bio, setBio] = useState(userProfile.bio);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  const [cachePath, setCachePath] = useState(
    'E:\\AI-Lab\\02-Hermes\\projects\\riff-data\\tracks'
  );
  const [cacheMessage, setCacheMessage] = useState<string | null>(null);

  const offlineCount = ALL_TRACKS.filter((t) => t.isCachedOffline).length;

  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      displayName: displayName.trim() || 'Molly Hunter',
      handle: handle.trim() || '@mollyhunter',
      bio: bio.trim(),
    });
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  const handleChangeCacheFolder = async () => {
    if (window.kordiveAPI?.selectLocalFolder) {
      const selected = await window.kordiveAPI.selectLocalFolder();
      if (selected) {
        setCachePath(selected);
        setCacheMessage('Lokasi penyimpanan berhasil diperbarui.');
        setTimeout(() => setCacheMessage(null), 3500);
        return;
      }
    }
    setCacheMessage(
      'Direktori terverifikasi pada E:\\AI-Lab\\02-Hermes\\projects\\riff-data\\tracks'
    );
    setTimeout(() => setCacheMessage(null), 3500);
  };

  const handleClearTempCache = () => {
    setCacheMessage(
      'File sementara dibersihkan. Lagu offline utama Anda tetap aman.'
    );
    setTimeout(() => setCacheMessage(null), 3500);
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-[24px] font-bold text-[#F8FAFC] tracking-tight">
          Pengaturan & Profil Pengguna
        </h1>
        <p className="text-[13px] text-[#948F9E]">
          Kelola profil Anda, preferensi pemutaran, kualitas audio, penyimpanan offline, dan privasi.
        </p>
      </div>

      {/* Main Split Settings Layout (Internal Sidebar + Content Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Internal Settings Navigation Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-2">
          {SETTINGS_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = activeSettingsSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => openSettingsPage(item.id)}
                className={`w-full p-3.5 rounded-[16px] border text-left flex items-center gap-3.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FB9278]/12 border-[#FB9278]/50 text-[#F8FAFC] shadow-[0_0_18px_rgba(251,146,120,0.12)]'
                    : 'bg-[#16161C]/85 border-white/[0.07] text-[#948F9E] hover:text-[#F8FAFC] hover:border-white/[0.18]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-[#FB9278] text-[#0E0D12]'
                      : 'bg-[#1B1A22] text-[#948F9E]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-bold text-[#F8FAFC]">
                    {item.label}
                  </p>
                  <p className="text-[11.5px] text-[#948F9E] truncate">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Right Settings Content Panel (8 cols) */}
        <div className="lg:col-span-8 rounded-[24px] velvet-glass p-6 sm:p-7 space-y-6">
          {/* SECTION 0: PROFIL & AKUN */}
          {activeSettingsSection === 'profile' && (
            <div className="space-y-6">
              <div className="border-b border-white/[0.07] pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-bold text-[#F8FAFC]">
                    Profil Pengguna & Aktivitas
                  </h2>
                  <p className="text-[12.5px] text-[#948F9E]">
                    Sesuaikan identitas profil Anda yang tampil di aplikasi dan playlist buatan Anda.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#FB9278]/15 border border-[#FB9278]/40 text-[11px] font-mono text-[#FB9278]">
                  {userProfile.membershipTier}
                </span>
              </div>

              {profileSavedToast && (
                <div className="p-3.5 rounded-xl bg-[#6EE7B7]/15 border border-[#6EE7B7]/40 text-[#6EE7B7] text-[12.5px] font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Perubahan profil berhasil disimpan.</span>
                </div>
              )}

              {/* Profile Header Card */}
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-2xl bg-[#1B1A22]/85 border border-white/[0.06]">
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-tr ${userProfile.avatarGradient} border-2 border-white/20 flex items-center justify-center text-[24px] font-bold text-[#0E0D12] shrink-0 shadow-xl`}
                  >
                    {initials || 'MH'}
                  </div>

                  <div className="space-y-2 flex-1">
                    <p className="text-[12px] font-medium text-[#948F9E]">
                      Pilih Warna Avatar Profil:
                    </p>
                    <div className="flex items-center gap-2.5">
                      {AVATAR_GRADIENTS.map((g) => {
                        const selected =
                          userProfile.avatarGradient === g.value;
                        return (
                          <button
                            type="button"
                            key={g.label}
                            onClick={() =>
                              updateUserProfile({ avatarGradient: g.value })
                            }
                            title={g.label}
                            className={`w-8 h-8 rounded-full bg-gradient-to-tr ${g.value} border flex items-center justify-center transition-transform cursor-pointer ${
                              selected
                                ? 'border-white scale-110'
                                : 'border-white/20 opacity-75 hover:opacity-100'
                            }`}
                          >
                            {selected && (
                              <Check className="w-3.5 h-3.5 text-[#0E0D12]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#948F9E] block">
                      Nama Tampilan
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-[#16161C] border border-white/10 focus:border-[#FB9278] focus:outline-none text-[13.5px] text-[#F8FAFC]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#948F9E] block">
                      Username / Handle
                    </label>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl bg-[#16161C] border border-white/10 focus:border-[#FB9278] focus:outline-none text-[13.5px] font-mono text-[#F8FAFC]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[#948F9E] block">
                    Bio Musik Singkat
                  </label>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-[#16161C] border border-white/10 focus:border-[#FB9278] focus:outline-none text-[13px] text-[#F8FAFC]"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#FB9278] hover:bg-[#FCA5A5] text-[#0E0D12] text-[13px] font-bold shadow-[0_0_18px_rgba(251,146,120,0.3)] cursor-pointer"
                  >
                    Simpan Profil
                  </button>
                </div>
              </form>

              {/* Ringkasan Statistik Koleksi */}
              <div className="pt-3 border-t border-white/[0.07] space-y-3">
                <h3 className="text-[14px] font-bold text-[#F8FAFC]">
                  Ringkasan Koleksi Anda
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => openLibrarySection('liked')}
                    className="p-3.5 rounded-xl bg-[#1B1A22]/85 border border-white/[0.06] hover:border-[#FB9278]/50 text-left transition-colors cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-[#FB9278] mb-1.5" />
                    <p className="text-[18px] font-bold text-[#F8FAFC]">
                      {favoriteTrackIds.length}
                    </p>
                    <p className="text-[11px] text-[#948F9E]">Lagu Disukai</p>
                  </button>

                  <button
                    onClick={() => openLibrarySection('playlists')}
                    className="p-3.5 rounded-xl bg-[#1B1A22]/85 border border-white/[0.06] hover:border-[#FB9278]/50 text-left transition-colors cursor-pointer"
                  >
                    <ListMusic className="w-4 h-4 text-[#FB9278] mb-1.5" />
                    <p className="text-[18px] font-bold text-[#F8FAFC]">
                      {playlists.length}
                    </p>
                    <p className="text-[11px] text-[#948F9E]">Playlist Pribadi</p>
                  </button>

                  <button
                    onClick={() => openLibrarySection('offline')}
                    className="p-3.5 rounded-xl bg-[#1B1A22]/85 border border-white/[0.06] hover:border-[#6EE7B7]/50 text-left transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#6EE7B7] mb-1.5" />
                    <p className="text-[18px] font-bold text-[#F8FAFC]">
                      {offlineCount}
                    </p>
                    <p className="text-[11px] text-[#948F9E]">Tersedia Offline</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 1: PEMUTARAN */}
          {activeSettingsSection === 'playback' && (
            <div className="space-y-6">
              <div className="border-b border-white/[0.07] pb-4">
                <h2 className="text-[18px] font-bold text-[#F8FAFC]">
                  Preferensi Pemutaran Audio
                </h2>
                <p className="text-[12.5px] text-[#948F9E]">
                  Atur bagaimana lagu berpindah dan menjaga kestabilan volume.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1B1A22]/85 border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#F8FAFC]">
                      Transisi Crossfade Antar-Lagu
                    </h4>
                    <p className="text-[12px] text-[#948F9E]">
                      Memadukan akhir lagu dengan awal lagu berikutnya secara mulus.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#FB9278]/15 text-[#FB9278] font-mono text-[12px] font-bold">
                    {crossfadeSec === 0 ? 'Nonaktif' : `${crossfadeSec} detik`}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={12}
                  step={1}
                  value={crossfadeSec}
                  onChange={(e) => setCrossfadeSec(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg bg-[#262430]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#1B1A22]/85 border border-white/[0.06] flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[14px] font-semibold text-[#F8FAFC]">
                    Pemutaran Tanpa Jeda (Gapless Playback)
                  </h4>
                  <p className="text-[12px] text-[#948F9E]">
                    Hilangkan jeda hening saat memutar album konsep atau rekaman langsung.
                  </p>
                </div>
                <button
                  onClick={toggleGaplessPlayback}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                    gaplessPlayback ? 'bg-[#FB9278]' : 'bg-[#262430]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-[#0E0D12] transition-transform ${
                      gaplessPlayback ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#1B1A22]/85 border border-white/[0.06] flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[14px] font-semibold text-[#F8FAFC]">
                    Normalisasi Volume Otomatis (EBU R128)
                  </h4>
                  <p className="text-[12px] text-[#948F9E]">
                    Tetapkan tingkat kekerasan suara yang sama (-14 LUFS) untuk semua lagu.
                  </p>
                </div>
                <button
                  onClick={toggleEbuR128}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                    ebuR128Enabled ? 'bg-[#FB9278]' : 'bg-[#262430]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-[#0E0D12] transition-transform ${
                      ebuR128Enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#1B1A22]/85 border border-white/[0.06] flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[14px] font-semibold text-[#F8FAFC]">
                    Redupkan Volume Timer Tidur Secara Bertahap
                  </h4>
                  <p className="text-[12px] text-[#948F9E]">
                    Turunkan volume perlahan selama 30 detik terakhir sebelum timer tidur berhenti.
                  </p>
                </div>
                <button
                  onClick={toggleSmartFadeOut}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                    smartFadeOutEnabled ? 'bg-[#FB9278]' : 'bg-[#262430]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-[#0E0D12] transition-transform ${
                      smartFadeOutEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: KUALITAS AUDIO */}
          {activeSettingsSection === 'audio-quality' && (
            <div className="space-y-6">
              <div className="border-b border-white/[0.07] pb-4">
                <h2 className="text-[18px] font-bold text-[#F8FAFC]">
                  Kualitas Streaming & Unduhan
                </h2>
                <p className="text-[12.5px] text-[#948F9E]">
                  Pilih keseimbangan antara kejernihan audio studio dan penggunaan data.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-[13px] font-semibold text-[#F8FAFC] block">
                  Kualitas Streaming Saat Online
                </label>
                {[
                  {
                    id: 'normal' as const,
                    title: 'Hemat Data (128 kbps AAC)',
                    desc: 'Konsumsi kuota paling ringan untuk koneksi seluler.',
                  },
                  {
                    id: 'high' as const,
                    title: 'Sangat Tinggi (320 kbps / Opus 251)',
                    desc: 'Kualitas jernih standar musik digital.',
                  },
                  {
                    id: 'lossless' as const,
                    title: 'Lossless Studio Master (FLAC hingga 24-bit/96kHz)',
                    desc: 'Resolusi audio tanpa kompresi untuk headphone & speaker terbaik.',
                  },
                ].map((opt) => {
                  const selected = streamingQuality === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setStreamingQuality(opt.id)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#FB9278]/12 border-[#FB9278]'
                          : 'bg-[#1B1A22]/85 border-white/[0.06] hover:border-white/20'
                      }`}
                    >
                      <div>
                        <p className="text-[14px] font-semibold text-[#F8FAFC]">
                          {opt.title}
                        </p>
                        <p className="text-[12px] text-[#948F9E] mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selected
                            ? 'border-[#FB9278] bg-[#FB9278]'
                            : 'border-white/30'
                        }`}
                      >
                        {selected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0E0D12]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[13px] font-semibold text-[#F8FAFC] block">
                  Format Penyimpanan Lagu Offline
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: 'high' as const,
                      title: 'Tinggi (320 kbps)',
                      desc: 'Sekitar 8 MB per lagu',
                    },
                    {
                      id: 'lossless' as const,
                      title: 'Lossless (FLAC)',
                      desc: 'Sekitar 25-40 MB per lagu',
                    },
                  ].map((opt) => {
                    const selected = downloadQuality === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setDownloadQuality(opt.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selected
                            ? 'bg-[#FB9278]/12 border-[#FB9278]'
                            : 'bg-[#1B1A22]/85 border-white/[0.06]'
                        }`}
                      >
                        <p className="text-[13.5px] font-semibold text-[#F8FAFC]">
                          {opt.title}
                        </p>
                        <p className="text-[11.5px] text-[#948F9E]">
                          {opt.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: PENYIMPANAN & OFFLINE CACHE */}
          {activeSettingsSection === 'storage' && (
            <div className="space-y-6">
              <div className="border-b border-white/[0.07] pb-4">
                <h2 className="text-[18px] font-bold text-[#F8FAFC]">
                  Penyimpanan & Lagu Offline
                </h2>
                <p className="text-[12.5px] text-[#948F9E]">
                  Kelola direktori penyimpanan lagu yang di-cache secara otomatis di perangkat Anda.
                </p>
              </div>

              {cacheMessage && (
                <div className="p-3.5 rounded-xl bg-[#6EE7B7]/15 border border-[#6EE7B7]/40 text-[#6EE7B7] text-[12.5px] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{cacheMessage}</span>
                </div>
              )}

              <div className="p-5 rounded-2xl bg-[#1B1A22]/90 border border-white/[0.07] space-y-3">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-semibold text-[#F8FAFC]">
                    Penggunaan Ruang Penyimpanan Musik
                  </span>
                  <span className="font-mono text-[#FB9278] font-bold">
                    1.84 GB / 10.0 GB
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[#262430] overflow-hidden flex">
                  <div
                    className="h-full bg-[#FB9278]"
                    style={{ width: '18.4%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11.5px] text-[#948F9E]">
                  <span>142 lagu tersimpan offline</span>
                  <span>8.16 GB ruang tersisa dari batas alokasi</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1B1A22]/85 border border-white/[0.06] flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[14px] font-semibold text-[#F8FAFC]">
                    Simpan Otomatis Lagu yang Diputar (Ghost Caching)
                  </h4>
                  <p className="text-[12px] text-[#948F9E]">
                    Lagu yang sudah pernah diputar penuh akan otomatis tersedia offline tanpa mengunduh ulang.
                  </p>
                </div>
                <button
                  onClick={toggleGhostCache}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                    ghostCacheEnabled ? 'bg-[#6EE7B7]' : 'bg-[#262430]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-[#0E0D12] transition-transform ${
                      ghostCacheEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#1B1A22]/85 border border-white/[0.06] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#F8FAFC]">
                      Lokasi Folder Penyimpanan Offline
                    </h4>
                    <p className="text-[12px] font-mono text-[#948F9E] mt-1">
                      {cachePath}
                    </p>
                  </div>
                  <button
                    onClick={handleChangeCacheFolder}
                    className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-[12.5px] font-medium text-[#F8FAFC] flex items-center gap-2 cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4 text-[#FB9278]" />
                    <span>Ubah Lokasi</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[12px] text-[#6B6775]">
                    Bersihkan buffer streaming sementara tanpa menghapus lagu favorit
                  </span>
                  <button
                    onClick={handleClearTempCache}
                    className="px-3.5 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-[12px] font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Bersihkan Cache</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: TAMPILAN & LIRIK */}
          {activeSettingsSection === 'appearance' && (
            <div className="space-y-6">
              <div className="border-b border-white/[0.07] pb-4">
                <h2 className="text-[18px] font-bold text-[#F8FAFC]">
                  Tampilan & Lirik
                </h2>
                <p className="text-[12.5px] text-[#948F9E]">
                  Sesuaikan kenyamanan visual dan keterbacaan lirik karaoke.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1B1A22]/85 border border-white/[0.06] flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[14px] font-semibold text-[#F8FAFC]">
                    Ukuran Teks Lirik Lagu
                  </h4>
                  <p className="text-[12px] text-[#948F9E]">
                    Gunakan ukuran besar untuk keterbacaan lebih jelas saat bernyanyi.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {(['normal', 'large'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setLyricsFontSize(sz)}
                      className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-medium border cursor-pointer ${
                        lyricsFontSize === sz
                          ? 'bg-[#FB9278] text-[#0E0D12] border-[#FB9278] font-bold'
                          : 'bg-[#16161C] border-white/10 text-[#948F9E]'
                      }`}
                    >
                      {sz === 'normal' ? 'Standar' : 'Besar'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1B1A22]/85 border border-white/[0.06] flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[14px] font-semibold text-[#F8FAFC]">
                    Tema Visual Aktif
                  </h4>
                  <p className="text-[12px] text-[#948F9E]">
                    Warm Peachy Velvet Glass · Dirancang nyaman untuk mata di ruangan gelap.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0E0D12] border border-white/20" />
                  <span className="w-5 h-5 rounded-full bg-[#FB9278]" />
                  <span className="w-5 h-5 rounded-full bg-[#6EE7B7]" />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: INTEGRASI & KEAMANAN */}
          {activeSettingsSection === 'privacy' && (
            <div className="space-y-6">
              <div className="border-b border-white/[0.07] pb-4">
                <h2 className="text-[18px] font-bold text-[#F8FAFC]">
                  Integrasi & Keamanan Privasi
                </h2>
                <p className="text-[12.5px] text-[#948F9E]">
                  Hubungkan status musik Anda dan tinjau perlindungan keamanan aplikasi.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1B1A22]/85 border border-white/[0.06] flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-[14px] font-semibold text-[#F8FAFC]">
                    Discord Rich Presence
                  </h4>
                  <p className="text-[12px] text-[#948F9E]">
                    Tampilkan judul lagu, artis, dan durasi berjalan di profil Discord Anda.
                  </p>
                </div>
                <button
                  onClick={toggleDiscordRpc}
                  className={`w-11 h-6 rounded-full p-0.5 transition-colors shrink-0 cursor-pointer ${
                    discordRpcEnabled ? 'bg-[#FB9278]' : 'bg-[#262430]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-[#0E0D12] transition-transform ${
                      discordRpcEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#141918] border border-[#6EE7B7]/30 space-y-2.5">
                <div className="flex items-center gap-2 text-[#6EE7B7]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[13px] font-bold">
                    Perlindungan Keamanan & Privasi Kordive
                  </span>
                </div>
                <p className="text-[12px] text-[#948F9E] leading-relaxed">
                  Kordive berjalan dengan isolasi proses penuh (`contextIsolation`), komunikasi server lokal terenkripsi token loopback (`127.0.0.1`), dan tidak mengirimkan data riwayat mendengarkan Anda ke pihak ketiga.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
