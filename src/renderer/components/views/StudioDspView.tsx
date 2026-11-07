import React, { useState } from 'react';
import {
  Sliders,
  Upload,
  Save,
  Copy,
  Check,
  Trash2,
  Volume2,
  Sparkles,
  Radio,
  RotateCcw,
  FileJson,
  Music,
} from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';

export const StudioDspView: React.FC = () => {
  const {
    currentTrack,
    ebuR128Enabled,
    toggleEbuR128,
    eqEnabled,
    toggleEq,
    fxPresets,
    activePresetId,
    selectFxPreset,
    eqBands,
    setEqBandGain,
    bassBoostDb,
    setBassBoostDb,
    spatialReverb,
    setSpatialReverb,
    crossfadeSec,
    setCrossfadeSec,
    importFxPresetJson,
    saveCurrentAsCustomPreset,
    deleteCustomPreset,
  } = usePlayerStore();

  const [showImportPanel, setShowImportPanel] = useState(false);
  const [showSavePanel, setShowSavePanel] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');
  const [statusToast, setStatusToast] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  const activePreset =
    fxPresets.find((p) => p.id === activePresetId) || fxPresets[0];

  const showToast = (type: 'success' | 'error', text: string) => {
    setStatusToast({ type, text });
    setTimeout(() => setStatusToast(null), 4000);
  };

  const handleLoadSamplePreset = () => {
    const sample = JSON.stringify(
      {
        name: 'Warm Tube Master FX',
        author: 'Audiophile Community',
        description:
          'Saturasi tabung hangat dengan vokal intim dan sub-bass bulat.',
        gains: [4.5, 5.0, 3.0, 1.0, 0.5, 2.0, 3.0, 2.5, 1.5, 0.5],
        bassBoostDb: 5.5,
        spatialReverb: 30,
      },
      null,
      2
    );
    setImportJsonText(sample);
  };

  const handleImportSubmit = () => {
    const res = importFxPresetJson(importJsonText);
    if (res.success) {
      setShowImportPanel(false);
      setImportJsonText('');
      showToast('success', res.message);
    } else {
      showToast('error', res.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = String(ev.target?.result || '');
      setImportJsonText(content);
    };
    reader.readAsText(file);
  };

  const handleSaveCustom = () => {
    if (!newPresetName.trim()) {
      showToast('error', 'Masukkan nama preset terlebih dahulu.');
      return;
    }
    saveCurrentAsCustomPreset(newPresetName, newPresetDesc);
    setNewPresetName('');
    setNewPresetDesc('');
    setShowSavePanel(false);
    showToast(
      'success',
      `Preset "${newPresetName}" berhasil disimpan ke FX Studio.`
    );
  };

  const handleExportCurrentJson = () => {
    const payload = {
      name: activePreset.name,
      author: activePreset.author,
      description: activePreset.description,
      gains: eqBands.map((b) => b.gainDb),
      bassBoostDb,
      spatialReverb,
    };
    navigator.clipboard?.writeText(JSON.stringify(payload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  // Compute SVG polyline points for the live frequency response graph
  const svgPoints = eqBands
    .map((band, idx) => {
      const x = (idx / (eqBands.length - 1)) * 600;
      const y = 60 - (band.gainDb / 12) * 48; // 0dB is at y=60, +12dB at y=12, -12dB at y=108
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-6 pb-10">
      {/* 1. FX Studio Header & Active Status Banner */}
      <section className="rounded-[22px] bg-gradient-to-r from-[#24161C] via-[#1A1622] to-[#16161C] border border-white/[0.12] p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FB9278]/15 border border-[#FB9278]/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(251,146,120,0.2)]">
            <Sliders className="w-6 h-6 text-[#FB9278]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[22px] font-bold text-[#F8FAFC] tracking-tight">
                FX Studio & Equalizer
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold uppercase ${
                  eqEnabled
                    ? 'bg-[#6EE7B7]/20 text-[#6EE7B7] border border-[#6EE7B7]/40'
                    : 'bg-white/10 text-[#948F9E]'
                }`}
              >
                {eqEnabled ? 'MESIN DSP AKTIF' : 'MODE BYPASS'}
              </span>
            </div>
            <p className="text-[12.5px] text-[#948F9E] mt-0.5 flex items-center gap-2">
              <Music className="w-3.5 h-3.5 text-[#FB9278]" />
              <span>
                Memproses: <strong className="text-[#F8FAFC]">{currentTrack.title}</strong> · Preset Aktif:{' '}
                <strong className="text-[#FB9278]">{activePreset.name}</strong>
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setShowImportPanel(!showImportPanel);
              setShowSavePanel(false);
            }}
            className="px-4 py-2.5 rounded-full bg-[#1B1A22] hover:bg-[#FB9278]/15 border border-white/[0.14] hover:border-[#FB9278] text-[12.5px] font-semibold text-[#F8FAFC] hover:text-[#FB9278] flex items-center gap-2 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#FB9278]" />
            <span>Impor Preset</span>
          </button>

          <button
            onClick={() => {
              setShowSavePanel(!showSavePanel);
              setShowImportPanel(false);
            }}
            className="px-4 py-2.5 rounded-full bg-[#FB9278] hover:bg-[#FCA5A5] text-[#0E0D12] text-[12.5px] font-bold flex items-center gap-2 shadow-[0_0_18px_rgba(251,146,120,0.3)] transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Preset</span>
          </button>

          <button
            onClick={handleExportCurrentJson}
            title="Salin Konfigurasi Preset ke Clipboard"
            className="px-3.5 py-2.5 rounded-full bg-[#1B1A22] border border-white/[0.12] hover:border-white/25 text-[12px] font-mono text-[#F8FAFC] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedJson ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#6EE7B7]" />
                <span className="text-[#6EE7B7]">Disalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#FB9278]" />
                <span>Ekspor JSON</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Status Notification Toast */}
      {statusToast && (
        <div
          className={`p-3.5 rounded-xl border text-[13px] font-medium flex items-center justify-between ${
            statusToast.type === 'success'
              ? 'bg-[#6EE7B7]/15 border-[#6EE7B7]/40 text-[#6EE7B7]'
              : 'bg-red-500/15 border-red-500/40 text-red-300'
          }`}
        >
          <span>{statusToast.text}</span>
        </div>
      )}

      {/* Collapsible Import Preset Panel */}
      {showImportPanel && (
        <section className="rounded-[22px] velvet-glass p-5 border border-[#FB9278]/50 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileJson className="w-4 h-4 text-[#FB9278]" />
              <h3 className="text-[15px] font-bold text-[#F8FAFC]">
                Impor Preset Audio FX Studio (.json)
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <label className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-[12px] font-medium text-[#F8FAFC] cursor-pointer">
                Pilih File .json
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleLoadSamplePreset}
                className="px-3 py-1.5 rounded-lg bg-[#FB9278]/20 text-[#FB9278] text-[12px] font-semibold hover:bg-[#FB9278]/30 cursor-pointer"
              >
                Muat Contoh Preset
              </button>
            </div>
          </div>

          <textarea
            rows={5}
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder='{"name": "Custom Studio EQ", "gains": [3, 4, 2, 0, -1, 1, 2, 3, 2, 1], "bassBoostDb": 4, "spatialReverb": 25}'
            className="w-full rounded-xl bg-[#0E0D12] border border-white/15 p-3.5 font-mono text-[12px] text-[#F8FAFC] focus:border-[#FB9278] focus:outline-none"
          />

          <div className="flex justify-end gap-2.5">
            <button
              onClick={() => setShowImportPanel(false)}
              className="px-4 py-2 rounded-xl bg-white/[0.06] text-[#948F9E] text-[12.5px] font-medium cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleImportSubmit}
              className="px-5 py-2 rounded-xl bg-[#FB9278] text-[#0E0D12] text-[12.5px] font-bold cursor-pointer"
            >
              Pasang & Aktifkan Preset
            </button>
          </div>
        </section>
      )}

      {/* Collapsible Save Custom Preset Panel */}
      {showSavePanel && (
        <section className="rounded-[22px] velvet-glass p-5 border border-[#FB9278]/50 space-y-4">
          <h3 className="text-[15px] font-bold text-[#F8FAFC]">
            Simpan Konfigurasi Saat Ini sebagai Preset Baru
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] text-[#948F9E] block">
                Nama Preset Audio
              </label>
              <input
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="Contoh: Warm Acoustic Headphone"
                className="w-full h-10 px-3.5 rounded-xl bg-[#0E0D12] border border-white/15 text-[13px] text-[#F8FAFC] focus:border-[#FB9278] focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] text-[#948F9E] block">
                Deskripsi Karakter Suara
              </label>
              <input
                type="text"
                value={newPresetDesc}
                onChange={(e) => setNewPresetDesc(e.target.value)}
                placeholder="Contoh: Fokus vokal jernih dan sub-bass lembut"
                className="w-full h-10 px-3.5 rounded-xl bg-[#0E0D12] border border-white/15 text-[13px] text-[#F8FAFC] focus:border-[#FB9278] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2.5">
            <button
              onClick={() => setShowSavePanel(false)}
              className="px-4 py-2 rounded-xl bg-white/[0.06] text-[#948F9E] text-[12.5px] font-medium cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleSaveCustom}
              className="px-5 py-2 rounded-xl bg-[#FB9278] text-[#0E0D12] text-[12.5px] font-bold cursor-pointer"
            >
              Simpan Preset
            </button>
          </div>
        </section>
      )}

      {/* 2. Pilihan Preset Audio (High-Visibility Cards) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-[#F8FAFC]">
            1. Pilih Karakter Preset Audio ({fxPresets.length})
          </h3>
          <span className="text-[12px] text-[#948F9E]">
            Klik kartu preset untuk langsung mengubah karakter suara
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {fxPresets.map((preset) => {
            const isSelected = preset.id === activePresetId;
            return (
              <div
                key={preset.id}
                onClick={() => selectFxPreset(preset.id)}
                className={`p-4 rounded-[18px] border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#FB9278]/15 border-[#FB9278] shadow-[0_0_22px_rgba(251,146,120,0.2)]'
                    : 'bg-[#181720] border-white/[0.1] hover:border-white/[0.25]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-[15px] font-bold text-[#F8FAFC]">
                        {preset.name}
                      </h4>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-[#FB9278] text-[#0E0D12] text-[9.5px] font-mono font-bold uppercase">
                          Aktif
                        </span>
                      )}
                      {preset.isCustom && (
                        <span className="px-2 py-0.5 rounded bg-[#6EE7B7]/20 text-[#6EE7B7] text-[9.5px] font-mono">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-[#FB9278] mt-0.5">
                      Oleh {preset.author}
                    </p>
                  </div>

                  {preset.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCustomPreset(preset.id);
                      }}
                      title="Hapus preset kustom"
                      className="p-1 text-[#948F9E] hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-[12px] text-[#F8FAFC]/80 line-clamp-2">
                  {preset.description}
                </p>

                <div className="flex items-center gap-3 pt-2 border-t border-white/[0.08] text-[11px] font-mono text-[#948F9E]">
                  <span>Sub-Bass: +{preset.bassBoostDb}dB</span>
                  <span>·</span>
                  <span>Spatial: {preset.spatialReverb}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. 10-Band Graphic Equalizer Rack with Live Curve & High-Visibility Thumbs */}
      <section className="rounded-[24px] velvet-glass p-6 space-y-5 border border-white/[0.12]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-[17px] font-bold text-[#F8FAFC]">
              2. Kustomisasi 10-Band Equalizer (-12dB hingga +12dB)
            </h3>
            <p className="text-[12.5px] text-[#948F9E]">
              Geser knop putih pada tiap pita frekuensi untuk menyesuaikan Bass (kiri), Vokal (tengah), dan Treble (kanan).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => selectFxPreset('preset-flat')}
              className="px-3.5 py-2 rounded-full bg-[#1B1A22] border border-white/15 text-[12px] font-medium text-[#F8FAFC] hover:border-[#FB9278] flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#FB9278]" />
              <span>Reset Netral (0dB)</span>
            </button>

            <button
              onClick={toggleEq}
              className={`px-4 py-2 rounded-full text-[12px] font-mono font-bold border transition-all cursor-pointer ${
                eqEnabled
                  ? 'bg-[#FB9278] text-[#0E0D12] border-[#FB9278] shadow-[0_0_16px_rgba(251,146,120,0.3)]'
                  : 'bg-[#1B1A22] border-white/15 text-[#948F9E]'
              }`}
            >
              {eqEnabled ? 'EQUALIZER: ON' : 'EQUALIZER: OFF'}
            </button>
          </div>
        </div>

        {/* Live Frequency Response Curve Visualizer */}
        <div className="relative w-full h-28 rounded-2xl bg-[#111016] border border-white/[0.08] p-3 overflow-hidden">
          <div className="absolute left-3 top-2 text-[10px] font-mono text-[#6B6775]">
            +12 dB
          </div>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#948F9E]">
            0 dB
          </div>
          <div className="absolute left-3 bottom-2 text-[10px] font-mono text-[#6B6775]">
            -12 dB
          </div>

          {/* 0dB Reference Line */}
          <div className="absolute left-14 right-4 top-1/2 border-t border-dashed border-white/15 pointer-events-none" />

          <svg
            viewBox="0 0 600 120"
            preserveAspectRatio="none"
            className="w-full h-full pl-10"
          >
            <polyline
              fill="none"
              stroke={eqEnabled ? '#FB9278' : '#6B6775'}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={svgPoints}
            />
          </svg>
        </div>

        {/* 10 Vertical Frequency Sliders with High-Contrast Visual Knobs */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 pt-2 pb-1">
          {eqBands.map((band, index) => {
            const fillPercent = Math.round(((band.gainDb + 12) / 24) * 100);
            return (
              <div
                key={band.freqLabel}
                className="flex flex-col items-center gap-2.5 p-2 rounded-xl bg-[#15141C] border border-white/[0.06]"
              >
                {/* dB Value Badge */}
                <span
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                    band.gainDb > 0
                      ? 'bg-[#FB9278]/15 text-[#FB9278]'
                      : band.gainDb < 0
                      ? 'bg-white/10 text-[#F8FAFC]'
                      : 'text-[#948F9E]'
                  }`}
                >
                  {band.gainDb > 0 ? `+${band.gainDb}` : band.gainDb}dB
                </span>

                {/* Vertical Track & Visible Knob */}
                <div className="relative h-40 w-8 flex items-center justify-center">
                  {/* Center 0dB tick mark */}
                  <div className="absolute inset-x-1 top-1/2 border-t border-white/20 pointer-events-none" />

                  <div className="w-2.5 h-full rounded-full bg-[#262430] overflow-hidden flex flex-col justify-end">
                    <div
                      className={`w-full rounded-full transition-all duration-150 ${
                        eqEnabled
                          ? 'bg-gradient-to-t from-[#FB9278]/40 to-[#FB9278]'
                          : 'bg-[#6B6775]/40'
                      }`}
                      style={{ height: `${fillPercent}%` }}
                    />
                  </div>

                  {/* High-Visibility Fader Thumb Indicator */}
                  <div
                    className={`w-6 h-3.5 rounded-md border-2 pointer-events-none absolute transition-all duration-150 ${
                      eqEnabled
                        ? 'bg-[#F8FAFC] border-[#FB9278] shadow-[0_0_12px_rgba(251,146,120,0.6)]'
                        : 'bg-[#948F9E] border-[#6B6775]'
                    }`}
                    style={{
                      bottom: `calc(${fillPercent}% - 7px)`,
                    }}
                  />

                  <input
                    type="range"
                    min={-12}
                    max={12}
                    step={0.5}
                    disabled={!eqEnabled}
                    value={band.gainDb}
                    onChange={(e) =>
                      setEqBandGain(index, Number(e.target.value))
                    }
                    style={{
                      writingMode: 'vertical-lr',
                      direction: 'rtl',
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* Frequency Label */}
                <span className="text-[11.5px] font-mono font-semibold text-[#F8FAFC]">
                  {band.freqLabel}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FX Studio Acoustic Modules */}
      <section className="space-y-3">
        <h3 className="text-[16px] font-bold text-[#F8FAFC]">
          3. Modul Efek Studio Tambahan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sub-Bass Warmth */}
          <div className="rounded-[20px] velvet-glass p-5 flex flex-col justify-between space-y-4 border border-white/[0.1]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[14.5px] font-bold text-[#F8FAFC] flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#FB9278]" />
                  Sub-Bass Warmth
                </span>
                <span className="px-2 py-0.5 rounded bg-[#FB9278]/15 text-[12px] font-mono font-bold text-[#FB9278]">
                  +{bassBoostDb} dB
                </span>
              </div>
              <p className="text-[12px] text-[#948F9E] mt-1.5">
                Menambah kedalaman frekuensi rendah harmonik tanpa menutupi vokal.
              </p>
            </div>
            <input
              type="range"
              min={0}
              max={12}
              step={0.5}
              value={bassBoostDb}
              onChange={(e) => setBassBoostDb(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-[#262430]"
            />
          </div>

          {/* Spatial Room Reverb */}
          <div className="rounded-[20px] velvet-glass p-5 flex flex-col justify-between space-y-4 border border-white/[0.1]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[14.5px] font-bold text-[#F8FAFC] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FB9278]" />
                  Spatial Studio Stage
                </span>
                <span className="px-2 py-0.5 rounded bg-[#FB9278]/15 text-[12px] font-mono font-bold text-[#FB9278]">
                  {spatialReverb}%
                </span>
              </div>
              <p className="text-[12px] text-[#948F9E] mt-1.5">
                Memperluas panggung suara stereo agar terasa seperti di studio akustik.
              </p>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={spatialReverb}
              onChange={(e) => setSpatialReverb(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-[#262430]"
            />
          </div>

          {/* EBU R128 Auto-Normalization */}
          <div className="rounded-[20px] velvet-glass p-5 flex flex-col justify-between space-y-4 border border-white/[0.1]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[14.5px] font-bold text-[#F8FAFC] flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#FB9278]" />
                  Normalisasi Volume
                </span>
                <p className="text-[12px] text-[#948F9E] mt-1.5">
                  Standar EBU R128 (-14 LUFS) menjaga volume tetap seimbang antar-lagu.
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
            <div className="text-[11.5px] font-mono font-semibold text-[#6EE7B7]">
              {ebuR128Enabled
                ? 'Target -14.0 LUFS Aktif'
                : 'Normalisasi Nonaktif'}
            </div>
          </div>

          {/* Dynamic Crossfade */}
          <div className="rounded-[20px] velvet-glass p-5 flex flex-col justify-between space-y-4 border border-white/[0.1]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[14.5px] font-bold text-[#F8FAFC]">
                  Transisi Crossfade
                </span>
                <span className="px-2 py-0.5 rounded bg-[#FB9278]/15 text-[12px] font-mono font-bold text-[#FB9278]">
                  {crossfadeSec} dtk
                </span>
              </div>
              <p className="text-[12px] text-[#948F9E] mt-1.5">
                Perpindahan mulus fade-in/fade-out saat pergantian lagu berikutnya.
              </p>
            </div>
            <input
              type="range"
              min={0}
              max={12}
              step={1}
              value={crossfadeSec}
              onChange={(e) => setCrossfadeSec(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-[#262430]"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
