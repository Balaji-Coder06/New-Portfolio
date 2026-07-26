import { motion } from 'framer-motion';
import { ArrowUp, Code2, Heart, Sparkles, Terminal, Mail } from 'lucide-react';
import Magnetic from '../ui/Magnetic';
import { personalData, socialLinks } from '../../data/portfolioData';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon, WhatsAppIcon } from '../ui/SocialIcons';

const socialIconMap = {
  Github: GithubIcon,
  Linkedin: LinkedinIcon,
  Mail: Mail,
  MessageSquare: WhatsAppIcon,
  Instagram: InstagramIcon,
  Twitter: TwitterIcon
};

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-neutral-950/80 backdrop-blur-xl border-t border-neutral-800/80 overflow-hidden pt-16 pb-12">
      
      {/* Top Ambient Glow Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent blur-[2px]" />

      {/* Background Radial Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-neutral-800/80 items-start">
          
          {/* Brand & Developer Quote Column (Col 1-5) */}
          <div className="md:col-span-5 space-y-4">
            
            {/* Logo */}
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, '#hero')}
              className="inline-flex items-center gap-3 group"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-violet-600 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
                <div className="w-full h-full bg-neutral-950 rounded-[11px] flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-neutral-100 group-hover:text-emerald-400 transition-colors tracking-tight flex items-center gap-1.5">
                  S BALAJI
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </span>
                <span className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase">
                  Frontend Developer & CS Engineer
                </span>
              </div>
            </a>

            {/* Developer Philosophy Quote */}
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              &ldquo;Crafting high-performance digital experiences with precision, aesthetic excellence, and scalable architecture.&rdquo;
            </p>

            {/* Location & Status Tag */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available for Roles & Projects
              </span>
            </div>

          </div>

          {/* Quick Navigation Links (Col 6-8) */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block font-semibold">
              Navigation
            </span>

            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-xs text-neutral-400 hover:text-emerald-400 transition-colors inline-block hover:translate-x-1 transition-transform font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Platforms & Back to Top (Col 9-12) */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block font-semibold">
              Connect
            </span>

            {/* Social Icons Flex Grid */}
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social) => {
                const IconComp = socialIconMap[social.icon] || Code2;
                return (
                  <Magnetic key={social.name} strength={0.2}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-neutral-800 transition-all shadow-md"
                      title={social.name}
                      aria-label={social.name}
                    >
                      <IconComp className="w-4 h-4" />
                    </a>
                  </Magnetic>
                );
              })}
            </div>

            {/* Back to Top Button */}
            <div className="pt-2">
              <Magnetic strength={0.3} className="w-full block">
                <button
                  onClick={scrollToTop}
                  className="w-full px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/40 text-xs sm:text-sm font-mono font-medium text-neutral-300 hover:text-emerald-400 transition-all flex items-center justify-center gap-2.5 group shadow-lg"
                  aria-label="Back to Top"
                >
                  <ArrowUp className="w-4 h-4 text-emerald-400 group-hover:-translate-y-1 transition-transform shrink-0" />
                  <span className="whitespace-nowrap">Back to Top</span>
                </button>
              </Magnetic>
            </div>

          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex items-center justify-center text-xs font-mono text-neutral-400 text-center">
          <p className="flex flex-wrap items-center justify-center gap-1.5">
            <span>© 2026 Designed & Engineered with</span>
            <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 animate-pulse" />
            <span>by S Balaji</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
