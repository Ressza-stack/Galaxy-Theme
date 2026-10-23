import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export default function PlanetCollision() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 }); // Trigger saat 50% terlihat
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    if (!isInView) {
      // Reset animasi kalau di-scroll keluar
      setHasPlayed(false);
      return;
    }
    if (hasPlayed) return;

    setHasPlayed(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = 300;

    let state = 'approaching'; // approaching, exploding, done
    let frame = 0;
    let animId;

    // Fisika Planet (Kecepatan dinaikin biar cepet tabrakan)
    const sun = { x: -50, y: height / 2, r: 60, vx: 12, color: '#ffaa00' };
    const saturn = { x: width + 50, y: height / 2, r: 50, vx: -12, color: '#d2b48c' };
    
    let particles = [];

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      frame++;

      if (state === 'approaching') {
        sun.x += sun.vx;
        saturn.x += saturn.vx;

        // Gambar Matahari (dengan Glow)
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, sun.r, 0, Math.PI * 2);
        ctx.fillStyle = sun.color;
        ctx.shadowBlur = 50;
        ctx.shadowColor = sun.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Gambar Saturnus
        ctx.beginPath();
        ctx.arc(saturn.x, saturn.y, saturn.r, 0, Math.PI * 2);
        ctx.fillStyle = saturn.color;
        ctx.fill();
        
        // Cincin Saturnus
        ctx.beginPath();
        ctx.ellipse(saturn.x, saturn.y, saturn.r * 2, saturn.r * 0.4, Math.PI / 6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(210, 180, 140, 0.6)';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Deteksi Tabrakan (Titik tengah bertemu)
        if (sun.x + sun.r * 0.5 >= saturn.x - saturn.r * 0.5) {
          state = 'exploding';
          // SPAWN 200 PARTIKEL LEDAKAN
          for (let i = 0; i < 200; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 15 + 2;
            particles.push({
              x: width / 2, y: height / 2,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              r: Math.random() * 5 + 1,
              life: 1,
              decay: Math.random() * 0.015 + 0.005,
              color: Math.random() > 0.5 ? '#ffaa00' : '#d2b48c'
            });
          }
        }
      } else if (state === 'exploding') {
        // Flash Ledakan
        if (frame < 20) {
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, 100 + frame * 15, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${1 - frame/20})`;
          ctx.fill();
        }

        // Render Partikel
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          
          // Fisika: Gesekan Udara (melambat) & Anti-Gravity (naik pelan)
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.vy -= 0.08; 

          p.life -= p.decay;

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          // Partikel awalnya berwarna, lalu memudar jadi putih
          ctx.fillStyle = p.life > 0.5 ? p.color : `rgba(255, 255, 255, ${p.life})`;
          ctx.fill();
        }

        if (particles.length === 0) {
          state = 'done';
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animId);
  }, [isInView, hasPlayed]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '300px', position: 'relative', overflow: 'hidden', marginBottom: '40px' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}