import React, { useState } from 'react';
import { FolderPlus, X, Check, ListMusic } from 'lucide-react';
import { ALL_TRACKS } from '../../data/mockCatalog';
import { usePlayerStore } from '../../store/usePlayerStore';

const COVER_THEMES = [
  { label: 'Velvet Crimson', gradient: 'from-[#642026] to-[#18131A]' },
  { label: 'Sunset Amber', gradient: 'from-[#5A2D1B] to-[#181210]' },
  { label: 'Midnight Ocean', gradient: 'from-[#182738] to-[#0F131A]' },
  { label: 'Emerald Forest', gradient: 'from-[#182E23] to-[#0D1311]' },
  { label: 'Synthwave Plum', gradient: 'from-[#3B1D36] to-[#130D16]' },
];

export const CreatePlaylistModal: React.FC = () => {
  const {
    isCreatePlaylistModalOpen,
    setCreatePlaylistModalOpen,
    createCustomPlaylist,
  } = usePlayerStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(
    COVER_THEMES[0].gradient
  );
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([
    'pop-1',
    'feat-3',
  ]);

  if (!isCreatePlaylistModalOpen) return null;

  const toggleTrackSelection = (id: string) => {
    setSelectedTrackIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCustomPlaylist(
      name || 'Playlist Pribadi Baru',
      description || 'Disusun khusus di Kordive.',
      selectedGradient,
      selectedTrackIds.length > 0 ? selectedTrackIds : ['pop-1']
    );
    setName('');
    setDescription('');
  };

  return (
    <div
      onClick={() => setCreatePlaylistModalOpen(false)}
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-[500px] rounded-[24px] velvet-glass p-6 border border-white/[0.12] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FB9278]/15 border border-[#FB9278]/40 flex items-center justify-center">
              <FolderPlus className="w-4 h-4 text-[#FB9278]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#F8FAFC]">
                Buat Playlist Baru
              </h3>
              <p className="text-[11.5px] text-[#948F9E]">
                Susun koleksi lagu pribadi sesuai suasana hati Anda
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCreatePlaylistModalOpen(false)}
            className="p-1.5 rounded-lg text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.06] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview & Input Fields */}
        <div className="flex items-center gap-4">
          <div
            className={`w-20 h-20 rounded-[16px] bg-gradient-to-br ${selectedGradient} border border-white/15 flex items-center justify-center shrink-0 shadow-lg`}
          >
            <ListMusic className="w-8 h-8 text-[#FB9278]" />
          </div>

          <div className="flex-1 space-y-2.5">
            <div>
              <label className="text-[11.5px] font-medium text-[#948F9E] block mb-1">
                Nama Playlist
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Sesi Fokus Malam"
                className="w-full h-10 px-3.5 rounded-xl bg-[#16161C] border border-white/10 focus:border-[#FB9278] focus:outline-none text-[13px] text-[#F8FAFC]"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-[11.5px] font-medium text-[#948F9E] block mb-1">
            Deskripsi Singkat (Opsional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ceritakan suasana atau tema dari playlist ini..."
            className="w-full h-10 px-3.5 rounded-xl bg-[#16161C] border border-white/10 focus:border-[#FB9278] focus:outline-none text-[13px] text-[#F8FAFC]"
          />
        </div>

        {/* Cover Theme Picker */}
        <div>
          <label className="text-[11.5px] font-medium text-[#948F9E] block mb-2">
            Pilih Tema Warna Sampul
          </label>
          <div className="flex items-center gap-2.5">
            {COVER_THEMES.map((theme) => {
              const isSelected = selectedGradient === theme.gradient;
              return (
                <button
                  type="button"
                  key={theme.label}
                  onClick={() => setSelectedGradient(theme.gradient)}
                  title={theme.label}
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${theme.gradient} border flex items-center justify-center transition-transform cursor-pointer ${
                    isSelected
                      ? 'border-[#FB9278] scale-110'
                      : 'border-white/15 opacity-75 hover:opacity-100'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-[#FB9278]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Select Initial Songs */}
        <div>
          <label className="text-[11.5px] font-medium text-[#948F9E] block mb-2">
            Pilih Lagu Awal ({selectedTrackIds.length} dipilih)
          </label>
          <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
            {ALL_TRACKS.map((track) => {
              const checked = selectedTrackIds.includes(track.id);
              return (
                <div
                  key={track.id}
                  onClick={() => toggleTrackSelection(track.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    checked
                      ? 'bg-[#FB9278]/12 border-[#FB9278]/50'
                      : 'bg-[#16161C]/80 border-white/[0.05] hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${track.coverGradient} shrink-0`}
                    />
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-semibold text-[#F8FAFC] truncate">
                        {track.title}
                      </p>
                      <p className="text-[11px] text-[#948F9E] truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                      checked
                        ? 'bg-[#FB9278] border-[#FB9278] text-[#0E0D12]'
                        : 'border-white/25'
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => setCreatePlaylistModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-white/[0.06] text-[#948F9E] hover:text-[#F8FAFC] text-[13px] font-medium cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-[#FB9278] hover:bg-[#FCA5A5] text-[#0E0D12] text-[13px] font-bold shadow-[0_0_20px_rgba(251,146,120,0.3)] cursor-pointer"
          >
            Simpan Playlist
          </button>
        </div>
      </form>
    </div>
  );
};
