import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Save, Mail, FolderKanban, ShieldAlert, Monitor } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const emptyProject = { title: '', description: '', tech: '', imageUrl: '', liveUrl: '', sourceUrl: '', order: 0 };
const emptyProfile = { name: '', role: '', bio: '', education: [], journey: [], socials: { github: '', linkedin: '', instagram: '' } };

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(emptyProfile);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState('');

  const loadAll = async () => {
    try {
      const [p, m, pr] = await Promise.all([api.get('/projects'), api.get('/messages'), api.get('/profile')]);
      setProjects(p.data.data);
      setMessages(m.data.data);
      setProfile({ ...emptyProfile, ...pr.data.data, socials: { ...emptyProfile.socials, ...(pr.data.data.socials || {}) } });
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadAll(); }, []);

  const onLogout = async () => { await logout(); navigate('/admin/login'); };

  const submitProject = async (e) => {
    e.preventDefault(); setFeedback('');
    const payload = { ...form, tech: form.tech.split(',').map(t => t.trim()).filter(Boolean), order: Number(form.order) || 0 };
    try {
      if (editingId) { await api.put(`/projects/${editingId}`, payload); setFeedback('Project updated.'); }
      else { await api.post('/projects', payload); setFeedback('Project created.'); }
      setForm(emptyProject); setEditingId(null); await loadAll();
    } catch (err) { setFeedback(err?.response?.data?.message || 'Failed to save project.'); }
  };

  const editProject = (p) => { setEditingId(p._id); setForm({ ...p, tech: (p.tech || []).join(', ') }); };
  const deleteProject = async (id) => { if (!window.confirm('Delete this project?')) return; await api.delete(`/projects/${id}`); await loadAll(); };
  
  const updateStatus = async (id, status) => { await api.patch(`/messages/${id}/status`, { status }); await loadAll(); };
  const deleteMessage = async (id) => { if (!window.confirm('Delete this message?')) return; await api.delete(`/messages/${id}`); await loadAll(); };
  
  const saveProfile = async () => {
    setFeedback('');
    try {
      await api.put('/profile', { name: profile.name, role: profile.role, bio: profile.bio, education: profile.education, journey: profile.journey, socials: profile.socials });
      setFeedback('Profile saved.'); await loadAll();
    } catch (err) { setFeedback(err?.response?.data?.message || 'Failed to save profile.'); }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div><p className="eyebrow">ADMIN DASHBOARD</p><h1 className="section-title">Welcome, {admin?.username}</h1></div>
        <button className="btn btn-ghost" onClick={onLogout}><LogOut size={16} /> Logout</button>
      </header>

      <div className="stats-grid">
        <div className="card glass stat-card"><FolderKanban size={20} /><p>Projects</p><strong>{projects.length}</strong></div>
        <div className="card glass stat-card"><Mail size={20} /><p>Messages</p><strong>{messages.length}</strong></div>
        <div className="card glass stat-card"><Mail size={20} /><p>Unread</p><strong>{messages.filter(m => m.status === 'unread').length}</strong></div>
      </div>

      <div className="admin-tabs">
        <button className={tab === 'projects' ? 'active' : ''} onClick={() => setTab('projects')}>Projects</button>
        <button className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>Messages</button>
        <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>Profile</button>
      </div>

      {feedback && <p className="form-status success">{feedback}</p>}

      {tab === 'projects' && (
        <div className="admin-section">
          {/* Form Project (Sama seperti sebelumnya) */}
          <form className="card glass admin-form" onSubmit={submitProject}>
            <h3 className="card-title">{editingId ? 'Edit Project' : 'New Project'}</h3>
            <div className="form-field"><label>Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="form-field"><label>Description</label><textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div className="form-field"><label>Tech (comma separated)</label><input value={form.tech} onChange={e => setForm({ ...form, tech: e.target.value })} /></div>
            <div className="form-row">
              <div className="form-field"><label>Image URL</label><input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} /></div>
              <div className="form-field"><label>Live URL</label><input value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} /></div>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" type="submit"><Save size={16} /> Save</button>
            </div>
          </form>
          <div className="admin-list">
            {projects.map(p => (
              <div key={p._id} className="card glass admin-item">
                <div><strong>{p.title}</strong><p className="muted">{p.description.slice(0, 120)}</p></div>
                <div className="admin-item-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => editProject(p)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteProject(p._id)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'messages' && (
        <div className="admin-list">
          {messages.length === 0 && <p className="muted">No messages yet.</p>}
          {messages.map(m => {
            // Deteksi Spam Sederhana
            const isSuspicious = m.userAgent?.includes('curl') || m.userAgent?.includes('python') || m.userAgent?.includes('bot');
            // Cek apakah ada lebih dari 3 pesan dengan IP yang sama
            const sameIpCount = messages.filter(msg => msg.ipAddress === m.ipAddress).length;
            const isSpamIp = sameIpCount >= 3;

            return (
              <div key={m._id} className="card glass admin-item" style={isSpamIp ? { borderColor: 'rgba(255, 85, 85, 0.5)' } : {}}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong>{m.subject}</strong>
                    {isSpamIp && <span className="badge badge-unread" style={{ background: '#ff5555', color: '#fff' }}><ShieldAlert size={12} style={{ display: 'inline', marginRight: '4px' }}/> SPAM IP</span>}
                    {isSuspicious && <span className="badge badge-read" style={{ background: '#ffaa00', color: '#000' }}>SUSPICIOUS BOT</span>}
                  </div>
                  <p className="muted" style={{ fontSize: '0.85rem' }}>
                    {m.name} &lt;{m.email}&gt; · {new Date(m.createdAt).toLocaleString()}
                  </p>
                  <p style={{ margin: '12px 0' }}>{m.message}</p>
                  
                  {/* Info Spam / IP */}
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: '#666', fontFamily: 'monospace', background: '#0a0a0a', padding: '8px', borderRadius: '4px' }}>
                    <span>IP: {m.ipAddress || 'Unknown'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Monitor size={12} /> {m.userAgent ? m.userAgent.substring(0, 50) + '...' : 'Unknown'}
                    </span>
                  </div>
                </div>
                <div className="admin-item-actions" style={{ marginLeft: '24px' }}>
                  <select value={m.status} onChange={e => updateStatus(m._id, e.target.value)}>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteMessage(m._id)}><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'profile' && (
        <div className="card glass admin-form">
          <h3 className="card-title">Profile</h3>
          <div className="form-field"><label>Name</label><input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /></div>
          <div className="form-field"><label>Role</label><input value={profile.role} onChange={e => setProfile({ ...profile, role: e.target.value })} /></div>
          <div className="form-field"><label>Bio</label><textarea rows="4" value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} /></div>
          <div className="form-row">
            <div className="form-field"><label>GitHub URL</label><input value={profile.socials.github} onChange={e => setProfile({ ...profile, socials: { ...profile.socials, github: e.target.value } })} /></div>
            <div className="form-field"><label>LinkedIn URL</label><input value={profile.socials.linkedin} onChange={e => setProfile({ ...profile, socials: { ...profile.socials, linkedin: e.target.value } })} /></div>
          </div>
          <button className="btn btn-primary" onClick={saveProfile}><Save size={16} /> Save Profile</button>
        </div>
      )}
    </div>
  );
}