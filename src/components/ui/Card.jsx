import { memo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = memo(function Card({
  children,
  className,
  hoverEffect = true,
  tiltEffect = true,
  tiltMax = 12,
  glare = true,
  ...props
}) {
  const cardRef = useRef(null);

  // Motion values for tilt angles
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Glare position percentage
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);

  // Smooth springs for rotation with spring physics
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [tiltMax, -tiltMax]), {
    stiffness: 320,
    damping: 25,
    mass: 0.4,
  });

  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-tiltMax, tiltMax]), {
    stiffness: 320,
    damping: 25,
    mass: 0.4,
  });

  const scale = useSpring(1, {
    stiffness: 320,
    damping: 25,
  });

  // Glare background transform defined at top level of component hook
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(400px circle at ${gx}% ${gy}%, rgba(16, 185, 129, 0.22), rgba(6, 182, 212, 0.08) 40%, transparent 80%)`
  );

  const handleMouseMove = (e) => {
    if (!tiltEffect || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const normX = mouseX / rect.width - 0.5;
    const normY = mouseY / rect.height - 0.5;

    x.set(normX);
    y.set(normY);

    glareX.set((mouseX / rect.width) * 100);
    glareY.set((mouseY / rect.height) * 100);
    glareOpacity.set(0.15);
  };

  const handleMouseEnter = () => {
    if (!tiltEffect) return;
    scale.set(1.015);
  };

  const handleMouseLeave = () => {
    if (!tiltEffect) return;
    x.set(0);
    y.set(0);
    scale.set(1);
    glareOpacity.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: tiltEffect ? rotateX : 0,
        rotateY: tiltEffect ? rotateY : 0,
        scale: tiltEffect ? scale : 1,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={twMerge(
        clsx(
          'glass-card rounded-2xl p-6 relative [clip-path:inset(0_round_1rem)] transition-colors duration-300 transform-gpu gpu-accelerated',
          hoverEffect && 'hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/15',
          className
        )
      )}
      {...props}
    >
      {/* Glare Lighting Highlight */}
      {tiltEffect && glare && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl z-30 transition-opacity duration-300"
          style={{
            opacity: glareOpacity,
            background: glareBackground,
          }}
        />
      )}

      {/* Card Content with 3D z-axis lift */}
      <div className="relative z-10 w-full h-full" style={{ transform: 'translateZ(12px)' }}>
        {children}
      </div>
    </motion.div>
  );
});

export default Card;
