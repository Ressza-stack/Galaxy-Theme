import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, GitFork, ExternalLink, Code2 } from 'lucide-react';

export default function GitHubProjects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const GITHUB_USERNAME = 'Ressza-stack';

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`)
      .then(res => res.json()).then(data => setRepos(data.filter(r => !r.fork))).finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="section">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="eyebrow">OPEN SOURCE</p>
        <h2 className="section-title">My GitHub Repositories.</h2>
      </motion.div>
      {loading && <p className="muted">Fetching repositories...</p>}
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
    </section>
  );
}