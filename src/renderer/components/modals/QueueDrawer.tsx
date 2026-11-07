import React from 'react';
import { ListMusic, X, Play, Pause, Trash2 } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';

export const QueueDrawer: React.FC = () => {
  const {
    isQueueDrawerOpen,
    setQueueDrawerOpen,
    queue,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    removeFromQueue,
  } = usePlayerStore();

  if (!isQueueDrawerOpen) return null;

  return (
    <div
      onClick={() => setQueueDrawerOpen(false)}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[380px] h-full velvet-glass border-l border-white/[0.1] p-6 flex flex-col justify-between shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <ListMusic className="w-5 h-5 text-[#FB9278]" />
            <div>
              <h3 className="text-[16px] font-bold text-[#F8FAFC]">
                Antrean Pemutaran
              </h3>
              <p className="text-[11px] font-mono text-[#948F9E]">
                {queue.length} lagu dalam antrean aktif
              </p>
            </div>
          </div>

          <button
            onClick={() => setQueueDrawerOpen(false)}
            className="p-1.5 rounded-lg text-[#948F9E] hover:text-[#F8FAFC] hover:bg-white/[0.06] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Queue Track List */}
        <div className="flex-1 overflow-y-auto my-4 space-y-2 pr-1">
          {queue.map((track, idx) => {
            const isCurrent = currentTrack.id === track.id;
            const isCurrentPlaying = isCurrent && isPlaying;

            return (
              <div
                key={`${track.id}-${idx}`}
                onClick={() => (isCurrent ? togglePlay() : playTrack(track))}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#FB9278]/15 border-[#FB9278]/50'
                    : 'bg-[#1B1A22]/75 border-white/[0.05] hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${track.coverGradient} flex items-center justify-center shrink-0`}
                  >
                    {isCurrentPlaying ? (
                      <Pause className="w-3.5 h-3.5 text-[#FB9278] fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-white/80 fill-current ml-0.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-[13px] font-semibold truncate ${
                        isCurrent ? 'text-[#FB9278]' : 'text-[#F8FAFC]'
                      }`}
                    >
                      {track.title}
                    </p>
                    <p className="text-[11px] text-[#948F9E] truncate">
                      {track.artist} · {track.durationFormatted}
                    </p>
                  </div>
                </div>

                {!isCurrent && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromQueue(track.id);
                    }}
                    title="Hapus dari antrean"
                    className="p-1.5 text-[#6B6775] hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.08] text-center">
          <p className="text-[11px] font-mono text-[#6B6775]">
            EBU R128 Auto-Leveling & Seamless Crossfade Aktif
          </p>
        </div>
      </div>
    </div>
  );
};
