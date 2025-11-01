import React, { useState, useEffect, useRef } from 'react';

const ScamSleuthGame = ({ onGameComplete, dogName, island, theme }) => {
  const [gameState, setGameState] = useState('start'); // start, playing, gameOver
  const [score, setScore] = useState(0);
  const [flagsFound, setFlagsFound] = useState(0);
  const [foundFlags, setFoundFlags] = useState(new Set()); // Track which flags have been found
  const [timer, setTimer] = useState(30);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const timerIntervalRef = useRef(null);
  const messageTimeoutRef = useRef(null);

  // Game messages with red flags
  const allMessages = [
    { type: 'bank', text: 'You received a $1,500.00 payment from "Alex G."' },
    { type: 'scammer', text: 'OMG hello??', safe: true },
    { type: 'scammer', text: 'I made a terrible mistake!', safe: true },
    { 
      type: 'scammer', 
      text: 'I accidentally sent you $1,500, it was my rent money!! ',
      flagText: 'My landlord is going to evict me, I am panicking!!',
      flagId: 1
    },
    { type: 'scammer', text: 'Please, you have to help me!', safe: true },
    { 
      type: 'scammer', 
      text: 'My account is frozen now for some reason, ',
      flagText: 'can you send the $1,500 to my wife\'s account instead?',
      flagId: 2
    },
    { 
      type: 'scammer', 
      text: '',
      flagText: 'Acct #: 987-654-321 (Z-Bank)',
      flagId: 3
    },
    { type: 'scammer', text: 'Please hurry!', safe: true }
  ];

  const startGame = () => {
    setScore(0);
    setFlagsFound(0);
    setFoundFlags(new Set());
    setTimer(30);
    setCurrentMessageIndex(0);
    setShowDecisionModal(false);
    setGameState('playing');
    
    // Start timer
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          endGame('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start showing messages after a short delay
    setTimeout(() => {
      setCurrentMessageIndex(1);
    }, 500);
  };

  // useEffect to handle message progression
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    if (currentMessageIndex > 0 && currentMessageIndex < allMessages.length) {
      messageTimeoutRef.current = setTimeout(() => {
        setCurrentMessageIndex(prev => prev + 1);
      }, 1500);
    } else if (currentMessageIndex >= allMessages.length) {
      // All messages shown, show decision modal
      setTimeout(() => {
        setShowDecisionModal(true);
      }, 1000);
    }

    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, [currentMessageIndex, gameState, allMessages.length]);

  const endGame = (reason) => {
    setGameState('gameOver');
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    
    let finalScore = score;
    if (reason === 'report') {
      finalScore += 200; // Bonus for correct decision
      setScore(finalScore);
    }

    setTimeout(() => {
      onGameComplete({ 
        passed: finalScore >= 100, 
        score: finalScore, 
        gameType: 'scam-sleuth' 
      });
    }, 3000);
  };

  const handleFlagClick = (flagId) => {
    if (gameState !== 'playing' || foundFlags.has(flagId)) return;
    
    setFoundFlags(prev => new Set(prev).add(flagId));
    setFlagsFound(prev => prev + 1);
    setScore(prev => prev + 50);
  };

  const handleSafeClick = () => {
    if (gameState !== 'playing') return;
    
    setScore(prev => Math.max(0, prev - 25));
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);

  const renderMessage = (message, index) => {
    if (index >= currentMessageIndex) return null;

    return (
      <div 
        key={index} 
        className={`chat-bubble ${message.type === 'bank' ? 'bubble-bank' : 'bubble-scammer'} mb-3 p-3 rounded-2xl max-w-xs opacity-0 animate-fadeIn`}
        style={{
          animationDelay: `${index * 0.1}s`,
          animationFillMode: 'forwards'
        }}
      >
        {message.text && (
          <span 
            className={message.safe ? 'cursor-pointer hover:bg-blue-200 p-1 rounded' : ''}
            onClick={message.safe ? handleSafeClick : undefined}
          >
            {message.text}
          </span>
        )}
        {message.flagText && (
          <span 
            className={`cursor-pointer p-1 rounded border border-red-300 ${
              foundFlags.has(message.flagId) 
                ? 'bg-red-300 text-red-800 font-semibold' 
                : 'bg-yellow-100 hover:bg-red-200'
            }`}
            onClick={() => handleFlagClick(message.flagId)}
          >
            {message.flagText}
          </span>
        )}
      </div>
    );
  };

  const timerPercent = (timer / 30) * 100;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .bubble-bank {
          align-self: center;
          background-color: #d1fae5;
          color: #065f46;
          font-weight: 600;
          text-align: center;
          border: 1px solid #6ee7b7;
          margin: 0 auto;
        }
        .bubble-scammer {
          background-color: #fff;
          color: #1a202c;
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
      `}</style>

      <div className="w-full max-w-md bg-gray-100 rounded-3xl border-8 border-gray-800 shadow-2xl overflow-hidden h-screen max-h-[800px] flex flex-col">
        
        {/* Start Screen */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-95 backdrop-blur-lg flex flex-col justify-center items-center text-center p-8 z-50 text-white">
            <h1 className="text-5xl font-extrabold mb-6">Scam Sleuth</h1>
            <h2 className="text-3xl font-bold mb-4 text-purple-300">The Overpayment Trap</h2>
            <div className="text-lg space-y-3 max-w-md mx-auto text-left mb-8 bg-gray-800 p-6 rounded-lg">
              <p>You're about to receive a series of messages.</p>
              <p>Read them carefully and <strong className="text-red-400">CLICK on the 3 RED FLAGS</strong> before the timer runs out!</p>
              <p>Find flags for <strong className="text-green-400">+50 points</strong>. Clicking safe text costs <strong className="text-yellow-400">-25 points</strong>.</p>
              <p>Choose the right action at the end for a <strong className="text-green-400">+200 bonus</strong>!</p>
            </div>
            <button 
              onClick={startGame}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-10 rounded-lg text-2xl transition-colors"
            >
              Start Investigating
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-95 backdrop-blur-lg flex flex-col justify-center items-center text-center p-8 z-50 text-white">
            <h1 className="text-4xl font-extrabold mb-6">Investigation Complete!</h1>
            <p className="text-2xl mb-4">Your Final Score:</p>
            <p className="text-8xl font-bold mb-8 text-purple-400">{score}</p>
            <p className="text-lg max-w-md mb-8">
              {score >= 100 ? 
                "Excellent detective work! You spotted the scam and protected yourself." :
                "The scammer got away this time. Remember to look for urgency, unusual payment requests, and pressure tactics."
              }
            </p>
            <button 
              onClick={() => onGameComplete({ passed: score >= 100, score: score, gameType: 'scam-sleuth' })}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-10 rounded-lg text-2xl transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Game UI */}
        {gameState === 'playing' && (
          <>
            {/* Phone Top Bar */}
            <div className="p-4 flex justify-between items-center bg-white border-b border-gray-300">
              <span className="font-semibold text-sm">9:41 AM</span>
              <div className="flex space-x-1">
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-grow p-4 overflow-y-auto bg-green-50 flex flex-col space-y-2">
              {allMessages.slice(0, currentMessageIndex).map((message, index) => renderMessage(message, index))}
            </div>

            {/* HUD */}
            <div className="p-4 bg-white border-t border-gray-300 shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-gray-800">
                  SCORE: <span className="text-purple-600">{score}</span>
                </h2>
                <h3 className="text-lg font-semibold text-gray-700">
                  FLAGS: <span className="text-red-600">{flagsFound} / 3</span>
                </h3>
              </div>
              <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    timerPercent < 30 ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${timerPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Decision Modal */}
            {showDecisionModal && (
              <div className="absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-3xl shadow-lg border-t-4 border-purple-500 z-40">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">What's your move?</h3>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => endGame('report')}
                    className="w-full p-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors"
                  >
                    Report to Bank
                  </button>
                  <button 
                    onClick={() => endGame('refund')}
                    className="w-full p-4 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
                  >
                    Send Refund
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Exit Button */}
        {gameState === 'playing' && (
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={() => onGameComplete({ passed: false, score: score, gameType: 'scam-sleuth' })}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
            >
              Exit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScamSleuthGame;