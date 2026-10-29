import { useState } from 'react';
import { Send, Mail, MapPin, Copy, Check, Github, Linkedin, Instagram, MessageCircle } from 'lucide-react';
import Reveal from '../components/Reveal';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const initial = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isUplink, setIsUplink] = useState(false); // State untuk animasi laser
  
  const emailAddress = "santosodamarrestu@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    setStatus({ type: '', text: '' });
    try {
      await api.post('/messages', form); 
      setForm(initial);
      setStatus({ type: 'success', text: '[SYS.LOG]: TRANSMISSION UPLOADED SUCCESSFULLY.' });
      setIsUplink(true);
      setTimeout(() => setIsUplink(false), 2500); // Reset animasi setelah 2.5 detik
    } catch (err) { 
      setStatus({ type: 'error', text: '[SYS.ERROR]: TRANSMISSION FAILED. RETRY.' }); 
    }
    finally { setSubmitting(false); }
  };

  const socials = [
    { name: 'GitHub', icon: Github, url: 'https://github.com/Ressza-stack' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/damar-restu-santoso-127a02413/' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/Ressza10' },
    { name: 'Discord', icon: MessageCircle, url: 'https://discord.com/users/1404321789001076806' },
  ];

  return (
    <section id="contact" className="section">
      <Reveal><p className="eyebrow">CONTACT</p><h2 className="section-title">Open Communication.</h2></Reveal>
      <div className="contact-layout">
        <Reveal delay={0.1} className="contact-info">
          <h3 className="contact-subtitle">Let's build something great together.</h3>
          <p className="muted" style={{ marginBottom: '30px' }}>Currently open for freelance projects, collaborations, or just a friendly chat about tech.</p>
          
          <div className="info-items">
            <div className="info-item">
              <Mail size={20} className="info-icon" />
              <div style={{ flex: 1 }}>
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

          <div className="comm-links-panel">
            <p className="comm-links-title">CONNECT VIA SECURE CHANNELS</p>
            <div className="social-links-grid">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a 
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="social-btn"
                    whileHover={{ y: -5, borderColor: '#4f8eff', boxShadow: '0 0 20px rgba(79,142,255,0.2)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={22} />
                    <span>{social.name}</span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          {/* Wrapper animasi uplink */}
          <div className="contact-form-wrapper">
            {/* Laser Beam Animation */}
            <AnimatePresence>
              {isUplink && (
                <motion.div 
                  className="uplink-laser"
                  initial={{ height: 0, opacity: 1 }}
                  animate={{ height: '100vh', opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>

            <form className="contact-form" onSubmit={onSubmit}>
              <div className="form-row">
                <div className="form-field"><label>Name</label><input name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div className="form-field"><label>Email</label><input name="email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
              </div>
              <div className="form-field"><label>Subject</label><input name="subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required /></div>
              <div className="form-field"><label>Message</label><textarea name="message" rows="4" value={form.message} onChange={e => setForm({...form, message: e.target.value})} required></textarea></div>
              
              {status.text && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className={`form-status ${status.type}`}
                >
                  {status.text}
                </motion.div>
              )}

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <Send size={16} /> {submitting ? 'TRANSMITTING...' : 'SEND TRANSMISSION'}
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}