import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SiPython, 
  SiJavascript, 
  SiHtml5, 
  SiCss, 
  SiReact, 
  SiNodedotjs, 
  SiExpress, 
  SiMongodb, 
  SiGit, 
  SiGithub, 
  SiLinux, 
  SiCplusplus 
} from 'react-icons/si';
import { FaJava, FaDatabase, FaWindows } from 'react-icons/fa6';
import { TbBrandVscode, TbApi, TbDeviceMobileCode, TbCode, TbLayout, TbServer, TbDatabase, TbTools } from 'react-icons/tb';
import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Magnetic from '../ui/Magnetic';

// Official C language SVG icon
const CIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" {...props}>
    <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 9.95-9h-4.07A6 6 0 1 1 12 6c1.9 0 3.6.87 4.7 2.24l3.18-2.6A9.97 9.97 0 0 0 12 2z"/>
  </svg>
);

const skillCategories = [
  { id: 'all', label: 'All Tech' },
  { id: 'languages', label: 'Programming Languages', icon: TbCode },
  { id: 'frontend', label: 'Frontend', icon: TbLayout },
  { id: 'backend', label: 'Backend', icon: TbServer },
  { id: 'database', label: 'Database', icon: TbDatabase },
  { id: 'tools', label: 'Tools & Platforms', icon: TbTools },
];

