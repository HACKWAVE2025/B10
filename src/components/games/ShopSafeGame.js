import React, { useState, useEffect, useRef, useCallback } from 'react';

// Game configuration
const ITEM_WIDTH = 200;
const ITEM_HEIGHT = 60;
const PLAYER_WIDTH = 100;
const PLAYER_HEIGHT = 60;
const PLAYER_SPEED = 10;

// Diverse legitimate domains (Indian and International)
const GOOD_DOMAINS = [
  "amazon.in", "flipkart.com", "myntra.com", "paytm.com", "swiggy.com",
  "zomato.com", "makemytrip.com", "bookmyshow.com", "nykaa.com", "bigbasket.com",
  "amazon.com", "walmart.com", "target.com", "apple.com", "google.com",
  "microsoft.com", "netflix.com", "spotify.com", "facebook.com", "instagram.com"
];

// Fake/phishing domains with common tricks
const FAKE_DOMAINS = [
  "amaz0n.in", "flipkart.net", "myntr4.com", "paytm-secure.biz", "swiggy.store",
  "z0mato.com", "makemytrip.xyz", "bookmysh0w.net", "nyka4.com", "bigbasket.org",
  "amaz0n.com", "wa1mart.com", "targ3t.com", "app1e.com", "g00gle.com",
  "micr0soft.com", "netf1ix.com", "sp0tify.com", "fac3book.com", "1nstagram.com"
];

// Cooldown tracking
const domainCooldowns = new Map();

// Helper function to get available domain with cooldown
const getAvailableDomain = (isFake) => {
  const currentTime = Date.now();
  const sourceArray = isFake ? FAKE_DOMAINS : GOOD_DOMAINS;
  
  // Filter out domains that are in cooldown
  const availableDomains = sourceArray.filter(domain => {
    const lastUsed = domainCooldowns.get(domain);
    return !lastUsed || (currentTime - lastUsed) >= 15000; // 15 seconds cooldown
  });
  
  // If no domains available, use any domain (reset cooldowns)
  if (availableDomains.length === 0) {
    // Clear cooldowns for this type
    sourceArray.forEach(domain => domainCooldowns.delete(domain));
    const selectedDomain = sourceArray[Math.floor(Math.random() * sourceArray.length)];
    domainCooldowns.set(selectedDomain, currentTime);
    return selectedDomain;
  }
  
  // Select random available domain
  const selectedDomain = availableDomains[Math.floor(Math.random() * availableDomains.length)];
  domainCooldowns.set(selectedDomain, currentTime);
  return selectedDomain;
};

// Player class
class Player {
  constructor() {
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.x = (600 / 2) - (this.width / 2);
    this.y = 800 - this.height - 20;
    this.speed = PLAYER_SPEED;
  }

  draw(ctx) {
    ctx.font = '60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🛒', this.x + this.width / 2, this.y + this.height / 1.5);
  }
  
  move(direction) {
    if (direction === 'left') {
      this.x -= this.speed;
    } else if (direction === 'right') {
      this.x += this.speed;
    }
    
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > 600) this.x = 600 - this.width;
  }
}

// Item class
class Item {
  constructor(itemSpeed) {
    this.width = ITEM_WIDTH;
    this.height = ITEM_HEIGHT;
    this.x = Math.random() * (600 - this.width);
    this.y = -this.height;
    this.speed = itemSpeed;
    
    this.isFake = Math.random() < 0.5;
    
    // Use cooldown system to get domain
    this.text = getAvailableDomain(this.isFake);
    this.color = '#4A90E2'; // Same blue color for both
    this.borderColor = '#357ABD'; // Same border for both
    this.icon = '📦'; // Same icon for both
  }
  
  update() {
    this.y += this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    ctx.strokeStyle = this.borderColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.icon, this.x + 10, this.y + this.height / 2);

    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x + (this.width / 2) + 15, this.y + this.height / 2);
  }
}

