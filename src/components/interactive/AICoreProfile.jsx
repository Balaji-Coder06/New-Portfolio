import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Sparkles, Cpu, Terminal, Binary, Server, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import AICoreParticles from './AICoreParticles';

// Tech Badges Configuration with User-Customized Experience Metadata
const techBadges = [
  {
    id: 'react',
    name: 'React',
    icon: Code2,
    color: '#06b6d4', // cyan
    glowClass: 'border-cyan-500/50 text-cyan-300 bg-cyan-950/80 shadow-[0_0_15px_rgba(6,182,212,0.4)]',
    years: '6+ Months Exp',
    description: 'Component Architecture, Custom Hooks & Concurrent UI'
  },
  {
    id: 'tailwind',
    name: 'Tailwind',
    icon: Sparkles,
    color: '#10b981', // emerald
    glowClass: 'border-emerald-500/50 text-emerald-300 bg-emerald-950/80 shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    years: '6+ Months Exp',
    description: 'Design Systems, Micro-animations & Obsidian Glass Theme'
  },
  {
    id: 'python',
    name: 'Python',
    icon: Cpu,
    color: '#8b5cf6', // violet/blue
    glowClass: 'border-violet-500/50 text-violet-300 bg-violet-950/80 shadow-[0_0_15px_rgba(139,92,246,0.4)]',
    years: '2+ Yrs Exp',
    description: 'Machine Learning, PyTorch Models & Data Telemetry'
  },
  {
    id: 'java',
    name: 'Java',
    icon: Terminal,
    color: '#f59e0b', // amber
    glowClass: 'border-amber-500/50 text-amber-300 bg-amber-950/80 shadow-[0_0_15px_rgba(245,158,11,0.4)]',
    years: '3+ Yrs Exp',
    description: 'Object-Oriented Programming, Multithreading & DSA'
  },
  {
    id: 'cpp',
    name: 'C / C++',
    icon: Binary,
    color: '#3b82f6', // blue
    glowClass: 'border-blue-500/50 text-blue-300 bg-blue-950/80 shadow-[0_0_15px_rgba(59,130,246,0.4)]',
    years: '3+ Yrs Exp',
    description: 'Competitive Programming, High Performance & Memory Management'
  },
  {
    id: 'node',
    name: 'NodeJS',
    icon: Server,
    color: '#06b6d4', // cyan
    glowClass: 'border-cyan-500/50 text-cyan-300 bg-cyan-950/80 shadow-[0_0_15px_rgba(6,182,212,0.4)]',
    years: '6+ Months Exp',
    description: 'Fullstack App Engineering, REST & GraphQL APIs'
  }
];

