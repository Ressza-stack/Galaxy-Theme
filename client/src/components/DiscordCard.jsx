import { MessageCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DiscordCard() {
  const discordUrl = "https://discord.com/users/1404321789001076806";

  return (
    <motion.a 
      href={discordUrl} 
      target="_blank" 
      rel="noreferrer"
      className="discord-card"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="discord-icon">
        <MessageCircle size={24} />
      </div>
      <div className="discord-info">
        <p className="discord-label">DISCORD PROFILE</p>
        <p className="discord-name">damar#2024</p>
      </div>
      <ExternalLink size={16} className="discord-arrow" />
    </motion.a>
  );
}