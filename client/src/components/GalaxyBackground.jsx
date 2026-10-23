import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import '../styles/galaxy.css';

export default function GalaxyBackground() {
  const canvasRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isGrabbed, setIsGrabbed] = useState(false); // State saat black hole dipegang

  // Posisi awal Black Hole (Kanan Atas)
  const defaultX = typeof window !== 'undefined' ? window.innerWidth * 0.75 : 800;
  const defaultY = typeof window !== 'undefined' ? window.innerHeight * 0.25 : 200;

  // Gunakan useMotionValue & useSpring untuk pergerakan yang sangat halus (tidak kaku)
  const bhX = useMotionValue(defaultX);
  const bhY = useMotionValue(defaultY);
  const springConfig = { stiffness: 40, damping: 20, mass: 1 };
  const springX = useSpring(bhX, springConfig);
  const springY = useSpring(bhY, springConfig);

  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);

    // 1. Logika Tracking Mouse
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      
      // Jika sedang di-grab, ikuti kursor
      if (isGrabbed) {
        bhX.set(e.clientX);
        bhY.set(e.clientY);
      }

      const target = e.target;
      if (target.closest('a') || target.closest('button') || target.closest('input') || target.closest('textarea')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    // 2. Logika Klik (Grab / Release)
    const handleClick = (e) => {
      // Cek apakah klik terjadi di dekat area Black Hole (jarak < 200px dari pusat)
      const currentBx = springX.get();
      const currentBy = springY.get();
      const dist = Math.hypot(e.clientX - currentBx, e.clientY - currentBy);

      if (dist < 200) {
        if (!isGrabbed) {
          // Ambil black hole
          setIsGrabbed(true);
          bhX.set(e.clientX);
          bhY.set(e.clientY);
        } else {
          // Lepaskan black hole (kembali ke posisi diam)
          setIsGrabbed(false);
          bhX.set(defaultX);
          bhY.set(defaultY);
        }
      } else if (isGrabbed) {
        // Jika klik di sembarang tempat saat grab, lepaskan juga (opsional, biar gampang)
        setIsGrabbed(false);
        bhX.set(defaultX);
        bhY.set(defaultY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // 3. Logika Canvas Bintang & Gravitasi
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
        x: Math.random() * width, y: Math.random() * height,
        vx: 0, vy: 0,
        r: Math.random() * 1.2 + 0.1, baseA: Math.random() * 0.4 + 0.2, 
        tw: Math.random() * 0.02 + 0.005, dir: Math.random() > 0.5 ? 1 : -1,
        speed: Math.random() * 0.2 + 0.05
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      
      // Baca posisi black hole secara real-time dari spring value
      let bhCenterX = springX.get();
      let bhCenterY = springY.get();
      
      if (isTouchDevice) {
        bhCenterX = width * 0.8; bhCenterY = height * 0.2;
      }

      const pullRadius = 450; 

      for (const s of stars) {
        s.baseA += s.tw * s.dir;
        if (s.baseA > 0.8) { s.baseA = 0.8; s.dir = -1; }
        if (s.baseA < 0.1) { s.baseA = 0.1; s.dir = 1; }

        if (!reduce) {
          const dx = bhCenterX - s.x;
          const dy = bhCenterY - s.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < pullRadius) {
            const force = (pullRadius - dist) / pullRadius; 
            s.vx += (dx / dist) * force * 0.8;
            s.vy += (dy / dist) * force * 0.8;
            
            const angle = Math.atan2(dy, dx);
            s.vx += Math.cos(angle + Math.PI / 2) * force * 0.6;
            s.vy += Math.sin(angle + Math.PI / 2) * force * 0.6;
            
            s.r = Math.max(0.1, s.r - 0.005); 

            if (dist < 20) {
              s.x = Math.random() * width; s.y = Math.random() * height;
              s.vx = 0; s.vy = 0; s.r = Math.random() * 1.2 + 0.1;
            }
          } else {
            s.vx *= 0.95; s.vy -= s.speed * 0.05; 
          }

          s.x += s.vx; s.y += s.vy;

          if (s.x < -50 || s.x > width + 50 || s.y > height + 50) {
            s.x = Math.random() * width; s.y = -10;
            s.vx = 0; s.vy = 0; s.r = Math.random() * 1.2 + 0.1;
          }
        }

        ctx.beginPath(); 
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        const dx = bhCenterX - s.x;
        const dy = bhCenterY - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const alpha = dist < 150 ? s.baseA * (dist / 150) : s.baseA;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`; 
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
      window.removeEventListener('click', handleClick);
    };
  }, [isGrabbed, springX, springY]);

  return (
    <>
      <div className="galaxy-bg" aria-hidden="true">
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>

        {!isTouchDevice && (
          <motion.div 
            className={`black-hole-wrapper ${isGrabbed ? 'grabbed' : ''}`}
            style={{ 
              x: springX, 
              y: springY,
              translateX: '-50%', // Agar titik tengahnya pas di kursor
              translateY: '-50%',
              position: 'fixed',
              top: 0, left: 0
            }}
          >
            <div className="black-hole-container">
              <div className="accretion-disk" />
              <div className="black-hole-core" />
            </div>
          </motion.div>
        )}
        
        <canvas ref={canvasRef} className="star-canvas" />
      </div>

      {!isTouchDevice && (
        <>
          <div className={`cursor-dot ${isGrabbed ? 'grabbed' : ''}`} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }} />
          <div className={`cursor-ring ${isHovering ? 'hovering' : ''} ${isGrabbed ? 'grabbed' : ''}`} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }} />
        </>
      )}
    </>
  );
}