import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/galaxy.css';

export default function GalaxyBackground() {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  // State untuk posisi kursor custom
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    // 1. Logika Tracking Mouse untuk Custom Cursor & Parallax
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      
      // Hitung posisi parallax (-0.5 sampai 0.5)
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });

      // Deteksi jika mouse berada di atas elemen interaktif
      const target = e.target;
      if (target.closest('a') || target.closest('button') || target.closest('input') || target.closest('textarea')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 2. Logika Canvas Bintang (Drifting & Twinkling)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height, stars = [], raf;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(350, Math.floor((width * height) / 7000)); 
      
      stars = Array.from({ length: count }).map(() => ({
        x: Math.random() * width, 
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.1, 
        a: Math.random() * 0.6 + 0.1, 
        tw: Math.random() * 0.02 + 0.005, 
        dir: Math.random() > 0.5 ? 1 : -1,
        speed: Math.random() * 0.3 + 0.05 // Kecepatan melayang ke bawah
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        // Animasi kelap-kelip
        s.a += s.tw * s.dir;
        if (s.a > 0.8) { s.a = 0.8; s.dir = -1; }
        if (s.a < 0.1) { s.a = 0.1; s.dir = 1; }
        
        // Animasi bintang bergerak turun perlahan
        if (!reduce) {
          s.y -= s.speed; 
          if (s.y < 0) s.y = height; // Reset ke bawah kalau sudah lewat atas
        }

        ctx.beginPath(); 
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.a})`; 
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    }

    resize(); draw();
    const onResize = () => { resize(); if (reduce) draw(); };
    window.addEventListener('resize', onResize);
    
    return () => { 
      cancelAnimationFrame(raf); 
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className="galaxy-bg" aria-hidden="true">
        {/* Black Hole dibungkus Framer Motion untuk Parallax */}
        <motion.div 
          className="black-hole-wrapper"
          animate={{ 
            x: mousePos.x * 60, 
            y: mousePos.y * 60 
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20, mass: 0.5 }}
        >
          <div className="black-hole-container">
            <div className="accretion-disk" />
            <div className="black-hole-core" />
          </div>
        </motion.div>
        
        <canvas ref={canvasRef} className="star-canvas" />
      </div>

      {/* Custom Cursor Element */}
      <div 
        className="cursor-dot" 
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }} 
      />
      <div 
        className={`cursor-ring ${isHovering ? 'hovering' : ''}`}
        style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }} 
      />
    </>
  );
}