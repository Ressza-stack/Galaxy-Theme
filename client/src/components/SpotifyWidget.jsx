import { useState } from 'react';
import { Music, X, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SpotifyWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Link Embed Playlist Spotify Kamu
  const spotifyEmbedUrl = "https://open.spotify.com/embed/playlist/51gr21AYB59aB1lO5n6eGC?utm_source=generator&theme=0";

  return (
    <>
      {/* Tombol Toggle */}
      <motion.button 
        className="spotify-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 4.2, duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        title="Toggle Audio Stream"
      >
        {isOpen ? <X size={20} /> : <Music size={20} />}
      </motion.button>

      {/* Widget Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="spotify-panel"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="spotify-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={14} className="text-green animate-pulse" />
                <span>SYS.AUDIO_STREAM</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="spotify-close"><X size={14} /></button>
            </div>
            
            <div className="spotify-iframe-container">
              <iframe 
                style={{ borderRadius: '8px' }} 
                src={spotifyEmbedUrl} 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allowFullScreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}