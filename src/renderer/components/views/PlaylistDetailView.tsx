import React, { useState } from 'react';
import {
  Play,
  Pause,
  Shuffle,
  ListMusic,
  Heart,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  Download,
  Loader2,
  Check,
  X,
} from 'lucide-react';
import { ALL_SYSTEM_PLAYLISTS, ALL_TRACKS } from '../../data/mockCatalog';
import { usePlayerStore } from '../../store/usePlayerStore';

export const PlaylistDetailView: React.FC = () => {
  const {
    playlists,
    activePlaylistId,
    currentTrack,
    isPlaying,
    playTrack,
    playPlaylist,
    togglePlay,
    openTrackDetail,
    favoriteTrackIds,
    cachedTrackIds,
    downloadingTrackIds,
    toggleFavorite,
    toggleTrackOffline,
    downloadTracksOffline,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    updateCustomPlaylist,
    deleteCustomPlaylist,
  } = usePlayerStore();

  const allKnownPlaylists = [...playlists, ...ALL_SYSTEM_PLAYLISTS];
  const playlist =
    allKnownPlaylists.find((p) => p.id === activePlaylistId) || playlists[0];

  const isUserEditable = playlists.some((p) => p.id === playlist.id);

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editName, setEditName] = useState(playlist.name);
  const [editDesc, setEditDesc] = useState(playlist.description);

  const playlistTracks = ALL_TRACKS.filter((t) =>
    playlist.trackIds.includes(t.id)
  );
  const availableToAdd = ALL_TRACKS.filter(
    (t) => !playlist.trackIds.includes(t.id)
  );

  const allOfflineReady =
    playlistTracks.length > 0 &&
    playlistTracks.every((t) => cachedTrackIds.includes(t.id));

  const handleSaveEdit = () => {
    updateCustomPlaylist(playlist.id, editName, editDesc);
    setIsEditingInfo(false);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Playlist Hero Header */}
      <section
        className={`rounded-[24px] p-6 sm:p-8 bg-gradient-to-br ${playlist.coverGradient} border border-white/[0.14] flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 shadow-2xl`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1 min-w-0">
          <div
            className={`w-28 h-28 sm:w-36 sm:h-36 rounded-[20px] bg-gradient-to-tr ${playlist.coverGradient} border border-white/20 shadow-2xl flex items-center justify-center shrink-0`}
          >
            <ListMusic className="w-12 h-12 text-[#FB9278]" />
          </div>

          <div className="space-y-2 flex-1 min-w-0">
            <span className="px-3 py-1 rounded-full bg-black/35 border border-white/10 text-[11px] font-mono text-[#FB9278] uppercase">
              Playlist · Oleh {playlist.creator}
            </span>

            {isEditingInfo ? (
              <div className="space-y-2.5 pt-1 max-w-lg">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-black/50 border border-[#FB9278]/60 text-[18px] font-bold text-[#F8FAFC] focus:outline-none"
                />
                <input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full h-9 px-3.5 rounded-xl bg-black/50 border border-white/20 text-[13px] text-[#F8FAFC] focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3.5 py-1.5 rounded-lg bg-[#FB9278] text-[#0E0D12] text-[12px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Simpan</span>
                  </button>
                  <button
                    onClick={() => setIsEditingInfo(false)}
                    className="px-3.5 py-1.5 rounded-lg bg-white/10 text-[#F8FAFC] text-[12px] flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Batal</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-[26px] sm:text-[32px] font-bold text-[#F8FAFC] tracking-tight truncate">
                  {playlist.name}
                </h1>
                <p className="text-[13.5px] text-white/80 max-w-xl">
                  {playlist.description}
                </p>
                <p className="text-[12px] font-mono text-[#948F9E]">
                  {playlistTracks.length} lagu dalam playlist ini
                </p>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => playPlaylist(playlist.trackIds, false)}
            className="px-6 py-3 rounded-full bg-[#FB9278] hover:bg-[#FCA5A5] text-[#0E0D12] text-[13.5px] font-bold flex items-center gap-2 shadow-[0_0_24px_rgba(251,146,120,0.4)] transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Putar Playlist</span>
          </button>

          <button
            onClick={() => playPlaylist(playlist.trackIds, true)}
            className="px-4 py-3 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-[#F8FAFC] text-[13px] font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Shuffle className="w-4 h-4 text-[#FB9278]" />
            <span>Shuffle</span>
          </button>

          <button
            onClick={() =>
              downloadTracksOffline(playlist.trackIds, playlist.name)
            }
            title="Simpan Seluruh Lagu Playlist untuk Mode Offline"
            className={`px-4 py-3 rounded-full border text-[13px] font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              allOfflineReady
                ? 'bg-[#6EE7B7]/15 border-[#6EE7B7]/45 text-[#6EE7B7]'
                : 'bg-black/40 hover:bg-black/60 border-white/15 text-[#F8FAFC]'
            }`}
          >
            {allOfflineReady ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#6EE7B7]" />
                <span>Tersimpan Offline</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#FB9278]" />
                <span>Simpan Offline</span>
              </>
            )}
          </button>

          {isUserEditable && (
            <>
              <button
                onClick={() => {
                  setEditName(playlist.name);
                  setEditDesc(playlist.description);
                  setIsEditingInfo(true);
                }}
                title="Ubah Nama & Deskripsi Playlist"
                className="p-3 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-[#F8FAFC] hover:text-[#FB9278] transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              {playlists.length > 1 && (
                <button
                  onClick={() => deleteCustomPlaylist(playlist.id)}
                  title="Hapus Playlist Ini"
                  className="p-3 rounded-full bg-black/40 hover:bg-red-500/20 border border-white/15 hover:border-red-400/50 text-[#948F9E] hover:text-red-300 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </section>

      {/* 2. Daftar Lagu dalam Playlist */}
      <section className="space-y-3.5">
        <h3 className="text-[17px] font-bold text-[#F8FAFC]">
          Daftar Lagu ({playlistTracks.length})
        </h3>

        <div className="rounded-[20px] velvet-glass divide-y divide-white/[0.05] overflow-hidden">
          {playlistTracks.map((track, idx) => {
            const isCurrent = currentTrack.id === track.id;
            const isCurrentPlaying = isCurrent && isPlaying;
            const isFav = favoriteTrackIds.includes(track.id);
            const isCached = cachedTrackIds.includes(track.id);
            const isDownloading = downloadingTrackIds.includes(track.id);

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
                      {track.artist} · {track.album}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Offline Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTrackOffline(track.id);
                    }}
                    title={
                      isCached
                        ? 'Tersedia Offline (Klik untuk hapus)'
                        : 'Simpan Offline'
                    }
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
                      isCached
                        ? 'bg-[#6EE7B7]/12 border-[#6EE7B7]/35 text-[#6EE7B7]'
                        : 'bg-white/[0.04] border-white/[0.08] text-[#948F9E] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-[#FB9278]" />
                        <span className="hidden sm:inline">Mengunduh...</span>
                      </>
                    ) : isCached ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="hidden sm:inline">Offline</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3" />
                        <span className="hidden sm:inline">Unduh</span>
                      </>
                    )}
                  </button>

                  {/* Favorite Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(track.id);
                    }}
                    title="Suka"
                    className="p-1.5 text-[#948F9E] hover:text-[#FB9278] cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? 'fill-[#FB9278] text-[#FB9278]' : ''
                      }`}
                    />
                  </button>

                  {/* Remove from Playlist (For User Playlists) */}
                  {isUserEditable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTrackFromPlaylist(playlist.id, track.id);
                      }}
                      title="Hapus Lagu dari Playlist Ini"
                      className="p-1.5 text-[#6B6775] hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <span className="text-[12px] font-mono text-[#948F9E] w-10 text-right">
                    {track.durationFormatted}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Rekomendasi Lagu untuk Ditambahkan (Untuk Playlist Pribadi) */}
      {isUserEditable && availableToAdd.length > 0 && (
        <section className="space-y-3.5">
          <div>
            <h3 className="text-[16px] font-bold text-[#F8FAFC]">
              Tambahkan Lagu ke "{playlist.name}"
            </h3>
            <p className="text-[12px] text-[#948F9E]">
              Klik tombol Tambah untuk memasukkan lagu ke dalam playlist Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableToAdd.slice(0, 4).map((track) => (
              <div
                key={track.id}
                className="p-3 rounded-[14px] velvet-glass-subtle flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${track.coverGradient} shrink-0`}
                  />
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold text-[#F8FAFC] truncate">
                      {track.title}
                    </p>
                    <p className="text-[11.5px] text-[#948F9E] truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => addTrackToPlaylist(playlist.id, track.id)}
                  className="px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-[#FB9278] text-[#F8FAFC] hover:text-[#0E0D12] text-[12px] font-semibold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
