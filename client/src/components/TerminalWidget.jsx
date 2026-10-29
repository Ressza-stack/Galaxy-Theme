import { useState, useRef, useEffect } from 'react';
import { Terminal, X, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TerminalWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'sys', text: 'DAMAR.OS v2.1.24 initialized.' },
    { type: 'sys', text: 'Type "help" to see available commands.' }
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [history, isOpen]);

  // Tutup pakai tombol Escape
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    let response = [];

    if (cmd.startsWith('goto ')) {
      const section = cmd.split(' ')[1];
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        response = [`Navigating to [${section.toUpperCase()}] sector...`];
        setTimeout(() => setIsOpen(false), 1000); // Tutup terminal setelah jalan
      } else {
        response = [`Sector not found: ${section}. Try "about", "skills", "projects", or "contact".`];
      }
    } else {
      switch (cmd) {
        case 'help':
          response = ['Available commands:', '  about      - Who is Damar?', '  skills     - Tech stack.', '  goto [x]   - Scroll to section (about/skills/projects/contact).', '  github     - Open GitHub.', '  clear      - Clear terminal.', '  exit       - Close terminal.'];
          break;
        case 'about':
          response = ['Damar Restu Santoso is an Aspiring Full-Stack Developer.'];
          break;
        case 'skills':
          response = ['React, Node.js, Express, MongoDB, Python, Laravel, MySQL.'];
          break;
        case 'github':
          response = ['Opening GitHub profile...'];
          setTimeout(() => window.open('https://github.com/Ressza-stack', '_blank'), 1000);
          break;
        case 'clear':
          setHistory([]); setInput(''); return;
        case 'exit':
          setIsOpen(false); setInput(''); return;
        default:
          response = [`Command not found: ${cmd}. Type "help".`];
      }
    }

    setHistory(prev => [...prev, { type: 'input', text: `guest@damar:~$ ${input}` }, ...response.map(r => ({ type: 'output', text: r }))]);
    setInput('');
  };

  return (
    <>
      <motion.button className="terminal-toggle-btn" onClick={() => setIsOpen(true)} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 4 }} whileHover={{ scale: 1.1 }} title="Open Command Center">
        <Terminal size={22} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div className="terminal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)}>
            <motion.div className="terminal-window" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} onClick={(e) => e.stopPropagation()}>
              <div className="terminal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Terminal size={16} /> <span>guest@damar: ~</span></div>
                <button onClick={() => setIsOpen(false)} className="terminal-close-btn"><X size={18} /></button>
              </div>
              <div className="terminal-body-scroll">
                {history.map((line, i) => <div key={i} className={`term-line ${line.type}`}>{line.text}</div>)}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={handleCommand} className="terminal-input-form">
                <span className="term-prompt">guest@damar:~$</span>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} autoFocus spellCheck="false" autoComplete="off" />
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}