import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function GlobalBackground() {
  const canvasRef = useRef(null);
  const spotlightRef = useRef(null);

  // Smooth direct DOM mouse listener for radial cursor spotlight (0 React re-renders)
  useEffect(() => {
    let animationFrameId;

    const handleMouseMove = (e) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        if (spotlightRef.current) {
          spotlightRef.current.style.background = `radial-gradient(650px circle at ${e.clientX}px ${e.clientY}px, rgba(16, 185, 129, 0.05), rgba(6, 182, 212, 0.025) 40%, transparent 85%)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 60-120 FPS High-Performance Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const updateCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize, { passive: true });

    // Cosmic Stars (180 stars optimized for speed & smooth rendering)
    const starCount = 180;
    const starColors = ['#ffffff', '#a7f3d0', '#bae6fd', '#ddd6fe', '#fef08a'];

    const stars = Array.from({ length: starCount }, () => {
      const radius = Math.random() < 0.85 ? Math.random() * 1.1 + 0.4 : Math.random() * 2.0 + 1.1;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: radius,
        vx: (Math.random() - 0.5) * 0.06,
        vy: -(Math.random() * 0.1 + 0.03),
        baseAlpha: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.015 + 0.004,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        hasGlow: radius > 1.8
      };
    });

    let activeAsteroids = [];

    const spawnAsteroid = () => {
      const startFromLeft = Math.random() > 0.3;
      const startX = startFromLeft ? Math.random() * (width * 0.6) : Math.random() * width;
      const startY = Math.random() * (height * 0.25);

      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.25;
      const speed = Math.random() * 3.5 + 4.5;

      activeAsteroids.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * 120 + 100,
        thickness: Math.random() * 2 + 1.5,
        color: Math.random() > 0.5 ? '#38bdf8' : '#34d399',
        headColor: '#ffffff',
        life: 0,
        maxLife: Math.floor(Math.random() * 110 + 100),
        opacity: 1
      });
    };

    const initialTeaserTimer = setTimeout(() => {
      spawnAsteroid();
    }, 3000);

    const ASTEROID_INTERVAL_MS = 130000;
    const asteroidInterval = setInterval(() => {
      spawnAsteroid();
    }, ASTEROID_INTERVAL_MS);

    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      frame++;

      // A. Render Stars
      for (let i = 0; i < starCount; i++) {
        const s = stars[i];

        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        const currentAlpha = s.baseAlpha + Math.sin(frame * s.twinkleSpeed + s.twinkleOffset) * 0.22;
        const clampedAlpha = Math.max(0.15, Math.min(1, currentAlpha));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = clampedAlpha;
        ctx.fill();

        if (s.hasGlow) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 2.4, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = clampedAlpha * 0.12;
          ctx.fill();
        }
      }

      // B. Render Active Asteroids
      for (let i = activeAsteroids.length - 1; i >= 0; i--) {
        const ast = activeAsteroids[i];
        ast.life++;

        ast.x += ast.vx;
        ast.y += ast.vy;

        if (ast.life < 18) {
          ast.opacity = ast.life / 18;
        } else if (ast.life > ast.maxLife - 25) {
          ast.opacity = (ast.maxLife - ast.life) / 25;
        }

        if (ast.opacity <= 0 || ast.life >= ast.maxLife || ast.x > width + 200 || ast.y > height + 200) {
          activeAsteroids.splice(i, 1);
          continue;
        }

        const hyp = Math.hypot(ast.vx, ast.vy);
        const tailX = ast.x - (ast.vx / hyp) * ast.length;
        const tailY = ast.y - (ast.vy / hyp) * ast.length;

        const tailGradient = ctx.createLinearGradient(ast.x, ast.y, tailX, tailY);
        tailGradient.addColorStop(0, `rgba(255, 255, 255, ${ast.opacity})`);
        tailGradient.addColorStop(0.25, ast.color);
        tailGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.moveTo(ast.x, ast.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = tailGradient;
        ctx.lineWidth = ast.thickness;
        ctx.lineCap = 'round';
        ctx.globalAlpha = ast.opacity;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ast.x, ast.y, ast.thickness * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = ast.headColor;
        ctx.globalAlpha = ast.opacity;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      clearTimeout(initialTeaserTimer);
      clearInterval(asteroidInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050508]">
      
      {/* 1. Deep Space Cosmic Nebula Gradients (Pre-softened radial gradients, 0 GPU blur penalty) */}
      <div className="absolute inset-0 opacity-60 mix-blend-screen pointer-events-none">
        {/* Emerald Nebula */}
        <motion.div
          animate={{
            x: ['0%', '4%', '-3%', '0%'],
            y: ['0%', '-4%', '3%', '0%'],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full gpu-accelerated"
          style={{
            background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.16) 0%, rgba(16, 185, 129, 0.05) 35%, rgba(6, 78, 59, 0.02) 55%, transparent 75%)'
          }}
        />

        {/* Deep Cyan Nebula */}
        <motion.div
          animate={{
            x: ['0%', '-4%', '3%', '0%'],
            y: ['0%', '5%', '-3%', '0%'],
            scale: [1, 0.95, 1.06, 1],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[28%] -right-[15%] w-[65vw] h-[65vw] rounded-full gpu-accelerated"
          style={{
            background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.15) 0%, rgba(6, 182, 212, 0.04) 35%, rgba(30, 58, 138, 0.02) 55%, transparent 75%)'
          }}
        />

        {/* Cosmic Violet Nebula */}
        <motion.div
          animate={{
            x: ['0%', '3%', '-5%', '0%'],
            y: ['0%', '6%', '-3%', '0%'],
            scale: [1, 1.06, 0.94, 1],
          }}
          transition={{
            duration: 36,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-[20%] left-[12%] w-[60vw] h-[60vw] rounded-full gpu-accelerated"
          style={{
            background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.14) 0%, rgba(139, 92, 246, 0.04) 35%, rgba(88, 28, 135, 0.02) 55%, transparent 75%)'
          }}
        />
      </div>

      {/* 2. Interactive Cosmic Cursor Spotlight (Direct DOM manipulation for 0 React re-renders) */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 transition-opacity duration-300 z-10 pointer-events-none"
      />

      {/* 3. High-DPI 60-120 FPS Galaxy Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-20 opacity-95 pointer-events-none gpu-accelerated"
      />

      {/* 4. Subdued Cosmic Dot Grid Pattern */}
      <div className="absolute inset-0 z-30 opacity-15 grid-bg-pattern pointer-events-none" />

    </div>
  );
}
