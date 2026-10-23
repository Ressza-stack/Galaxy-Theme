import { useState } from 'react';
import { Send, Mail, MapPin, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import Reveal from '../components/Reveal';
import api from '../services/api';

const initial = { name: '', email: '', subject: '', message: '' };
export default function Contact() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const emailAddress = "damar@example.com";

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus({ type: 'error', text: 'Please complete every field.' }); return;
    }
    setSubmitting(true);
    try {
      await api.post('/messages', form);
      setForm(initial);
      setStatus({ type: 'success', text: 'Transmission received. I will get back to you shortly.' });
    } catch (err) {
      // Tangani error 429 (Too Many Requests / Rate Limit)
      if (err.response?.status === 429) {
        setStatus({ type: 'error', text: 'Batas pengiriman tercapai. Anda hanya bisa mengirim 3 pesan per 15 menit.' });
      } else {
        setStatus({ type: 'error', text: err?.response?.data?.message || 'Transmission failed. Please try again.' });
      }
    } finally { setSubmitting(false); }
  };

  return (
    <section id="contact" className="section">
      <Reveal>
        <p className="eyebrow">CONTACT</p>
        <h2 className="section-title">Open Communication.</h2>
      </Reveal>

      <div className="contact-layout">
        <Reveal delay={0.1} className="contact-info">
          <h3 className="contact-subtitle">Let's build something great together.</h3>
          <p className="muted">Currently open for freelance projects, collaborations, or just a friendly chat about tech.</p>
          
          <div className="info-items">
            <div className="info-item">
              <Mail size={20} className="info-icon" />
              <div>
                <p className="info-label">Email</p>
                <p className="info-value">{emailAddress}</p>
              </div>
              <button onClick={copyEmail} className="copy-btn" title="Copy Email">
                {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="info-item">
              <MapPin size={20} className="info-icon" />
              <div>
                <p className="info-label">Location</p>
                <p className="info-value">Indonesia</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="contact-form-wrapper">
          <form className="contact-form" onSubmit={onSubmit} noValidate>
            <div className="form-row">
              <div className="form-field">
                <label>Name</label>
                <input name="name" value={form.name} onChange={onChange} placeholder="Your name" />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={onChange} placeholder="you@email.com" />
              </div>
            </div>
            <div className="form-field">
              <label>Subject</label>
              <input name="subject" value={form.subject} onChange={onChange} placeholder="What is this regarding?" />
            </div>
            <div className="form-field">
              <label>Message</label>
              <textarea name="message" rows="4" value={form.message} onChange={onChange} placeholder="Write your message here..."></textarea>
            </div>
            
            {status.text && (
              <div className={`form-status ${status.type}`}>
                {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{status.text}</span>
              </div>
            )}
            
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Send size={16} /> {submitting ? 'Transmitting...' : 'Send Transmission'}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}