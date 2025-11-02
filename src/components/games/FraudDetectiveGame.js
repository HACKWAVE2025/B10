import React, { useState, useCallback } from 'react';

// Case data for investigation
const FRAUD_CASES = [
  {
    id: 1,
    title: "Suspicious Online Purchase",
    description: "A customer reports unauthorized charges on their credit card.",
    evidence: [
      { id: 1, type: "transaction", text: "Purchase: Electronics Store - $2,499", suspicious: false },
      { id: 2, type: "location", text: "Transaction Location: Customer's City", suspicious: false },
      { id: 3, type: "timing", text: "Purchase Time: 2:30 AM", suspicious: true },
      { id: 4, type: "merchant", text: "Merchant: Verified Electronics Chain", suspicious: false },
      { id: 5, type: "pattern", text: "Customer's 15th purchase this month", suspicious: true },
      { id: 6, type: "amount", text: "Amount exceeds customer's usual $200 limit", suspicious: true }
    ],
    solution: "FRAUD - Unusual timing + spending pattern + amount suggests compromised card"
  },
  {
    id: 2,
    title: "Bank Transfer Investigation",
    description: "Large transfer flagged by automated systems.",
    evidence: [
      { id: 1, type: "amount", text: "Transfer Amount: $15,000", suspicious: false },
      { id: 2, type: "recipient", text: "Recipient: Family Member (verified)", suspicious: false },
      { id: 3, type: "timing", text: "Transfer Time: 10:00 AM (business hours)", suspicious: false },
      { id: 4, type: "authentication", text: "Used customer's registered device", suspicious: false },
      { id: 5, type: "purpose", text: "Purpose: Emergency medical expenses", suspicious: false },
      { id: 6, type: "history", text: "Customer has made similar transfers before", suspicious: false }
    ],
    solution: "LEGITIMATE - All evidence points to authorized emergency transfer"
  },
  {
    id: 3,
    title: "ATM Withdrawal Alert",
    description: "Multiple ATM withdrawals in different cities.",
    evidence: [
      { id: 1, type: "location", text: "ATM Location 1: Customer's Home City", suspicious: false },
      { id: 2, type: "location", text: "ATM Location 2: 500 miles away, 30 mins later", suspicious: true },
      { id: 3, type: "timing", text: "Withdrawals: 11:00 AM and 11:30 AM", suspicious: true },
      { id: 4, type: "amount", text: "Both withdrawals: $500 (daily limit)", suspicious: true },
      { id: 5, type: "card", text: "Card status: Not reported stolen", suspicious: false },
      { id: 6, type: "pattern", text: "Customer travels frequently for work", suspicious: false }
    ],
    solution: "FRAUD - Impossible to travel 500 miles in 30 minutes, card skimmed"
  }
];