const ShopSafeGame = ({ onGameComplete, dogName, island, theme }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const spawnTimerRef = useRef(null);
  const keysRef = useRef({});
  const [gameState, setGameState] = useState('start'); // start, playing, gameOver
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [showGlitch, setShowGlitch] = useState(false);
  
  // Game objects refs
  const playerRef = useRef(null);
  const itemsRef = useRef([]);
  const itemSpawnRateRef = useRef(3000); // Slower spawn rate for reading
  const itemSpeedRef = useRef(1.5); // Slower speed for reading domains

  // Audio system
  const audioContext = useRef(null);
  const [audioEnabled] = useState(true);

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // Audio system for Shop Safe Game
  const playSound = useCallback((type) => {
    if (!audioEnabled || !audioContext.current) return;

    const ctx = audioContext.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (type) {
      case 'catch-good':
        // Catching legitimate domain - positive shopping sound
        oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4
        oscillator.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.3); // E5
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
        break;
      
      case 'catch-fake':
        // Catching fake domain - negative warning sound
        oscillator.frequency.setValueAtTime(220, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.6);
        break;

      case 'miss-good':
        // Missing good domain - penalty sound
        oscillator.frequency.setValueAtTime(330, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.16, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;

      case 'item-spawn':
        // New item spawning - subtle notification
        oscillator.frequency.setValueAtTime(880, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
        break;

      case 'game-over':
        // Game over - dramatic descending sound
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.0);
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 1.2);
        break;

      case 'level-up':
        // Difficulty increase - ascending progress sound
        oscillator.frequency.setValueAtTime(523, ctx.currentTime); // C5
        oscillator.frequency.exponentialRampToValueAtTime(784, ctx.currentTime + 0.3); // G5
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
        break;

      default:
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    }
  }, [audioEnabled]);

  const triggerGlitch = useCallback(() => {
    setShowGlitch(true);
    setTimeout(() => {
      setShowGlitch(false);
    }, 300);
  }, []);

  const spawnItem = useCallback(() => {
    if (gameState !== 'playing') return;
    
    const newItem = new Item(itemSpeedRef.current);
    itemsRef.current.push(newItem);
    playSound('item-spawn');
  }, [gameState, playSound]);

  // Set up spawn interval
  useEffect(() => {
    if (gameState === 'playing') {
      const spawnInterval = setInterval(() => {
        spawnItem();
      }, itemSpawnRateRef.current);
      
      spawnTimerRef.current = spawnInterval;
      
      return () => {
        if (spawnTimerRef.current) {
          clearInterval(spawnTimerRef.current);
        }
      };
    }
  }, [gameState, spawnItem]);

  const updateItems = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    for (let i = itemsRef.current.length - 1; i >= 0; i--) {
      const item = itemsRef.current[i];
      item.update();
      
      // Check for collision with player
      if (
        item.y + item.height >= player.y &&
        item.x < player.x + player.width &&
        item.x + item.width > player.x &&
        item.y < player.y + player.height
      ) {
        if (item.isFake) {
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameState('gameOver');
              playSound('game-over');
            }
            return newLives;
          });
          triggerGlitch();
          playSound('catch-fake');
        } else {
          setScore(prev => prev + 10);
          playSound('catch-good');
        }
        
        itemsRef.current.splice(i, 1);
      } else if (item.y > 800) {
        if (!item.isFake) {
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameState('gameOver');
              playSound('game-over');
            }
            return newLives;
          });
          playSound('miss-good');
        }
        itemsRef.current.splice(i, 1);
      }
    }
  }, [triggerGlitch, playSound]);

  const increaseDifficulty = useCallback(() => {
    // Increase difficulty every 50 points (slower progression)
    if (score > 0 && score % 50 === 0) {
      // Gradually decrease spawn rate (faster spawning)
      if (itemSpawnRateRef.current > 1200) {
        itemSpawnRateRef.current -= 100;
      }
      // Very gradual speed increase, cap at lower level
      if (itemSpeedRef.current < 4) {
        itemSpeedRef.current += 0.2;
      }
      playSound('level-up');
    }
  }, [score, playSound]);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updateItems();
    
    if (playerRef.current) {
      playerRef.current.draw(ctx);
    }
    
    itemsRef.current.forEach(item => item.draw(ctx));
    
    increaseDifficulty();

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, updateItems, increaseDifficulty]);

  const startGame = useCallback(() => {
    initAudio();
    setScore(0);
    setLives(3);
    itemsRef.current = [];
    itemSpawnRateRef.current = 2000;
    itemSpeedRef.current = 3;
    playerRef.current = new Player();
    setGameState('playing');
    
    if (spawnTimerRef.current) {
      clearInterval(spawnTimerRef.current);
    }
  }, [initAudio]);

  const handleKeyDown = useCallback((e) => {
    keysRef.current[e.key] = true;
    
    if (e.key === 'Enter' && gameState !== 'playing') {
      e.preventDefault();
      startGame();
    }
  }, [gameState, startGame]);

  const handleKeyUp = useCallback((e) => {
    keysRef.current[e.key] = false;
  }, []);

  const playerMoveLoop = useCallback(() => {
    if (gameState === 'playing' && playerRef.current) {
      if (keysRef.current['ArrowLeft']) {
        playerRef.current.move('left');
      }
      if (keysRef.current['ArrowRight']) {
        playerRef.current.move('right');
      }
    }
    requestAnimationFrame(playerMoveLoop);
  }, [gameState]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    playerMoveLoop();
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
    };
  }, [handleKeyDown, handleKeyUp, playerMoveLoop]);

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

  useEffect(() => {
    if (gameState === 'gameOver') {
      setTimeout(() => {
        onGameComplete({ 
          passed: score >= 50, 
          score: score, 
          gameType: 'shop-safe' 
        });
      }, 3000);
    }
  }, [gameState, score, onGameComplete]);

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
      <style jsx>{`
        @keyframes glitch-anim {
          0% {
            transform: translate(0);
            opacity: 1;
            clip-path: inset(10% 0 80% 0);
          }
          25% {
            transform: translate(10px, -5px);
            clip-path: inset(30% 0 40% 0);
          }
          50% {
            transform: translate(-15px, 10px);
            clip-path: inset(70% 0 10% 0);
          }
          75% {
            transform: translate(5px, -10px);
            clip-path: inset(40% 0 30% 0);
          }
          100% {
            transform: translate(0);
            opacity: 1;
            clip-path: inset(0);
          }
        }
      `}</style>

      <div className="w-full h-screen flex flex-col justify-center items-center relative">
        {/* Game HUD */}
        {gameState === 'playing' && (
          <div className="absolute top-5 left-5 right-5 flex justify-between items-center text-2xl font-bold text-shadow z-10">
            <h2>SCORE: {score}</h2>
            <h2>LIVES: {'❤️'.repeat(lives)}</h2>
          </div>
        )}

        {/* Game Canvas */}
        <canvas 
          ref={canvasRef}
          width="600" 
          height="800"
          className="bg-gray-800 rounded-lg shadow-xl"
          style={{
            imageRendering: 'pixelated'
          }}
        />

        {/* Glitch Overlay */}
        {showGlitch && (
          <div 
            className="absolute inset-0 z-50 pointer-events-none bg-red-600 opacity-30"
            style={{
              animation: 'glitch-anim 0.3s steps(2, end) forwards'
            }}
          />
        )}

        {/* Start Screen */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-lg flex flex-col justify-center items-center text-center p-8 z-20">
            <h1 className="text-5xl font-extrabold mb-6">Shop Safe</h1>
            <h2 className="text-3xl font-bold mb-4">How to Play</h2>
            <div className="max-w-lg bg-gray-800 p-6 rounded-lg mb-8 space-y-3">
              <p className="flex items-center">
                <span className="mr-3">⬅️➡️</span>
                Use <kbd className="bg-gray-700 px-2 py-1 rounded mx-1">Arrow Keys</kbd> to move your cart
              </p>
              <p className="flex items-center">
                <span className="mr-3">✅</span>
                Catch banners from <strong className="text-green-400">VERIFIED sites</strong> for points
              </p>
              <p className="flex items-center">
                <span className="mr-3">⚠️</span>
                <strong className="text-red-400">AVOID</strong> banners from <strong className="text-red-400">FAKE sites</strong>!
              </p>
              <p className="flex items-center">
                <span className="mr-3">💀</span>
                <strong className="text-red-400">TWIST:</strong> Catching a FAKE site gives you a <strong className="text-yellow-400">VIRUS</strong> and you lose a life!
              </p>
              <p className="italic text-gray-300">Lesson: Always check the website domain before you buy!</p>
            </div>
            <button 
              onClick={startGame}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg text-2xl transition-colors"
            >
              Start Shopping (Press Enter)
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-lg flex flex-col justify-center items-center text-center p-8 z-20">
            <h1 className="text-5xl font-extrabold mb-6">
              {lives <= 0 ? "You Got a Virus!" : "Game Over!"}
            </h1>
            <p className="text-2xl mb-4">Your Final Score:</p>
            <p className="text-8xl font-bold mb-8">{score}</p>
            <div className="space-x-4">
              <button 
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg text-2xl transition-colors"
              >
                Try Again (Press Enter)
              </button>
              <button 
                onClick={() => onGameComplete({ passed: score >= 50, score: score, gameType: 'shop-safe' })}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-10 rounded-lg text-2xl transition-colors"
              >
                Exit Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopSafeGame;