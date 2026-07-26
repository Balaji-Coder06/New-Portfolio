import { useEffect, useRef } from 'react';

export default function AICoreParticles({ mousePos = { x: null, y: null }, active = true }) {
  const canvasRef = useRef(null);
  const mousePosRef = useRef(mousePos);

  // Sync mouse position ref without re-triggering canvas initialization effect
  useEffect(() => {
    mousePosRef.current = mousePos;
  }, [mousePos.x, mousePos.y]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || 500);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 500);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Particle pool setup (allocated ONCE for maximum memory stability and speed)
    const particleCount = 36;
    const particles = [];
    const colors = [
      'rgba(6, 182, 212, ',   // cyan
      'rgba(16, 185, 129, ',  // emerald
      'rgba(59, 130, 246, '   // subtle blue
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 1,
        z: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.2
      });
    }

    // High performance 60-120 FPS RAF render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const currentMouse = mousePosRef.current;
      const mouseX = currentMouse ? currentMouse.x : null;
      const mouseY = currentMouse ? currentMouse.y : null;
      const hasMouse = mouseX !== null && mouseY !== null;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // Magnetic Attraction to Mouse
        if (hasMouse) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130 && dist > 1) {
            const force = (130 - dist) / 130;
            p.x += (dx / dist) * force * 0.45 * p.z;
            p.y += (dy / dist) * force * 0.45 * p.z;
          }
        }

        // Standard movement
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;

        // Screen boundary wrap
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        // Draw Proximity Connections
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            const lineAlpha = (1 - dist / 80) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Draw Cursor Connection Line
        if (hasMouse) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const cursorLineAlpha = (1 - dist / 100) * 0.3;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(16, 185, 129, ${cursorLineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 gpu-accelerated"
    />
  );
}
