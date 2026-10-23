import Reveal from '../components/Reveal';
import { Code2, Server, Database, Wrench, Globe, Smartphone, Terminal } from 'lucide-react';

const techs = [
  // Orbit 1 (Radius 120px)
  { name: 'React', icon: Globe, orbit: 1, angle: 0, color: '#61DAFB' },
  { name: 'Node', icon: Server, orbit: 1, angle: 90, color: '#68A063' },
  { name: 'MongoDB', icon: Database, orbit: 1, angle: 180, color: '#4DB33D' },
  { name: 'Git', icon: Code2, orbit: 1, angle: 270, color: '#F1502F' },
  
  // Orbit 2 (Radius 200px)
  { name: 'Express', icon: Terminal, orbit: 2, angle: 45, color: '#fff' },
  { name: 'Python', icon: Code2, orbit: 2, angle: 135, color: '#FFD43B' },
  { name: 'MySQL', icon: Database, orbit: 2, angle: 225, color: '#00758F' },
  { name: 'GitHub', icon: Wrench, orbit: 2, angle: 315, color: '#fff' },

  // Orbit 3 (Radius 280px)
  { name: 'JS', icon: Code2, orbit: 3, angle: 22, color: '#F7DF1E' },
  { name: 'HTML', icon: Globe, orbit: 3, angle: 88, color: '#E34F26' },
  { name: 'CSS', icon: Globe, orbit: 3, angle: 154, color: '#264DE4' },
  { name: 'PHP', icon: Server, orbit: 3, angle: 202, color: '#777BB4' },
  { name: 'Laravel', icon: Terminal, orbit: 3, angle: 250, color: '#FF2D20' },
  { name: 'React Native', icon: Smartphone, orbit: 3, angle: 298, color: '#61DAFB' },
];

export default function Skills() {
  return (
    <section id="skills" className="section">
      <Reveal>
        <p className="eyebrow">SYSTEM CAPABILITIES</p>
        <h2 className="section-title">Orbital Tech Stack.</h2>
        <p className="section-sub">Teknologi yang mengorbit di sekitar inti keahlian saya.</p>
      </Reveal>

      <div className="orbit-system">
        {/* Inti Tengah */}
        <div className="orbit-core">
          <Code2 size={40} />
        </div>

        {/* Garis Orbit */}
        <div className="orbit-ring ring-1"></div>
        <div className="orbit-ring ring-2"></div>
        <div className="orbit-ring ring-3"></div>

        {/* Node Teknologi */}
        {techs.map((tech, i) => {
          const Icon = tech.icon;
          const radius = tech.orbit === 1 ? 120 : tech.orbit === 2 ? 200 : 280;
          const speed = tech.orbit === 1 ? '20s' : tech.orbit === 2 ? '30s' : '40s';
          
          return (
            <div 
              key={i} 
              className="orbit-node-wrapper"
              style={{ 
                '--angle': `${tech.angle}deg`, 
                '--radius': `${radius}px`,
                '--speed': speed,
                '--orbit': tech.orbit
              }}
            >
              <div className="orbit-node">
                <div className="tech-icon-box" style={{ color: tech.color }}>
                  <Icon size={20} />
                </div>
                <span className="tech-name">{tech.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}