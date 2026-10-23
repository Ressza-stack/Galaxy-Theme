import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Star, GitFork, ExternalLink, Code2 } from 'lucide-react';

// Animasi Tabrakan (Sama seperti sebelumnya)
const CosmicCollision = () => {
  const [phase, setPhase] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase(1);
          setTimeout(() => setPhase(2), 1000);
          setTimeout(() => setPhase(3), 1300);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const debris = Array.from({ length: 35 }).map((_, i) => {
    const angle = (Math.random() * 360) * (Math.PI / 180);
    const distance = 80 + Math.random() * 250;
    return { id: i, x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, size: 4 + Math.random() * 12, rotation: Math.random() * 720 - 360, duration: 0.8 + Math.random() * 0.5, floatDuration: 3 + Math.random() * 4 };
  });

  return (
    <motion.div 
      className="collision-wrapper" ref={containerRef}
      animate={phase === 2 ? { x: [0, -10, 10, -10, 10, 0], y: [0, 5, -5, 5, -5, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {phase === 1 && (
          <>
            <motion.div key="sun" className="planet-sun" initial={{ x: -600, opacity: 0, scale: 0.8, rotate: 0 }} animate={{ x: 0, opacity: 1, scale: 1, rotate: 180 }} exit={{ opacity: 0, scale: 2 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
            <motion.div key="saturn" className="planet-saturn" initial={{ x: 600, opacity: 0, scale: 0.8, rotate: 0 }} animate={{ x: 0, opacity: 1, scale: 1, rotate: -180 }} exit={{ opacity: 0, scale: 2 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
              <div className="saturn-ring" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {phase >= 2 && (
        <>
          <motion.div className="explosion-flash" initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.5, 3], opacity: [1, 1, 0] }} transition={{ duration: 1.2, ease: "easeOut" }} />
          <motion.div className="explosion-ring" initial={{ scale: 0, opacity: 1 }} animate={{ scale: 4, opacity: 0 }} transition={{ duration: 1, ease: "easeOut" }} />
        </>
      )}
      {phase === 3 && debris.map((p) => (
        <motion.div key={p.id} className="explosion-debris-wrapper" style={{ left: '50%', top: '50%', marginLeft: -(p.size/2), marginTop: -(p.size/2) }} initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: p.x, y: p.y, opacity: 1 }} transition={{ duration: p.duration, ease: "easeOut" }}>
          <motion.div className="explosion-debris" style={{ width: p.size, height: p.size }} animate={{ rotate: p.rotation, y: [0, -15, 0], x: [0, Math.random() * 10 - 5, 0] }} transition={{ rotate: { duration: p.duration, ease: "easeOut" }, y: { duration: p.floatDuration, repeat: Infinity, ease: "easeInOut" }, x: { duration: p.floatDuration * 1.5, repeat: Infinity, ease: "easeInOut" } }} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default function GitHubProjects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reveal, setReveal] = useState(false);
  const sectionRef = useRef(null);
  const GITHUB_USERNAME = 'Ressza-stack';

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`)
      .then(res => {
        if (!res.ok) throw new Error('Gagal mengambil data dari GitHub');
        return res.json();
      })
      .then(data => {
        // Filter agar tidak menampilkan repo fork (opsional) dan urutkan berdasarkan bintang
        const filteredRepos = data.filter(repo => !repo.fork).sort((a, b) => b.stargazers_count - a.stargazers_count);
        setRepos(filteredRepos);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReveal(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="section" ref={sectionRef}>
      <CosmicCollision />
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={reveal ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 1.5 }}>
        <p className="eyebrow">OPEN SOURCE</p>
        <h2 className="section-title">My GitHub Repositories.</h2>
      </motion.div>

      {loading && <p className="muted">Fetching repositories from GitHub...</p>}
      {error && <p className="form-status error">Gagal memuat repositori: {error}</p>}

      <div className="projects-grid">
        {repos.map((repo, i) => (
          <motion.div key={repo.id} initial={{ opacity: 0, y: 40 }} animate={reveal ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 1.8 + (i * 0.1) }}>
            <article className="card glass project-card">
              <div className="project-body" style={{ paddingTop: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <Github size={20} className="text-white" />
                  <h3 style={{ margin: 0 }}>{repo.name}</h3>
                </div>
                <p className="project-desc">{repo.description || 'No description provided.'}</p>
                
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  {repo.language && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Code2 size={14} /> {repo.language}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} /> {repo.stargazers_count}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <GitFork size={14} /> {repo.forks_count}
                  </span>
                </div>

                <div className="project-actions">
                  <a href={repo.html_url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                    <Github size={14} /> Source Code
                  </a>
                  {repo.homepage && (
                    <a href={repo.homepage} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          </motion.div>
        ))}
      </div>
    </section>
  );
}