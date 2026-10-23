import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="section hero">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        style={{ maxWidth: '800px' }}
      >
        <p className="eyebrow">WELCOME TO MY DIGITAL UNIVERSE</p>
        <h1 className="hero-title">Exploring the<br/>Universe of Code.</h1>
        <h2 className="hero-name">Damar Restu Santoso</h2>
        <p className="hero-desc">
          Aspiring Full-Stack Developer focused on building clean, scalable web and mobile applications
          across the frontend, backend, and database layers.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => scrollTo('projects')}>
            Explore My Work <ArrowRight size={16} />
          </button>
          <button className="btn btn-ghost" onClick={() => scrollTo('contact')}>
            Contact Me
          </button>
        </div>
      </motion.div>
    </section>
  );
}