const FraudDetectiveGame = ({ onGameComplete, dogName, theme }) => {
  const [gameState, setGameState] = useState('start');
  const [currentCase, setCurrentCase] = useState(0);
  const [selectedEvidence, setSelectedEvidence] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  const case_ = FRAUD_CASES[currentCase];

  const startGame = useCallback(() => {
    setGameState('investigating');
    setCurrentCase(0);
    setSelectedEvidence([]);
    setScore(0);
    setFeedback('');
    setShowSolution(false);
  }, []);

  const toggleEvidence = useCallback((evidenceId) => {
    setSelectedEvidence(prev => 
      prev.includes(evidenceId) 
        ? prev.filter(id => id !== evidenceId)
        : [...prev, evidenceId]
    );
  }, []);

  const submitInvestigation = useCallback(() => {
    const case_ = FRAUD_CASES[currentCase];
    const suspiciousEvidence = case_.evidence.filter(e => e.suspicious);
    const selectedSuspicious = selectedEvidence.filter(id => 
      suspiciousEvidence.some(e => e.id === id)
    );
    
    // Calculate score based on accuracy
    const totalSuspicious = suspiciousEvidence.length;
    const correctSelected = selectedSuspicious.length;
    const incorrectSelected = selectedEvidence.length - correctSelected;
    
    // Scoring: +20 for each correct, -10 for each incorrect
    const caseScore = Math.max(0, (correctSelected * 20) - (incorrectSelected * 10));
    setScore(prev => prev + caseScore);
    
    // Provide feedback
    if (correctSelected === totalSuspicious && incorrectSelected === 0) {
      setFeedback(`🎉 Perfect investigation! +${caseScore} points. You identified all suspicious evidence correctly!`);
    } else if (correctSelected > totalSuspicious / 2) {
      setFeedback(`✅ Good work! +${caseScore} points. You caught most of the suspicious evidence.`);
    } else {
      setFeedback(`⚠️ Investigation incomplete. +${caseScore} points. Review the evidence more carefully.`);
    }
    
    setShowSolution(true);
  }, [currentCase, selectedEvidence]);

  const nextCase = useCallback(() => {
    if (currentCase < FRAUD_CASES.length - 1) {
      setCurrentCase(prev => prev + 1);
      setSelectedEvidence([]);
      setFeedback('');
      setShowSolution(false);
    } else {
      // Game complete
      setGameState('gameOver');
      setTimeout(() => {
        onGameComplete({
          passed: score >= 120, // Need 120+ points (60% accuracy) to pass
          score,
          accuracy: Math.round((score / (FRAUD_CASES.length * 120)) * 100), // Max possible is 120 per case
          gameType: 'fraud-detective'
        });
      }, 2000);
    }
  }, [currentCase, score, onGameComplete]);

  if (gameState === 'start') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-8" style={{ backgroundColor: theme.background }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-6xl font-black mb-6" style={{ color: theme.text }}>
            🔍 Fraud Detective
          </h1>
          <div className="text-lg space-y-4 text-left mb-8 p-6 rounded-lg" style={{ backgroundColor: theme.secondary + '30', color: theme.text }}>
            <h3 className="text-2xl font-bold text-center" style={{ color: theme.accent }}>Detective Training:</h3>
            <p>🕵️ <strong>Investigate suspicious transactions</strong> by analyzing evidence</p>
            <p>🔍 <strong>Click on evidence</strong> you think is suspicious or unusual</p>
            <p>💡 <strong>Think like a detective:</strong> Look for timing, location, amount, and pattern anomalies</p>
            <p>⚖️ <strong>Submit your findings</strong> to see if you caught the fraud</p>
            <p>🎯 <strong>Goal:</strong> Score 120+ points by solving all 3 cases accurately</p>
          </div>
          <button 
            onClick={startGame}
            className="px-10 py-4 rounded-lg text-2xl font-bold transition-all hover:scale-105"
            style={{ backgroundColor: theme.primary, color: theme.text }}
          >
            🚀 Start Investigation
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    const passed = score >= 120;
    const rank = score >= 180 ? "🏆 Master Detective" : 
                 score >= 150 ? "🥇 Senior Detective" :
                 score >= 120 ? "🥈 Detective" : "👮 Trainee";
    
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-8" style={{ backgroundColor: theme.background }}>
        <h1 className="text-5xl font-extrabold mb-6" style={{ color: theme.text }}>
          {passed ? '🎉 Investigation Complete!' : '📋 Training Complete!'}
        </h1>
        <div className="text-2xl mb-6" style={{ color: theme.text }}>
          <p>Final Score: <span className="font-bold text-4xl" style={{ color: theme.accent }}>{score}</span></p>
          <p className="mt-2 text-xl">Rank: {rank}</p>
          <p className="mt-2">{passed ? `Excellent detective work, ${dogName}!` : 'Keep practicing your investigation skills!'}</p>
        </div>
        <button 
          onClick={startGame}
          className="px-8 py-3 rounded-lg text-xl font-bold transition-all hover:scale-105"
          style={{ backgroundColor: theme.primary, color: theme.text }}
        >
          🔄 New Investigation
        </button>
      </div>
    );
  }

  // Investigation state
  return (
    <div 
      className="w-full h-full p-6 overflow-y-auto"
      style={{ 
        background: `linear-gradient(135deg, ${theme.background} 0%, ${theme.secondary} 100%)`,
        color: theme.text
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: theme.text }}>
            🔍 Case {currentCase + 1}/3: {case_.title}
          </h1>
          <p className="text-lg mt-2" style={{ color: theme.text }}>{case_.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: theme.accent }}>Score: {score}</div>
          <div className="text-lg" style={{ color: theme.text }}>Evidence Selected: {selectedEvidence.length}</div>
        </div>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {case_.evidence.map((evidence) => (
          <div
            key={evidence.id}
            onClick={() => !showSolution && toggleEvidence(evidence.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedEvidence.includes(evidence.id) 
                ? 'scale-105 shadow-lg' 
                : 'hover:scale-102'
            } ${showSolution && evidence.suspicious ? 'animate-pulse' : ''}`}
            style={{
              backgroundColor: selectedEvidence.includes(evidence.id) 
                ? theme.accent + '40' 
                : theme.background + '80',
              borderColor: showSolution && evidence.suspicious 
                ? theme.accent 
                : selectedEvidence.includes(evidence.id) 
                  ? theme.accent 
                  : theme.secondary,
              borderWidth: showSolution && evidence.suspicious ? '3px' : '2px'
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-sm uppercase tracking-wide mb-2" style={{ color: theme.accent }}>
                  {evidence.type}
                </div>
                <div className="text-base" style={{ color: theme.text }}>
                  {evidence.text}
                </div>
              </div>
              <div className="ml-4 text-2xl">
                {selectedEvidence.includes(evidence.id) ? '✅' : '🔍'}
                {showSolution && evidence.suspicious && '⚠️'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        {!showSolution ? (
          <button 
            onClick={submitInvestigation}
            disabled={selectedEvidence.length === 0}
            className="px-8 py-3 rounded-lg text-xl font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: selectedEvidence.length > 0 ? theme.primary : theme.secondary, 
              color: theme.text 
            }}
          >
            📋 Submit Investigation
          </button>
        ) : (
          <button 
            onClick={nextCase}
            className="px-8 py-3 rounded-lg text-xl font-bold transition-all hover:scale-105"
            style={{ backgroundColor: theme.primary, color: theme.text }}
          >
            {currentCase < FRAUD_CASES.length - 1 ? '➡️ Next Case' : '🏁 Complete Investigation'}
          </button>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="text-center mb-4">
          <div 
            className="inline-block px-6 py-3 rounded-lg text-lg font-semibold"
            style={{ backgroundColor: theme.accent + '30', color: theme.text }}
          >
            {feedback}
          </div>
        </div>
      )}

      {/* Solution */}
      {showSolution && (
        <div 
          className="p-6 rounded-lg border-2"
          style={{ 
            backgroundColor: theme.background + '90', 
            borderColor: theme.accent,
            color: theme.text 
          }}
        >
          <h3 className="text-xl font-bold mb-3" style={{ color: theme.accent }}>
            🎯 Case Solution:
          </h3>
          <p className="text-lg">{case_.solution}</p>
          <p className="text-sm mt-2 opacity-75">
            Suspicious evidence is highlighted with ⚠️ symbols above.
          </p>
        </div>
      )}
    </div>
  );
};

export default FraudDetectiveGame;