import { useState } from 'react';
import { Send, Mail, MapPin } from 'lucide-react';
import Reveal from '../components/Reveal';
import api from '../services/api';

const initial = { name: '', email: '', subject: '', message: '' };
export default function Contact() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await api.post('/messages', form); setForm(initial);
      setStatus({ type: 'success', text: 'Message received. Thank you!' });
    } catch (err) { setStatus({ type: 'error', text: 'Failed to send message.' }); }
    finally { setSubmitting(false); }
  };

  return (
    <section id="contact" className="section">
      <Reveal><p className="eyebrow">CONTACT</p><h2 className="section-title">Open Communication.</h2></Reveal>
      <div className="contact-layout">
        <Reveal delay={0.1} className="contact-info">
          <h3 className="contact-subtitle">Let's build something great together.</h3>
          <p className="muted">Currently open for freelance projects, collaborations, or just a friendly chat about tech.</p>
          <div className="info-items">
            <div className="info-item"><Mail size={20} /> <div><p className="info-label">Email</p><p className="info-value">damar@example.com</p></div></div>
            <div className="info-item"><MapPin size={20} /> <div><p className="info-label">Location</p><p className="info-value">Indonesia</p></div></div>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <form className="contact-form" onSubmit={onSubmit}>
            <div className="form-row">
              <div className="form-field"><label>Name</label><input name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="form-field"><label>Email</label><input name="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
            </div>
            <div className="form-field"><label>Subject</label><input name="subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} /></div>
            <div className="form-field"><label>Message</label><textarea name="message" rows="4" value={form.message} onChange={e => setForm({...form, message: e.target.value})}></textarea></div>
            {status.text && <div className={`form-status ${status.type}`}>{status.text}</div>}
            <button type="submit" className="btn btn-primary" disabled={submitting}><Send size={16} /> Send Transmission</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}