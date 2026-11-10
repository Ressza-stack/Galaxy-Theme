import Reveal from '../components/Reveal';
import { Terminal, Code2, Database, Cpu, Fingerprint, Radio } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function About({ profile }) {
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
        {/* Glitch dihapus, diganti animasi minimalis yang smooth */}
        <motion.h2 
          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="section-title"
        >
          A developer in orbit.
        </motion.h2>
      </Reveal>
      
      <div className="about-layout">
        {/* KIRI: Holographic ID Card (Tidak diubah) */}
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
                <h3>{profile?.name || 'Damar Restu Santoso'}</h3>
                <p>{profile?.role || 'Aspiring Full-Stack Developer'}</p>
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

        {/* KANAN: Terminal (Teks Diperbarui) & Spotify */}
        <Reveal delay={0.2} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="terminal-box">
            <div className="terminal-header"><Terminal size={14} /> <span>damar@galaxy:~</span></div>
            <div className="terminal-body">
              <p><span className="t-green">&gt;</span> <span className="t-blue">~</span> whoami</p>
              <p className="t-muted" style={{ marginBottom: '16px' }}>Damar Restu Santoso [Full-Stack Developer]</p>
              
              <p><span className="t-green">&gt;</span> <span className="t-blue">~</span> cat about_me.txt</p>
              <p className="t-muted" style={{ marginBottom: '16px', lineHeight: '1.6' }}>
                I am an aspiring developer passionate about building clean, scalable web applications. 
                I specialize in bridging elegant frontend design with robust backend architecture.
              </p>
              
              <p><span className="t-green">&gt;</span> <span className="t-blue">~</span> cat mission.txt</p>
              <p className="t-muted" style={{ marginBottom: '16px', lineHeight: '1.6' }}>
                "To craft seamless digital experiences that solve real-world problems."
              </p>
              
              <p><span className="t-green">&gt;</span> <span className="t-blue">~</span> status --availability</p>
              <p className="t-muted">Open for freelance & collaborations<span className="blinking-cursor">_</span></p>
            </div>
          </div>

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