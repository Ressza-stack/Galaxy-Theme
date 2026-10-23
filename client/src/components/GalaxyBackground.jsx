import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import '../styles/galaxy.css';

export default function GalaxyBackground() {
  const canvasRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isGrabbed, setIsGrabbed] = useState(false);

  const defaultX = typeof window !== 'undefined' ? window.innerWidth * 0.75 : 800;
  const defaultY = typeof window !== 'undefined' ? window.innerHeight * 0.25 : 200;

  const bhX = useMotionValue(defaultX);
  const bhY = useMotionValue(defaultY);
  const springConfig = { stiffness: 40, damping: 20, mass: 1 };
  const springX = useSpring(bhX, springConfig);
  const springY = useSpring(bhY, springConfig);

  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  let mouseX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  let mouseY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);

    const handleMouseMove = (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      setCursorPos({ x: e.clientX, y: e.clientY });
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

    const handleClick = (e) => {
      const currentBx = springX.get();
      const currentBy = springY.get();
      const dist = Math.hypot(e.clientX - currentBx, e.clientY - currentBy);

      if (dist < 150) {
        if (!isGrabbed) { setIsGrabbed(true); bhX.set(e.clientX); bhY.set(e.clientY); }
        else { setIsGrabbed(false); bhX.set(defaultX); bhY.set(defaultY); }
      } else if (isGrabbed) {
        setIsGrabbed(false); bhX.set(defaultX); bhY.set(defaultY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height, stars = [], raf;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    // WARP SPEED VARIABLES
    let scrollSpeed = 0;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollSpeed = Math.abs(currentScrollY - lastScrollY) * 0.5;
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      const count = Math.min(800, Math.floor((width * height) / 3000)); 
      const starColors = ['255, 255, 255', '200, 220, 255', '255, 255, 200', '255, 200, 200'];
      
      stars = Array.from({ length: count }).map(() => ({
        x: Math.random() * width, 
        y: Math.random() * height,
        vx: 0, vy: 0,
        r: Math.random() * 1.5 + 0.2, 
        baseA: Math.random() * 0.6 + 0.2, 
        tw: Math.random() * 0.02 + 0.005, 
        dir: Math.random() > 0.5 ? 1 : -1,
        speed: Math.random() * 0.2 + 0.05,
        color: starColors[Math.floor(Math.random() * starColors.length)]
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      
      let bhCenterX = springX.get();
      let bhCenterY = springY.get();
      if (isTouchDevice) { bhCenterX = width * 0.8; bhCenterY = height * 0.2; }

      const pullRadius = 450; 

      // Kurangi kecepatan warp secara perlahan (friction)
      if (scrollSpeed > 0) scrollSpeed -= 0.2;
      const isWarping = scrollSpeed > 2;

      for (const s of stars) {
        s.baseA += s.tw * s.dir;
        if (s.baseA > 0.9) { s.baseA = 0.9; s.dir = -1; }
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
              s.vx = 0; s.vy = 0; s.r = Math.random() * 1.5 + 0.2;
            }
          } else {
            s.vx *= 0.95; 
            s.vy -= (s.speed + (isWarping ? scrollSpeed : 0)) * 0.05; 
          }

          s.x += s.vx;
          s.y += s.vy;

          if (s.x < -50 || s.x > width + 50 || s.y > height + 50 || s.y < -100) {
            s.x = Math.random() * width;
            s.y = isWarping ? height + 50 : -10;
            s.vx = 0; s.vy = 0;
            s.r = Math.random() * 1.5 + 0.2;
          }
        }

        // Gambar bintang
        const dx = bhCenterX - s.x;
        const dy = bhCenterY - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const alpha = dist < 150 ? s.baseA * (dist / 150) : s.baseA;
        ctx.fillStyle = `rgba(${s.color}, ${alpha})`; 

        if (isWarping) {
          // Gambar garis (Warp Effect)
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x, s.y + scrollSpeed * 2);
          ctx.lineWidth = s.r;
          ctx.strokeStyle = `rgba(${s.color}, ${alpha})`;
          ctx.stroke();
        } else {
          // Gambar titik (Normal)
          ctx.beginPath(); 
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
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
      window.removeEventListener('scroll', handleScroll);
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
            style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%', position: 'fixed', top: 0, left: 0 }}
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