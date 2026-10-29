import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2, Save, Mail, FolderKanban, ShieldAlert, Monitor, Hexagon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import api from '../services/api';

const emptyProfile = { name: '', role: '', bio: '', education: [], journey: [], socials: { github: '', linkedin: '', instagram: '' } };

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(emptyProfile);
  const [feedback, setFeedback] = useState('');

  const loadAll = async () => {
    try {
      const [m, pr] = await Promise.all([api.get('/messages'), api.get('/profile')]);
      setMessages(m.data.data);
      setProfile({ ...emptyProfile, ...pr.data.data, socials: { ...emptyProfile.socials, ...(pr.data.data.socials || {}) } });
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadAll(); }, []);

  const onLogout = async () => { await logout(); navigate('/admin/login'); };
  
  const updateStatus = async (id, status) => { await api.patch(`/messages/${id}/status`, { status }); await loadAll(); };
  const deleteMessage = async (id) => { if (!window.confirm('Delete this transmission?')) return; await api.delete(`/messages/${id}`); await loadAll(); };
  
  const saveProfile = async () => {
    setFeedback('');
    try {
      await api.put('/profile', { name: profile.name, role: profile.role, bio: profile.bio, socials: profile.socials });
      setFeedback('PROFILE DATA SAVED SUCCESSFULLY.'); await loadAll();
    } catch (err) { setFeedback('ERROR: FAILED TO SAVE DATA.'); }
  };

  return (
    <div className="admin-page">
      <motion.header className="admin-header" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div>
          <p className="eyebrow" style={{ color: '#4ade80' }}>COMMAND CENTER</p>
          <h1 className="section-title">Welcome, {admin?.username}</h1>
        </div>
        <button className="btn btn-ghost" onClick={onLogout} style={{ borderColor: '#ff5555', color: '#ff5555' }}>
          <LogOut size={16} /> TERMINATE SESSION
        </button>
      </motion.header>

      <div className="stats-grid">
        <motion.div className="stat-card" whileHover={{ y: -5 }}>
          <FolderKanban size={24} className="stat-icon" />
          <p>ACTIVE MODULES</p><strong>02</strong>
        </motion.div>
        <motion.div className="stat-card" whileHover={{ y: -5 }}>
          <Mail size={24} className="stat-icon" />
          <p>TOTAL TRANSMISSIONS</p><strong>{messages.length}</strong>
        </motion.div>
        <motion.div className="stat-card" whileHover={{ y: -5 }}>
          <ShieldAlert size={24} className="stat-icon" style={{ color: '#ff5555' }} />
          <p>UNREAD ALERTS</p><strong>{messages.filter(m => m.status === 'unread').length}</strong>
        </motion.div>
      </div>

      <div className="admin-tabs">
        <button className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>TRANSMISSIONS</button>
        <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>SYSTEM PROFILE</button>
      </div>

      {feedback && <p className="form-status success" style={{ fontFamily: 'monospace' }}>{feedback}</p>}

      {tab === 'messages' && (
        <div className="admin-list">
          {messages.length === 0 && <p className="muted">NO TRANSMISSIONS LOGGED.</p>}
          {messages.map(m => {
            const isSuspicious = m.userAgent?.includes('curl') || m.userAgent?.includes('python') || m.userAgent?.includes('bot');
            const sameIpCount = messages.filter(msg => msg.ipAddress === m.ipAddress).length;
            const isSpamIp = sameIpCount >= 3;

            return (
              <motion.div key={m._id} className="admin-item" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={isSpamIp ? { borderColor: 'rgba(255, 85, 85, 0.5)' } : {}}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span className="badge" style={{ background: isSpamIp ? '#ff5555' : '#222', color: '#fff' }}>{m.status}</span>
                    <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{m.subject}</strong>
                    {isSpamIp && <span className="badge" style={{ background: '#ff5555', color: '#fff' }}>SPAM IP</span>}
                  </div>
                  <p style={{ color: '#888', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: '12px' }}>
                    FROM: {m.name} &lt;{m.email}&gt; | TIME: {new Date(m.createdAt).toLocaleString()}
                  </p>
                  <p style={{ color: '#ddd', marginBottom: '16px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', borderLeft: '2px solid #4f8eff' }}>
                    {m.message}
                  </p>
                  <div className="admin-meta">
                    <span>IP: {m.ipAddress || 'Unknown'}</span>
                    <span><Monitor size={12} /> {m.userAgent ? m.userAgent.substring(0, 50) + '...' : 'Unknown'}</span>
                  </div>
                </div>
                <div className="admin-item-actions">
                  <select value={m.status} onChange={e => updateStatus(m._id, e.target.value)}>
                    <option value="unread">UNREAD</option>
                    <option value="read">READ</option>
                    <option value="archived">ARCHIVED</option>
                  </select>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteMessage(m._id)}><Trash2 size={14} /></button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {tab === 'profile' && (
        <motion.div className="admin-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="form-field"><label>Display Name</label><input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /></div>
          <div className="form-field"><label>Role / Status</label><input value={profile.role} onChange={e => setProfile({ ...profile, role: e.target.value })} /></div>
          <div className="form-field"><label>System Bio</label><textarea rows="4" value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} /></div>
          <div className="form-row">
            <div className="form-field"><label>GitHub Link</label><input value={profile.socials.github} onChange={e => setProfile({ ...profile, socials: { ...profile.socials, github: e.target.value } })} /></div>
            <div className="form-field"><label>LinkedIn Link</label><input value={profile.socials.linkedin} onChange={e => setProfile({ ...profile, socials: { ...profile.socials, linkedin: e.target.value } })} /></div>
          </div>
          <button className="btn btn-primary" onClick={saveProfile}><Save size={16} /> UPDATE SYSTEM DATA</button>
        </motion.div>
      )}
    </div>
  );
}