import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Orbit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'game', label: 'Play Game' },
  { id: 'contact', label: 'Contact' }
];

// Fungsi Custom Scroll (Lebih Halus dari Native Browser)
const smoothScrollTo = (targetY, duration = 1200) => {
  const startY = window.scrollY;
  const difference = targetY - startY;
  let startTime = null;

  // Kurva kecepatan: Mulai lambat -> Ngebut di tengah -> Melambat di akhir
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const step = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const progress = (currentTime - startTime) / duration;

    if (progress < 1) {
      window.scrollTo(0, startY + difference * easeInOutCubic(progress));
      requestAnimationFrame(step);
    } else {
      window.scrollTo(0, targetY); // Pastikan berhenti tepat di target
    }
  };
  requestAnimationFrame(step);
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll); onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    links.forEach((l) => { const el = document.getElementById(l.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [location.pathname]);

  const goTo = (id) => {
    setOpen(false);
    if (location.pathname !== '/') { window.location.href = `/#${id}`; return; }
    
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Jarak dari atas layar
      const targetY = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      // Panggil fungsi custom scroll
      smoothScrollTo(targetY, 1200); 
    }
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => goTo('home')}>
          <span className="brand-logo"><Orbit size={20} /></span>
          <span className="brand-name">Damar Restu Santoso</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="nav-links">
          {links.map((l) => (
            <button 
              key={l.id} 
              className={`nav-link ${active === l.id ? 'active' : ''}`} 
              onClick={() => goTo(l.id)}
              style={{ position: 'relative' }}
            >
              {/* Animasi Sliding Background */}
              {active === l.id && (
                <motion.div
                  layoutId="nav-pill"
                  className="nav-pill"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>{l.label}</span>
            </button>
          ))}
        </nav>

        {/* MOBILE TOGGLE BUTTON */}
        <button className="nav-toggle" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <AnimatePresence>
        {open && (
          <motion.nav 
            className="mobile-nav"
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {links.map((l) => (
              <button 
                key={l.id} 
                className={`nav-link-mobile ${active === l.id ? 'active' : ''}`} 
                onClick={() => goTo(l.id)}
              >
                {l.label}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}