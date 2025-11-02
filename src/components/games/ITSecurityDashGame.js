import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const ITSecurityDashGame = ({ onGameComplete, dogName, island, theme }) => {
  // Game State
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameOver'
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [popups, setPopups] = useState([]);
  const [currentMinigame, setCurrentMinigame] = useState(null);
  const [currentPopup, setCurrentPopup] = useState(null);

  // Enhanced Minigame States
  const [keypadSequence, setKeypadSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [keypadLevel, setKeypadLevel] = useState(3);
  const [keypadActive, setKeypadActive] = useState(false);
  const [flashingNumber, setFlashingNumber] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Puzzle state - simplified for beginner tasks
  const [cipherPuzzle, setCipherPuzzle] = useState(null);

  // Audio system
  const audioContext = useRef(null);
  const [audioEnabled] = useState(true);

  // Refs
  const gameIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const uploadIntervalRef = useRef(null);
  const popupTimeoutRefs = useRef(new Map());

  // Game Data - enhanced with logical cybersecurity challenges
  const itemData = useMemo(() => [
    // Safe Tasks
    { stationId: 'station-email', title: 'Backup Complete', text: 'Email server backup finished successfully.', isScam: false, taskType: 'simple-clear' },
    { stationId: 'station-main', title: 'Update Installed', text: 'OS update v1.2.3 installed.', isScam: false, taskType: 'simple-clear' },
    { stationId: 'station-db', title: 'Query OK', text: 'Database optimization complete.', isScam: false, taskType: 'simple-clear' },
    { stationId: 'station-mobile', title: 'New Device', text: 'New user device registered.', isScam: false, taskType: 'simple-clear' },

    // Beginner-friendly Security Tasks - Password and Basic Security
    { 
      stationId: 'station-mobile', 
      title: '� WEAK PASSWORD DETECTED', 
      text: 'Choose the strongest password to secure your account!', 
      isScam: true, 
      taskType: 'password-strength' 
    },
    { 
      stationId: 'station-email', 
      title: '📧 SUSPICIOUS EMAIL', 
      text: 'Identify which email is safe to open!', 
      isScam: true, 
      taskType: 'email-safety' 
    },
    { 
      stationId: 'station-firewall', 
      title: '� SECURE CONNECTION', 
      text: 'Choose the secure website link!', 
      isScam: true, 
      taskType: 'link-safety' 
    }
  ], []);

  // Initialize audio context
  const initAudio = useCallback(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // Enhanced audio system with different tones than game 1
  const playSound = useCallback((type) => {
    if (!audioEnabled || !audioContext.current) return;

    const ctx = audioContext.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (type) {
      case 'alert':
        // Urgent alert sound - high frequency alarm
        oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        oscillator.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        break;
      
      case 'secure':
        // Security cleared sound - confident tone
        oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4
        oscillator.frequency.exponentialRampToValueAtTime(554.37, ctx.currentTime + 0.15); // C#5
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.25);
        break;
      
      case 'breach':
        // Security breach sound - ominous low tone
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
        break;
      
      case 'success':
        // Task completed successfully - triumph chord
        const playChord = (freq, delay, duration = 0.2) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
          gain.gain.setValueAtTime(0.06, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + duration);
        };
        
        playChord(349.23, 0);    // F4
        playChord(440, 0.1);     // A4
        playChord(523.25, 0.2);  // C5
        break;
      
      case 'error':
        // Wrong input sound - sharp dissonance
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        break;
      
      case 'keypad':
        // Keypad beep - short click
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;

      default:
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
    }
  }, [audioEnabled]);

  const stations = useMemo(() => [
    { id: 'station-email', icon: '📧', title: 'Email Server', position: { top: '10%', left: '10%' } },
    { id: 'station-firewall', icon: '🔥', title: 'Firewall', position: { top: '10%', right: '10%' } },
    { id: 'station-main', icon: '🖥️', title: 'Mainframe', position: { top: '50%', left: '50%', transform: 'translateX(-50%)' } },
    { id: 'station-mobile', icon: '📱', title: 'Mobile Network', position: { bottom: '10%', left: '25%' } },
    { id: 'station-db', icon: '🗄️', title: 'Database', position: { bottom: '10%', right: '25%' } }
  ], []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
    popupTimeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    popupTimeoutRefs.current.clear();
  }, []);

  // Start Game
  const startGame = useCallback(() => {
    // Initialize audio context on user interaction
    initAudio();
    
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    setPopups([]);
    setCurrentMinigame(null);
    setCurrentPopup(null);

    // Reset puzzle state
    setCipherPuzzle(null);

    // Play start sound
    playSound('secure');

    // Start spawning popups
    gameIntervalRef.current = setInterval(() => {
      // Use a state updater function to check current minigame state
      setCurrentMinigame(currentMini => {
        if (currentMini) {
          return currentMini; // Don't spawn new popups if minigame is active
        }
        
        // Check current popup count to avoid overcrowding
        setPopups(currentPopups => {
          if (currentPopups.length >= 3) {
            return currentPopups; // Don't spawn if we already have 3+ popups
          }
          
          // Only spawn if no minigame is active and not too many popups
          const item = itemData[Math.floor(Math.random() * itemData.length)];
          const id = `popup-${Date.now()}`;
          
          const newPopup = {
            id,
            ...item,
            station: stations.find(s => s.id === item.stationId)
          };

          const updatedPopups = [...currentPopups, newPopup];

          // Auto-remove after 8 seconds
          const timeout = setTimeout(() => {
            if (item.isScam) {
              setScore(prev => prev - 100);
            }
            setPopups(prev => prev.filter(p => p.id !== id));
            popupTimeoutRefs.current.delete(id);
          }, 8000);

          popupTimeoutRefs.current.set(id, timeout);
          return updatedPopups;
        });
        
        return currentMini; // Return the current state unchanged
      });
    }, 3000);

    // Start timer
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('gameOver');
          if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          setPopups([]);
          setCurrentMinigame(null);
          setCurrentPopup(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [itemData, stations, initAudio, playSound]);

  // Flash sequence function
  const flashSequence = useCallback(async (sequence) => {
    setKeypadActive(false);
    setFlashingNumber(null);
    
    // Wait a moment before starting
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Flash each number in sequence
    for (let i = 0; i < sequence.length; i++) {
      const number = sequence[i];
      setFlashingNumber(number);
      await new Promise(resolve => setTimeout(resolve, 600)); // Flash duration
      setFlashingNumber(null);
      await new Promise(resolve => setTimeout(resolve, 200)); // Pause between flashes
    }
    
    // After sequence is shown, allow player input
    setKeypadActive(true);
  }, []);

  // Beginner-friendly Puzzle Generation Functions
  const generatePasswordPuzzle = useCallback(() => {
    const passwords = [
      { weak: 'password123', strong: 'P@ssw0rd!2024' },
      { weak: 'admin', strong: 'Adm1n$ecur3' },
      { weak: '12345', strong: 'MyStr0ng!P@ss' },
      { weak: 'qwerty', strong: 'Qu3rty#2024!' }
    ];
    
    const selected = passwords[Math.floor(Math.random() * passwords.length)];
    const allPasswords = [selected.strong, selected.weak, 'TempPass1', 'user123'];
    const shuffled = allPasswords.sort(() => Math.random() - 0.5);
    
    return {
      items: shuffled,
      correctAnswer: selected.strong,
      description: "Which password is the STRONGEST and most secure?",
      type: 'password-strength'
    };
  }, []);

  const generateEmailSafetyPuzzle = useCallback(() => {
    const emails = [
      { email: 'Your bank: Click here to verify account immediately!', safe: false, reason: 'Urgent/threatening language' },
      { email: 'Weekly newsletter from your favorite store', safe: true, reason: 'Normal business communication' },
      { email: 'You won $1,000,000! Click to claim prize now!', safe: false, reason: 'Too good to be true offer' },
      { email: 'Meeting reminder for tomorrow at 2 PM', safe: true, reason: 'Normal work communication' }
    ];
    
    const safeEmails = emails.filter(e => e.safe).slice(0, 2);
    const dangerousEmails = emails.filter(e => !e.safe).slice(0, 2);
    const allEmails = [...safeEmails, ...dangerousEmails];
    const shuffled = allEmails.sort(() => Math.random() - 0.5);
    
    return {
      items: shuffled.map(e => e.email),
      correctAnswer: safeEmails[0].email,
      description: "Which email is SAFE to open?",
      type: 'email-safety'
    };
  }, []);

  const generateLinkSafetyPuzzle = useCallback(() => {
    const links = [
      { url: 'https://secure-bank.com/login', safe: true },
      { url: 'http://bank-security.net/verify-urgent', safe: false },
      { url: 'https://amazon.com/account', safe: true },
      { url: 'http://amaz0n-security.org/update', safe: false }
    ];
    
    const safeLinks = links.filter(l => l.safe).slice(0, 2);
    const dangerousLinks = links.filter(l => !l.safe).slice(0, 2);
    const allLinks = [...safeLinks, ...dangerousLinks];
    const shuffled = allLinks.sort(() => Math.random() - 0.5);
    
    return {
      items: shuffled.map(l => l.url),
      correctAnswer: safeLinks[0].url,
      description: "Which website link is SECURE to visit?",
      type: 'link-safety'
    };
  }, []);

  // Handle popup click
  const onPopupClick = useCallback((popup) => {
    // Clear timeout
    const timeout = popupTimeoutRefs.current.get(popup.id);
    if (timeout) {
      clearTimeout(timeout);
      popupTimeoutRefs.current.delete(popup.id);
    }

    if (popup.isScam) {
      // Play alert sound
      playSound('alert');
      
      // Start appropriate minigame based on task type
      setCurrentPopup(popup);
      setCurrentMinigame(popup.taskType);
      
      if (popup.taskType === 'password-strength') {
        const puzzle = generatePasswordPuzzle();
        setCipherPuzzle(puzzle);
      } else if (popup.taskType === 'email-safety') {
        const puzzle = generateEmailSafetyPuzzle();
        setCipherPuzzle(puzzle);
      } else if (popup.taskType === 'link-safety') {
        const puzzle = generateLinkSafetyPuzzle();
        setCipherPuzzle(puzzle);
      } else if (popup.taskType === 'keypad') {
        // Keep existing keypad game for variety
        const sequence = [];
        for (let i = 0; i < keypadLevel; i++) {
          sequence.push(Math.floor(Math.random() * 9) + 1);
        }
        setKeypadSequence(sequence);
        setPlayerSequence([]);
        setKeypadActive(false);

        // Flash sequence after delay
        setTimeout(async () => {
          await flashSequence(sequence);
        }, 1000);
      } else if (popup.taskType === 'upload') {
        // Keep existing upload game for variety
        setUploadProgress(0);
      }
    } else {
      // Simple clear - play secure sound
      playSound('secure');
      setScore(prev => prev + 75);
      setPopups(prev => prev.filter(p => p.id !== popup.id));
    }
  }, [keypadLevel, flashSequence, playSound, generatePasswordPuzzle, generateEmailSafetyPuzzle, generateLinkSafetyPuzzle]);

  // Minigame win
  const winMinigame = useCallback(() => {
    playSound('success');
    setScore(prev => prev + 300);
    setPopups(prev => prev.filter(p => p.id !== currentPopup?.id));
    setCurrentMinigame(null);
    setCurrentPopup(null);
    
    // Reset puzzle state
    setCipherPuzzle(null);
  }, [currentPopup, playSound]);

  // Keypad Game Functions
  const onKeypadPress = useCallback((number) => {
    if (!keypadActive) return;

    playSound('keypad');
    const newPlayerSequence = [...playerSequence, number];
    setPlayerSequence(newPlayerSequence);

    // Check if input is correct so far
    for (let i = 0; i < newPlayerSequence.length; i++) {
      if (newPlayerSequence[i] !== keypadSequence[i]) {
        // Wrong - restart
        playSound('error');
        setPlayerSequence([]);
        setTimeout(() => setKeypadActive(true), 500);
        return;
      }
    }

    // Check if complete
    if (newPlayerSequence.length === keypadSequence.length) {
      setKeypadLevel(prev => prev + 1);
      winMinigame();
    }
  }, [keypadActive, playerSequence, keypadSequence, winMinigame, playSound]);

  // Upload Game Functions
  const startUpload = useCallback(() => {
    uploadIntervalRef.current = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(uploadIntervalRef.current);
          winMinigame();
          return 100;
        }
        return newProgress;
      });
    }, 50);
  }, [winMinigame]);

  const stopUpload = useCallback(() => {
    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current);
    }
    if (uploadProgress < 100) {
      setUploadProgress(0);
    }
  }, [uploadProgress]);

  const handleCipherSubmit = useCallback((selectedAnswer) => {
    if (!cipherPuzzle) return;
    
    if (selectedAnswer === cipherPuzzle.correctAnswer) {
      winMinigame();
    } else {
      playSound('error');
      // Give visual feedback but don't end the game immediately
    }
  }, [cipherPuzzle, winMinigame, playSound]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Handle game end callback
  useEffect(() => {
    if (gameState === 'gameOver' && onGameComplete) {
      onGameComplete({ passed: false, score: score, gameType: 'it-security-dash' });
    }
  }, [gameState, score, onGameComplete]);

  if (gameState === 'start') {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col justify-center items-center text-center p-4 z-50">
        <div className="bg-gradient-to-br from-blue-900 via-gray-800 to-purple-900 p-8 rounded-xl border-4 border-blue-400 shadow-2xl">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            IT SECURITY DASH
          </h1>
          <p className="text-blue-200 text-xl mb-8">
            Clear tasks and fix security threats by clicking colored buttons!
          </p>
          <div className="space-y-4 text-gray-300 mb-8">
            <p>🟢 Click green notifications to clear them</p>
            <p>🔴 Click red alerts to start simple security tasks</p>
            <p>🎨 Read instructions and click the correct colored button!</p>
            <p>⏱️ Work fast - you only have 60 seconds!</p>
          </div>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg text-2xl hover:from-blue-700 hover:to-purple-700 transition duration-300 border-2 border-blue-400"
          >
            Start Security Shift
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col justify-center items-center text-center p-4 z-50">
        <div className="bg-gradient-to-br from-red-900 via-gray-800 to-blue-900 p-8 rounded-xl border-4 border-red-400 shadow-2xl">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-4xl font-bold text-white mb-4">Security Shift Complete!</h1>
          <p className="text-red-200 text-xl mb-6">Your final score:</p>
          <div className="text-8xl font-bold text-blue-400 mb-6">{score}</div>
          <div className="space-y-2 text-gray-300 mb-8">
            <p>🏆 {score >= 1000 ? 'EXPERT SECURITY ANALYST' : score >= 500 ? 'SKILLED DEFENDER' : 'SECURITY TRAINEE'}</p>
            <p>📊 Performance: {score >= 1000 ? 'Outstanding' : score >= 500 ? 'Good' : 'Needs Improvement'}</p>
          </div>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg text-2xl hover:from-blue-700 hover:to-purple-700 transition duration-300 border-2 border-blue-400 mr-4"
          >
            Start New Shift
          </button>
          <button
            onClick={() => onGameComplete && onGameComplete({ passed: false, score: score, gameType: 'it-security-dash' })}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-4 px-10 rounded-lg shadow-lg text-2xl hover:from-gray-700 hover:to-gray-800 transition duration-300 border-2 border-gray-400"
          >
            Return to Bridge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-800 text-white relative overflow-hidden">
      {/* Stats Bar */}
      <div className="w-full max-w-4xl mx-auto my-4 z-40">
        <div className="flex justify-between items-center bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-xl border border-blue-400">
          <div>
            <span className="text-gray-400 text-lg">Score:</span>
            <span className="font-bold text-3xl text-blue-400 ml-2">{score}</span>
          </div>
          <div>
            <span className="text-gray-400 text-lg">Time:</span>
            <span className={`font-bold text-3xl ml-2 ${timeLeft <= 10 ? 'text-red-400' : 'text-yellow-400'}`}>
              {timeLeft}
            </span>
          </div>
        </div>
      </div>

      {/* Network Dashboard */}
      <div className="flex-1 w-full relative overflow-hidden rounded-lg shadow-inner bg-gray-700" 
           style={{
             backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
             backgroundSize: '30px 30px'
           }}>
        
        {/* Stations */}
        {stations.map(station => (
          <div
            key={station.id}
            className="absolute bg-gray-900 bg-opacity-80 border-2 border-gray-600 rounded-lg p-4 flex flex-col items-center text-white shadow-lg"
            style={station.position}
          >
            <div className="text-5xl text-blue-300 mb-2">{station.icon}</div>
            <span className="font-semibold text-gray-200">{station.title}</span>
          </div>
        ))}

        {/* Popups */}
        {popups.map(popup => {
          const station = popup.station;
          if (!station) return null;
          
          return (
            <div
              key={popup.id}
              className={`absolute w-72 bg-white text-gray-900 rounded-lg shadow-xl z-30 border-t-8 ${
                popup.isScam ? 'border-red-500' : 'border-green-500'
              }`}
              style={{
                left: '50%',
                top: '30%',
                transform: 'translateX(-50%)',
                animation: 'popup-appear 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
              }}
            >
              <div className="p-4">
                <h4 className="font-bold text-lg">{popup.title}</h4>
                <p className="text-sm text-gray-700 my-2">{popup.text}</p>
              </div>
              <button
                onClick={() => onPopupClick(popup)}
                className={`w-full p-3 font-bold text-white rounded-b-md transition-colors ${
                  popup.isScam 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {popup.isScam ? 'Respond' : 'Clear'}
              </button>
              <div className="w-full bg-gray-200 overflow-hidden">
                <div 
                  className="h-2 bg-blue-500"
                  style={{
                    animation: 'popup-countdown 8s linear forwards'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Keypad Minigame Modal */}
      {currentMinigame === 'keypad' && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center">
          <div className="bg-gray-700 p-8 rounded-lg shadow-xl w-96 border-2 border-red-400">
            <h3 className="text-2xl font-bold text-center mb-2">🔐 Authorize Access</h3>
            <p className="text-center text-gray-300 mb-6">
              {!keypadActive ? 'Watch the sequence...' : 'Repeat the sequence.'}
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
                <button
                  key={number}
                  onClick={() => onKeypadPress(number)}
                  className={`aspect-square rounded-lg cursor-pointer transition-all flex items-center justify-center text-xl font-bold ${
                    flashingNumber === number
                      ? 'bg-yellow-400 text-black scale-110 animate-pulse'
                      : keypadSequence.includes(number) && !keypadActive 
                        ? 'bg-blue-400 text-white' 
                        : 'bg-gray-600 hover:bg-gray-500 active:scale-95'
                  } ${!keypadActive ? 'pointer-events-none' : ''}`}
                  disabled={!keypadActive}
                >
                  {number}
                </button>
              ))}
            </div>
            {!keypadActive && (
              <div className="mt-4 text-center text-yellow-400 animate-pulse">
                📖 Memorize the flashing sequence!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Beginner-Friendly Security Tasks Modal */}
      {(currentMinigame === 'password-strength' || currentMinigame === 'email-safety' || currentMinigame === 'link-safety') && cipherPuzzle && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center">
          <div className="bg-gray-700 p-8 rounded-lg shadow-xl w-[500px] border-2 border-red-400">
            <h3 className="text-2xl font-bold text-center mb-2">
              {currentMinigame === 'password-strength' && '🔐 Password Security'}
              {currentMinigame === 'email-safety' && '📧 Email Safety'}
              {currentMinigame === 'link-safety' && '🔒 Link Security'}
            </h3>
            <p className="text-center text-gray-300 mb-6">{cipherPuzzle.description}</p>
            
            <div className="grid grid-cols-1 gap-3">
              {cipherPuzzle.items.map(item => (
                <button
                  key={item}
                  onClick={() => handleCipherSubmit(item)}
                  className="p-4 rounded-lg border-2 border-gray-400 hover:bg-gray-600 transition-all font-mono text-left break-all"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-4 text-center text-yellow-400 text-sm">
              {currentMinigame === 'password-strength' && '💡 Look for: Special characters, numbers, length, and complexity'}
              {currentMinigame === 'email-safety' && '💡 Look for: Normal business communication vs urgent/threatening language'}
              {currentMinigame === 'link-safety' && '💡 Look for: HTTPS, official domain names, no suspicious characters'}
            </div>
          </div>
        </div>
      )}

      {/* Upload Minigame Modal */}
      {currentMinigame === 'upload' && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center">
          <div className="bg-gray-700 p-8 rounded-lg shadow-xl w-96 border-2 border-red-400">
            <h3 className="text-2xl font-bold text-center mb-2">⬆️ Upload Patch</h3>
            <p className="text-center text-gray-300 mb-6">Click and HOLD to upload.</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-900 rounded-full h-8 mb-4">
              <div 
                className="bg-green-500 h-8 rounded-full transition-all duration-100"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            
            <button
              onMouseDown={startUpload}
              onMouseUp={stopUpload}
              onMouseLeave={stopUpload}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg text-xl transition-all hover:bg-blue-700 active:scale-95 active:bg-blue-800"
            >
              Hold to Upload
            </button>
          </div>
        </div>
      )}

      {/* Security Task Minigame Modal - Unified for all task types */}
      {(currentMinigame === 'password-strength' || currentMinigame === 'email-safety' || currentMinigame === 'link-safety') && cipherPuzzle && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center">
          <div className="bg-gray-700 p-8 rounded-lg shadow-xl w-[500px] border-2 border-blue-400">
            <h3 className="text-2xl font-bold text-center mb-2">
              {currentMinigame === 'password-strength' && '🔐 Password Security'}
              {currentMinigame === 'email-safety' && '📧 Email Safety'}
              {currentMinigame === 'link-safety' && '🔒 Link Safety'}
            </h3>
            <p className="text-center text-gray-300 mb-6">{cipherPuzzle.description}</p>
            
            <div className="grid grid-cols-1 gap-3">
              {cipherPuzzle.items.map(item => (
                <button
                  key={item}
                  onClick={() => handleCipherSubmit(item)}
                  className="p-4 rounded-lg border-2 border-gray-400 hover:bg-gray-600 transition-all font-mono text-left"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-4 text-center text-yellow-400 text-sm">
              {currentMinigame === 'password-strength' && 'Look for: Special characters, numbers, length, and complexity'}
              {currentMinigame === 'email-safety' && 'Look for: Safe, non-threatening business communication'}
              {currentMinigame === 'link-safety' && 'Look for: HTTPS protocol and legitimate domain names'}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes popup-appear {
          from { opacity: 0; transform: translateX(-50%) scale(0.7); }
          to { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        
        @keyframes popup-countdown {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default ITSecurityDashGame;