const skillsDataList = [
  // 1. Programming Languages
  { name: 'Java', category: 'languages', icon: FaJava, highlight: 'OOP & Core Fundamentals', color: 'from-amber-600/20 to-red-500/20 text-[#EA2D2E] border-amber-500/30' },
  { name: 'Python', category: 'languages', icon: SiPython, highlight: 'Scripting & Automation', color: 'from-blue-500/20 to-yellow-500/20 text-[#3776AB] border-blue-500/30' },
  { name: 'C', category: 'languages', icon: CIcon, highlight: 'Procedural Programming & Memory', color: 'from-cyan-500/20 to-blue-600/20 text-[#A8B9CC] border-cyan-500/30' },
  { name: 'C++', category: 'languages', icon: SiCplusplus, highlight: 'Object-Oriented & Problem Solving', color: 'from-blue-600/20 to-indigo-500/20 text-[#00599C] border-blue-500/30' },
  { name: 'JavaScript', category: 'languages', icon: SiJavascript, highlight: 'ES6+, Async & Modern Web Engine', color: 'from-yellow-500/20 to-amber-500/20 text-[#F7DF1E] border-yellow-500/30' },

  // 2. Frontend
  { name: 'HTML5', category: 'frontend', icon: SiHtml5, highlight: 'Semantic Document Structure', color: 'from-orange-500/20 to-red-500/20 text-[#E34F26] border-orange-500/30' },
  { name: 'CSS3', category: 'frontend', icon: SiCss, highlight: 'Flexbox, Grid & Keyframe Styling', color: 'from-blue-500/20 to-cyan-500/20 text-[#1572B6] border-blue-500/30' },
  { name: 'JavaScript', category: 'frontend', icon: SiJavascript, highlight: 'DOM Manipulation & Interactivity', color: 'from-yellow-500/20 to-amber-500/20 text-[#F7DF1E] border-yellow-500/30' },
  { name: 'React.js', category: 'frontend', icon: SiReact, highlight: 'Component SPA Architecture', color: 'from-cyan-400/20 to-blue-500/20 text-[#61DAFB] border-cyan-400/30' },
  { name: 'Responsive Web Design', category: 'frontend', icon: TbDeviceMobileCode, highlight: 'Mobile-First Fluid Viewports', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30' },

  // 3. Backend
  { name: 'Node.js', category: 'backend', icon: SiNodedotjs, highlight: 'Asynchronous Event-Driven Runtime', color: 'from-emerald-600/20 to-green-500/20 text-[#5FA04E] border-emerald-600/30' },
  { name: 'Express.js', category: 'backend', icon: SiExpress, highlight: 'Server Routing & Middleware Stack', color: 'from-neutral-700/30 to-neutral-800/30 text-neutral-200 border-neutral-600/40' },
  { name: 'REST APIs', category: 'backend', icon: TbApi, highlight: 'Client-Server HTTP Data Exchange', color: 'from-blue-500/20 to-indigo-500/20 text-[#38BDF8] border-blue-500/30' },

  // 4. Database
  { name: 'MongoDB', category: 'database', icon: SiMongodb, highlight: 'NoSQL Document Store & Collections', color: 'from-emerald-500/20 to-green-600/20 text-[#47A248] border-emerald-500/30' },
  { name: 'SQL', category: 'database', icon: FaDatabase, highlight: 'Relational Database Queries & Schema', color: 'from-indigo-500/20 to-violet-500/20 text-[#4479A1] border-indigo-500/30' },

  // 5. Tools & Platforms
  { name: 'Git', category: 'tools', icon: SiGit, highlight: 'Distributed Version Control Systems', color: 'from-orange-500/20 to-red-500/20 text-[#F05032] border-orange-500/30' },
  { name: 'GitHub', category: 'tools', icon: SiGithub, highlight: 'Repository Hosting & Collaboration', color: 'from-purple-500/20 to-violet-500/20 text-neutral-100 border-purple-500/30' },
  { name: 'VS Code', category: 'tools', icon: TbBrandVscode, highlight: 'Development IDE & Extensions Stack', color: 'from-blue-500/20 to-cyan-500/20 text-[#007ACC] border-blue-500/30' },
  { name: 'Linux', category: 'tools', icon: SiLinux, highlight: 'Command Line Terminal & Environment', color: 'from-yellow-500/20 to-amber-600/20 text-[#FCC624] border-yellow-500/30' },
  { name: 'Windows', category: 'tools', icon: FaWindows, highlight: 'Desktop Workstation & Operating System', color: 'from-sky-500/20 to-blue-500/20 text-[#0078D4] border-sky-500/30' },
];

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  // Deduplicate items by name when showing 'all' category to avoid seeing JavaScript twice
  const getFilteredSkills = () => {
    if (activeCategory === 'all') {
      const seen = new Set();
      return skillsDataList.filter(item => {
        if (seen.has(item.name)) return false;
        seen.add(item.name);
        return true;
      });
    }
    return skillsDataList.filter(s => s.category === activeCategory);
  };

  const filteredSkills = getFilteredSkills();

  return (
    <section id="skills" className="py-28 relative overflow-hidden bg-transparent">
      
      {/* Ambient Radial Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <SectionHeading
          badge="Technical Stack"
          title="Development Tools &"
          highlight="Technologies"
          subtitle="Categorized tech stack across Frontend, Backend, Languages, Database, and Developer Tools."
        />

        {/* Category Pill Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
          {skillCategories.map((cat) => {
            const IconComp = cat.icon;
            const isActive = activeCategory === cat.id;

            return (
              <Magnetic key={cat.id} strength={0.15}>
                <button
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 border focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10 scale-105'
                      : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:border-neutral-700'
                  }`}
                >
                  {IconComp && <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`} />}
                  <span>{cat.label}</span>
                </button>
              </Magnetic>
            );
          })}
        </div>

        {/* Dynamic Animated Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => {
              const IconComp = skill.icon;
              return (
                <motion.div
                  key={`${skill.category}-${skill.name}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <Card className="p-6 h-full flex flex-col justify-between group hover:border-emerald-500/40 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${skill.color} p-2.5 flex items-center justify-center border shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                          <IconComp className="w-full h-full" />
                        </div>
                        <Badge variant="neutral" className="uppercase text-[10px] tracking-wider font-mono">
                          {skill.category}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold text-neutral-100 mb-1 group-hover:text-emerald-400 transition-colors">
                        {skill.name}
                      </h3>

                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        {skill.highlight}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400/90 flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Active Stack
                      </span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
