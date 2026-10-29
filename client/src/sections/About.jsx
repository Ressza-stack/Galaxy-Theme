import Reveal from '../components/Reveal';
import GlitchText from '../components/GlitchText';
import { Terminal, Code2, Database, Cpu, Fingerprint, Radio } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function About({ profile }) {
  // Logic untuk 3D Tilt Hologram Card
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section id="about" className="section">
      <Reveal>
        <p className="eyebrow">ABOUT ME</p>
        <GlitchText text="A developer in orbit." className="section-title" />
      </Reveal>
      
      <div className="about-layout">
        {/* KIRI: Holographic ID Card */}
        <Reveal delay={0.1}>
          <motion.div 
            className="hologram-card"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            <div className="scanline"></div>
            <div className="hologram-header">
              <Fingerprint size={24} />
              <span>ID: DRS-2024</span>
            </div>
            
            <div className="hologram-body" style={{ transform: "translateZ(30px)", display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div className="hologram-avatar">
                <img src="/profile.jpg" alt="Avatar" />
              </div>
              <div>
                <h3>Damar Restu Santoso</h3>
                <p>Aspiring Full-Stack Developer</p>
              </div>
            </div>
            
            <div className="hologram-barcode"></div>
            
            <div className="stats-container" style={{ transform: "translateZ(20px)" }}>
              <div className="stat-box"><Code2 size={20} /><h4>Frontend</h4></div>
              <div className="stat-box"><Database size={20} /><h4>Backend</h4></div>
              <div className="stat-box"><Cpu size={20} /><h4>Explorer</h4></div>
            </div>
          </motion.div>
        </Reveal>

        {/* KANAN: Terminal & Spotify */}
        <Reveal delay={0.2} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* TERMINAL YANG SUDAH DIISI DATA KAMU */}
          <div className="terminal-box">
            <div className="terminal-header"><Terminal size={14} /> <span>damar@galaxy:~</span></div>
            <div className="terminal-body">
              <p><span className="t-green"></span> <span className="t-blue">~</span> whoami</p>
              <p className="t-muted">Damar Restu Santoso [Full-Stack Developer]</p>
              
              <p><span className="t-green"></span> <span className="t-blue">~</span> cat core_stack.txt</p>
              <p className="t-muted">Frontend: React, HTML5, CSS3, JavaScript, Tailwind</p>
              <p className="t-muted">Backend : Node.js, Express, Python, PHP, Laravel</p>
              <p className="t-muted">Database: MongoDB, MySQL</p>
              
              <p><span className="t-green"></span> <span className="t-blue">~</span> cat mission.txt</p>
              <p className="t-muted">"To build impactful software that pushes boundaries and</p>
              <p className="t-muted">delivers seamless digital experiences."</p>
              
              <p><span className="t-green"></span> <span className="t-blue">~</span> status</p>
              <p className="t-muted">Available for opportunities<span className="blinking-cursor">_</span></p>
            </div>
          </div>

          {/* SPOTIFY PLAYER */}
          <div className="inline-spotify-box">
            <div className="spotify-box-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={14} className="text-green animate-pulse" />
                <span>SYS.AUDIO_STREAM // WHAT I LISTEN TO</span>
              </div>
            </div>
            <iframe 
              style={{ borderRadius: '0 0 8px 8px', display: 'block', width: '100%' }} 
              src="https://open.spotify.com/embed/playlist/51gr21AYB59aB1lO5n6eGC?utm_source=generator&theme=0" 
              height="380" 
              frameBorder="0" 
              allowFullScreen="" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </div>

        </Reveal>
      </div>
    </section>
  );
}