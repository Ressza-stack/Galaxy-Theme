import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [isEating, setIsEating] = useState(false);
  const text = "DAMAR RESTU SANTOSO";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEating(true);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }} 
    >
      <div className="loading-content">
        
        {/* BLACK HOLE (FLUID ANIMATION) */}
        <motion.div 
          className="loading-black-hole"
          animate={isEating ? { scale: 80 } : { scale: [1, 1.05, 1] }} 
          transition={
            isEating 
              ? { duration: 1.4, ease: [0.7, 0, 1, 1] } 
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {/* Core */}
          <motion.div 
            className="bh-core"
            animate={{ 
              scale: [1, 1.1, 1], 
              rotate: [0, 10, -10, 0],
              borderRadius: ["50%", "45% 55% 48% 52%", "50%"]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Ring 1 */}
          <motion.div 
            className="bh-ring ring-a"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Ring 2 */}
          <motion.div 
            className="bh-ring ring-b"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* TEXT & PROGRESS BAR */}
        <motion.div 
          className="loading-ui"
          animate={isEating ? { scale: 0, opacity: 0, filter: "blur(10px)", y: -50 } : { scale: 1, opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }} 
        >
          <div className="typing-text">
            {text.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05, duration: 0.1 }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>

          <div className="loading-bar-container">
            <motion.div 
              className="loading-bar"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.2, ease: "linear" }} 
            />
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}