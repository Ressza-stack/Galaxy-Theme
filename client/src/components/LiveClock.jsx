import { useState, useEffect } from 'react';
import { Clock, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <motion.div 
      className="live-clock-hud"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 4.5, duration: 0.5 }}
    >
      <div className="clock-row">
        <Clock size={14} />
        <span>{timeString} WIB</span>
      </div>
      <div className="status-row">
        <motion.div 
          animate={{ opacity: [1, 0.3, 1] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Circle size={8} fill="#4ade80" color="#4ade80" />
        </motion.div>
        <span>AVAILABLE FOR WORK</span>
      </div>
    </motion.div>
  );
}