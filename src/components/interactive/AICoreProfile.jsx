import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Atom,
  Server,
  Database,
  Cpu,
  Layers,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import AICoreParticles from './AICoreParticles';

// 6 Core Technologies for Orbital HUD
const techBadges = [
  {
    id: 'react',
    name: 'React 19',
    icon: Atom,
    color: '#06b6d4',
    glowClass: 'border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] bg-cyan-950/40',
    description: 'Component architecture, Hooks, React Server Components & Concurrent Mode optimization.',
    years: '3+ Yrs Exp'
  },
  {
    id: 'node',
    name: 'Node.js',
    icon: Server,
    color: '#10b981',
    glowClass: 'border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)] bg-emerald-950/40',
    description: 'Scalable REST APIs, Microservices, Express, Event Loop architecture & WebSockets.',
    years: '3+ Yrs Exp'
  },
  {
    id: 'mongo',
    name: 'MongoDB',
    icon: Database,
    color: '#34d399',
    glowClass: 'border-emerald-400/40 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.25)] bg-emerald-950/40',
    description: 'NoSQL schema design, Aggregation Framework, Mongoose ORM & Indexing optimization.',
    years: '2+ Yrs Exp'
  },
  {
    id: 'js',
    name: 'JavaScript',
    icon: Cpu,
    color: '#facc15',
    glowClass: 'border-amber-400/40 text-amber-200 shadow-[0_0_20px_rgba(250,204,21,0.25)] bg-amber-950/40',
    description: 'Async/Await, Closures, DOM Architecture, Prototypes & Engine Performance.',
    years: '3+ Yrs Exp'
  },
  {
    id: 'express',
    name: 'Express.js',
    icon: Layers,
    color: '#8b5cf6',
    glowClass: 'border-purple-500/40 text-purple-300 shadow-[0_0_20px_rgba(139,92,246,0.25)] bg-purple-950/40',
    description: 'Middleware pipelines, JWT Authentication, Error Handling & API Gateway routing.',
    years: '3+ Yrs Exp'
  },
  {
    id: 'dsa',
    name: 'FullStack',
    icon: Code2,
    color: '#38bdf8',
    glowClass: 'border-sky-400/40 text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.25)] bg-sky-950/40',
    description: 'Data Structures, Algorithmic Problem Solving (LeetCode/CodeChef) & Optimization.',
    years: 'Competitive'
  }
];

