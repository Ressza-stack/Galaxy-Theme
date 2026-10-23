import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try { await login(form.username, form.password); navigate('/admin'); }
    catch (err) { setError(err?.response?.data?.message || 'Login failed.'); }
    finally { setSubmitting(false); }
  };
  return (
    <div className="auth-page">
      <form className="card glass auth-card" onSubmit={onSubmit}>
        <h1 className="section-title">Admin Login</h1>
        <p className="muted">Sign in to manage the portfolio content.</p>
        <div className="form-field"><label htmlFor="username">Username</label>
          <input id="username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></div>
        <div className="form-field"><label htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign In'}</button>
      </form>
    </div>
  );
}
