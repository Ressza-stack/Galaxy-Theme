import { useState, useEffect } from 'react';
import { Activity, Cpu, Wifi } from 'lucide-react';

export default function SystemDiagnostics() {
  const [cpu, setCpu] = useState(42);
  const [mem, setMem] = useState(68);
  const [ping, setPing] = useState(14);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    // Simulasi Uptime
    const uptimeTimer = setInterval(() => setUptime(prev => prev + 1), 1000);
    
    // Simulasi Stats
    const statsTimer = setInterval(() => {
      setCpu(Math.floor(Math.random() * 30) + 20); // 20 - 50
      setMem(Math.floor(Math.random() * 15) + 60); // 60 - 75
      setPing(Math.floor(Math.random() * 20) + 8); // 8 - 28
    }, 2000);

    return () => {
      clearInterval(uptimeTimer);
      clearInterval(statsTimer);
    };
  }, []);

  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="sys-diagnostics">
      <div className="sys-header">
        <Activity size={14} className="text-green" />
        <span>CORE_SYSTEM_DIAGNOSTICS</span>
        <span className="sys-status">ONLINE</span>
      </div>

      <div className="sys-body">
        <div className="sys-left">
          {/* CPU & Memory Bars */}
          <div className="sys-bar-group">
            <div className="sys-bar-label">
              <span><Cpu size={12} /> CPU</span>
              <span>{cpu}%</span>
            </div>
            <div className="sys-bar-bg">
              <div className="sys-bar-fill" style={{ width: `${cpu}%`, background: cpu > 60 ? '#ff5555' : '#4ade80' }}></div>
            </div>
          </div>

          <div className="sys-bar-group">
            <div className="sys-bar-label">
              <span><Activity size={12} /> MEM</span>
              <span>{mem}%</span>
            </div>
            <div className="sys-bar-bg">
              <div className="sys-bar-fill" style={{ width: `${mem}%`, background: mem > 80 ? '#ffaa00' : '#4f8eff' }}></div>
            </div>
          </div>

          {/* Uptime & Ping */}
          <div className="sys-data-grid">
            <div className="sys-data-box">
              <p>SYS.UPTIME</p>
              <h4>{formatUptime(uptime)}</h4>
            </div>
            <div className="sys-data-box">
              <p>NET.PING</p>
              <h4 style={{ color: ping > 20 ? '#ffaa00' : '#4ade80' }}>{ping}ms <Wifi size={10}/></h4>
            </div>
          </div>
        </div>

        {/* Radar */}
        <div className="sys-right">
          <div className="radar-container">
            <div className="radar-sweep"></div>
            <div className="radar-grid-circle c1"></div>
            <div className="radar-grid-circle c2"></div>
            <div className="radar-grid-circle c3"></div>
            <div className="radar-dot d1"></div>
            <div className="radar-dot d2"></div>
            <div className="radar-dot d3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}