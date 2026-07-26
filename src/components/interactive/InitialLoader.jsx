import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Sparkles } from 'lucide-react';

export default function InitialLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsLoading(false);
            if (onComplete) onComplete();
          }, 300);
          return 100;
        }
        const increment = Math.floor(Math.random() * 12) + 5;
        return Math.min(100, prev + increment);
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="initial-loader"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 bg-[#07070a] flex flex-col items-center justify-center px-4 overflow-hidden selection:bg-none"
        >
          {/* Ambient Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-md w-full flex flex-col items-center text-center relative z-10 space-y-6">
            
            {/* Animated Logo Ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-violet-600 p-[1px] shadow-2xl shadow-emerald-500/30"
            >
              <div className="w-full h-full bg-neutral-950 rounded-[15px] flex items-center justify-center">
                <Code2 className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>
            </motion.div>

            {/* Developer Title */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-1"
            >
              <h1 className="text-xl font-bold text-neutral-100 tracking-tight flex items-center justify-center gap-2">
                <span>S BALAJI</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </h1>
              <p className="text-xs font-mono text-emerald-400 tracking-widest uppercase">
                Frontend Developer & CS Engineer
              </p>
            </motion.div>

            {/* Progress Percentage Display */}
            <div className="w-full space-y-2 pt-4">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  INITIALIZING ARCHITECTURE...
                </span>
                <span className="text-emerald-400 font-bold">{progress}%</span>
              </div>

              {/* Progress Track & Fill */}
              <div className="h-1.5 w-full bg-neutral-900 rounded-full overflow-hidden border border-neutral-800 p-[1px]">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 rounded-full shadow-[0_0_12px_#10b981]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
            </div>

            <p className="text-[11px] font-mono text-neutral-400 pt-2">
              Loading React 19 • Framer Motion • GSAP • Lenis • Dark Glass Architecture
            </p>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
