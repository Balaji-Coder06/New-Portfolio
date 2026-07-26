import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Award, Trophy, ExternalLink, Calendar, MapPin, CheckCircle2, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Magnetic from '../ui/Magnetic';
import { personalData, certificationsData } from '../../data/portfolioData';

const timelineMilestones = [
  {
    id: 'exp-2',
    year: '2026',
    period: 'Jun 2026',
    category: 'Experience',
    title: 'Web Development Intern',
    organization: 'InternPe',
    description: 'Successfully developed four complete web applications during a four-week internship, including a Calculator, E-Commerce Website, To-Do Application, and Connect 4 Game using HTML, CSS, and JavaScript. Created technical documentation explaining project architecture, functionality, and implementation details.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Git', 'GitHub'],
    icon: Briefcase,
    accent: 'from-cyan-500 to-blue-500',
    highlight: 'Web Dev Internship'
  },
  {
    id: 'exp-1',
    year: '2025',
    period: 'Dec 2025',
    category: 'Experience',
    title: 'Full Stack Development Intern',
    organization: 'Big Bucks Innovation Pvt. Ltd.',
    description: 'Contributed to full-stack feature development across frontend and backend modules for production-oriented web applications. Collaborated with senior developers during sprint cycles, participated in code reviews, and helped deliver scalable, maintainable software solutions while following modern development practices.',
    tags: ['React', 'Node.js', 'Express.js', 'JavaScript', 'Git', 'GitHub'],
    icon: Briefcase,
    accent: 'from-emerald-500 to-teal-500',
    highlight: 'Full Stack Internship'
  },
  {
    id: 'exp-3',
    year: '2025',
    period: 'Jun 2025 – Jul 2025',
    category: 'Experience',
    title: 'Web Development Intern',
    organization: 'Codec Technologies',
    description: 'Developed responsive web applications from design specifications using HTML, CSS, and JavaScript. Followed modern frontend development workflows, practiced Git-based version control, debugging, and collaborated through iterative development.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Git', 'Responsive Design'],
    icon: Briefcase,
    accent: 'from-violet-500 to-indigo-500',
    highlight: 'Frontend Internship'
  }
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-28 relative overflow-hidden bg-transparent">
      
      {/* Ambient Gradient Lighting */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Professional Industry Experience"
          title="Internships &"
          highlight="Development Roles"
          subtitle="A track record of software development internships, full-stack contributions, and web engineering deliverables."
        />

        {/* Serpentine Alternating Glass Timeline */}
        <div className="relative max-w-5xl mx-auto mt-12">
          
          {/* Vertical Glowing Connector Line (Desktop Center / Mobile Left) */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-emerald-500 via-cyan-500 to-violet-500 shadow-[0_0_12px_#10b981]" />

          <motion.div layout className="space-y-12 relative">
            <AnimatePresence mode="popLayout">
              {timelineMilestones.map((item, index) => {
                const IconComponent = item.icon;
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 40, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, y: 0, x: 0 }}
                    viewport={{ once: true }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={`relative flex flex-col md:flex-row items-center ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    
                    {/* Glowing Node Icon Circle */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-neutral-950 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 z-20 group hover:scale-125 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Timeline Glass Card Component */}
                    <div className="w-full pl-12 md:pl-0 md:w-[calc(50%-2.5rem)]">
                      <Card className="p-6 sm:p-7 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group relative overflow-hidden">
                        
                        {/* Background Ambient Glow */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform pointer-events-none" />

                        {/* Top Metadata Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                            {item.period}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {item.category}
                          </span>
                        </div>

                        {/* Title & Organization */}
                        <h3 className="text-lg font-bold text-neutral-100 group-hover:text-emerald-400 transition-colors mb-0.5">
                          {item.title}
                        </h3>
                        <p className="text-xs font-mono text-cyan-400 mb-3 flex items-center gap-1.5">
                          <span>{item.organization}</span>
                        </p>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5">
                          {item.description}
                        </p>

                        {/* Tags */}
                        <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap gap-1.5 items-center justify-between">
                          <div className="flex flex-wrap gap-1.5">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="neutral">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {item.link && (
                            <a
                              href={item.link}
                              target={item.link.startsWith('http') ? '_blank' : '_self'}
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                              title="Verify Credential / Link"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                          )}
                        </div>

                      </Card>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

        </div>

        {/* Official GDrive Verification Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <div className="glass-panel p-6 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-3xl w-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-100">Verify Official Transcripts & Credentials</h4>
                <p className="text-xs text-neutral-400">All Springboard certifications and course completion records are verified via Google Drive.</p>
              </div>
            </div>

            <Button
              href={personalData.certificateDriveLink}
              target="_blank"
              variant="primary"
              size="sm"
              icon={ExternalLink}
              iconPosition="right"
              className="shrink-0"
            >
              Open GDrive Folder
            </Button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
