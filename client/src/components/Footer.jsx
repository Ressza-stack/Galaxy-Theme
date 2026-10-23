import { Github, Linkedin, Instagram } from 'lucide-react';
export default function Footer({ profile }) {
  const year = new Date().getFullYear();
  const s = profile?.socials || {};
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-slogan">Exploring the universe of code, one project at a time.</p>
        <div className="footer-socials">
          {s.github && <a href={s.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>}
          {s.linkedin && <a href={s.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>}
          {s.instagram && <a href={s.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={18} /></a>}
        </div>
        <p className="footer-copy">© {year} Damar Restu Santoso. All rights reserved.</p>
      </div>
    </footer>
  );
}
