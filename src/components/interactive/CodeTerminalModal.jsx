import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, CornerDownLeft, Sparkles, Code2, Copy, Check } from 'lucide-react';
import { personalData, projectsData, skillsData, socialLinks } from '../../data/portfolioData';

export default function CodeTerminalModal({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState([
    { type: 'system', text: 'Welcome to S Balaji CLI v2.0. Type "help" for available commands.' }
  ]);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newLogs = [...logs, { type: 'input', text: `$ ${input}` }];

    switch (cmd) {
      case 'help':
        newLogs.push({
          type: 'output',
          text: `Available Commands:
  • bio       : Read developer biography & background
  • skills    : List technical languages, frameworks & tools
  • projects  : Display featured software projects
  • resume    : Open official PDF resume
  • contact   : View email, phone, & social profile links
  • clear     : Clear terminal screen output
  • exit      : Close command menu`
        });
        break;
      case 'bio':
        newLogs.push({
          type: 'output',
          text: `${personalData.name} - ${personalData.title}
Status: ${personalData.status}
Education: ${personalData.education}
Motto: "${personalData.motto}"

${personalData.bio.join(' ')}`
        });
        break;
      case 'skills':
        const allSkills = skillsData.flatMap(c => c.skills.map(s => s.name)).join(', ');
        newLogs.push({
          type: 'output',
          text: `Technical Stack & Proficiency:
${allSkills}`
        });
        break;
      case 'projects':
        const projList = projectsData.map(p => `• [${p.title}]: ${p.description}`).join('\n');
        newLogs.push({
          type: 'output',
          text: `Featured Projects:\n${projList}`
        });
        break;
      case 'resume':
        window.open(personalData.resumeLink, '_blank');
        newLogs.push({ type: 'output', text: 'Opening resume in new tab...' });
        break;
      case 'contact':
        const contactInfo = socialLinks.map(s => `• ${s.name}: ${s.handle} (${s.url})`).join('\n');
        newLogs.push({ type: 'output', text: `Contact Profiles:\n${contactInfo}` });
        break;
      case 'clear':
        setLogs([]);
        setInput('');
        return;
      case 'exit':
        onClose();
        setInput('');
        return;
      default:
        newLogs.push({
          type: 'error',
          text: `Command not recognized: "${cmd}". Type "help" for command list.`
        });
    }

    setLogs(newLogs);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                balaji@arch-system:~
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Command Pills */}
          <div className="px-4 py-2 bg-neutral-900/40 border-b border-neutral-800/60 flex items-center gap-2 overflow-x-auto text-xs font-mono text-neutral-400">
            <span className="text-neutral-500 shrink-0">Quick run:</span>
            {['help', 'bio', 'skills', 'projects', 'resume', 'contact'].map(cmd => (
              <button
                key={cmd}
                onClick={() => setInput(cmd)}
                className="px-2.5 py-1 rounded bg-neutral-800/80 hover:bg-emerald-500/20 hover:text-emerald-400 border border-neutral-700/50 transition-colors shrink-0"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Output Screen */}
          <div className="p-4 overflow-y-auto font-mono text-xs space-y-3 flex-1 bg-black/60">
            {logs.map((log, index) => (
              <div key={index} className="leading-relaxed">
                {log.type === 'input' && <span className="text-emerald-400 font-semibold">{log.text}</span>}
                {log.type === 'system' && <span className="text-cyan-400">{log.text}</span>}
                {log.type === 'output' && <pre className="text-neutral-300 whitespace-pre-wrap font-mono font-sans">{log.text}</pre>}
                {log.type === 'error' && <span className="text-rose-400">{log.text}</span>}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleCommand} className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-xs font-bold">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type command ('help', 'projects', 'resume')..."
              className="w-full bg-transparent font-mono text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none"
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
