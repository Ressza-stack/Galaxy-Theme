import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, RotateCcw, Rocket, Star, Globe, Zap, Shield, Sun } from 'lucide-react';

const icons = [Rocket, Star, Globe, Zap, Shield, Sun];

export default function SpaceMemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [isWon, setIsWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    const gameCards = [...icons, ...icons]
      .map((Icon, index) => ({ id: index, Icon }))
      .sort(() => Math.random() - 0.5);
    setCards(gameCards);
    setFlipped([]);
    setSolved([]);
    setIsWon(false);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].Icon === cards[second].Icon) {
        setSolved(prev => [...prev, first, second]);
        setFlipped([]);
        if (solved.length + 2 === cards.length) {
          setTimeout(() => setIsWon(true), 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  return (
    <div className="memory-game-container">
      <div className="game-header">
        <Gamepad2 size={20} />
        <span>SPACE MEMORY MATRIX</span>
        <span style={{ marginLeft: 'auto', color: '#4f8eff' }}>MOVES: {moves}</span>
      </div>
      
      <div className="game-grid">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || solved.includes(index);
          const Icon = card.Icon;
          return (
            <motion.div 
              key={index}
              className={`memory-card ${isFlipped ? 'flipped' : ''}`}
              onClick={() => handleClick(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="card-inner">
                <div className="card-front">?</div>
                <div className="card-back"><Icon size={24} /></div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isWon && (
          <motion.div 
            className="game-overlay-win"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3>ACCESS GRANTED</h3>
            <p>Congratulations! You unlocked a secret message:</p>
            <p className="secret-text">"Keep exploring the universe of code. - DRS"</p>
            <button className="btn btn-primary" onClick={initGame}><RotateCcw size={14} /> Play Again</button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button className="btn btn-ghost btn-sm" onClick={initGame} style={{ marginTop: '16px', width: '100%' }}>
        <RotateCcw size={14} /> Reset Matrix
      </button>
    </div>
  );
}