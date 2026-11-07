import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Info, X } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';

export const ToastContainer: React.FC = () => {
  const { toastNotice, clearToast } = usePlayerStore();

  return (
    <AnimatePresence>
      {toastNotice && (
        <motion.div
          key={toastNotice.id}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-[104px] right-7 z-50 max-w-md rounded-2xl velvet-glass px-4 py-3 border border-[#FB9278]/45 shadow-[0_12px_36px_rgba(0,0,0,0.65)] flex items-center gap-3"
        >
          {toastNotice.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#6EE7B7] shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-[#FB9278] shrink-0" />
          )}

          <span className="text-[12.5px] font-medium text-[#F8FAFC]">
            {toastNotice.text}
          </span>

          <button
            onClick={clearToast}
            className="p-1 rounded-full text-[#948F9E] hover:text-[#F8FAFC] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
