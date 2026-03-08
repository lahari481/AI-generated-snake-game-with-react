import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';
const GAME_SPEED = 80;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on snake
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas with semi-transparent black for trail effect
    ctx.fillStyle = 'rgba(10, 10, 10, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(26, 26, 26, 0.5)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );
    ctx.shadowBlur = 0;

    // Draw snake with enhanced glow
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const glowColor = isHead ? '#00ffff' : '#ff00ff';
      
      ctx.fillStyle = glowColor;
      ctx.shadowBlur = isHead ? 25 : 15;
      ctx.shadowColor = glowColor;
      
      const padding = 1.5;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
      
      // Add a second layer of glow for the head
      if (isHead) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          segment.x * cellSize + padding,
          segment.y * cellSize + padding,
          cellSize - padding * 2,
          cellSize - padding * 2
        );
      }
      ctx.shadowBlur = 0;
    });
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] px-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Trophy className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Score</p>
            <p className="text-xl font-mono text-white leading-none">{score}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">High Score</p>
          <p className="text-xl font-mono text-cyan-400 leading-none">{highScore}</p>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="relative bg-black rounded-lg shadow-2xl border border-white/10"
        />

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center gap-4 z-10"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Game Over</h2>
                  <p className="text-cyan-400 font-mono">Final Score: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="mt-4 flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Try Again
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Paused</h2>
                  <p className="text-white/40 text-sm">Press Space to Resume</p>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="mt-4 flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Resume
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-[400px]">
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Controls</p>
          <div className="flex gap-2 text-xs text-white/60">
            <span className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">Arrows</span>
            <span>to move</span>
          </div>
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Pause</p>
          <div className="flex gap-2 text-xs text-white/60">
            <span className="px-1.5 py-0.5 bg-white/10 rounded border border-white/20">Space</span>
            <span>to toggle</span>
          </div>
        </div>
      </div>
    </div>
  );
};
