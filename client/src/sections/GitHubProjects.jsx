import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, GitFork, Code2, Database, Activity, AlertTriangle } from 'lucide-react';

export default function GitHubProjects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState({ repos: 0, stars: 0, forks: 0, lang: '...' });
  const GITHUB_USERNAME = 'Ressza-stack';

  useEffect(() => {
    // 1. Cek Cache di localStorage dulu
    const cachedData = localStorage.getItem('github_portfolio_cache');
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setRepos(parsed.repos);
        setStats(parsed.stats);
        setLoading(false);
      } catch (e) { console.error("Cache error"); }
    }

    // 2. Fetch data terbaru dari GitHub API
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`)
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error('Invalid Data');
        
        const filtered = data.filter(r => !r.fork);
        setRepos(filtered);
        setError(false);
        
        let stars = 0;
        let forks = 0;
        const langs = {};
        
        filtered.forEach(repo => {
          stars += repo.stargazers_count;
          forks += repo.forks_count;
          if (repo.language) {
            langs[repo.language] = (langs[repo.language] || 0) + 1;
          }
        });

        let topLang = 'N/A';
        let max = 0;
        for (const [lang, count] of Object.entries(langs)) {
          if (count > max) { max = count; topLang = lang; }
        }

        const newStats = { repos: filtered.length, stars, forks, lang: topLang };
        setStats(newStats);

        // 3. Simpan data yang berhasil ke Cache
        localStorage.setItem('github_portfolio_cache', JSON.stringify({ repos: filtered, stats: newStats }));
      })
      .catch(err => {
        console.error(err);
        // Jika fetch gagal TAPI tidak ada cache, baru tampilkan error
        if (!cachedData) setError(true); 
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="section">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="eyebrow">OPEN SOURCE</p>
        <h2 className="section-title">My GitHub Repositories.</h2>
      </motion.div>

      {loading && <p className="muted">Fetching data from GitHub API...</p>}

      {!loading && error && (
        <motion.div className="github-error-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AlertTriangle size={24} color="#ffaa00" />
          <div>
            <h3>SYSTEM ALERT: GITHUB API RATE LIMIT</h3>
            <p>Terlalu banyak refresh dalam waktu singkat. Silakan tunggu 1 jam atau buka via VPN.</p>
            <a href="https://github.com/Ressza-stack" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ marginTop: '12px' }}>
              <Github size={14} /> Kunjungi Profil GitHub Langsung
            </a>
          </div>
        </motion.div>
      )}

      {!loading && !error && (
        <>
          <motion.div className="github-stats-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="stats-header">
              <Activity size={14} className="text-green" />
              <span>LIVE_GITHUB_TELEMETRY</span>
              <span className="stats-status">SYNCED</span>
            </div>
            <div className="stats-grid">
              <div className="g-stat-box"><Database size={20} className="g-icon" /><p>REPOSITORIES</p><h4>{stats.repos}</h4></div>
              <div className="g-stat-box"><Star size={20} className="g-icon" /><p>TOTAL STARS</p><h4>{stats.stars}</h4></div>
              <div className="g-stat-box"><GitFork size={20} className="g-icon" /><p>TOTAL FORKS</p><h4>{stats.forks}</h4></div>
              <div className="g-stat-box"><Code2 size={20} className="g-icon" /><p>TOP LANGUAGE</p><h4>{stats.lang}</h4></div>
            </div>
          </motion.div>

          <div className="projects-grid" style={{ marginTop: '40px' }}>
            {repos.map((repo, i) => (
              <motion.div key={repo.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <article className="card glass project-card" style={{ height: '100%' }}>
                  <div className="project-body" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <Github size={20} className="text-white" />
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>{repo.name}</h3>
                    </div>
                    <p className="project-desc" style={{ color: '#888', flex: 1 }}>{repo.description || 'No description provided.'}</p>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#666', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                      {repo.language && <span><Code2 size={14} /> {repo.language}</span>}
                      <span><Star size={14} /> {repo.stargazers_count}</span>
                      <span><GitFork size={14} /> {repo.forks_count}</span>
                    </div>
                    <div className="project-actions" style={{ marginTop: '16px' }}>
                      <a href={repo.html_url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}><Github size={14} /> View Source</a>
                    </div>
                  </div>
                </article>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}