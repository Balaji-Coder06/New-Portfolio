import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorFollower() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Motion values for smooth hardware-accelerated tracking with 0 React re-renders
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const ringX = useSpring(mouseX, { damping: 28, stiffness: 320, mass: 0.4 });
  const ringY = useSpring(mouseY, { damping: 28, stiffness: 320, mass: 0.4 });

  const dotX = useSpring(mouseX, { damping: 35, stiffness: 500, mass: 0.1 });
  const dotY = useSpring(mouseY, { damping: 35, stiffness: 500, mass: 0.1 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });

    const onMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (target && target.closest && target.closest('a, button, [data-interactive="true"]')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, [mouseX, mouseY]);

  if (isMobile) return null;

  return (
    <>
      {/* Outer Glowing Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-emerald-500/40 mix-blend-screen gpu-accelerated"
        style={{
          x: ringX,
          y: ringY,
          translateX: isHovered ? '-24px' : '-16px',
          translateY: isHovered ? '-24px' : '-16px',
          width: isHovered ? 48 : 32,
          height: isHovered ? 48 : 32,
          backgroundColor: isHovered ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.05)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      />

      {/* Inner Emerald Center Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 w-2 h-2 rounded-full bg-emerald-400 gpu-accelerated"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-4px',
          translateY: '-4px',
        }}
      />
    </>
  );
}
