import { motion } from 'framer-motion';
import { Orbit } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <motion.div 
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <div className="loading-content">
        {/* Orbit Berputar */}
        <motion.div 
          className="loading-icon"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        >
          <Orbit size={64} />
        </motion.div>

        {/* Teks */}
        <motion.h2 
          className="loading-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          INITIALIZING UNIVERSE
        </motion.h2>

        {/* Progress Bar */}
        <div className="loading-bar-container">
          <motion.div 
            className="loading-bar"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}