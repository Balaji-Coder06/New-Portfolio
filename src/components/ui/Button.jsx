import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className,
  onClick,
  href,
  target,
  download,
  disabled = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 border border-emerald-400/40',
    secondary: 'bg-neutral-900/80 hover:bg-neutral-800/90 text-neutral-100 border border-neutral-700/60 hover:border-emerald-500/50 backdrop-blur-md',
    outline: 'bg-transparent text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/10 hover:border-emerald-400',
    ghost: 'bg-transparent text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/50'
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 space-x-1.5',
    md: 'text-sm px-5 py-2.5 space-x-2',
    lg: 'text-base px-6 py-3.5 space-x-2.5'
  };

  const combinedClass = twMerge(clsx(baseStyles, variants[variant], sizes[size], className));

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        download={download}
        className={`group ${combinedClass}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group ${combinedClass}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {content}
    </motion.button>
  );
}