export default function AICoreProfile() {
  const containerRef = useRef(null);
  const tiltContainerRef = useRef(null);
  const badgeNodeRefs = useRef([]);
  const beamLineRef = useRef(null);
  const beamGlowRef = useRef(null);

  // Viewport & Reduced Motion State
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // System Boot Sequence State
  const [bootState, setBootState] = useState(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('ai_core_booted') === 'true') {
      return { step: 'online', progress: 100, isBooting: false };
    }
    return { step: 'init', progress: 0, isBooting: true };
  });

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
      if (w < 640) setOrbitRadius(130);
      else if (w < 1024) setOrbitRadius(165);
      else setOrbitRadius(210);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // System Boot Progress Sequence
  useEffect(() => {
    if (!bootState.isBooting) return;

    const progressInterval = setInterval(() => {
      setBootState((prev) => {
        if (prev.progress >= 100) {
          clearInterval(progressInterval);
          return { step: 'complete', progress: 100, isBooting: true };
        }
        return { ...prev, progress: prev.progress + 5 };
      });
    }, 35);

    return () => clearInterval(progressInterval);
  }, [bootState.isBooting]);

  useEffect(() => {
    if (bootState.progress >= 100 && bootState.step === 'complete') {
      const timer = setTimeout(() => {
        setBootState({ step: 'online', progress: 100, isBooting: false });
        sessionStorage.setItem('ai_core_booted', 'true');
        setIsPulseActive(true);
        setTimeout(() => setIsPulseActive(false), 1200);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [bootState.progress, bootState.step]);

  // Unified High-Performance GPU RAF Loop (0 React re-renders during rotation)
  useEffect(() => {
    if (!isVisible || bootState.isBooting || prefersReducedMotion) return;

    let animationFrame;
    let lastTime = performance.now();

    const renderLoop = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1); // cap dt to prevent huge jumps
      lastTime = now;

      // 1. Calculate Target Orbit Speed Multiplier
      const isHovered = hoveredBadgeRef.current !== null;
      const isProfHovered = isProfileHoveredRef.current;
      const targetMult = isHovered ? 0.05 : isProfHovered ? 2.2 : 1.0;

      // Smooth lerp speed multiplier
      speedMultRef.current += (targetMult - speedMultRef.current) * 0.08;

      const baseSpeed = 0.08; // ~75s full rotation
      orbitAngleRef.current = (orbitAngleRef.current + baseSpeed * speedMultRef.current * dt) % (Math.PI * 2);

      // 2. Smooth Lerp 3D Tilt Inertia
      const t = tiltRef.current;
      t.currentX += (t.targetX - t.currentX) * 0.08;
      t.currentY += (t.targetY - t.currentY) * 0.08;

      if (tiltContainerRef.current) {
        tiltContainerRef.current.style.transform = `perspective(1000px) rotateX(${t.currentX.toFixed(2)}deg) rotateY(${t.currentY.toFixed(2)}deg)`;
      }

      // 3. Update Orbiting Badges GPU Transforms
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

        // Hardware-accelerated GPU translate3d transform
        badgeEl.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0px) translate(-50%, -50%)`;

        if (hoveredBadgeRef.current === techBadges[i].id) {
          hoveredPos = { x, y };
        }
      }

      // 4. Update Energy Flow Beam Path directly on SVG DOM
      if (beamLineRef.current && beamGlowRef.current) {
        if (hoveredPos) {
          beamLineRef.current.setAttribute('x1', hoveredPos.x.toFixed(2));
          beamLineRef.current.setAttribute('y1', hoveredPos.y.toFixed(2));
          beamGlowRef.current.setAttribute('x1', hoveredPos.x.toFixed(2));
          beamGlowRef.current.setAttribute('y1', hoveredPos.y.toFixed(2));
        }
      }

      animationFrame = requestAnimationFrame(renderLoop);
    };

    animationFrame = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, bootState.isBooting, prefersReducedMotion, orbitRadius]);

  // Holographic Laser Scan Interval (8s)
  useEffect(() => {
    if (!isVisible || bootState.isBooting) return;
    const scanInterval = setInterval(() => {
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 1800);
    }, 8000);
    return () => clearInterval(scanInterval);
  }, [isVisible, bootState.isBooting]);

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

      // Calculate normalized target tilt (-12deg to +12deg)
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

  const getBootStatusText = (progress) => {
    if (progress < 25) return 'Loading Neural Engine...';
    if (progress < 50) return 'Loading UI Components...';
    if (progress < 75) return 'Loading Skill Badges...';
    if (progress < 100) return 'Loading Telemetry Matrix...';
    return 'System Online ✓';
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
        <AICoreParticles mousePos={mousePos} active={!bootState.isBooting && isVisible} />

        {/* Ambient Breathing Background Aura */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-cyan-500/20 via-emerald-500/15 to-blue-600/20 blur-3xl pointer-events-none animate-pulse" />

        {/* ------------------------------------------------------------- */}
        {/* SYSTEM BOOT OVERLAY */}
        {/* ------------------------------------------------------------- */}
        <AnimatePresence>
          {bootState.isBooting && (
            <motion.div
              initial={{ opacity: 1, scale: 0.95 }}
              exit={{ opacity: 0, scale: 1.12, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 glass-panel rounded-3xl border border-cyan-500/30 bg-neutral-950/90 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)]"
            >
              <div className="flex items-center gap-2 mb-4 text-cyan-400 font-mono text-xs tracking-widest uppercase font-bold animate-pulse">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Core Initializing...</span>
              </div>

              <div className="w-full max-w-xs bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 font-mono text-xs shadow-inner">
                <div className="flex justify-between text-neutral-400 mb-2 text-[11px]">
                  <span>CORE_OS v2.4</span>
                  <span className="text-cyan-400 font-bold">{bootState.progress}%</span>
                </div>

                <div className="h-3 w-full bg-neutral-950 rounded-md overflow-hidden p-0.5 border border-neutral-800 flex items-center mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-blue-500 rounded transition-all duration-75 shadow-[0_0_10px_#06b6d4]"
                    style={{ width: `${bootState.progress}%` }}
                  />
                </div>

                <div className="text-emerald-400 font-semibold flex items-center gap-1.5 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{getBootStatusText(bootState.progress)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ------------------------------------------------------------- */}
        {/* CONCENTRIC HUD RINGS */}
        {/* ------------------------------------------------------------- */}

        {/* 1. INNER RING (20s Rotation Clockwise) */}
        <motion.div
          animate={{ rotate: prefersReducedMotion ? 0 : 360 }}
          transition={{
            duration: isProfileHovered ? 9 : 20,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[310px] lg:h-[310px] rounded-full pointer-events-none transform-gpu"
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

        {/* 2. MIDDLE RING (35s Counter-Rotation Counter-Clockwise) */}
        <motion.div
          animate={{ rotate: prefersReducedMotion ? 0 : -360 }}
          transition={{
            duration: isProfileHovered ? 16 : 35,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] lg:w-[410px] lg:h-[410px] rounded-full pointer-events-none transform-gpu"
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

        {/* 3. OUTER ANCHOR RING (Static Orbit Path) */}
        <div className="absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px] rounded-full pointer-events-none transform-gpu">
          <svg className="w-full h-full" viewBox="0 0 500 500">
            <circle
              cx="250"
              cy="250"
              r="235"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
              strokeDasharray="3 9"
            />
          </svg>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ANIMATED ENERGY BEAM WITH TRAVELING FLOW PARTICLES */}
        {/* ------------------------------------------------------------- */}
        <svg
          className={`absolute inset-0 w-full h-full pointer-events-none z-20 transition-opacity duration-300 ${
            hoveredBadge ? 'opacity-100' : 'opacity-0'
          }`}
          viewBox="-270 -270 540 540"
        >
          <defs>
            <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={currentHoveredColor} stopOpacity="0.9" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <line
            ref={beamGlowRef}
            x1="0"
            y1="0"
            x2="0"
            y2="0"
            stroke="url(#beamGradient)"
            strokeWidth="2.5"
            filter="url(#glow)"
          />

          <line
            ref={beamLineRef}
            x1="0"
            y1="0"
            x2="0"
            y2="0"
            stroke={currentHoveredColor}
            strokeWidth="3.5"
            strokeDasharray="6 18"
            className="animate-beam-flow"
          />
        </svg>

        {/* ------------------------------------------------------------- */}
        {/* CENTER PROFILE IMAGE & AI CORE PROCESSOR */}
        {/* ------------------------------------------------------------- */}
        <motion.div
          onMouseEnter={() => setIsProfileHovered(true)}
          onMouseLeave={() => setIsProfileHovered(false)}
          onClick={handleProfileClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative w-40 h-40 sm:w-52 sm:h-52 lg:w-60 lg:h-60 rounded-full z-30 cursor-pointer group transform-gpu"
        >
          <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-cyan-500 via-emerald-400 to-blue-600 opacity-70 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500" />

          <div
            className={`absolute -inset-1 rounded-full bg-neutral-950 p-1 border transition-all duration-300 ${
              isScanning || isPulseActive
                ? 'border-cyan-400 shadow-[0_0_30px_#06b6d4]'
                : 'border-cyan-500/40 group-hover:border-emerald-400'
            }`}
          >
            <div className="relative w-full h-full rounded-full overflow-hidden bg-neutral-900">
              <img
                src="/hero_developer_avatar.png"
                alt="S Balaji Developer Avatar"
                className={`w-full h-full object-cover rounded-full filter contrast-[1.08] saturate-[1.1] transition-transform duration-700 ${
                  isProfileHovered ? 'scale-110' : 'scale-100'
                }`}
              />

              <div
                className="absolute inset-0 rounded-full pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${mousePos.x ? (mousePos.x / 540) * 100 : 30}% ${
                    mousePos.y ? (mousePos.y / 540) * 100 : 30
                  }%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%)`
                }}
              />

              <AnimatePresence>
                {isScanning && (
                  <motion.div
                    initial={{ top: '-10%' }}
                    animate={{ top: '110%' }}
                    transition={{ duration: 1.6, ease: 'easeInOut' }}
                    className="absolute left-0 right-0 h-2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] z-20 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 glass-panel px-3 py-1 rounded-full border border-emerald-500/40 text-[10px] sm:text-[11px] font-mono text-emerald-300 flex items-center gap-1.5 shadow-xl z-20">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
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

        {/* ------------------------------------------------------------- */}
        {/* ORBITING TECHNOLOGY BADGES (UPRIGHT COUNTER-ROTATION) */}
        {/* ------------------------------------------------------------- */}
        {!bootState.isBooting &&
          techBadges.map((badge, idx) => {
            const Icon = badge.icon;
            const isHovered = hoveredBadge === badge.id;
            const isPulsing = pulsingBadgeIndex === idx;

            return (
              <div
                key={badge.id}
                ref={(el) => (badgeNodeRefs.current[idx] = el)}
                className="absolute top-1/2 left-1/2 z-40 transform-gpu will-change-transform"
                style={{
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <motion.div
                  onMouseEnter={() => setHoveredBadge(badge.id)}
                  onMouseLeave={() => setHoveredBadge(null)}
                  animate={{
                    scale: isHovered ? 1.25 : isPulsing ? 1.2 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                  className={`relative px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border backdrop-blur-xl font-mono text-xs font-bold flex items-center gap-2 cursor-pointer transition-all duration-300 ${
                    badge.glowClass
                  } ${isPulsing ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_#06b6d4]' : ''}`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: badge.color }} />
                  <span className="whitespace-nowrap">{badge.name}</span>

                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 rounded-2xl glass-panel border border-cyan-500/40 bg-neutral-950/95 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-left pointer-events-none z-50"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-neutral-100">{badge.name}</span>
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                            {badge.years}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-300 leading-snug font-sans font-normal">
                          {badge.description}
                        </p>
                        <div className="mt-2 pt-1.5 border-t border-neutral-800 flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
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
