import { useState } from 'react';
import Reveal from '../components/Reveal';
import { Code2, Server, Database, Wrench, Globe, Smartphone, Terminal, Cpu, Layout, Layers, Box, Figma, GitBranch, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 24 Teknologi dibagi ke 4 Orbit
const techs = [
  // Orbit 1 (Radius 140px) - 6 items
  { name: 'React', icon: Globe, orbit: 1, angle: 0, color: '#61DAFB', desc: 'UI Library' },
  { name: 'JS', icon: Code2, orbit: 1, angle: 60, color: '#F7DF1E', desc: 'Language' },
  { name: 'HTML5', icon: Layout, orbit: 1, angle: 120, color: '#E34F26', desc: 'Markup' },
  { name: 'CSS3', icon: Layers, orbit: 1, angle: 180, color: '#264DE4', desc: 'Styling' },
  { name: 'Tailwind', icon: Cpu, orbit: 1, angle: 240, color: '#38BDF8', desc: 'CSS Framework' },
  { name: 'Next.js', icon: Box, orbit: 1, angle: 300, color: '#fff', desc: 'React Framework' },

  // Orbit 2 (Radius 240px) - 6 items
  { name: 'Node.js', icon: Server, orbit: 2, angle: 30, color: '#68A063', desc: 'Runtime' },
  { name: 'Express', icon: Terminal, orbit: 2, angle: 90, color: '#fff', desc: 'Backend Framework' },
  { name: 'Python', icon: Code2, orbit: 2, angle: 150, color: '#FFD43B', desc: 'Language' },
  { name: 'PHP', icon: Server, orbit: 2, angle: 210, color: '#777BB4', desc: 'Language' },
  { name: 'Laravel', icon: Terminal, orbit: 2, angle: 270, color: '#FF2D20', desc: 'PHP Framework' },
  { name: 'TypeScript', icon: Code2, orbit: 2, angle: 330, color: '#3178C6', desc: 'Language' },

  // Orbit 3 (Radius 340px) - 6 items
  { name: 'MongoDB', icon: Database, orbit: 3, angle: 0, color: '#4DB33D', desc: 'NoSQL Database' },
  { name: 'MySQL', icon: Database, orbit: 3, angle: 60, color: '#00758F', desc: 'SQL Database' },
  { name: 'Git', icon: GitBranch, orbit: 3, angle: 120, color: '#F1502F', desc: 'Version Control' },
  { name: 'GitHub', icon: Wrench, orbit: 3, angle: 180, color: '#fff', desc: 'Code Hosting' },
  { name: 'Docker', icon: Box, orbit: 3, angle: 240, color: '#2496ED', desc: 'Containerization' },
  { name: 'Postman', icon: Cloud, orbit: 3, angle: 300, color: '#FF6C37', desc: 'API Testing' },

  // Orbit 4 (Radius 440px) - 6 items
  { name: 'Redux', icon: Layers, orbit: 4, angle: 30, color: '#764ABC', desc: 'State Management' },
  { name: 'Figma', icon: Figma, orbit: 4, angle: 90, color: '#F24E1E', desc: 'UI/UX Design' },
  { name: 'Vite', icon: Cpu, orbit: 4, angle: 150, color: '#646CFF', desc: 'Build Tool' },
  { name: 'Firebase', icon: Cloud, orbit: 4, angle: 210, color: '#FFCA28', desc: 'BaaS' },
  { name: 'Prisma', icon: Database, orbit: 4, angle: 270, color: '#fff', desc: 'ORM' },
  { name: 'React Native', icon: Smartphone, orbit: 4, angle: 330, color: '#61DAFB', desc: 'Mobile Framework' },
];

export default function Skills() {
  const [hoveredTech, setHoveredTech] = useState(null);

  return (
    <section id="skills" className="section" style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <Reveal>
        <p className="eyebrow">SYSTEM CAPABILITIES</p>
        <h2 className="section-title">Orbital Tech Stack.</h2>
        <p className="section-sub">Hover over the nodes to scan the technology.</p>
      </Reveal>

      <div className="orbit-system" style={{ height: '1000px' }}>
        {/* Inti Tengah */}
        <div className="orbit-core">
          <span className="core-text">DAMAR</span>
        </div>

        {/* Garis Orbit (4 Ring) */}
        <div className="orbit-ring ring-1"></div>
        <div className="orbit-ring ring-2"></div>
        <div className="orbit-ring ring-3"></div>
        <div className="orbit-ring ring-4"></div>

        {/* Node Teknologi */}
        {techs.map((tech, i) => {
          const Icon = tech.icon;
          const radius = tech.orbit === 1 ? 140 : tech.orbit === 2 ? 240 : tech.orbit === 3 ? 340 : 440;
          const speed = tech.orbit === 1 ? '25s' : tech.orbit === 2 ? '35s' : tech.orbit === 3 ? '45s' : '60s';
          
          return (
            <div 
              key={i} 
              className="orbit-node-wrapper"
              style={{ '--angle': `${tech.angle}deg`, '--radius': `${radius}px`, '--speed': speed }}
            >
              <div 
                className="orbit-node"
                onMouseEnter={() => setHoveredTech(tech)}
                onMouseLeave={() => setHoveredTech(null)}
              >
                <div className="tech-icon-box" style={{ color: tech.color, borderColor: hoveredTech?.name === tech.name ? tech.color : 'rgba(255,255,255,0.1)' }}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}

        {/* Holographic HUD Panel (Muncul saat hover) */}
        <AnimatePresence>
          {hoveredTech && (
            <motion.div 
              className="hud-panel"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="hud-corner top-left"></div>
              <div className="hud-corner top-right"></div>
              <div className="hud-corner bottom-left"></div>
              <div className="hud-corner bottom-right"></div>
              
              <div className="hud-scanline"></div>
              
              <div className="hud-content">
                <h4 style={{ color: hoveredTech.color }}>{hoveredTech.name}</h4>
                <p className="hud-desc">{hoveredTech.desc}</p>
                <p className="hud-orbit">ORBIT: {hoveredTech.orbit}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}