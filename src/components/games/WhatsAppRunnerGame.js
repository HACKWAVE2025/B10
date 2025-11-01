import React, { useState, useEffect, useRef } from 'react';

const WhatsAppRunnerGame = ({ onGameComplete, dogName, island, theme }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // start, playing, gameOver
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const gameLoopRef = useRef(null);
  
  // Game configuration
  const GROUND_Y = 400;
  const PLAYER_WIDTH = 50;
  const PLAYER_HEIGHT = 50;
  const PLAYER_X_POSITION = 100;
  const PLAYER_SLIDE_HEIGHT = 25;
  const GRAVITY = 0.8;
  const JUMP_POWER = -18;
  
  // Game state
  const gameStateRef = useRef({
    gameSpeed: 4, // Increased back to faster speed
    spawnTimer: 0,
    spawnInterval: 150, // Reduced interval for faster gameplay but still reasonable
    player: {
      x: PLAYER_X_POSITION,
      y: GROUND_Y - PLAYER_HEIGHT,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      dy: 0,
      isJumping: false,
      isSliding: false
    },
    obstacles: [],
    collectibles: [],
    backgroundObjects: []
  });

  const SPAM_MESSAGES = ["💰 FREE $500!", "🎁 YOU WON!", "⚡ CLICK HERE!", "💸 EASY MONEY!", "🔥 LIMITED OFFER!", "💎 GET RICH NOW!"];
  const POPUP_MESSAGES = ["⚠️ VIRUS FOUND!", "🚨 UPDATE URGENT!", "❌ SECURITY ALERT!", "⛔ PHONE AT RISK!", "🔒 ACCOUNT LOCKED!"];
  const SAFE_MESSAGES = ["Hey there! 😊", "How are you?", "See you later", "Thanks a lot!", "Good morning", "Have a great day!"];

  const startGame = () => {
    setScore(0);
    setLives(3);
    setGameState('playing');
    
    // Reset game state
    gameStateRef.current = {
      gameSpeed: 4, // Increased back to faster speed
      spawnTimer: 0,
      spawnInterval: 150, // Reduced interval for faster gameplay but still reasonable
      player: {
        x: PLAYER_X_POSITION,
        y: GROUND_Y - PLAYER_HEIGHT,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        dy: 0,
        isJumping: false,
        isSliding: false
      },
      obstacles: [],
      collectibles: [],
      backgroundObjects: []
    };
    
    generateInitialBackground();
  };

  const endGame = () => {
    setGameState('gameOver');
  };

  const generateInitialBackground = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    for (let i = 0; i < 15; i++) {
      spawnBackgroundBubble(Math.random() * canvas.width);
    }
  };

  const spawnBackgroundBubble = (xPos) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    gameStateRef.current.backgroundObjects.push({
      x: xPos || canvas.width + 50,
      y: Math.random() * (canvas.height - 100),
      width: Math.random() * 50 + 80,
      height: 40,
      color: Math.random() < 0.5 ? '#f0fdf4' : '#f7fafc',
      speed: Math.random() * 0.5 + 0.2
    });
  };

  const updatePlayer = () => {
    const player = gameStateRef.current.player;
    
    // Apply gravity
    if (player.y + player.height < GROUND_Y || player.dy < 0) {
      player.dy += GRAVITY;
      player.y += player.dy;
    }

    // Prevent falling through floor
    if (player.y + player.height > GROUND_Y) {
      player.y = GROUND_Y - player.height;
      player.dy = 0;
      player.isJumping = false;
    }
  };

  const spawnEntity = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const state = gameStateRef.current;
    state.spawnTimer++;
    
    if (state.spawnTimer < state.spawnInterval) return;
    
    state.spawnTimer = 0;
    
    // Increase difficulty more gradually
    if (score > 0 && score % 800 === 0) { // Reduced from 1000 to 800 for faster progression
      state.gameSpeed = Math.min(7, state.gameSpeed + 0.15); // Increased max speed to 7, slightly larger increments
      state.spawnInterval = Math.max(100, state.spawnInterval - 2); // Smaller decrease rate
    }

    const entityType = Math.random();
    
    if (entityType < 0.35) { // Reduced from 0.4 to 0.35 - fewer red obstacles
      // Spawn obstacle (jump) - made much smaller and easier to dodge
      state.obstacles.push({
        x: canvas.width + 50,
        y: GROUND_Y - 30, // Reduced height even more
        width: 80, // Reduced width from 100 to 80
        height: 30, // Reduced height from 35 to 30
        type: 'spam',
        text: SPAM_MESSAGES[Math.floor(Math.random() * SPAM_MESSAGES.length)],
        color: '#e53e3e'
      });
    } else if (entityType < 0.55) { // Reduced from 0.6 to 0.55 - fewer orange obstacles
      // Spawn obstacle (slide) - made much smaller and easier to dodge
      state.obstacles.push({
        x: canvas.width + 50,
        y: GROUND_Y - 100, // Raised even higher to make sliding much easier
        width: 80, // Reduced width from 100 to 80
        height: 40, // Reduced height from 50 to 40
        type: 'popup',
        text: POPUP_MESSAGES[Math.floor(Math.random() * POPUP_MESSAGES.length)],
        color: '#dd6b20'
      });
    } else {
      // Spawn collectible - made larger for better readability
      state.collectibles.push({
        x: canvas.width + 50,
        y: GROUND_Y - 90, // Adjusted position
        width: 120, // Increased width from 100 to 120
        height: 45, // Increased height from 35 to 45
        type: 'safe',
        text: SAFE_MESSAGES[Math.floor(Math.random() * SAFE_MESSAGES.length)]
      });
    }
  };

  const updateEntities = (entityArray, isObstacle) => {
    const state = gameStateRef.current;
    const player = state.player;
    
    for (let i = entityArray.length - 1; i >= 0; i--) {
      let entity = entityArray[i];
      entity.x -= state.gameSpeed;

      // Check for collision with player
      if (
        player.x < entity.x + entity.width &&
        player.x + player.width > entity.x &&
        player.y < entity.y + entity.height &&
        player.y + player.height > entity.y
      ) {
        if (isObstacle) {
          // Hit obstacle
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setTimeout(() => endGame(), 100);
            }
            return newLives;
          });
          entityArray.splice(i, 1);
        } else {
          // Hit collectible
          setScore(prev => prev + 50);
          entityArray.splice(i, 1);
        }
        continue;
      }

      // Remove if off-screen
      if (entity.x + entity.width < 0) {
        entityArray.splice(i, 1);
      }
    }
  };

  const updateBackground = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (Math.random() < 0.01) {
      spawnBackgroundBubble();
    }
    
    const bgObjects = gameStateRef.current.backgroundObjects;
    for (let i = bgObjects.length - 1; i >= 0; i--) {
      let bgObj = bgObjects[i];
      bgObj.x -= bgObj.speed;
      
      if (bgObj.x + bgObj.width < 0) {
        bgObjects.splice(i, 1);
      }
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background gradient (WhatsApp style)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#e2e8f0');
    gradient.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw background chat bubbles
    state.backgroundObjects.forEach(bgObj => {
      ctx.fillStyle = bgObj.color;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.roundRect(bgObj.x, bgObj.y, bgObj.width, bgObj.height, 15);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });
    
    // Draw ground
    ctx.fillStyle = '#a0aec0';
    ctx.fillRect(0, GROUND_Y, canvas.width, 50);
    
    // Draw player
    const player = state.player;
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.roundRect(player.x, player.y, player.width, player.height, 10);
    ctx.fill();
    
    // Draw player face
    ctx.fillStyle = 'white';
    if (player.isSliding) {
      ctx.fillRect(player.x + 15, player.y + 10, 8, 8);
      ctx.fillRect(player.x + 30, player.y + 10, 8, 8);
    } else {
      ctx.fillRect(player.x + 12, player.y + 15, 8, 8);
      ctx.fillRect(player.x + 30, player.y + 15, 8, 8);
      ctx.fillRect(player.x + 15, player.y + 35, 20, 5);
    }
    
    // Draw obstacles
    state.obstacles.forEach(obs => {
      ctx.fillStyle = obs.color;
      ctx.beginPath();
      ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 10);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = '600 20px Arial'; // Increased from 16px to 20px
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obs.text, obs.x + obs.width / 2, obs.y + obs.height / 2);
    });
    
    // Draw collectibles
    state.collectibles.forEach(col => {
      ctx.fillStyle = '#38a169';
      ctx.beginPath();
      ctx.roundRect(col.x, col.y, col.width, col.height, 10);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = '600 18px Arial'; // Increased from 14px to 18px
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(col.text, col.x + col.width / 2, col.y + col.height / 2);
    });
  };

  const gameLoop = () => {
    if (gameState !== 'playing') return;
    
    updateBackground();
    updatePlayer();
    spawnEntity();
    updateEntities(gameStateRef.current.obstacles, true);
    updateEntities(gameStateRef.current.collectibles, false);
    draw();
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = 800;
    canvas.height = 450;
    
    // Add support for roundRect if not available
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        this.beginPath();
        this.moveTo(x + r, y);
        this.lineTo(x + w - r, y);
        this.quadraticCurveTo(x + w, y, x + w, y + r);
        this.lineTo(x + w, y + h - r);
        this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.lineTo(x + r, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r);
        this.lineTo(x, y + r);
        this.quadraticCurveTo(x, y, x + r, y);
        this.closePath();
      };
    }
    
    // Initial draw
    draw();
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoop();
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState === 'playing') {
        const player = gameStateRef.current.player;
        
        if ((e.code === 'Space' || e.code === 'ArrowUp') && !player.isJumping && !player.isSliding) {
          player.dy = JUMP_POWER;
          player.isJumping = true;
        } else if (e.code === 'ArrowDown' && !player.isJumping) {
          if (!player.isSliding) {
            player.isSliding = true;
            player.y += (PLAYER_HEIGHT - PLAYER_SLIDE_HEIGHT);
            player.height = PLAYER_SLIDE_HEIGHT;
          }
        }
      } else if (e.key === 'Enter') {
        if (gameState === 'start' || gameState === 'gameOver') {
          startGame();
        }
      }
    };

    const handleKeyUp = (e) => {
      if (gameState === 'playing' && e.code === 'ArrowDown') {
        const player = gameStateRef.current.player;
        if (player.isSliding) {
          player.isSliding = false;
          player.y -= (PLAYER_HEIGHT - PLAYER_SLIDE_HEIGHT);
          player.height = PLAYER_HEIGHT;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="relative w-[800px] h-[450px] border-4 border-gray-600 rounded-lg overflow-hidden bg-gray-200">
        <canvas 
          ref={canvasRef}
          className="block"
        />
        
        {/* Game HUD */}
        {gameState === 'playing' && (
          <div className="absolute top-0 left-0 w-full p-4 flex justify-between z-10">
            <div className="bg-gray-900 bg-opacity-70 p-3 rounded-lg">
              <span className="text-gray-400 text-lg">Score:</span>
              <span className="font-bold text-3xl text-blue-400 ml-2">{score}</span>
            </div>
            <div className="bg-gray-900 bg-opacity-70 p-3 rounded-lg">
              <span className="text-gray-400 text-lg">Lives:</span>
              <span className="font-bold text-3xl text-red-500 ml-2">
                {'❤️ '.repeat(Math.max(0, lives)) || '💔'}
              </span>
            </div>
          </div>
        )}

        {/* Start Screen */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-95 flex flex-col justify-center items-center text-center text-white p-8 z-20">
            <h1 className="text-6xl font-bold text-white mb-6">WhatsApp Dash</h1>
            
            <div className="max-w-xl w-full bg-gray-800 p-6 rounded-lg shadow-2xl mb-8 border border-gray-700">
              <h2 className="text-3xl font-bold text-blue-400 mb-4">How to Play</h2>
              
              <div className="flex justify-around items-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 bg-gray-700 rounded border-b-4 border-gray-900 font-semibold">SPACE</span>
                    <span className="text-gray-300">or</span>
                    <span className="px-4 py-2 bg-gray-700 rounded border-b-4 border-gray-900 font-semibold">↑</span>
                  </div>
                  <p className="mt-2 text-lg text-green-400 font-medium">to JUMP over spam</p>
                  <div className="w-24 h-10 bg-red-600 rounded-lg flex items-center justify-center mt-2">
                    <span className="text-white text-xl">⚠️</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <span className="px-4 py-2 bg-gray-700 rounded border-b-4 border-gray-900 font-semibold">↓</span>
                  <p className="mt-2 text-lg text-green-400 font-medium">to SLIDE under pop-ups</p>
                  <div className="w-24 h-10 bg-orange-500 rounded-lg flex items-center justify-center mt-2">
                    <span className="text-white text-xl">📋</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={startGame}
              className="bg-blue-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg text-2xl hover:bg-blue-700 transition duration-300"
            >
              Start Dashing (Press Enter)
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-95 flex flex-col justify-center items-center text-white z-20">
            <h1 className="text-4xl font-bold text-white mb-4">CRASHED!</h1>
            <p className="text-gray-300 text-xl mb-6">Your final score:</p>
            <div className="text-8xl font-bold text-blue-400 mb-10">{score}</div>
            <div className="space-x-4">
              <button 
                onClick={startGame}
                className="bg-blue-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg text-2xl hover:bg-blue-700 transition duration-300"
              >
                Try Again (Press Enter)
              </button>
              <button 
                onClick={() => onGameComplete({ passed: score >= 400, score: score, gameType: 'whatsapp-runner' })}
                className="bg-gray-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg text-2xl hover:bg-gray-700 transition duration-300"
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

export default WhatsAppRunnerGame;