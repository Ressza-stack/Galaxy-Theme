import Reveal from '../components/Reveal';
import { Monitor, Server, Database, Settings } from 'lucide-react';

const groups = [
  { title: 'Frontend', icon: Monitor, items: ['HTML5', 'CSS3', 'JavaScript', 'React.js'] },
  { title: 'Backend', icon: Server, items: ['Node.js', 'Express.js', 'Python', 'PHP', 'Laravel'] },
  { title: 'Database', icon: Database, items: ['MongoDB', 'MySQL'] },
  { title: 'Tools & Mobile', icon: Settings, items: ['Git', 'GitHub', 'VS Code', 'React Native'] }
];

export default function Skills() {
  return (
    <section id="skills" className="section">
      <Reveal>
        <p className="eyebrow">TECH STACK</p>
        <h2 className="section-title">System Capabilities.</h2>
        <p className="section-sub">Technologies and tools I use to construct digital experiences.</p>
      </Reveal>
      
      <div className="skills-grid-v2">
        {groups.map((g, i) => {
          const Icon = g.icon;
          return (
            <Reveal key={g.title} delay={0.1 * i}>
              <div className="tech-card">
                <div className="tech-header">
                  <Icon size={24} className="tech-icon" />
                  <h3>{g.title}</h3>
                </div>
                <div className="tech-list">
                  {g.items.map(item => (
                    <div key={item} className="tech-item">
                      <span className="tech-dot"></span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}