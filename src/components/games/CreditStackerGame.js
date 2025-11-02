import React, { useState, useEffect, useRef, useCallback } from 'react';

// Game configuration
const BLOCK_HEIGHT = 20;
const MAX_CREDIT_SCORE = 700;
const CREDIT_PENALTY = 100;
const GOOD_BLOCK_MESSAGES = ["PAY BILL ON TIME", "SAVE 10%", "CHECK REPORT", "LOW BALANCE", "BUILD HISTORY"];
const TRAP_BLOCK_MESSAGES = ["INSTANT LOAN!", "2x PROFIT!", "GUARANTEED!", "0%... FOR 1 DAY", "FREE MONEY!"];

// Block class
class Block {
  constructor(y, width, isTrap = false, score = 0, speed = 2) {
    this.x = 0;
    this.y = y;
    this.width = width;
    this.height = BLOCK_HEIGHT;
    this.isTrap = isTrap;
    this.speed = speed; // Use the passed speed parameter
    this.direction = 1;
    this.dropY = y; // Current drop position (for falling animation)
    this.isDropping = false; // Whether the block is currently dropping
    
    if (isTrap) {
      this.text = TRAP_BLOCK_MESSAGES[Math.floor(Math.random() * TRAP_BLOCK_MESSAGES.length)];
    } else {
      this.text = GOOD_BLOCK_MESSAGES[Math.floor(Math.random() * GOOD_BLOCK_MESSAGES.length)];
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#4A90E2'; // Same blue color for both
    const drawY = this.isDropping ? this.dropY : this.y;
    ctx.fillRect(this.x, drawY, this.width, this.height);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x + this.width / 2, drawY + this.height / 2);
  }
  
  drawStatic(ctx, offsetY) {
    ctx.fillStyle = '#4A90E2'; // Same blue color for both
    const drawY = this.isDropping ? this.dropY : this.y;
    ctx.fillRect(this.x, drawY - offsetY, this.width, this.height);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x + this.width / 2, drawY - offsetY + this.height / 2);
  }

  update() {
    if (this.isDropping) {
      // Drop from top with gravity-like effect
      this.dropY += this.speed * 2; // Drop faster for better gameplay
      
      // Check if block has reached its target position
      if (this.dropY >= this.y) {
        this.dropY = this.y;
        this.isDropping = false;
      }
    } else {
      // Original side-to-side movement (only when not dropping)
      this.x += this.speed * this.direction;
      if (this.x + this.width > 500) {
        this.direction = -1;
        this.x = 500 - this.width;
      }
      if (this.x < 0) {
        this.direction = 1;
        this.x = 0;
      }
    }
  }
}

// Platform class
class Platform {
  constructor() {
    this.width = 150;
    this.height = 30;
    this.x = (500 / 2) - (this.width / 2);
    this.y = 700 - 50;
    this.isShaking = false;
  }
  
  draw(ctx, offsetY) {
    let shakeX = 0;
    if (this.isShaking) {
      shakeX = (Math.random() - 0.5) * 10;
    }
    
    ctx.fillStyle = '#a0aec0';
    ctx.fillRect(this.x + shakeX, this.y - offsetY, this.width, this.height);
    
    ctx.fillStyle = 'black';
    ctx.font = 'bold 14px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CREDIT SCORE', this.x + shakeX + this.width / 2, this.y - offsetY + this.height / 2);
  }
  
  shake() {
    this.isShaking = true;
    setTimeout(() => this.isShaking = false, 200);
  }
}

