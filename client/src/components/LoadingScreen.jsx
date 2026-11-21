import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function LoadingScreen() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frame = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();

    const particles = [];
    const particleCount = Math.min(110, Math.floor((width * height) / 9000));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        distance: Math.random() * Math.max(width, height) * 0.75 + 100,
        speed: Math.random() * 0.02 + 0.01,
        size: Math.random() * 2 + 0.5,
        color: Math.random() > 0.5 ? '79, 142, 255' : '255, 255, 255' // Biru & Putih
      });
    }

    const animate = () => {
      const centerX = width / 2;
      const centerY = height / 2;
      ctx.fillStyle = 'rgba(3, 5, 12, 0.2)';
      ctx.fillRect(0, 0, width, height);

      const pulse = Math.sin(Date.now() / 520) * 2;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-0.16);
      ctx.scale(1, 0.34);

      ctx.beginPath();
      ctx.ellipse(0, 0, 78 + pulse, 78 + pulse, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(122, 114, 255, 0.28)';
      ctx.lineWidth = 15;
      ctx.shadowBlur = 28;
      ctx.shadowColor = 'rgba(116, 111, 255, 0.86)';
      ctx.stroke();

      const diskGradient = ctx.createLinearGradient(-78, 0, 78, 0);
      diskGradient.addColorStop(0, 'rgba(91, 122, 255, 0.08)');
      diskGradient.addColorStop(0.28, 'rgba(163, 156, 255, 0.92)');
      diskGradient.addColorStop(0.5, 'rgba(255, 244, 226, 0.96)');
      diskGradient.addColorStop(0.72, 'rgba(169, 141, 255, 0.9)');
      diskGradient.addColorStop(1, 'rgba(85, 119, 255, 0.08)');
      ctx.beginPath();
      ctx.ellipse(0, 0, 78 + pulse, 78 + pulse, 0, 0, Math.PI * 2);
      ctx.strokeStyle = diskGradient;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 14;
      ctx.shadowColor = 'rgba(186, 169, 255, 0.9)';
      ctx.stroke();
      ctx.restore();

      const coreGradient = ctx.createRadialGradient(centerX - 10, centerY - 12, 4, centerX, centerY, 42);
      coreGradient.addColorStop(0, '#000');
      coreGradient.addColorStop(0.72, '#010105');
      coreGradient.addColorStop(0.92, 'rgba(4, 5, 18, 0.98)');
      coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(centerX, centerY, 42, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.shadowBlur = 22;
      ctx.shadowColor = 'rgba(119, 117, 255, 0.54)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 39 + pulse * 0.4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(222, 213, 255, 0.82)';
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(135, 152, 255, 0.86)';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Animating particles toward the black hole
      particles.forEach((p, index) => {
        p.angle += p.speed;
        p.distance -= p.speed * 30; // Tersedot ke tengah

        // Jika sudah mencapai inti, reset ke pinggir
        if (p.distance < 40) {
          p.distance = Math.random() * Math.max(width, height) * 0.75 + 100;
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

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
    >
      <canvas ref={canvasRef} className="vortex-canvas" />
      
      <motion.div
        className="loading-text-wrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12 }}
      >
        <div className="typing-text">INITIALIZING GRAVITY WELL</div>
        <div className="loading-bar-container" aria-hidden="true">
          <motion.div
            className="loading-bar"
            initial={{ scaleX: 0.08 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
