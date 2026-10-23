import Reveal from '../components/Reveal';
import { Terminal, Code2, Cpu, Database } from 'lucide-react';

export default function About({ profile }) {
  return (
    <section id="about" className="section">
      <Reveal>
        <p className="eyebrow">ABOUT ME</p>
        <h2 className="section-title">A developer in orbit.</h2>
      </Reveal>
      
      <div className="about-layout">
        <Reveal delay={0.1} className="about-left">
          <p className="about-text">
            {profile?.bio || 'I am an aspiring full-stack developer passionate about building clean, functional, and user-focused web and mobile applications. I enjoy learning across the stack, from UI design to backend systems and databases.'}
          </p>
          
          <div className="stats-container">
            <div className="stat-box">
              <Code2 size={24} className="stat-icon" />
              <h4>Frontend</h4>
              <p>React & Modern CSS</p>
            </div>
            <div className="stat-box">
              <Database size={24} className="stat-icon" />
              <h4>Backend</h4>
              <p>Node.js & MongoDB</p>
            </div>
            <div className="stat-box">
              <Cpu size={24} className="stat-icon" />
              <h4>Explorer</h4>
              <p>Always learning</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="about-right">
          <div className="terminal-box">
            <div className="terminal-header">
              <Terminal size={14} /> <span>damar@galaxy:~</span>
            </div>
            <div className="terminal-body">
              <p><span className="t-green">➜</span> <span className="t-blue">~</span> whoami</p>
              <p className="t-muted">Damar Restu Santoso</p>
              <p><span className="t-green">➜</span> <span className="t-blue">~</span> cat goals.txt</p>
              <p className="t-muted">"To build impactful software that pushes boundaries."</p>
              <p><span className="t-green">➜</span> <span className="t-blue">~</span> status</p>
              <p className="t-muted">Available for opportunities<span className="blinking-cursor">_</span></p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}