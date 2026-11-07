import React from 'react';
import { Moon, X, Sparkles, Clock } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { SleepTimerMode } from '../../types/music';
import { formatDuration } from '../../utils/formatters';

const TIMER_OPTIONS: { mode: SleepTimerMode; label: string; desc: string }[] = [
  { mode: '15m', label: '15 Menit', desc: 'Cocok untuk power nap singkat' },
  { mode: '30m', label: '30 Menit', desc: 'Durasi pengantar tidur ideal' },
  { mode: '45m', label: '45 Menit', desc: 'Sesi relaksasi malam mendalam' },
  { mode: '60m', label: '60 Menit', desc: 'Satu jam penuh ambient tenang' },
  {
    mode: 'end-of-track',
    label: 'Akhir Lagu Ini',
    desc: 'Berhenti otomatis setelah lagu selesai',
  },
];

export const SleepTimerModal: React.FC = () => {
  const {
    isSleepModalOpen,
    setSleepModalOpen,
    sleepTimerMode,
    sleepTimerRemainingSec,
    smartFadeOutEnabled,
    setSleepTimer,
    toggleSmartFadeOut,
  } = usePlayerStore();

  if (!isSleepModalOpen) return null;

  return (
    <div
      onClick={() => setSleepModalOpen(false)}
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] rounded-[24px] velvet-glass p-6 border border-white/[0.12] shadow-2xl space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/40 flex items-center justify-center">
              <Moon className="w-4 h-4 text-[#FBBF24] fill-current" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#F8FAFC]">
                Smart Sleep Timer
              </h3>
              <p className="text-[11.5px] text-[#948F9E]">
                Matikan musik otomatis saat Anda terlelap
              </p>
            </div>
          </div>

          <button
            onClick={() => setSleepModalOpen(false)}
            className="p-1.5 rounded-lg text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.06] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active Countdown Banner */}
        {sleepTimerRemainingSec !== null && (
          <div className="p-3.5 rounded-2xl bg-[#F59E0B]/12 border border-[#F59E0B]/40 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#FCD34D]">
              <Clock className="w-4 h-4 animate-spin" />
              <span className="text-[12.5px] font-medium">
                Sisa waktu pemutaran:
              </span>
            </div>
            <span className="text-[16px] font-mono font-bold text-[#FBBF24]">
              {formatDuration(sleepTimerRemainingSec)}
            </span>
          </div>
        )}

        {/* Preset Choices */}
        <div className="space-y-2">
          {TIMER_OPTIONS.map((opt) => {
            const isSelected = sleepTimerMode === opt.mode;
            return (
              <button
                key={opt.mode}
                onClick={() => setSleepTimer(opt.mode)}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FB9278]/15 border-[#FB9278] text-[#F8FAFC]'
                    : 'bg-[#1B1A22]/80 border-white/[0.06] text-[#948F9E] hover:text-[#F8FAFC] hover:border-white/[0.15]'
                }`}
              >
                <div>
                  <p className="text-[13.5px] font-semibold text-[#F8FAFC]">
                    {opt.label}
                  </p>
                  <p className="text-[11px] text-[#948F9E]">{opt.desc}</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? 'border-[#FB9278] bg-[#FB9278]'
                      : 'border-white/25'
                  }`}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0E0D12]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Smart 30s Exponential Volume Fade-Out Toggle */}
        <div className="p-3.5 rounded-xl bg-[#16161C] border border-white/[0.07] flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FB9278]" />
              <span className="text-[12.5px] font-semibold text-[#F8FAFC]">
                Exponential Fade-Out (30 dtk terakhir)
              </span>
            </div>
            <p className="text-[11px] text-[#948F9E] mt-0.5">
              Turunkan volume perlahan sebelum berhenti agar tidak kaget.
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

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {sleepTimerMode !== 'off' && (
            <button
              onClick={() => setSleepTimer('off')}
              className="px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 text-[12.5px] font-medium cursor-pointer"
            >
              Matikan Timer
            </button>
          )}
          <button
            onClick={() => setSleepModalOpen(false)}
            className="ml-auto px-5 py-2 rounded-xl bg-[#FB9278] text-[#0E0D12] text-[13px] font-semibold cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
