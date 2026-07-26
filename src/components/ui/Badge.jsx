import { memo } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Badge = memo(function Badge({
  children,
  variant = 'emerald',
  pulse = false,
  className,
  ...props
}) {
  const variants = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/25',
    neutral: 'bg-neutral-800/80 text-neutral-300 border-neutral-700/50'
  };

  return (
    <motion.span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border backdrop-blur-sm',
          variants[variant],
          className
        )
      )}
      whileHover={{ scale: 1.05 }}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      )}
      {children}
    </motion.span>
  );
});

export default Badge;
