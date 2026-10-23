import { useEffect, useRef, useState } from 'react';
import Reveal from '../components/Reveal';
import { Rocket, RotateCcw } from 'lucide-react';

export default function MiniGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const gameState = useRef({
    player: { x: 150, y: 300, width: 30, height: 30 },
    asteroids: [],
    speed: 2,
    frame: 0
  });

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    gameState.current = {
      player: { x: 150, y: 300, width: 30, height: 30 },
      asteroids: [],
      speed: 2,
      frame: 0
    };
  };

  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set resolusi canvas
    canvas.width = 500;
    canvas.height = 350;

    // Kontrol mouse
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      // Batasi agar pesawat tidak keluar layar
      gameState.current.player.x = Math.max(0, Math.min(mouseX - 15, canvas.width - 30));
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    let animationId;

    const update = () => {
      const state = gameState.current;
      state.frame++;

      // Spawn Asteroid
      if (state.frame % Math.max(10, 40 - Math.floor(state.speed * 2)) === 0) {
        state.asteroids.push({
          x: Math.random() * (canvas.width - 30),
          y: -30,
          size: Math.random() * 20 + 15,
          speedY: state.speed + Math.random() * 1.5
        });
      }

      // Update Asteroid
      for (let i = state.asteroids.length - 1; i >= 0; i--) {
        const ast = state.asteroids[i];
        ast.y += ast.speedY;

        // Deteksi Tabrakan (Simple AABB)
        if (
          ast.y + ast.size > state.player.y &&
          ast.y < state.player.y + state.player.height &&
          ast.x + ast.size > state.player.x &&
          ast.x < state.player.x + state.player.width
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return; // Hentikan loop
        }

        // Hapus jika lewat bawah
        if (ast.y > canvas.height) {
          state.asteroids.splice(i, 1);
          setScore(s => s + 10);
          state.speed += 0.05; // Percepat game
        }
      }

      // Render
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Player (Pesawat)
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.moveTo(state.player.x + 15, state.player.y);
      ctx.lineTo(state.player.x, state.player.y + 30);
      ctx.lineTo(state.player.x + 30, state.player.y + 30);
      ctx.fill();

      // Draw Asteroids
      ctx.fillStyle = '#555';
      state.asteroids.forEach(ast => {
        ctx.beginPath();
        ctx.arc(ast.x + ast.size/2, ast.y + ast.size/2, ast.size/2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying]);

  return (
    <section id="game" className="section">
      <Reveal>
        <p className="eyebrow">INTERACTIVE EXPERIENCE</p>
        <h2 className="section-title">Space Dodger.</h2>
        <p className="section-sub">Use your mouse to navigate the ship and dodge the asteroids. Let's see how long you can survive.</p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="game-container">
          {!isPlaying && !gameOver && (
            <div className="game-overlay">
              <Rocket size={48} className="mb-4 text-white" />
              <h3>Ready to launch?</h3>
              <button className="btn btn-primary" onClick={startGame}>Start Game</button>
            </div>
          )}
          {gameOver && (
            <div className="game-overlay">
              <h3 className="text-red">Mission Failed</h3>
              <p className="text-xl">Score: {score}</p>
              <button className="btn btn-ghost" onClick={startGame}><RotateCcw size={16} /> Try Again</button>
            </div>
          )}
          
          <canvas ref={canvasRef} className="game-canvas" />
          
          <div className="game-hud">
            <span>SCORE: {score}</span>
            <span>STATUS: {isPlaying ? 'IN COMBAT' : 'STANDBY'}</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}