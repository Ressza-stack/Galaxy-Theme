import { useEffect, useState } from 'react';
import { Activity, Cpu, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SystemMonitor() {
  const [stats, setStats] = useState({ cpu: 12, mem: 45 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 20) + 5,
        mem: Math.floor(Math.random() * 10) + 40,
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="system-monitor"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 3, duration: 1 }}
    >
      <div className="monitor-header">
        <Activity size={12} className="text-green animate-pulse" />
        <span>SYS.MONITOR</span>
      </div>
      <div className="monitor-body">
        <div className="monitor-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Cpu size={12} /> CPU</span>
          <span>{stats.cpu}%</span>
        </div>
        <div className="monitor-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><HardDrive size={12} /> MEM</span>
          <span>{stats.mem}%</span>
        </div>
        <div className="monitor-bar-bg"><div className="monitor-bar-fill" style={{ width: `${stats.cpu}%` }}></div></div>
        <div className="monitor-bar-bg"><div className="monitor-bar-fill" style={{ width: `${stats.mem}%`, background: '#60a5fa' }}></div></div>
      </div>
    </motion.div>
  );
}