export default function AICoreProfile() {
  const containerRef = useRef(null);
  const tiltContainerRef = useRef(null);
  const badgeNodeRefs = useRef([]);

  const beamLineRef = useRef(null);
  const beamGlowRef = useRef(null);

  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const [mousePos, setMousePos] = useState({ x: null, y: null });
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [isPulseActive, setIsPulseActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [pulsingBadgeIndex, setPulsingBadgeIndex] = useState(null);

  // Responsive Orbit Radius
  const [orbitRadius, setOrbitRadius] = useState(210);

  // Animation Refs for 60-120 FPS performance
  const orbitAngleRef = useRef(0);
  const speedMultRef = useRef(1.0);
  const tiltRef = useRef({ currentX: 0, currentY: 0, targetX: 0, targetY: 0 });
  const hoveredBadgeRef = useRef(hoveredBadge);
  const isProfileHoveredRef = useRef(isProfileHovered);

  useEffect(() => {
    hoveredBadgeRef.current = hoveredBadge;
  }, [hoveredBadge]);

  useEffect(() => {
    isProfileHoveredRef.current = isProfileHovered;
  }, [isProfileHovered]);

  // Reduced Motion Check
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // IntersectionObserver to pause off-screen animations
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Responsive Orbit Radius Calculation
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 400) setOrbitRadius(115);
      else if (w < 640) setOrbitRadius(130);
      else if (w < 1024) setOrbitRadius(165);
      else setOrbitRadius(210);
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Unified High-Performance GPU RAF Loop (0 React re-renders during rotation)
  useEffect(() => {
    let animationFrame;
    let lastTime = performance.now();

    const renderLoop = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const isHovered = hoveredBadgeRef.current !== null;
      const isProfHovered = isProfileHoveredRef.current;
      const targetMult = isHovered ? 0.05 : isProfHovered ? 2.2 : 1.0;

      speedMultRef.current += (targetMult - speedMultRef.current) * 0.08;
      const baseSpeed = prefersReducedMotion ? 0 : 0.08;
      orbitAngleRef.current = (orbitAngleRef.current + baseSpeed * speedMultRef.current * dt) % (Math.PI * 2);

      // Smooth Lerp 3D Tilt Inertia
      const t = tiltRef.current;
      t.currentX += (t.targetX - t.currentX) * 0.08;
      t.currentY += (t.targetY - t.currentY) * 0.08;

      if (tiltContainerRef.current) {
        tiltContainerRef.current.style.transform = `perspective(1000px) rotateX(${t.currentX.toFixed(2)}deg) rotateY(${t.currentY.toFixed(2)}deg)`;
      }

      // Update Orbiting Badges GPU Transforms
      const currentOrbitAngle = orbitAngleRef.current;
      const totalBadges = techBadges.length;
      let hoveredPos = null;

      for (let i = 0; i < totalBadges; i++) {
        const badgeEl = badgeNodeRefs.current[i];
        if (!badgeEl) continue;

        const baseAngle = (i / totalBadges) * Math.PI * 2;
        const angle = baseAngle + currentOrbitAngle;

        const x = orbitRadius * Math.cos(angle);
        const y = orbitRadius * Math.sin(angle);

        badgeEl.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0px) translate(-50%, -50%)`;

        if (hoveredBadgeRef.current === techBadges[i].id) {
          hoveredPos = { x, y };
        }
      }

      // Update Energy Flow Beam Path directly in DOM
      if (beamLineRef.current && beamGlowRef.current) {
        if (hoveredPos) {
          const xStr = hoveredPos.x.toFixed(2);
          const yStr = hoveredPos.y.toFixed(2);
          beamLineRef.current.setAttribute('x1', xStr);
          beamLineRef.current.setAttribute('y1', yStr);
          beamGlowRef.current.setAttribute('x1', xStr);
          beamGlowRef.current.setAttribute('y1', yStr);
        }
      }

      if (isVisible && !prefersReducedMotion) {
        animationFrame = requestAnimationFrame(renderLoop);
      }
    };

    renderLoop(performance.now());
    if (isVisible && !prefersReducedMotion) {
      animationFrame = requestAnimationFrame(renderLoop);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, prefersReducedMotion, orbitRadius]);

  // Holographic Laser Scan Interval (8.5s)
  useEffect(() => {
    if (!isVisible) return;

    const scanInterval = setInterval(() => {
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 1600);
    }, 8500);

    return () => clearInterval(scanInterval);
  }, [isVisible]);

  const mouseMoveFrameRef = useRef(null);

  // Mouse tilt tracking with lerped physics & RAF throttling
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (mouseMoveFrameRef.current) return;
    mouseMoveFrameRef.current = requestAnimationFrame(() => {
      mouseMoveFrameRef.current = null;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      setMousePos((prev) => {
        if (prev.x !== null && Math.hypot(prev.x - x, prev.y - y) < 4) return prev;
        return { x, y };
      });

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      tiltRef.current.targetY = ((x - centerX) / centerX) * 12;
      tiltRef.current.targetX = -((y - centerY) / centerY) * 12;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: null, y: null });
    tiltRef.current.targetX = 0;
    tiltRef.current.targetY = 0;
    setIsProfileHovered(false);
  }, []);

  // Click Profile Energy Pulse
  const handleProfileClick = () => {
    if (isPulseActive) return;
    setIsPulseActive(true);

    techBadges.forEach((_, idx) => {
      setTimeout(() => {
        setPulsingBadgeIndex(idx);
        setTimeout(() => setPulsingBadgeIndex(null), 400);
      }, 300 + idx * 90);
    });

    setTimeout(() => {
      setIsPulseActive(false);
    }, 1200);
  };

  const currentHoveredColor = hoveredBadge ? techBadges.find(b => b.id === hoveredBadge)?.color || '#06b6d4' : '#06b6d4';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[540px] aspect-square flex items-center justify-center select-none"
    >
      {/* 3D Tilt Container with GPU acceleration */}
      <div
        ref={tiltContainerRef}
        className="relative w-full h-full flex items-center justify-center transform-gpu will-change-transform"
      >
        {/* Background Canvas Particles */}
        <AICoreParticles mousePos={mousePos} active={isVisible} />

        {/* Ambient Breathing Background Aura */}
        <div className="absolute w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-cyan-500/20 via-emerald-500/15 to-blue-600/20 blur-3xl pointer-events-none animate-pulse" />

        {/* CONCENTRIC HUD RINGS */}
        {/* 1. INNER RING */}
        <motion.div
          animate={{ rotate: prefersReducedMotion ? 0 : 360 }}
          transition={{
            duration: isProfileHovered ? 9 : 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] lg:w-[310px] lg:h-[310px] rounded-full pointer-events-none transform-gpu"
        >
          <svg className="w-full h-full" viewBox="0 0 300 300">
            <circle
              cx="150"
              cy="150"
              r="140"
              fill="none"
              stroke="rgba(6, 182, 212, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="4 8 16 8"
            />
            <circle
              cx="150"
              cy="150"
              r="132"
              fill="none"
              stroke="rgba(16, 185, 129, 0.25)"
              strokeWidth="1"
              strokeDasharray="2 12"
            />
            <circle cx="150" cy="10" r="3" fill="#06b6d4" />
            <circle cx="290" cy="150" r="3" fill="#10b981" />
            <circle cx="150" cy="290" r="3" fill="#06b6d4" />
            <circle cx="10" cy="150" r="3" fill="#10b981" />
          </svg>
        </motion.div>

        {/* 2. MIDDLE RING */}
        <motion.div
          animate={{ rotate: prefersReducedMotion ? 0 : -360 }}
          transition={{
            duration: isProfileHovered ? 16 : 35,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute w-[230px] h-[230px] sm:w-[340px] sm:h-[340px] lg:w-[410px] lg:h-[410px] rounded-full pointer-events-none transform-gpu"
        >
          <svg className="w-full h-full" viewBox="0 0 400 400">
            <circle
              cx="200"
              cy="200"
              r="190"
              fill="none"
              stroke="rgba(16, 185, 129, 0.3)"
              strokeWidth="1.5"
              strokeDasharray="12 18 6 18"
            />
            <circle cx="200" cy="10" r="4" fill="#10b981" />
            <circle cx="390" cy="200" r="4" fill="#3b82f6" />
            <circle cx="200" cy="390" r="4" fill="#10b981" />
            <circle cx="10" cy="200" r="4" fill="#3b82f6" />
          </svg>
        </motion.div>

        {/* 3. OUTER ANCHOR RING */}
        <div className="absolute w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px] rounded-full pointer-events-none transform-gpu">
          <svg className="w-full h-full" viewBox="0 0 500 500">
            <circle
              cx="250"
              cy="250"
              r="235"
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
              strokeDasharray="4 12"
            />
          </svg>
        </div>

        {/* ENERGY BEAM CONNECTOR SVG LAYER */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible"
          viewBox="-270 -270 540 540"
        >
          <defs>
            <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="100%" stopColor={currentHoveredColor} stopOpacity="0.9" />
            </linearGradient>
            <filter id="beamGlowFilter">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Active Energy Beam Flow to Hovered Badge */}
          {hoveredBadge && (
            <>
              <line
                ref={beamGlowRef}
                x1="0"
                y1="0"
                x2="0"
                y2="0"
                stroke={currentHoveredColor}
                strokeWidth="5"
                strokeOpacity="0.5"
                filter="url(#beamGlowFilter)"
              />
              <line
                ref={beamLineRef}
                x1="0"
                y1="0"
                x2="0"
                y2="0"
                stroke="url(#beamGradient)"
                strokeWidth="2"
                strokeDasharray="6 6"
                className="animate-beam-flow"
              />
            </>
          )}
        </svg>

        {/* CENTRAL PROFILE AVATAR HUD CORE */}
        <motion.div
          onClick={handleProfileClick}
          onMouseEnter={() => setIsProfileHovered(true)}
          onMouseLeave={() => setIsProfileHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="relative z-20 cursor-pointer group"
        >
          <div className="relative w-36 h-36 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full p-1.5 bg-gradient-to-tr from-cyan-500 via-emerald-400 to-blue-600 shadow-[0_0_40px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all duration-500">
            <div className="w-full h-full rounded-full bg-neutral-950 p-1.5 sm:p-2 relative overflow-hidden flex items-center justify-center border border-white/10">
              
              {/* Profile Avatar Image */}
              <img
                src={import.meta.env.BASE_URL ? `${import.meta.env.BASE_URL.replace(/\/$/, '')}/hero_developer_avatar.jpg` : './hero_developer_avatar.jpg'}
                alt="S Balaji Developer Avatar"
                className="w-full h-full object-cover rounded-full filter contrast-105 brightness-95 group-hover:scale-105 group-hover:brightness-105 transition-all duration-500"
                onError={(e) => {
                  e.target.src = import.meta.env.BASE_URL ? `${import.meta.env.BASE_URL.replace(/\/$/, '')}/hero_developer_avatar.png` : './hero_developer_avatar.png';
                }}
              />

              {/* Laser Hologram Scanning Line */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div
                    initial={{ top: '-10%' }}
                    animate={{ top: '110%' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.6, ease: 'easeInOut' }}
                    className="absolute left-0 right-0 h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] z-20 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* CORE ONLINE STATUS BADGE */}
              <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 glass-panel px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-emerald-500/40 text-[9px] sm:text-[11px] font-mono text-emerald-300 flex items-center gap-1.5 shadow-xl z-20">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 animate-pulse" />
                <span>CORE ONLINE</span>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isPulseActive && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.9 }}
                animate={{ scale: 2.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-full border-2 border-cyan-400 bg-cyan-500/10 pointer-events-none z-10 shadow-[0_0_40px_#06b6d4]"
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* ORBITING TECHNOLOGY BADGES */}
        {techBadges.map((badge, idx) => {
          const Icon = badge.icon;
          const isHovered = hoveredBadge === badge.id;
          const isPulsing = pulsingBadgeIndex === idx;

          const totalBadges = techBadges.length;
          const baseAngle = (idx / totalBadges) * Math.PI * 2;
          const initX = (orbitRadius * Math.cos(baseAngle)).toFixed(2);
          const initY = (orbitRadius * Math.sin(baseAngle)).toFixed(2);

          return (
            <div
              key={badge.id}
              ref={(el) => (badgeNodeRefs.current[idx] = el)}
              className="absolute top-1/2 left-1/2 z-40 transform-gpu will-change-transform"
              style={{
                transform: `translate3d(${initX}px, ${initY}px, 0px) translate(-50%, -50%)`
              }}
            >
              <motion.div
                onMouseEnter={() => setHoveredBadge(badge.id)}
                onMouseLeave={() => setHoveredBadge(null)}
                animate={{
                  scale: isHovered ? 1.2 : isPulsing ? 1.15 : 1,
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                className={`relative px-2 py-1 sm:px-3.5 sm:py-2 rounded-xl border backdrop-blur-xl font-mono text-[10px] sm:text-xs font-bold flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-300 ${
                  badge.glowClass
                } ${isPulsing ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_#06b6d4]' : ''}`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" style={{ color: badge.color }} />
                <span className="whitespace-nowrap">{badge.name}</span>

                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 sm:w-56 p-2.5 sm:p-3 rounded-2xl glass-panel border border-cyan-500/40 bg-neutral-950/95 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-left pointer-events-none z-50"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-neutral-100">{badge.name}</span>
                        <span className="text-[9px] sm:text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          {badge.years}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-neutral-300 leading-snug font-sans font-normal">
                        {badge.description}
                      </p>
                      <div className="mt-2 pt-1.5 border-t border-neutral-800 flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-400 font-mono">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Core Competency Verified</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
              </div>

      <style>{`
        @keyframes beamFlow {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-beam-flow {
          animation: beamFlow 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}
