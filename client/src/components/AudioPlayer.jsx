import { useState, useRef, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Menggunakan audio ambient luar angkasa dari CDN publik
    audioRef.current = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_789a3f9538.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Volume dikecilkan
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.button
      onClick={togglePlay}
      className={`audio-btn ${isPlaying ? 'playing' : ''}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 3.5, duration: 0.5 }}
      title={isPlaying ? "Mute Audio" : "Play Ambient Audio"}
    >
      {isPlaying ? <Music size={20} className="spin-slow" /> : <VolumeX size={20} />}
    </motion.button>
  );
}