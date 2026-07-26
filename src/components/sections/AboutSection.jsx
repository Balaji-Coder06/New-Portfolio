import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, BookOpen, GraduationCap, Compass, Target, Award, Sparkles, Terminal, Cpu, Code2, Globe, Heart, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Magnetic from '../ui/Magnetic';
import { personalData } from '../../data/portfolioData';

const timelineJourney = [
  {
    year: '2015-2024',
    title: 'Schooling',
    description: 'Completed my schooling.',
    icon: Code2,
    badge: 'Academics'
  },
  {
    year: '2024',
    title: 'Computer Science Foundation',
    description: 'Began CS Engineering degree. Learnt C, C++, Python, Java and core algorithm fundamentals.',
    icon: Code2,
    badge: 'Academics'
  },
  {
    year: '2024',
    title: 'Springboard Certifications',
    description: 'Completed 8+ verified courses across HTML5, CSS3, JavaScript, Java, and Networking.',
    icon: Award,
    badge: 'Certifications'
  },
  {
    year: '2025',
    title: 'Full Stack & Web Applications',
    description: 'Architected Campus-Connect and MHA DokuWiki Clone using React and modern CSS systems.',
    icon: Globe,
    badge: 'Projects'
  },
  {
    year: '2026',
    title: 'Modern Web Engineering & AI',
    description: 'Pioneered Portfolio architecture with Framer Motion, GSAP, and machine learning explorations.',
    icon: Sparkles,
    badge: 'Milestone'
  }
];

const quickFacts = [
  { label: 'Role', value: 'CS Engineer & Frontend Developer' },
  { label: 'Degree', value: 'B.E / B.Tech Computer Science' },
  { label: 'Status', value: '3rd Year Student' },
  { label: 'Location', value: 'India' },
  { label: 'Core Stack', value: 'React, NodeJS, HTML, CSS, JS' },
  { label: 'Languages', value: 'C, C++, Python, Java' }
];

const interests = [
  { name: 'UI/UX Architecture', desc: 'Learnt how to use Figma', icon: Cpu },
  { name: 'Artificial Intelligence', desc: 'Exploring ML algorithms & neural networks', icon: Sparkles },
  { name: 'Open Source', desc: 'Contributing to developer tooling & libraries', icon: Terminal },
  { name: 'Data Structures', desc: 'Solving algorithmic challenges with C/Java', icon: BookOpen }
];

const futureGoals = [
  'Ship production-grade AI-powered web applications',
  'Master advanced full-stack cloud architectures',
  'Contribute to major open-source frontend ecosystems',
  'Secure high-impact software engineering internships'
];

export default function AboutSection() {
  return (
    <section id="about" className="py-28 relative overflow-hidden bg-transparent">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Storytelling & Mindset"
          title="Learning Code with"
          highlight="Purpose & Curiosity"
          subtitle="Combining Computer Science fundamentals with modern frontend engineering and AI principles."
        />

        {/* 1. Animated Stats Counter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
        >
          {personalData.stats.map((stat) => (
            <Card key={stat.label} className="p-5 h-full flex flex-col justify-center text-center group hover:border-emerald-500/50 transition-all">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-1 group-hover:scale-105 transition-transform">
                {stat.value}
              </div>
              <p className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                {stat.label}
              </p>
            </Card>
          ))}
        </motion.div>

        {/* 2. Main Storytelling Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Personal Introduction & Quick Facts */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Story Quote Hero Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-l-4 border-l-emerald-500 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block">My Philosophy</span>
                    <h3 className="text-lg font-bold text-neutral-100">{personalData.motto}</h3>
                  </div>
                </div>

                <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
                  <p>
                    I am <strong className="text-emerald-400">S Balaji</strong>, a passionate Computer Science student with a strong interest in Full Stack Development, Artificial Intelligence, and Enterprise Software Systems.
                  </p>
                  <p>
                    Hands-on experience gained through internships and projects involving Multi-Agent AI, Knowledge Graphs, Digital Twins, and responsive web applications. Passionate about building innovative solutions and continuously expanding technical expertise.
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Based in {personalData.location}</span>
                  </div>

                  <Button
                    href={personalData.certificateDriveLink}
                    target="_blank"
                    variant="outline"
                    size="sm"
                    icon={BookOpen}
                  >
                    Transcripts & Certificates
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Quick Facts Matrix */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-base font-bold text-neutral-200 mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                Quick Developer Facts
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickFacts.map((fact) => (
                  <Card key={fact.label} className="p-4 h-full flex flex-col justify-center hover:border-emerald-500/40">
                    <span className="text-[11px] font-mono text-neutral-500 uppercase block mb-0.5">{fact.label}</span>
                    <span className="text-sm font-semibold text-neutral-100">{fact.value}</span>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Education Highlight Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    Schooling
                  </span>
                  <span className="text-xs font-mono text-neutral-500">2015-2024</span>
                </div>
                <h4 className="text-base font-bold text-neutral-100 mb-1">Bio-Math (Class-12)</h4>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  Built a strong foundation in Mathematics, Biology, and analytical problem-solving during higher secondary education.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-neutral-800/80">
                  <Badge variant="neutral">Mathematics</Badge>
                  <Badge variant="neutral">Biology</Badge>
                  <Badge variant="neutral">Analytical Thinking</Badge>
                  <Badge variant="neutral">Problem Solving</Badge>
                </div>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
                    Degree Program
                  </span>
                  <span className="text-xs font-mono text-neutral-500">2024 - Present</span>
                </div>
                <h4 className="text-base font-bold text-neutral-100 mb-1">Bachelor of Engineering / Computer Science</h4>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  Focused on Data Structures, Algorithms, Object-Oriented Programming (OOP), Database Systems, and Web Application Architecture.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-neutral-800/80">
                  <Badge variant="neutral">Data Structures</Badge>
                  <Badge variant="neutral">OOPs in Java</Badge>
                  <Badge variant="neutral">Web Development</Badge>
                  <Badge variant="neutral">Digital Logic Design</Badge>
                </div>
              </Card>
            </motion.div>

          </div>

          {/* Right Column: Timeline Journey, Interests & Future Goals */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Timeline Journey Card Stack */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-base font-bold text-neutral-200 mb-4 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                Evolution & Journey
              </h3>

              <div className="relative border-l-2 border-neutral-800 ml-3 space-y-6 pl-6">
                {timelineJourney.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={`${item.year}-${index}`}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="relative group"
                    >
                      {/* Node Icon */}
                      <div className="absolute -left-[37px] top-0.5 w-6 h-6 rounded-full bg-neutral-950 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-3 h-3" />
                      </div>

                      <Card className="p-4 hover:border-emerald-500/40">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-mono font-bold text-emerald-400">{item.year}</span>
                          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
                            {item.badge}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-neutral-100 group-hover:text-emerald-400 transition-colors mb-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          {item.description}
                        </p>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Core Interests Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-base font-bold text-neutral-200 mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-400" />
                Specialized Interests
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {interests.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <Card key={item.name} className="p-3.5 h-full flex flex-col justify-between hover:border-emerald-500/40 group">
                      <div>
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-110 transition-transform">
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-xs font-bold text-neutral-200 mb-1">{item.name}</h4>
                        <p className="text-[11px] text-neutral-400 leading-normal">{item.desc}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </motion.div>

            {/* Future Roadmap & Goals Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 border-l-4 border-l-cyan-500">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-neutral-100 uppercase tracking-wider font-mono">Future Roadmap & Target Goals</h3>
                </div>

                <div className="space-y-2.5">
                  {futureGoals.map((goal, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
