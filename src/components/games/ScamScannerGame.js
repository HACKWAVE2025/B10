import React, { useState, useEffect, useCallback, useRef } from 'react';

// Item database for the scanner game
const itemData = [
  { text: "From: boss@ourcompany.com", isScam: false },
  { text: "Subject: Your Weekly Report", isScam: false },
  { text: "From: secure@microsft-support.com", isScam: true },
  { text: "Click to win a FREE phone!", isScam: true },
  { text: "URGENT: Your account is locked!", isScam: true },
  { text: "From: Sarah (HR)", isScam: false },
  { text: "Your package has been delayed.", isScam: false },
  { text: "Login at http://bit.ly/secure-bank", isScam: true },
  { text: "Your Netflix payment failed.", isScam: true },
  { text: "Team meeting at 4 PM.", isScam: false },
  { text: "You've won $1,000,000!", isScam: true },
  { text: "From: it-support@ourcompany.com", isScam: false },
  { text: "Verify your Amazon account NOW.", isScam: true },
  { text: "Your friend 'Steve' needs help.", isScam: true },
  { text: "Lunch order has arrived.", isScam: false }
];

const ScamScannerGame = ({ onGameComplete, dogName, theme }) => {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'over'
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [items, setItems] = useState([]);
  const [speed, setSpeed] = useState(10); // Animation duration in seconds
  const [spawnRate, setSpawnRate] = useState(3000); // Spawn interval in ms - increased for better spacing
  const itemCounter = useRef(0);
  const timerInterval = useRef(null);
  const spawnInterval = useRef(null);
  
  // Audio system
  const audioContext = useRef(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const backgroundMusic = useRef(null);
  const bgGainNode = useRef(null);

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // Generate audio tones for different actions
  const playSound = useCallback((type) => {
    if (!audioEnabled || !audioContext.current) return;

    const ctx = audioContext.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (type) {
      case 'correct':
        // Success sound - ascending tone
        oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        oscillator.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        break;
      
      case 'incorrect':
        // Error sound - descending tone
        oscillator.frequency.setValueAtTime(415.30, ctx.currentTime); // G#4
        oscillator.frequency.exponentialRampToValueAtTime(277.18, ctx.currentTime + 0.3); // C#4
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
        break;
      
      case 'spawn':
        // Item spawn sound - quick beep
        oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;
      
      case 'warning':
        // Warning sound for missed scam
        oscillator.frequency.setValueAtTime(220, ctx.currentTime); // A3
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;
      
      case 'gameStart':
        // Game start sound - power-up
        oscillator.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
        oscillator.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.5); // C5
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.6);
        break;
      
      case 'gameEnd':
        // Game end sound - completion fanfare
        const playNote = (freq, delay, duration = 0.2) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
          gain.gain.setValueAtTime(0.08, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + duration);
        };
        
        playNote(523.25, 0);    // C5
        playNote(659.25, 0.15); // E5
        playNote(783.99, 0.3);  // G5
        playNote(1046.50, 0.45); // C6
        break;
      
      default:
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
    }
  }, [audioEnabled]);

  // Background music cleanup function
  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusic.current) {
      try {
        backgroundMusic.current.oscillators.forEach(osc => {
          try {
            osc.stop();
          } catch (e) {
            // Oscillator might already be stopped
          }
        });
      } catch (e) {
        // Handle any errors during cleanup
      }
      backgroundMusic.current = null;
    }
    if (bgGainNode.current) {
      try {
        bgGainNode.current.disconnect();
      } catch (e) {
        // Node might already be disconnected
      }
      bgGainNode.current = null;
    }
  }, []);

  // Background music system - creates ambient cybersecurity-themed music
  const createBackgroundMusic = useCallback(() => {
    if (!audioEnabled || !audioContext.current || backgroundMusic.current) return;

    const ctx = audioContext.current;
    
    // Create main gain node for background music
    bgGainNode.current = ctx.createGain();
    bgGainNode.current.gain.setValueAtTime(0.03, ctx.currentTime); // Low volume for background
    bgGainNode.current.connect(ctx.destination);

    // Create a complex ambient sound using multiple oscillators
    const createAmbientLoop = () => {
      // Bass drone
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.frequency.setValueAtTime(55, ctx.currentTime); // A1
      bassGain.gain.setValueAtTime(0.3, ctx.currentTime);
      bassOsc.connect(bassGain);
      bassGain.connect(bgGainNode.current);
      bassOsc.start();

      // Mid-range pulse
      const midOsc = ctx.createOscillator();
      const midGain = ctx.createGain();
      midOsc.frequency.setValueAtTime(220, ctx.currentTime); // A3
      midGain.gain.setValueAtTime(0, ctx.currentTime);
      
      // Create pulsing effect
      const pulseDuration = 2; // 2 seconds per pulse
      let currentTime = ctx.currentTime;
      for (let i = 0; i < 50; i++) { // Create 50 pulses (100 seconds of music)
        midGain.gain.setValueAtTime(0, currentTime + i * pulseDuration);
        midGain.gain.linearRampToValueAtTime(0.15, currentTime + i * pulseDuration + 0.1);
        midGain.gain.linearRampToValueAtTime(0, currentTime + i * pulseDuration + 0.3);
      }
      
      midOsc.connect(midGain);
      midGain.connect(bgGainNode.current);
      midOsc.start();

      // High frequency sparkle
      const hiOsc = ctx.createOscillator();
      const hiGain = ctx.createGain();
      hiOsc.frequency.setValueAtTime(1760, ctx.currentTime); // A6
      hiGain.gain.setValueAtTime(0, ctx.currentTime);
      
      // Create sparkle effect - random sparkles
      currentTime = ctx.currentTime;
      for (let i = 0; i < 30; i++) {
        const sparkleTime = currentTime + Math.random() * 100; // Random times over 100 seconds
        hiGain.gain.setValueAtTime(0, sparkleTime);
        hiGain.gain.linearRampToValueAtTime(0.08, sparkleTime + 0.05);
        hiGain.gain.linearRampToValueAtTime(0, sparkleTime + 0.2);
      }
      
      hiOsc.connect(hiGain);
      hiGain.connect(bgGainNode.current);
      hiOsc.start();

      // Store references for cleanup
      backgroundMusic.current = {
        oscillators: [bassOsc, midOsc, hiOsc],
        gainNodes: [bassGain, midGain, hiGain]
      };

      // Stop all oscillators after 100 seconds and restart
      setTimeout(() => {
        if (backgroundMusic.current && audioEnabled) {
          stopBackgroundMusic();
          createAmbientLoop(); // Restart the loop
        }
      }, 100000);
    };

    createAmbientLoop();
  }, [audioEnabled, stopBackgroundMusic]);

  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => {
      const newState = !prev;
      if (!newState) {
        // Turning off audio
        stopBackgroundMusic();
      } else {
        // Turning on audio
        setTimeout(() => {
          if (gameState === 'playing') {
            createBackgroundMusic();
          }
        }, 100);
      }
      return newState;
    });
  }, [gameState, createBackgroundMusic, stopBackgroundMusic]);

  // Generate random item
  const spawnItem = useCallback(() => {
    if (gameState !== 'playing') return;

    const item = itemData[Math.floor(Math.random() * itemData.length)];
    itemCounter.current++;
    
    const newItem = {
      id: itemCounter.current,
      text: item.text,
      isScam: item.isScam,
      x: Math.random() * 70 + 15, // Random position between 15% and 85%
      animationDuration: speed
    };

    setItems(prev => [...prev, newItem]);
    
    // Play spawn sound
    playSound('spawn');

    // Remove item after animation completes (if not dropped)
    setTimeout(() => {
      setItems(prev => {
        const stillExists = prev.find(i => i.id === newItem.id);
        if (stillExists && stillExists.isScam) {
          // Missed a scam item - penalize and play warning sound
          setScore(s => Math.max(0, s - 100));
          playSound('warning');
        }
        return prev.filter(i => i.id !== newItem.id);
      });
    }, speed * 1000);
  }, [gameState, speed, playSound]);

  // Start game
  const startGame = () => {
    // Initialize audio context on user interaction
    initAudio();
    
    setGameState('playing');
    setScore(0);
    setTimeLeft(20);
    setItems([]);
    setSpeed(10);
    setSpawnRate(3000);
    itemCounter.current = 0;

    // Play game start sound
    playSound('gameStart');
    
    // Start background music
    setTimeout(() => {
      createBackgroundMusic();
    }, 500); // Small delay to let the start sound play first

    // Start spawning items
    spawnInterval.current = setInterval(spawnItem, 3000);

    // Start game timer
    timerInterval.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // End game
  const endGame = () => {
    setGameState('over');
    clearInterval(spawnInterval.current);
    clearInterval(timerInterval.current);
    setItems([]);

    // Stop background music
    stopBackgroundMusic();

    // Play game end sound
    playSound('gameEnd');

    // Complete game after showing results
    setTimeout(() => {
      const passed = score >= 200; // Need at least 200 points to pass (adjusted for 20 second timer)
      onGameComplete({
        passed,
        score,
        accuracy: score > 0 ? Math.min(100, (score / 10)) : 0, // Rough accuracy calculation
        gameType: 'scam-scanner'
      });
    }, 3000);
  };

  // Update speed based on score - maintaining better spacing
  useEffect(() => {
    if (score > 1000) {
      setSpeed(6);
      setSpawnRate(2000); // Faster but still spaced
    } else if (score > 400) {
      setSpeed(8);
      setSpawnRate(2500); // Moderate speed
    }
  }, [score]);

  // Update spawn rate
  useEffect(() => {
    if (gameState === 'playing') {
      clearInterval(spawnInterval.current);
      spawnInterval.current = setInterval(spawnItem, spawnRate);
    }
  }, [spawnRate, spawnItem, gameState]);

  // Handle item drop
  const handleDrop = (itemId, binType) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const isCorrect = (binType === 'scam' && item.isScam) || (binType === 'safe' && !item.isScam);
    
    if (isCorrect) {
      setScore(prev => prev + 100);
      playSound('correct');
    } else {
      setScore(prev => Math.max(0, prev - 50));
      playSound('incorrect');
    }

    // Remove the item
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  // Drag handlers
  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', item.id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnBin = (e, binType) => {
    e.preventDefault();
    const itemId = parseInt(e.dataTransfer.getData('text/plain'));
    handleDrop(itemId, binType);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(spawnInterval.current);
      clearInterval(timerInterval.current);
      stopBackgroundMusic();
    };
  }, [stopBackgroundMusic]);

  if (gameState === 'start') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 text-white"
        style={{ 
          background: 'linear-gradient(135deg, #2C5282, #4A90E2, #63B3ED)',
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(139,0,0,0.3) 0%, transparent 50%)
          `
        }}
      >
        <div className="text-center max-w-2xl relative">
          {/* Scam-themed decorative elements */}
          <div className="absolute -top-10 -left-10 text-4xl opacity-30 animate-pulse">⚠️</div>
          <div className="absolute -bottom-10 -left-5 text-2xl opacity-25">🔒</div>
          <div className="absolute -bottom-5 -right-10 text-3xl opacity-30">🛡️</div>
          
          {/* Main Title with scam theme */}
          <div className="mb-6">
            <div className="text-6xl mb-2">🕵️‍♂️</div>
            <h1 className="text-6xl font-bold mb-2 text-yellow-300 drop-shadow-lg">
              SCAM SCANNER
            </h1>
            <div className="text-2xl text-blue-300 font-semibold">
              ⚡ FRAUD DETECTION UNIT ⚡
            </div>
          </div>
          
          <p className="text-gray-200 text-xl mb-8 bg-black bg-opacity-30 p-4 rounded-lg border border-blue-400">
            <span className="text-yellow-400">⚠️ MISSION BRIEFING:</span><br/>
            Malicious emails and messages detected! Sort them into SAFE or SCAM bins before they infiltrate the system!
          </p>
          
          <div className="mb-8 bg-gray-900 bg-opacity-50 p-6 rounded-xl border border-yellow-400">
            <div className="text-4xl mb-4">🧑‍🚀</div>
            <p className="text-lg text-blue-300">
              <span className="text-yellow-400 font-bold">Agent {dogName}</span> is standing by for cyber defense operations!
            </p>
          </div>
          
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-4 px-10 rounded-lg shadow-2xl text-2xl hover:from-blue-700 hover:to-blue-900 transition duration-300 border-2 border-blue-400 transform hover:scale-105"
          >
            🚀 DEPLOY SCANNER
          </button>
          
          {/* Bottom warning */}
          <div className="mt-6 text-sm text-yellow-300 animate-pulse">
            ⚠️ REVIEW REQUIRED - ANALYZE CAREFULLY ⚠️
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'over') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 text-white"
        style={{ 
          background: score >= 200 
            ? 'linear-gradient(135deg, #2C5282, #4A90E2, #63B3ED)' 
            : 'linear-gradient(135deg, #2C5282, #4A90E2, #63B3ED)',
          backgroundImage: `
            radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `
        }}
      >
        <div className="text-center max-w-2xl relative">
          {/* Result-based decorative elements */}
          {score >= 200 ? (
            <>
              <div className="absolute -top-8 -left-8 text-4xl animate-bounce">🏆</div>
              <div className="absolute -top-6 -right-10 text-3xl animate-pulse">⭐</div>
              <div className="absolute -bottom-8 -left-6 text-3xl animate-bounce">🎉</div>
              <div className="absolute -bottom-6 -right-8 text-4xl animate-pulse">✨</div>
            </>
          ) : (
            <>
              <div className="absolute -top-8 -left-8 text-4xl animate-pulse">⚠️</div>
              <div className="absolute -top-6 -right-10 text-3xl animate-bounce">🔴</div>
              <div className="absolute -bottom-8 -left-6 text-3xl animate-pulse">📊</div>
              <div className="absolute -bottom-6 -right-8 text-4xl animate-bounce">🎯</div>
            </>
          )}
          
          {/* Main Result */}
          <div className="mb-6">
            <div className="text-6xl mb-4">
              {score >= 200 ? '🛡️' : '⏰'}
            </div>
            <h1 className="text-4xl font-bold mb-4 text-yellow-300">
              {score >= 200 ? '🎉 MISSION ACCOMPLISHED!' : '⏰ TIME EXPIRED!'}
            </h1>
            <div className="text-xl text-gray-200 mb-2">THREAT ANALYSIS COMPLETE</div>
          </div>
          
          {/* Score Display */}
          <div className="bg-black bg-opacity-40 p-8 rounded-xl border-2 border-yellow-400 mb-6">
            <p className="text-gray-300 text-xl mb-4">FINAL SECURITY SCORE:</p>
            <div className="text-8xl font-bold text-yellow-400 mb-4">{score}</div>
            
            <div className={`text-lg mb-4 p-4 rounded-lg ${
              score >= 200 
                ? 'bg-blue-800 bg-opacity-50 text-blue-200 border border-blue-400' 
                : 'bg-gray-800 bg-opacity-50 text-gray-200 border border-gray-400'
            }`}>
              {score >= 200 ? (
                <>
                  <div className="text-2xl mb-2">SECURITY EXPERT CERTIFIED!</div>
                  <div>Outstanding fraud detection skills! You've successfully protected the system from cyber threats.</div>
                </>
              ) : (
                <>
                  <div className="text-2xl mb-2">🎯 TRAINING REQUIRED</div>
                  <div>Keep practicing! Cyber security requires constant vigilance and quick thinking.</div>
                </>
              )}
            </div>
            
            <div className="text-sm text-gray-400 border-t border-gray-600 pt-4">
              <div className="flex justify-center gap-8">
                <div>🎯 Accuracy: {score > 0 ? Math.min(100, Math.round(score / 10)) : 0}%</div>
                <div>⚡ Threat Level: {score >= 200 ? 'CONTAINED' : 'ACTIVE'}</div>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-yellow-300 bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-yellow-600">
            <span className="font-bold">Agent {dogName}</span> has completed cyber security training and is now better equipped to detect digital threats!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col text-white relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #1a1a1a, #2d1b2e, #1a1a1a)',
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(220,20,60,0.3) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255,69,0,0.2) 0%, transparent 50%)
        `
      }}
    >
      {/* Animated warning elements */}
      <div className="absolute top-10 left-10 text-red-400 text-2xl animate-pulse">⚠️</div>
      <div className="absolute top-20 right-20 text-yellow-400 text-xl animate-bounce">🚨</div>
      <div className="absolute bottom-40 left-1/4 text-orange-400 text-lg animate-pulse">🔥</div>
      <div className="absolute bottom-60 right-1/3 text-red-300 text-xl animate-bounce">⚡</div>
      
      {/* Stats Bar with Scam Theme */}
      <div className="w-full max-w-4xl mx-auto my-4 z-10">
        <div className="flex justify-between items-center bg-gradient-to-r from-gray-900 to-black p-4 rounded-lg shadow-2xl border-2 border-red-500">
          <div className="flex items-center gap-4">
            <div className="text-yellow-400 text-2xl">🛡️</div>
            <div>
              <span className="text-gray-400 text-lg">SECURITY SCORE:</span>
              <span className="font-bold text-3xl text-yellow-400 ml-2">{score}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-lg border-2 transition-all ${
                audioEnabled 
                  ? 'bg-blue-600 border-blue-400 text-white hover:bg-blue-700' 
                  : 'bg-gray-600 border-gray-400 text-gray-300 hover:bg-gray-700'
              }`}
              title={audioEnabled ? 'Mute Audio' : 'Enable Audio'}
            >
              <span className="text-xl">{audioEnabled ? '🔊' : '🔇'}</span>
            </button>
            
            <div className="text-red-400 text-2xl">⏱️</div>
            <div>
              <span className="text-gray-400 text-lg">THREAT TIMER:</span>
              <span className={`font-bold text-3xl ml-2 ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                {timeLeft}s
              </span>
            </div>
            </div>
        </div>
      </div>      {/* Conveyor Belt Area - Cyber Security Command Center */}
      <div className="flex-1 w-full relative overflow-hidden border-t-4 border-red-500 border-b-4 border-red-500" 
           style={{ background: 'linear-gradient(to bottom, #2a2a2a, #1a1a1a)' }}>
        
        {/* Cyber grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,0,0,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,0,0,0.3) 1px, transparent 1px),
              linear-gradient(rgba(255,255,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px, 50px 50px, 100% 100px',
            animation: 'cyberScan 3s linear infinite'
          }}
        />
        
        {/* Status indicators */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-60 p-2 rounded border border-red-400">
          <div className="text-red-400 text-sm font-mono">🔴 THREAT DETECTION ACTIVE</div>
        </div>
        <div className="absolute top-4 right-4 bg-black bg-opacity-60 p-2 rounded border border-yellow-400">
          <div className="text-yellow-400 text-sm font-mono">⚡ SCANNING IN PROGRESS</div>
        </div>
        
        {/* Falling Items - Enhanced Scam Theme */}
        {items.map(item => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className="absolute w-80 p-6 rounded-xl shadow-2xl cursor-grab active:cursor-grabbing transform hover:scale-110 transition-all duration-300 border-2 bg-gradient-to-br from-slate-700 to-slate-800 text-white border-slate-400 hover:border-blue-400"
            style={{
              left: `${item.x}%`,
              animation: `fallDown ${item.animationDuration}s linear forwards`,
              top: '-120px',
              boxShadow: '0 0 25px rgba(148, 163, 184, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)',
              minHeight: '120px'
            }}
          >
            {/* Header with icon */}
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl mr-3">📧</span>
              <span className="text-sm font-mono bg-slate-900 bg-opacity-60 px-3 py-1 rounded-full border border-slate-500">
                MESSAGE
              </span>
            </div>
            
            {/* Message content with better spacing */}
            <div className="text-center px-2">
              <div className="text-base leading-relaxed font-medium break-words">
                {item.text}
              </div>
            </div>
            
            {/* Drag indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-slate-400 text-xs">
              ↕️ Drag to sort
            </div>
          </div>
        ))}
      </div>

      {/* Drop Bins - Enhanced Security Theme */}
      <div className="w-full grid grid-cols-2 relative">
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDropOnBin(e, 'safe')}
          className="h-48 bg-gradient-to-t from-blue-700 to-blue-600 border-t-8 border-blue-400 flex flex-col justify-center items-center text-white hover:from-blue-800 hover:to-blue-700 transition-all duration-300 relative group"
          style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)' }}
        >
          <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="text-6xl mb-2 animate-pulse">🛡️</div>
          <h2 className="text-3xl font-bold font-mono">SECURE ZONE</h2>
          <div className="text-sm text-blue-200 font-mono">VERIFIED SAFE</div>
        </div>
        
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDropOnBin(e, 'scam')}
          className="h-48 bg-gradient-to-t from-gray-700 to-gray-600 border-t-8 border-gray-400 flex flex-col justify-center items-center text-white hover:from-gray-800 hover:to-gray-700 transition-all duration-300 relative group"
          style={{ boxShadow: '0 0 30px rgba(107, 114, 128, 0.3)' }}
        >
          <div className="absolute inset-0 bg-gray-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="text-6xl mb-2 animate-pulse">🚨</div>
          <h2 className="text-3xl font-bold font-mono">THREAT ZONE</h2>
          <div className="text-sm text-gray-200 font-mono">MALICIOUS DETECTED</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes cyberScan {
          0% { background-position: 0 0, 0 0, 0 0; }
          100% { background-position: 50px 50px, -50px -50px, 0 -100px; }
        }
        
        @keyframes fallDown {
          from { top: -120px; }
          to { top: calc(100vh - 280px); }
        }
      `}</style>
    </div>
  );
};

export default ScamScannerGame;