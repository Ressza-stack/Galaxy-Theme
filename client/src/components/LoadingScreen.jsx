import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [isEating, setIsEating] = useState(false);

  useEffect(() => {
    // Waktu 3.5 detik sebelum black hole menelan layar
    const timer = setTimeout(() => {
      setIsEating(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.2 } }} 
    >
      <div className="loading-content">
        
        {/* BLACK HOLE CONTAINER */}
        <motion.div 
          className="cinematic-black-hole"
          animate={isEating ? { scale: 50 } : { scale: [1, 1.02, 1] }} 
          transition={
            isEating 
              ? { duration: 1.2, ease: [0.7, 0, 1, 1] } // Efek meledak ngebut di akhir
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {/* Cincin Luar (Accretion Disk) */}
          <div className="cinematic-disk outer-disk"></div>
          
          {/* Cincin Cahaya (Photon Ring) */}
          <div className="photon-ring"></div>
          
          {/* Inti Hitam Pekat */}
          <div className="cinematic-core"></div>
          
          {/* Cincin Dalam */}
          <div className="cinematic-disk inner-disk"></div>
        </motion.div>

        {/* TEKS & PROGRESS BAR */}
        <motion.div 
          className="loading-text-wrap"
          animate={isEating ? { scale: 0, opacity: 0, filter: "blur(10px)", y: -50 } : { scale: 1, opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.6, ease: "easeIn" }} 
        >
          <div className="typing-text">
            INITIALIZING GRAVITY WELL
          </div>

          <div className="loading-bar-container">
            <motion.div 
              className="loading-bar"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.5, ease: "easeInOut" }} 
            />
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}