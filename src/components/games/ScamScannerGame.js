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
  const [timeLeft, setTimeLeft] = useState(60);
  const [items, setItems] = useState([]);
  const [speed, setSpeed] = useState(10); // Animation duration in seconds
  const [spawnRate, setSpawnRate] = useState(2000); // Spawn interval in ms
  const itemCounter = useRef(0);
  const timerInterval = useRef(null);
  const spawnInterval = useRef(null);

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

    // Remove item after animation completes (if not dropped)
    setTimeout(() => {
      setItems(prev => {
        const stillExists = prev.find(i => i.id === newItem.id);
        if (stillExists && stillExists.isScam) {
          // Missed a scam item - penalize
          setScore(s => Math.max(0, s - 100));
        }
        return prev.filter(i => i.id !== newItem.id);
      });
    }, speed * 1000);
  }, [gameState, speed]);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setItems([]);
    setSpeed(10);
    setSpawnRate(2000);
    itemCounter.current = 0;

    // Start spawning items
    spawnInterval.current = setInterval(spawnItem, 2000);

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

    // Complete game after showing results
    setTimeout(() => {
      const passed = score >= 300; // Need at least 300 points to pass
      onGameComplete({
        passed,
        score,
        accuracy: score > 0 ? Math.min(100, (score / 10)) : 0, // Rough accuracy calculation
        gameType: 'scam-scanner'
      });
    }, 3000);
  };

  // Update speed based on score
  useEffect(() => {
    if (score > 1500) {
      setSpeed(5);
      setSpawnRate(1000);
    } else if (score > 500) {
      setSpeed(7);
      setSpawnRate(1500);
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
    } else {
      setScore(prev => Math.max(0, prev - 50));
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
    };
  }, []);

  if (gameState === 'start') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 text-white"
        style={{ 
          background: 'linear-gradient(135deg, #8B0000, #DC143C, #B22222)',
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
          <div className="absolute -top-5 -right-15 text-3xl opacity-20 animate-bounce">�</div>
          <div className="absolute -bottom-10 -left-5 text-2xl opacity-25">🔒</div>
          <div className="absolute -bottom-5 -right-10 text-3xl opacity-30">🛡️</div>
          
          {/* Main Title with scam theme */}
          <div className="mb-6">
            <div className="text-6xl mb-2">🕵️‍♂️</div>
            <h1 className="text-6xl font-bold mb-2 text-yellow-300 drop-shadow-lg">
              SCAM SCANNER
            </h1>
            <div className="text-2xl text-red-300 font-semibold">
              ⚡ FRAUD DETECTION UNIT ⚡
            </div>
          </div>
          
          <p className="text-gray-200 text-xl mb-8 bg-black bg-opacity-30 p-4 rounded-lg border border-red-400">
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
            className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-4 px-10 rounded-lg shadow-2xl text-2xl hover:from-red-700 hover:to-red-900 transition duration-300 border-2 border-yellow-400 transform hover:scale-105"
          >
            🚀 DEPLOY SCANNER
          </button>
          
          {/* Bottom warning */}
          <div className="mt-6 text-sm text-yellow-300 animate-pulse">
            🔥 HIGH THREAT LEVEL - IMMEDIATE ACTION REQUIRED 🔥
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
          background: score >= 300 
            ? 'linear-gradient(135deg, #0F5132, #198754, #20C997)' 
            : 'linear-gradient(135deg, #8B0000, #DC143C, #B22222)',
          backgroundImage: `
            radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `
        }}
      >
        <div className="text-center max-w-2xl relative">
          {/* Result-based decorative elements */}
          {score >= 300 ? (
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
              {score >= 300 ? '🛡️' : '⏰'}
            </div>
            <h1 className="text-4xl font-bold mb-4 text-yellow-300">
              {score >= 300 ? '🎉 MISSION ACCOMPLISHED!' : '⏰ TIME EXPIRED!'}
            </h1>
            <div className="text-xl text-gray-200 mb-2">THREAT ANALYSIS COMPLETE</div>
          </div>
          
          {/* Score Display */}
          <div className="bg-black bg-opacity-40 p-8 rounded-xl border-2 border-yellow-400 mb-6">
            <p className="text-gray-300 text-xl mb-4">FINAL SECURITY SCORE:</p>
            <div className="text-8xl font-bold text-yellow-400 mb-4">{score}</div>
            
            <div className={`text-lg mb-4 p-4 rounded-lg ${
              score >= 300 
                ? 'bg-green-800 bg-opacity-50 text-green-200 border border-green-400' 
                : 'bg-red-800 bg-opacity-50 text-red-200 border border-red-400'
            }`}>
              {score >= 300 ? (
                <>
                  <div className="text-2xl mb-2">� SECURITY EXPERT CERTIFIED!</div>
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
                <div>⚡ Threat Level: {score >= 300 ? 'CONTAINED' : 'ACTIVE'}</div>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-yellow-300 bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-yellow-600">
            �️ <span className="font-bold">Agent {dogName}</span> has completed cyber security training and is now better equipped to detect digital threats!
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
          <div className="flex items-center gap-4">
            <div className="text-red-400 text-2xl">⏱️</div>
            <div>
              <span className="text-gray-400 text-lg">THREAT TIMER:</span>
              <span className={`font-bold text-3xl ml-2 ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conveyor Belt Area - Cyber Security Command Center */}
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
            className={`absolute w-64 p-4 rounded-lg shadow-2xl font-semibold text-lg text-center cursor-grab active:cursor-grabbing transform hover:scale-105 transition-all duration-200 border-2
              ${item.isScam 
                ? 'bg-gradient-to-br from-red-600 to-red-800 text-white border-red-300 shadow-red-500/50' 
                : 'bg-gradient-to-br from-green-600 to-green-800 text-white border-green-300 shadow-green-500/50'
              }`}
            style={{
              left: `${item.x}%`,
              animation: `fallDown ${item.animationDuration}s linear forwards`,
              top: '-100px',
              boxShadow: item.isScam 
                ? '0 0 20px rgba(239, 68, 68, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)' 
                : '0 0 20px rgba(34, 197, 94, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl mr-2">{item.isScam ? '🚨' : '✅'}</span>
              <span className="text-xs font-mono bg-black bg-opacity-30 px-2 py-1 rounded">
                {item.isScam ? 'THREAT' : 'SECURE'}
              </span>
            </div>
            <div className="text-sm leading-tight">{item.text}</div>
          </div>
        ))}
      </div>

      {/* Drop Bins - Enhanced Security Theme */}
      <div className="w-full grid grid-cols-2 relative">
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDropOnBin(e, 'safe')}
          className="h-48 bg-gradient-to-t from-green-700 to-green-600 border-t-8 border-green-400 flex flex-col justify-center items-center text-white hover:from-green-800 hover:to-green-700 transition-all duration-300 relative group"
          style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)' }}
        >
          <div className="absolute inset-0 bg-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="text-6xl mb-2 animate-pulse">🛡️</div>
          <h2 className="text-3xl font-bold font-mono">SECURE ZONE</h2>
          <div className="text-sm text-green-200 font-mono">VERIFIED SAFE</div>
        </div>
        
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDropOnBin(e, 'scam')}
          className="h-48 bg-gradient-to-t from-red-700 to-red-600 border-t-8 border-red-400 flex flex-col justify-center items-center text-white hover:from-red-800 hover:to-red-700 transition-all duration-300 relative group"
          style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)' }}
        >
          <div className="absolute inset-0 bg-red-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="text-6xl mb-2 animate-pulse">🚨</div>
          <h2 className="text-3xl font-bold font-mono">THREAT ZONE</h2>
          <div className="text-sm text-red-200 font-mono">MALICIOUS DETECTED</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes cyberScan {
          0% { background-position: 0 0, 0 0, 0 0; }
          100% { background-position: 50px 50px, -50px -50px, 0 -100px; }
        }
        
        @keyframes fallDown {
          from { top: -100px; }
          to { top: calc(100vh - 250px); }
        }
      `}</style>
    </div>
  );
};

export default ScamScannerGame;