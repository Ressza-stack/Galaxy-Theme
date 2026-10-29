import { motion } from 'framer-motion';

export default function WaveText({ text, className }) {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <motion.h1
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          variants={child}
          key={index}
          whileHover={{ 
            y: -20, 
            color: '#4f8eff', 
            textShadow: '0 0 20px #4f8eff',
            scale: 1.2
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          style={{ display: 'inline-block', cursor: 'default' }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
}