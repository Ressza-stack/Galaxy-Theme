import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Terminal, ShieldAlert } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try { await login(form.username, form.password); navigate('/admin'); }
    catch (err) { setError(err?.response?.data?.message || 'ACCESS DENIED. INVALID CREDENTIALS.'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="auth-page">
      <motion.div 
        className="hologram-card"
        initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <div className="scanline"></div>
        <div className="hologram-header">
          <Terminal size={18} />
          <span>SYSTEM_AUTHENTICATION.exe</span>
        </div>
        
        <form className="hologram-form" onSubmit={onSubmit}>
          <h1 className="hologram-title">RESTRICTED ACCESS</h1>
          <p className="hologram-subtitle">Identify yourself to access the command center.</p>
          
          <div className="form-field">
            <label>Admin ID</label>
            <input 
              value={form.username} 
              onChange={e => setForm({ ...form, username: e.target.value })} 
              placeholder="Enter ID" 
              className="hologram-input"
            />
          </div>
          <div className="form-field">
            <label>Security Key</label>
            <input 
              type="password" 
              value={form.password} 
              onChange={e => setForm({ ...form, password: e.target.value })} 
              placeholder="Enter Key" 
              className="hologram-input"
            />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="hologram-error">
              <ShieldAlert size={16} /> {error}
            </motion.div>
          )}

          <button className="btn btn-primary hologram-btn" type="submit" disabled={submitting}>
            {submitting ? 'AUTHENTICATING...' : 'INITIALIZE'}
          </button>
          
          <Link to="/" className="hologram-back">Return to Orbit (Home)</Link>
        </form>
      </motion.div>
    </div>
  );
}