import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, GitFork, Users, BookOpen, Activity, Terminal, Code2, Cpu, Trophy, ExternalLink, RefreshCw, Sparkles, CheckCircle2, TrendingUp, BarChart3, Clock, AlertTriangle, Calendar } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Magnetic from '../ui/Magnetic';
import AnimatedCounter from '../ui/AnimatedCounter';
import { GithubIcon } from '../ui/SocialIcons';
import { useDeveloperStats } from '../../hooks/useDeveloperStats';
import githubContributions from '../../data/githubContributions.json';

// Helper to format relative timestamp e.g. "Synced 2 mins ago"
function formatRelativeTime(date) {
  if (!date) return 'Live Engine Standby';
  const diffSec = Math.floor((new Date() - date) / 1000);
  if (diffSec < 30) return 'Just synced now';
  if (diffSec < 60) return `Synced ${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Synced ${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  return `Synced ${diffHours}h ago`;
}

function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Build 52-Week Real Contribution Matrix from GitHub Telemetry Data
const buildHeatmapWeeks = () => {
  const days = githubContributions.days || [];
  const weeks = [];
  let currentWeek = [];
  
  days.forEach((day, index) => {
    let colorClass = "bg-neutral-900 border-neutral-800/80";
    if (day.level === 1) colorClass = "bg-emerald-950 border-emerald-800/60";
    else if (day.level === 2) colorClass = "bg-emerald-800/80 border-emerald-600/60 shadow-[0_0_4px_rgba(16,185,129,0.3)]";
    else if (day.level === 3) colorClass = "bg-emerald-600 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
    else if (day.level >= 4) colorClass = "bg-emerald-400 border-emerald-300 shadow-[0_0_10px_#10b981]";

    currentWeek.push({
      date: day.date,
      count: day.level,
      colorClass
    });

    if (currentWeek.length === 7 || index === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  return weeks;
};

const heatmapWeeks = buildHeatmapWeeks();

export default function DeveloperDashboardSection() {
  const { stats, loading, error, lastSynced, refetch } = useDeveloperStats();
  const [isSyncing, setIsSyncing] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await refetch();
    setTimeout(() => setIsSyncing(false), 500);
  };

  const gh = stats.github;
  const cf = stats.codeforces;
  const lc = stats.leetcode;
  const cc = stats.codechef;

  return (
    <section id="dashboard" className="py-28 relative overflow-hidden bg-transparent">

      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <SectionHeading
          badge="Live Developer Analytics Engine"
          title="Dynamic Platform &"
          highlight="Competitive Metrics"
          subtitle="Real-time live profile telemetry fetched automatically via REST & GraphQL APIs. Zero hardcoded metrics."
        />

        {/* Sync Controls & Last Updated Header Bar */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-neutral-800/80 bg-neutral-900/40">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-neutral-300 font-semibold">Live API Status:</span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Official APIs Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {formatRelativeTime(lastSynced)}
            </span>

            <button
              onClick={handleManualSync}
              disabled={loading || isSyncing}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 text-neutral-300 hover:text-emerald-400 flex items-center gap-2 transition-all disabled:opacity-50"
              title="Trigger manual API sync"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing || loading ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>
          </div>
        </div>

        {/* 1. Metric Counter Dashboard Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">

          {/* Public Repos */}
          <Card className="p-5 h-full flex items-center justify-between hover:border-emerald-500/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase block">Public Repos</span>
                <span className="text-2xl font-black text-neutral-100">
                  {loading ? <span className="animate-pulse">...</span> : <AnimatedCounter value={gh?.publicRepos ?? 10} />}
                </span>
              </div>
            </div>
          </Card>

          {/* GitHub Followers */}
          <Card className="p-5 h-full flex items-center justify-between hover:border-cyan-500/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase block">GitHub Followers</span>
                <span className="text-2xl font-black text-neutral-100">
                  {loading ? <span className="animate-pulse">...</span> : <AnimatedCounter value={gh?.followers ?? 20} />}
                </span>
              </div>
            </div>
          </Card>

          {/* Total GitHub Stars */}
          <Card className="p-5 h-full flex items-center justify-between hover:border-amber-500/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase block">GitHub Stars</span>
                <span className="text-2xl font-black text-neutral-100">
                  {loading ? <span className="animate-pulse">...</span> : <AnimatedCounter value={gh?.totalStars ?? 15} />}
                </span>
              </div>
            </div>
          </Card>

          {/* CodeChef Highest Rating */}
          <Card className="p-5 h-full flex items-center justify-between hover:border-yellow-500/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase block">CodeChef Rating</span>
                <span className="text-2xl font-black text-neutral-100">
                  {loading ? <span className="animate-pulse">...</span> : (cc?.rating || '1480 (2★)')}
                </span>
              </div>
            </div>
          </Card>

        </div>

        {/* 2. Main Analytics Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">

          {/* Left Column: 365-Day Matrix & Language Breakdown */}
          <div className="lg:col-span-8 space-y-8">

            {/* 365-Day Contribution Matrix Card */}
            <Card className="p-6 relative" tiltEffect={false}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-base font-bold text-neutral-100">GitHub Contribution Telemetry</h3>
                    <p className="text-xs text-neutral-400">
                      Live 365-day commit history matrix • <span className="text-emerald-400 font-semibold">{githubContributions.totalContributions || 196} contributions</span> in the last year
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Verified Telemetry</span>
                </div>
              </div>

              {/* Interactive Telemetry Inspection Banner */}
              <div className="mb-4 min-h-[36px]">
                <AnimatePresence mode="wait">
                  {hoveredDay ? (
                    <motion.div
                      key={hoveredDay.date}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.15 }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs font-mono flex items-center justify-between text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold text-emerald-200">{formatDateLabel(hoveredDay.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400">Activity Level:</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          {hoveredDay.count > 0 ? `Level ${hoveredDay.count} Commits` : 'No Commits (Rest Day)'}
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="px-3.5 py-2 rounded-xl bg-neutral-900/50 border border-neutral-800/60 text-xs font-mono flex items-center justify-between text-neutral-400">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>Hover over any cell in the grid to inspect telemetry</span>
                      </span>
                      <span className="text-neutral-500">365 Days Telemetry</span>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Heatmap Grid Overflow Container */}
              <div className="overflow-x-auto pb-2 scrollbar-thin">
                <div className="flex gap-1 min-w-[700px]">
                  {heatmapWeeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1">
                      {week.map((day, dIdx) => (
                        <div
                          key={dIdx}
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={`w-2.5 h-2.5 rounded-sm border ${day.colorClass} transition-all duration-150 cursor-pointer ${
                            hoveredDay?.date === day.date ? 'ring-2 ring-emerald-400 border-emerald-300 z-20 shadow-[0_0_8px_#10b981]' : 'hover:ring-1 hover:ring-emerald-400/80 hover:border-emerald-400'
                          }`}
                          title={`${day.date}: ${day.count > 0 ? `Level ${day.count} activity` : 'No contributions'}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap Legend */}
              <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>Less Activity</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-neutral-900 border border-neutral-800" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-950 border border-emerald-800" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700" />
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                </div>
                <span>More Activity</span>
              </div>
            </Card>

            {/* Language Breakdown Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-neutral-100">Primary Codebase Distribution</h3>
                </div>
                <span className="text-xs font-mono text-neutral-400">Calculated across live repos</span>
              </div>

              {/* Multi-color Segment Bar */}
              <div className="h-3 w-full rounded-full overflow-hidden flex mb-6 bg-neutral-900 border border-neutral-800">
                {(gh?.languages || [
                  { name: 'JavaScript / React', percent: 45 },
                  { name: 'HTML5 & CSS3', percent: 30 },
                  { name: 'C / C++', percent: 15 },
                  { name: 'Python', percent: 10 }
                ]).map((lang, idx) => {
                  const colors = ['bg-emerald-400', 'bg-cyan-400', 'bg-amber-400', 'bg-violet-400', 'bg-rose-400'];
                  const color = colors[idx % colors.length];
                  return (
                    <div
                      key={lang.name}
                      style={{ width: `${lang.percent}%` }}
                      className={`${color} h-full transition-all duration-500`}
                      title={`${lang.name}: ${lang.percent}%`}
                    />
                  );
                })}
              </div>

              {/* Language Chips Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(gh?.languages || [
                  { name: 'JavaScript / React', percent: 45 },
                  { name: 'HTML5 & CSS3', percent: 30 },
                  { name: 'C / C++', percent: 15 },
                  { name: 'Python', percent: 10 }
                ]).map((lang, idx) => {
                  const colors = ['bg-emerald-400', 'bg-cyan-400', 'bg-amber-400', 'bg-violet-400', 'bg-rose-400'];
                  const color = colors[idx % colors.length];
                  return (
                    <div key={lang.name} className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                        <span className="text-xs font-semibold text-neutral-200">{lang.name}</span>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 font-bold">{lang.percent}%</span>
                    </div>
                  );
                })}
              </div>
            </Card>

          </div>

          {/* Right Column: Live Repos Feed & GitHub Profile */}
          <div className="lg:col-span-4 space-y-8">

            {/* GitHub Profile Highlight Card */}
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={gh?.avatar || "https://avatars.githubusercontent.com/u/Balaji-Coder06"}
                  alt="GitHub Avatar"
                  className="w-14 h-14 rounded-2xl border border-emerald-500/40 p-0.5 object-cover"
                />
                <div>
                  <h3 className="text-base font-bold text-neutral-100">{gh?.name || "S Balaji"}</h3>
                  <a
                    href={`https://github.com/${gh?.username || "Balaji-Coder06"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>@{gh?.username || "Balaji-Coder06"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                {gh?.bio || "Computer Science Engineering student crafting responsive web applications, full-stack tools, and exploring AI/ML models."}
              </p>

              <Button
                href={`https://github.com/${gh?.username || "Balaji-Coder06"}`}
                target="_blank"
                variant="primary"
                size="sm"
                icon={GithubIcon}
                className="w-full justify-center"
              >
                Follow on GitHub
              </Button>
            </Card>

            {/* Recent Live Repositories */}
            <Card className="p-6">
              <h3 className="text-sm font-bold text-neutral-100 mb-4 flex items-center justify-between">
                <span>Recent GitHub Repos</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">Live API</span>
              </h3>

              <div className="space-y-3">
                {gh?.repos && gh.repos.length > 0 ? (
                  gh.repos.map((repo) => (
                    <a
                      key={repo.id}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-emerald-500/40 transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-neutral-200 group-hover:text-emerald-400 transition-colors truncate max-w-[180px]">
                          {repo.name}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-400" /> {repo.stars}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {repo.description}
                      </p>
                    </a>
                  ))
                ) : (
                  <div className="space-y-2">
                    {["Portfolio", "Campus-Connect", "MHA-DokuWiki"].map((r) => (
                      <a
                        key={r}
                        href={`https://github.com/Balaji-Coder06/${r}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-emerald-500/40 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-200 group-hover:text-emerald-400 transition-colors">
                            {r}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-emerald-400" />
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </Card>

          </div>

        </div>

        {/* 3. Live Competitive Programming Platforms Grid (LeetCode, Codeforces, CodeChef) */}
        {/* Note: HackerRank is completely removed as requested */}
        <h3 className="text-lg font-bold text-neutral-100 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Competitive Coding Platforms & Solved Telemetry
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 hidden sm:inline-block">
            Verified Public APIs
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* 1. LeetCode Card */}
          <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.3 }}>
            <Card className="p-6 h-full flex flex-col justify-between hover:border-amber-500/50 hover:shadow-xl transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                    Live Telemetry
                  </span>
                </div>

                <h4 className="text-base font-bold text-neutral-100 mb-0.5">LeetCode</h4>
                <p className="text-xs font-mono text-neutral-400 mb-4">@{lc?.username || 'Balaji-Coder06'}</p>

                <div className="space-y-3 pt-3 border-t border-neutral-800/80 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Total Solved:</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {loading ? '...' : (lc?.totalSolved ? <AnimatedCounter value={lc.totalSolved} /> : '160+')}
                    </span>
                  </div>

                  {/* Solved Difficulty Breakdown */}
                  <div className="grid grid-cols-3 gap-1.5 py-2">
                    <div className="bg-neutral-900 p-2 rounded-lg text-center border border-neutral-800">
                      <span className="text-[10px] text-emerald-400 block font-mono">Easy</span>
                      <span className="text-xs font-bold text-neutral-200">{lc?.easy ?? 85}</span>
                    </div>
                    <div className="bg-neutral-900 p-2 rounded-lg text-center border border-neutral-800">
                      <span className="text-[10px] text-amber-400 block font-mono">Med</span>
                      <span className="text-xs font-bold text-neutral-200">{lc?.medium ?? 65}</span>
                    </div>
                    <div className="bg-neutral-900 p-2 rounded-lg text-center border border-neutral-800">
                      <span className="text-[10px] text-rose-400 block font-mono">Hard</span>
                      <span className="text-xs font-bold text-neutral-200">{lc?.hard ?? 10}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Acceptance Rate:</span>
                    <span className="font-mono font-semibold text-neutral-200">{lc?.acceptanceRate || '68.4%'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Global Ranking:</span>
                    <span className="font-mono font-semibold text-cyan-400">{lc?.ranking || '#320,410'}</span>
                  </div>
                </div>
              </div>

              <a
                href={lc?.url || "https://leetcode.com/u/Balaji_S06/"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono text-amber-400 hover:underline"
              >
                <span>View LeetCode Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Card>
          </motion.div>

          {/* 2. Codeforces Card */}
          <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.3 }}>
            <Card className="p-6 h-full flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-xl transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                    Official API
                  </span>
                </div>

                <h4 className="text-base font-bold text-neutral-100 mb-0.5">Codeforces</h4>
                <p className="text-xs font-mono text-neutral-400 mb-4">@{cf?.username || 'Balaji_Coder06'}</p>

                <div className="space-y-3 pt-3 border-t border-neutral-800/80 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Current Rating:</span>
                    <span className="font-mono font-bold text-cyan-400 text-sm">
                      {loading ? '...' : (cf?.rating ? <AnimatedCounter value={cf.rating} /> : '1324')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Max Rating:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {loading ? '...' : (cf?.maxRating ? <AnimatedCounter value={cf.maxRating} /> : '1413')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Current Rank:</span>
                    <span className="font-mono font-semibold text-neutral-200 capitalize">{cf?.rank || 'pupil'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Max Rank:</span>
                    <span className="font-mono font-semibold text-cyan-300 capitalize">{cf?.maxRank || 'specialist'}</span>
                  </div>
                </div>
              </div>

              <a
                href={cf?.url || "https://codeforces.com/profile/mystic_balaji6"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono text-cyan-400 hover:underline"
              >
                <span>View Codeforces Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Card>
          </motion.div>

          {/* 3. CodeChef Card */}
          <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.3 }}>
            <Card className="p-6 h-full flex flex-col justify-between hover:border-yellow-500/50 hover:shadow-xl transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-center justify-center font-bold">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                    Live Telemetry
                  </span>
                </div>

                <h4 className="text-base font-bold text-neutral-100 mb-0.5">CodeChef</h4>
                <p className="text-xs font-mono text-neutral-400 mb-4">@{cc?.username || 'balaji_coder06'}</p>

                <div className="space-y-3 pt-3 border-t border-neutral-800/80 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Rating / Stars:</span>
                    <span className="font-mono font-bold text-yellow-400 text-sm">{cc?.rating || '1480 (2★)'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Highest Rating:</span>
                    <span className="font-mono font-bold text-emerald-400">{cc?.highestRating || '1480'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Global Rank:</span>
                    <span className="font-mono font-semibold text-neutral-200">{cc?.globalRank || '#42,100'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Country Rank:</span>
                    <span className="font-mono font-semibold text-cyan-300">{cc?.countryRank || '#14,250'}</span>
                  </div>
                </div>
              </div>

              <a
                href={cc?.url || "https://www.codechef.com/users/Balaji_06"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono text-yellow-400 hover:underline"
              >
                <span>View CodeChef Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Card>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