const CreditStackerGame = ({ onGameComplete, dogName, island, theme }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // start, playing, gameOver
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [creditScore, setCreditScore] = useState(700);
  
  // Game objects refs
  const towerRef = useRef([]);
  const movingBlockRef = useRef(null);
  const cameraYRef = useRef(0);
  const platformRef = useRef(null);

  // Audio system
  const audioContext = useRef(null);
  const [audioEnabled] = useState(true);

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // Audio system for Credit Stacker Game
  const playSound = useCallback((type) => {
    if (!audioEnabled || !audioContext.current) return;

    const ctx = audioContext.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (type) {
      case 'block-stack':
        // Successful block stacking - positive building sound
        oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4
        oscillator.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.2); // E5
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        break;
      
      case 'trap-discard':
        // Successfully discarding a trap - rewarding sound
        oscillator.frequency.setValueAtTime(330, ctx.currentTime); // E4
        oscillator.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.15); // C#5
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.25);
        break;

      case 'trap-stack':
        // Accidentally stacking a trap - negative sound
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;

      case 'life-lost':
        // Life lost - dramatic descending sound
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.6);
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.7);
        break;

      case 'block-drop':
        // Block falling/dropping sound
        oscillator.frequency.setValueAtTime(220, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
        break;

      default:
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    }
  }, [audioEnabled]);

  const spawnNewBlock = useCallback(() => {
    const lastY = towerRef.current.length > 0 ? towerRef.current[towerRef.current.length - 1].y : platformRef.current.y;
    const lastWidth = towerRef.current.length > 0 ? towerRef.current[towerRef.current.length - 1].width : platformRef.current.width;
    
    const isTrap = Math.random() < 0.25;
    
    // More gradual progressive speed increase: base speed + tower height * 0.1 (reduced from 0.3)
    const currentSpeed = 1 + (towerRef.current.length * 0.1);
    
    // Create block that drops from top instead of moving side to side
    movingBlockRef.current = new Block(lastY - BLOCK_HEIGHT, lastWidth, isTrap, score, currentSpeed);
    movingBlockRef.current.x = Math.random() * (500 - lastWidth); // Random horizontal position
    movingBlockRef.current.dropY = -50; // Start above the screen
    movingBlockRef.current.isDropping = true; // Flag to indicate it's dropping
    
    // Play block drop sound
    playSound('block-drop');
    
    if (towerRef.current.length > 3) {
      cameraYRef.current = (towerRef.current.length - 3) * BLOCK_HEIGHT;
    }
  }, [score, playSound]);

  const dropBlock = useCallback(() => {
    if (gameState !== 'playing' || !movingBlockRef.current) return;

    const lastBlock = towerRef.current.length > 0 ? towerRef.current[towerRef.current.length - 1] : platformRef.current;

    const overlap = Math.max(0, 
      Math.min(movingBlockRef.current.x + movingBlockRef.current.width, lastBlock.x + lastBlock.width) - 
      Math.max(movingBlockRef.current.x, lastBlock.x)
    );

    if (overlap > 0) {
      if (movingBlockRef.current.isTrap) {
        // Play trap stacking sound (negative)
        playSound('trap-stack');
        setCreditScore(prev => {
          const newScore = Math.max(0, prev - CREDIT_PENALTY);
          if (newScore <= 0) {
            setGameState('gameOver');
          }
          return newScore;
        });
        platformRef.current.shake();
        spawnNewBlock();
        return;
      }

      // Play successful block stacking sound
      playSound('block-stack');
      
      const newWidth = overlap;
      const newX = Math.max(movingBlockRef.current.x, lastBlock.x);
      
      const stackedBlock = new Block(movingBlockRef.current.y, newWidth);
      stackedBlock.x = newX;
      stackedBlock.text = movingBlockRef.current.text;
      
      towerRef.current.push(stackedBlock);
      setScore(prev => prev + 10);
      spawnNewBlock();
    } else {
      // Play life lost sound
      playSound('life-lost');
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameState('gameOver');
        }
        return newLives;
      });
      spawnNewBlock();
    }
  }, [gameState, spawnNewBlock, playSound]);

  // New function to discard/skip the current block
  const discardBlock = useCallback(() => {
    if (gameState !== 'playing' || !movingBlockRef.current) return;
    
    // If it's a trap block, give bonus points for discarding it
    if (movingBlockRef.current.isTrap) {
      playSound('trap-discard'); // Positive sound for discarding trap
      setScore(prev => prev + 25); // Bonus for avoiding trap
    } else {
      playSound('life-lost'); // Negative sound for discarding good block
      // Small penalty for discarding a good block
      setScore(prev => Math.max(0, prev - 5));
    }
    
    spawnNewBlock();
  }, [gameState, spawnNewBlock, playSound]);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(0, cameraYRef.current);
    
    platformRef.current.draw(ctx, cameraYRef.current);
    
    towerRef.current.forEach(block => block.drawStatic(ctx, cameraYRef.current));
    
    if (movingBlockRef.current) {
      movingBlockRef.current.update();
      movingBlockRef.current.draw(ctx);
    }
    
    ctx.restore();
    
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState]);

  const startGame = useCallback(() => {
    // Initialize audio context on user interaction
    initAudio();
    
    towerRef.current = [];
    cameraYRef.current = 0;
    setScore(0);
    setLives(3);
    setCreditScore(MAX_CREDIT_SCORE);
    setGameState('playing');
    platformRef.current = new Platform();
    
    spawnNewBlock();
    gameLoop();
  }, [spawnNewBlock, gameLoop, initAudio]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (gameState === 'playing') {
        dropBlock();
      } else {
        startGame();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (gameState === 'playing') {
        dropBlock(); // Up arrow = Keep/Drop the block
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (gameState === 'playing') {
        discardBlock(); // Down arrow = Discard/Skip the block
      }
    }
  }, [gameState, dropBlock, discardBlock, startGame]);

  const handleCanvasClick = useCallback(() => {
    if (gameState === 'playing') {
      dropBlock();
    }
  }, [gameState, dropBlock]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoop();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, gameLoop]);

  const getOutcome = () => {
    if (creditScore <= 0) {
      return {
        title: "Credit Ruined!",
        headline: "APPLICATION DENIED",
        details: "Your credit score is too low. You failed to qualify for a car loan and were denied an apartment lease.",
        color: "text-blue-500",
        border: "border-blue-500"
      };
    } else if (creditScore < 500) {
      return {
        title: "Game Over!",
        headline: "HIGH INTEREST",
        details: "Your application was approved, but with a very high 22% interest rate due to your low credit score.",
        color: "text-orange-500",
        border: "border-orange-500"
      };
    } else {
      return {
        title: "Congratulations!",
        headline: "APPLICATION APPROVED!",
        details: "You've qualified for a low 4.5% interest rate on your car loan. Your good financial habits paid off!",
        color: "text-green-500",
        border: "border-green-500"
      };
    }
  };

  const outcome = getOutcome();
  const creditScorePercent = (creditScore / MAX_CREDIT_SCORE) * 100;
  const creditBarColor = creditScorePercent < 30 ? 'bg-red-500' : 
                        creditScorePercent < 60 ? 'bg-orange-500' : 'bg-green-500';

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* HUD */}
      {gameState === 'playing' && (
        <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10 text-xl font-bold">
          <div className="flex gap-6">
            <span>SCORE: {score}</span>
            <span>LIVES: {'❤️'.repeat(lives)}</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-2 bg-black bg-opacity-30 rounded-lg">
            <div className="flex items-center gap-2">
              <span>CREDIT SCORE: {creditScore}</span>
            </div>
            <div className="w-32 h-5 bg-gray-600 rounded border-2 border-white overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${creditBarColor}`}
                style={{ width: `${creditScorePercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Game Canvas */}
      <canvas 
        ref={canvasRef}
        width={500}
        height={700}
        className="bg-gray-800 rounded-lg shadow-2xl cursor-pointer"
        onClick={handleCanvasClick}
      />

      {/* Start Screen */}
      {gameState === 'start' && (
        <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center p-8 z-20">
          <h1 className="text-5xl font-extrabold mb-6">Credit Stacker</h1>
          <h2 className="text-3xl font-bold mb-4">How to Play</h2>
          <div className="max-w-md bg-gray-800 p-6 rounded-lg mb-8 space-y-3">
            <p className="flex items-center">
              <span className="mr-3">⬆️</span>
              <kbd className="bg-gray-700 px-2 py-1 rounded mx-1">↑ Arrow</kbd> or <kbd className="bg-gray-700 px-2 py-1 rounded mx-1">Space</kbd> to drop/keep blocks
            </p>
            <p className="flex items-center">
              <span className="mr-3">⬇️</span>
              <kbd className="bg-gray-700 px-2 py-1 rounded mx-1">↓ Arrow</kbd> to discard/skip blocks
            </p>
            <p className="flex items-center">
              <span className="w-5 h-5 bg-green-500 rounded mr-3"></span>
              Stack <strong className="text-green-400">Green "PAY BILL"</strong> blocks for points
            </p>
            <p className="flex items-center">
              <span className="w-5 h-5 bg-red-600 rounded mr-3"></span>
              <strong className="text-red-400">DISCARD</strong> red <strong className="text-red-400">"INSTANT LOAN"</strong> blocks for bonus!
            </p>
            <p className="flex items-center">
              <span className="mr-3">⚡</span>
              <strong className="text-yellow-400">Speed increases</strong> as your tower grows taller!
            </p>
            <p className="italic text-gray-300">Strategy: Keep good habits, discard predatory loans!</p>
          </div>
          <button 
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg text-2xl transition-colors"
          >
            Start Stacking (Press Space)
          </button>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center p-8 z-20">
          <h1 className="text-5xl font-extrabold mb-6">{outcome.title}</h1>
          
          <div className={`w-full max-w-lg bg-gray-800 p-6 rounded-lg mb-8 border-2 ${outcome.border}`}>
            <h2 className={`text-3xl font-bold mb-4 ${outcome.color}`}>{outcome.headline}</h2>
            <p className="text-lg">{outcome.details}</p>
          </div>
          
          <div className="flex justify-around w-full max-w-lg mb-8">
            <div className="text-center">
              <p className="text-xl mb-2">Final Score:</p>
              <p className="text-7xl font-bold">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-xl mb-2">Credit Score:</p>
              <p className={`text-5xl font-bold ${outcome.color}`}>{creditScore}</p>
            </div>
          </div>

          <div className="space-x-4">
            <button 
              onClick={startGame}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg text-2xl transition-colors"
            >
              Try Again (Press Space)
            </button>
            <button 
              onClick={() => onGameComplete({ 
                passed: creditScore >= 500, 
                score: score, 
                gameType: 'credit-stacker' 
              })}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-10 rounded-lg text-2xl transition-colors"
            >
              Exit Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditStackerGame;