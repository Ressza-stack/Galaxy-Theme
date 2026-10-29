import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Magnetic from '../components/Magnetic';
import WaveText from '../components/WaveText';
import Typewriter from '../components/Typewriter';

export default function Hero() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  
  // Parallax Text
  const textX = useMotionValue(0);
  const textY = useMotionValue(0);
  const springTextX = useSpring(textX, { stiffness: 100, damping: 30 });
  const springTextY = useSpring(textY, { stiffness: 100, damping: 30 });
  const moveTextX = useTransform(springTextX, [-0.5, 0.5], [-15, 15]);
  const moveTextY = useTransform(springTextY, [-0.5, 0.5], [-15, 15]);

  // 3D Tilt Image
  const imageRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-15deg", "15deg"]);
  const glareX = useTransform(springX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(springY, [-0.5, 0.5], ["0%", "100%"]);

  const handleGlobalMouseMove = (e) => {
    textX.set(e.clientX / window.innerWidth - 0.5);
    textY.set(e.clientY / window.innerHeight - 0.5);
  };

  const handleImageMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleImageMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section id="home" className="section hero" onMouseMove={handleGlobalMouseMove} onMouseLeave={() => { textX.set(0); textY.set(0); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', minHeight: '100vh', gap: '40px' }}>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ x: moveTextX, y: moveTextY, zIndex: 10 }}>
        <p className="eyebrow">WELCOME TO MY DIGITAL UNIVERSE</p>
        <WaveText text="DAMAR" className="hero-title" />
        <WaveText text="RESTU SANTOSO" className="hero-name" />
        <p className="hero-desc" style={{ fontSize: "1.2rem", color: "#fff", fontWeight: "500" }}>
          <Typewriter words={["Aspiring Full-Stack Developer", "React & Node.js Enthusiast", "UI/UX Explorer", "Problem Solver"]} />
        </p>
        <p className="hero-desc" style={{ marginTop: "8px" }}>Focused on building clean, scalable web and mobile applications.</p>
        <div className="hero-actions">
          <Magnetic><button className="btn btn-primary" onClick={() => scrollTo('projects')}>Explore My Work <ArrowRight size={16} /></button></Magnetic>
          <Magnetic><button className="btn btn-ghost" onClick={() => scrollTo('contact')}>Contact Me</button></Magnetic>
        </div>
      </motion.div>

      {/* Image Wrapper untuk Parallax Container */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.2 }} style={{ height: '500px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', perspective: '1000px' }}>
        
        {/* 3D Interactive Image */}
        <motion.div 
          ref={imageRef}
          onMouseMove={handleImageMouseMove}
          onMouseLeave={handleImageMouseLeave}
          className="hero-image-container"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          {/* Glare / Kilauan Cahaya */}
          <motion.div className="hero-image-glare" style={{ left: glareX, top: glareY }} />
          
          <img src="/profile.jpg" alt="Damar Restu Santoso" className="hero-image" />
        </motion.div>
        
      </motion.div>
    </section>
  );
}