import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

export default function NebulaBackground() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 50, damping: 20 });
  const springY = useSpring(y, { stiffness: 50, damping: 20 });

  // Parallax effect: Nebula bergeser sedikit mengikuti mouse
  const nebulaX = useTransform(springX, [-0.5, 0.5], [-50, 50]);
  const nebulaY = useTransform(springY, [-0.5, 0.5], [-50, 50]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      x.set(e.clientX / window.innerWidth - 0.5);
      y.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return (
    <div className="nebula-container" aria-hidden="true">
      <motion.div 
        className="nebula-cloud cloud-1" 
        style={{ x: nebulaX, y: nebulaY }} 
      />
      <motion.div 
        className="nebula-cloud cloud-2" 
        style={{ x: nebulaX, y: nebulaY }} 
      />
      <motion.div 
        className="nebula-cloud cloud-3" 
        style={{ x: nebulaX, y: nebulaY }} 
      />
    </div>
  );
}