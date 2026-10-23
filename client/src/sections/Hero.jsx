import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Magnetic from '../components/Magnetic';

export default function Hero() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const x = useMotionValue(0); const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 100, damping: 30 });
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const textX = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const textY = useTransform(springY, [-0.5, 0.5], [-20, 20]);

  return (
    <section id="home" className="section hero" onMouseMove={(e) => { x.set(e.clientX / window.innerWidth - 0.5); y.set(e.clientY / window.innerHeight - 0.5); }} onMouseLeave={() => { x.set(0); y.set(0); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', minHeight: '100vh', gap: '40px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ x: textX, y: textY, zIndex: 10 }}>
        <p className="eyebrow">WELCOME TO MY DIGITAL UNIVERSE</p>
        <h1 className="hero-title">Exploring the<br/>Universe of Code.</h1>
        <h2 className="hero-name">Damar Restu Santoso</h2>
        <p className="hero-desc">Aspiring Full-Stack Developer focused on building clean, scalable web and mobile applications.</p>
        <div className="hero-actions">
          <Magnetic><button className="btn btn-primary" onClick={() => scrollTo('projects')}>Explore My Work <ArrowRight size={16} /></button></Magnetic>
          <Magnetic><button className="btn btn-ghost" onClick={() => scrollTo('contact')}>Contact Me</button></Magnetic>
        </div>
      </motion.div>

      {/* CSS Orb Menggantikan Planet 3D */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.2 }} style={{ height: '500px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="css-planet">
          <div className="css-planet-ring"></div>
        </div>
      </motion.div>
    </section>
  );
}