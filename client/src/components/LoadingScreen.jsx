import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [text, setText] = useState("");
  const fullText = "INITIALIZING SYSTEM...";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }} 
    >
      <div className="orbital-loader-container">
        {/* 3 Cincin Berputar */}
        <div className="loader-ring ring-1"></div>
        <div className="loader-ring ring-2"></div>
        <div className="loader-ring ring-3"></div>
        
        {/* Inti Tengah */}
        <div className="loader-core"></div>
      </div>

      <div className="loading-text-wrap">
        <h2 className="loading-text">{text}<span className="blinking-cursor">|</span></h2>
        <div className="loading-bar-container">
          <motion.div 
            className="loading-bar"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.5, ease: "easeInOut" }} 
          />
        </div>
      </div>
    </motion.div>
  );
}