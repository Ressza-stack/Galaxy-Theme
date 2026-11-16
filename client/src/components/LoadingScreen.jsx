import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function LoadingScreen() {
  const canvasRef = useRef(null);
  const [isEating, setIsEating] = useState(false);

  useEffect(() => {
    // Waktu 3.2 detik sebelum meledak/menutup layar
    const timer = setTimeout(() => setIsEating(true), 3200);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;

    let particles = [];
    const particleCount = 250;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * (width / 2) + 100,
        speed: Math.random() * 0.02 + 0.01,
        size: Math.random() * 2 + 0.5,
        color: Math.random() > 0.5 ? '79, 142, 255' : '255, 255, 255' // Biru & Putih
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Trail effect
      ctx.fillRect(0, 0, width, height);

      // 1. Gambar Inti Lubang Hitam (Event Horizon) - Hitam Pekat
      ctx.beginPath();
      ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
      ctx.fillStyle = '#000000'; 
      ctx.fill();

      // 2. Gambar Cincin Cahaya (Photon Ring) yang berdenyut
      const pulse = Math.sin(Date.now() / 300) * 3; // Efek berdenyut
      ctx.beginPath();
      ctx.arc(centerX, centerY, 38 + pulse, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#4f8eff';
      ctx.stroke();
      
      // Reset shadow agar partikel tidak ikut menyala semua
      ctx.shadowBlur = 0; 

      // Animasi Partikel Tersedot
      particles.forEach((p, index) => {
        p.angle += p.speed;
        p.distance -= p.speed * 30; // Tersedot ke tengah

        // Jika sudah mencapai inti, reset ke pinggir
        if (p.distance < 40) {
          p.distance = Math.random() * (width / 2) + 100;
          p.angle = Math.random() * Math.PI * 2;
        }

        const x = centerX + Math.cos(p.angle) * p.distance;
        const y = centerY + Math.sin(p.angle) * p.distance;

        // Semakin dekat, semakin terang
        const opacity = Math.max(0, (p.distance / (width / 2)));
        
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <motion.div 
      className="loading-screen"
      initial={{ opacity: 1 }}
      animate={isEating ? { opacity: 0, transition: { duration: 1, delay: 1.2 } } : { opacity: 1 }}
    >
      <canvas ref={canvasRef} className="vortex-canvas" />
      
      <motion.div 
        className="loading-text-wrap"
        animate={isEating ? { scale: 0, opacity: 0, filter: "blur(10px)", y: -50 } : { scale: 1, opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.8, ease: "easeIn" }} 
      >
        <div className="typing-text">INITIALIZING GRAVITY WELL</div>
        <div className="loading-bar-container">
          <motion.div 
            className="loading-bar"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.2, ease: "linear" }} 
          />
        </div>
      </motion.div>
    </motion.div>
  );
}