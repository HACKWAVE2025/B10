import React, { useState, useEffect, useCallback } from 'react';

// Card data for memory game
const CARD_PAIRS = [
  { id: 1, type: 'safe', icon: '🏦', label: 'Bank' },
  { id: 2, type: 'safe', icon: '🔒', label: 'Secure' },
  { id: 3, type: 'safe', icon: '✅', label: 'Verified' },
  { id: 4, type: 'safe', icon: '🛡️', label: 'Protected' },
  { id: 5, type: 'safe', icon: '💳', label: 'Card' },
  { id: 6, type: 'safe', icon: '📧', label: 'Email' },
  { id: 7, type: 'fraud', icon: '⚠️', label: 'Warning' },
  { id: 8, type: 'fraud', icon: '🚨', label: 'Alert' },
  { id: 9, type: 'fraud', icon: '💰', label: 'Money' },
  { id: 10, type: 'fraud', icon: '🎯', label: 'Target' },
  { id: 11, type: 'fraud', icon: '📱', label: 'Phone' },
  { id: 12, type: 'fraud', icon: '🔗', label: 'Link' }
];

const CardMemoryGame = ({ onGameComplete, dogName, theme }) => {
  const [gameState, setGameState] = useState('start');
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [gameLevel, setGameLevel] = useState(1);
  const [showHint, setShowHint] = useState(false);

  // Initialize cards for the current level
  const initializeCards = useCallback((level) => {
    const pairsCount = Math.min(6 + level, 12); // Start with 6 pairs, max 12
    const selectedPairs = CARD_PAIRS.slice(0, pairsCount);
    
    // Create pairs and shuffle
    const gameCards = [];
    selectedPairs.forEach(pair => {
      gameCards.push({ ...pair, cardId: `${pair.id}_1`, isFlipped: false, isMatched: false });
      gameCards.push({ ...pair, cardId: `${pair.id}_2`, isFlipped: false, isMatched: false });
    });
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
    
    return gameCards;
  }, []);

  const startGame = useCallback(() => {
    setGameState('playing');
    setGameLevel(1);
    setCards(initializeCards(1));
    setFlippedCards([]);
    setMatchedPairs([]);
    setScore(0);
    setMoves(0);
    setTimeLeft(90);
    setShowHint(false);
  }, [initializeCards]);

  const flipCard = useCallback((cardId) => {
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(cardId)) return;
    
    setFlippedCards(prev => [...prev, cardId]);
    setCards(prev => prev.map(card => 
      card.cardId === cardId ? { ...card, isFlipped: true } : card
    ));
  }, [flippedCards]);

  // Check for matches when 2 cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [card1Id, card2Id] = flippedCards;
      const card1 = cards.find(c => c.cardId === card1Id);
      const card2 = cards.find(c => c.cardId === card2Id);
      
      if (card1 && card2 && card1.id === card2.id) {
        // Match found!
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.cardId === card1Id || card.cardId === card2Id 
              ? { ...card, isMatched: true }
              : card
          ));
          setMatchedPairs(prev => [...prev, card1.id]);
          
          // Score based on card type and speed
          const points = card1.type === 'safe' ? 20 : 30; // More points for fraud cards
          const timeBonus = timeLeft > 60 ? 10 : timeLeft > 30 ? 5 : 0;
          setScore(prev => prev + points + timeBonus);
          
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.cardId === card1Id || card.cardId === card2Id 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1500);
      }
    }
  }, [flippedCards, cards, timeLeft]);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState('gameOver');
    }
  }, [gameState, timeLeft]);

  // Check if level is complete
  useEffect(() => {
    const totalPairs = cards.length / 2;
    if (matchedPairs.length === totalPairs && totalPairs > 0) {
      if (gameLevel < 3) {
        // Next level
        setTimeout(() => {
          const nextLevel = gameLevel + 1;
          setGameLevel(nextLevel);
          setCards(initializeCards(nextLevel));
          setFlippedCards([]);
          setMatchedPairs([]);
          setTimeLeft(prev => prev + 30); // Bonus time
          setScore(prev => prev + 50); // Level completion bonus
        }, 2000);
      } else {
        // Game complete
        setTimeout(() => setGameState('gameOver'), 2000);
      }
    }
  }, [matchedPairs, cards.length, gameLevel, initializeCards]);

  // Hint system
  const showHintCards = useCallback(() => {
    if (showHint) return;
    setShowHint(true);
    
    // Briefly show all cards
    setCards(prev => prev.map(card => ({ ...card, isFlipped: true })));
    
    setTimeout(() => {
      setCards(prev => prev.map(card => 
        card.isMatched ? card : { ...card, isFlipped: false }
      ));
      setShowHint(false);
    }, 2000);
  }, [showHint]);

  // Game complete
  useEffect(() => {
    if (gameState === 'gameOver') {
      setTimeout(() => {
        onGameComplete({
          passed: score >= 200, // Need 200+ points to pass
          score,
          accuracy: Math.round((matchedPairs.length * 10 / Math.max(moves, 1)) * 100),
          gameType: 'card-memory'
        });
      }, 2000);
    }
  }, [gameState, score, matchedPairs.length, moves, onGameComplete]);

  if (gameState === 'start') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-8" style={{ backgroundColor: theme.background }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-6xl font-black mb-6" style={{ color: theme.text }}>
            🃏 Memory Detective
          </h1>
          <div className="text-lg space-y-4 text-left mb-8 p-6 rounded-lg" style={{ backgroundColor: theme.secondary + '30', color: theme.text }}>
            <h3 className="text-2xl font-bold text-center" style={{ color: theme.accent }}>Mission Briefing:</h3>
            <p>🧠 <strong>Match pairs of cards</strong> by flipping them two at a time</p>
            <p>🔒 <strong>Remember card positions</strong> to make matches efficiently</p>
            <p>⚡ <strong>Safe cards (20 pts)</strong> and Fraud cards (30 pts) have different values</p>
            <p>🎯 <strong>Complete 3 levels</strong> with increasing difficulty</p>
            <p>⏰ <strong>90 seconds</strong> to complete all levels, +30s bonus per level</p>
            <p>💡 <strong>Hint button</strong> available once per level (briefly shows all cards)</p>
          </div>
          <button 
            onClick={startGame}
            className="px-10 py-4 rounded-lg text-2xl font-bold transition-all hover:scale-105"
            style={{ backgroundColor: theme.primary, color: theme.text }}
          >
            🚀 Start Memory Test
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    const passed = score >= 200;
    const efficiency = moves > 0 ? Math.round((matchedPairs.length / moves) * 100) : 0;
    
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-8" style={{ backgroundColor: theme.background }}>
        <h1 className="text-5xl font-extrabold mb-6" style={{ color: theme.text }}>
          {passed ? '🎉 Memory Master!' : '🧠 Training Complete!'}
        </h1>
        <div className="text-2xl mb-6" style={{ color: theme.text }}>
          <p>Final Score: <span className="font-bold text-4xl" style={{ color: theme.accent }}>{score}</span></p>
          <p className="mt-2">Pairs Matched: {matchedPairs.length}</p>
          <p>Efficiency: {efficiency}%</p>
          <p className="mt-2">{passed ? `Excellent memory work, ${dogName}!` : 'Keep practicing your memory skills!'}</p>
        </div>
        <button 
          onClick={startGame}
          className="px-8 py-3 rounded-lg text-xl font-bold transition-all hover:scale-105"
          style={{ backgroundColor: theme.primary, color: theme.text }}
        >
          🔄 Play Again
        </button>
      </div>
    );
  }

  // Playing state
  return (
    <div 
      className="w-full h-full p-4 overflow-y-auto"
      style={{ 
        background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.secondary} 100%)`,
        color: theme.text
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: theme.text }}>
            🃏 Level {gameLevel}/3 - Memory Detective
          </h1>
          <p className="text-sm" style={{ color: theme.text }}>Match {cards.length / 2} pairs</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold" style={{ color: theme.accent }}>Score: {score}</div>
          <div className="text-sm" style={{ color: theme.text }}>Moves: {moves} | Time: {timeLeft}s</div>
        </div>
      </div>

      {/* Hint Button */}
      <div className="flex justify-center mb-4">
        <button 
          onClick={showHintCards}
          disabled={showHint}
          className="px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 disabled:opacity-50"
          style={{ backgroundColor: theme.accent + '40', color: theme.text }}
        >
          💡 Hint (2s preview)
        </button>
      </div>

      {/* Cards Grid */}
      <div className={`grid gap-3 mx-auto max-w-4xl ${
        cards.length <= 12 ? 'grid-cols-3 md:grid-cols-4' : 
        cards.length <= 16 ? 'grid-cols-4 md:grid-cols-4' : 
        'grid-cols-4 md:grid-cols-6'
      }`}>
        {cards.map((card) => (
          <div
            key={card.cardId}
            onClick={() => !card.isFlipped && !card.isMatched && flipCard(card.cardId)}
            className={`relative aspect-square rounded-lg border-2 cursor-pointer transition-all duration-300 transform ${
              card.isFlipped || card.isMatched 
                ? 'scale-105' 
                : 'hover:scale-110'
            } ${card.isMatched ? 'animate-pulse' : ''}`}
            style={{
              backgroundColor: card.isFlipped || card.isMatched 
                ? (card.type === 'safe' ? theme.primary : theme.accent) 
                : theme.secondary,
              borderColor: card.isMatched 
                ? theme.accent 
                : card.isFlipped 
                  ? theme.primary 
                  : theme.background,
              minHeight: '80px'
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              {card.isFlipped || card.isMatched ? (
                <>
                  <div className="text-2xl md:text-3xl mb-1">{card.icon}</div>
                  <div className="text-xs md:text-sm font-bold" style={{ color: theme.text }}>
                    {card.label}
                  </div>
                </>
              ) : (
                <div className="text-3xl md:text-4xl" style={{ color: theme.text }}>
                  🃏
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Level Progress */}
      <div className="mt-6 text-center">
        <div className="text-lg font-semibold mb-2">
          Progress: {matchedPairs.length}/{cards.length / 2} pairs matched
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2 mx-auto max-w-md">
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(matchedPairs.length / (cards.length / 2)) * 100}%`,
              backgroundColor: theme.accent 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CardMemoryGame;