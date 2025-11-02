import React, { useState, useCallback, useEffect } from 'react';

// Quiz questions covering all 9 previous games
const QUIZ_QUESTIONS = [
  // Island 1 - Scam Scanner
  {
    id: 1,
    game: "Scam Scanner",
    question: "What should you do when you receive an urgent email asking for your password?",
    options: [
      "Reply immediately with your password",
      "Forward it to your friends",
      "Delete it and report as spam",
      "Click all links to verify"
    ],
    correct: 2,
    explanation: "Never give your password via email. Legitimate companies never ask for passwords through email."
  },
  // Island 2 - IT Security Dash
  {
    id: 2,
    game: "IT Security Dash",
    question: "What is the best way to protect your computer from malware?",
    options: [
      "Download software from any website",
      "Keep antivirus updated and scan regularly", 
      "Open all email attachments",
      "Disable firewall for faster internet"
    ],
    correct: 1,
    explanation: "Regular antivirus updates and scans are essential for malware protection."
  },
  // Island 3 - WhatsApp Dash
  {
    id: 3,
    game: "WhatsApp Dash",
    question: "How can you verify if a WhatsApp message about a security vulnerability is legitimate?",
    options: [
      "Forward it to all contacts immediately",
      "Check official WhatsApp security channels",
      "Ignore all security messages",
      "Share it on social media first"
    ],
    correct: 1,
    explanation: "Always verify security information through official channels before taking action."
  },
  // Island 4 - WhatsApp Runner  
  {
    id: 4,
    game: "WhatsApp Runner",
    question: "What's the safest way to handle suspicious links in messages?",
    options: [
      "Click them to see what happens",
      "Share them with friends first",
      "Don't click and verify with sender",
      "Save them for later clicking"
    ],
    correct: 2,
    explanation: "Never click suspicious links. Always verify with the sender through a different communication method."
  },
  // Island 5 - Scam Sleuth
  {
    id: 5,
    game: "Scam Sleuth",
    question: "Which of these is a common sign of a phishing website?",
    options: [
      "HTTPS security certificate",
      "Misspelled company name in URL",
      "Professional looking design",
      "Contact information provided"
    ],
    correct: 1,
    explanation: "Phishing sites often use URLs with slight misspellings of legitimate company names."
  },
  // Island 6 - Credit Stacker
  {
    id: 6,
    game: "Credit Stacker",
    question: "What's the best practice for protecting your credit score?",
    options: [
      "Share credit card numbers online",
      "Monitor credit reports regularly",
      "Use the same password everywhere",
      "Ignore credit card statements"
    ],
    correct: 1,
    explanation: "Regular credit monitoring helps detect fraudulent activity early."
  },
  // Island 7 - Shop Safe
  {
    id: 7,
    game: "Shop Safe",
    question: "When shopping online, what should you always check before entering payment info?",
    options: [
      "The website's color scheme",
      "HTTPS lock icon and legitimate URL",
      "Number of product reviews only",
      "Website loading speed"
    ],
    correct: 1,
    explanation: "Always verify HTTPS security and legitimate URLs before entering payment information."
  },
  // Island 8 - Fraud Detective
  {
    id: 8,
    game: "Fraud Detective",
    question: "What's the most important step when investigating potential fraud?",
    options: [
      "Make quick decisions",
      "Gather and analyze all evidence",
      "Trust your first instinct only",
      "Ask friends for opinions"
    ],
    correct: 1,
    explanation: "Thorough evidence gathering and analysis is crucial for fraud detection."
  },
  // Island 9 - Card Memory
  {
    id: 9,
    game: "Card Memory",
    question: "Why is it important to remember security protocols and procedures?",
    options: [
      "To impress colleagues",
      "For consistent fraud prevention",
      "To complete training faster",
      "To avoid reading manuals"
    ],
    correct: 1,
    explanation: "Consistent application of security protocols is essential for effective fraud prevention."
  },
  // Bonus comprehensive questions
  {
    id: 10,
    game: "Summary",
    question: "What is the golden rule of fraud prevention?",
    options: [
      "Trust everyone completely",
      "Verify before you trust",
      "Ignore all warnings",
      "Share personal info freely"
    ],
    correct: 1,
    explanation: "The fundamental principle: always verify information and sources before trusting them."
  }
];

const FraudQuizGame = ({ onGameComplete, dogName, theme }) => {
  const [gameState, setGameState] = useState('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes total

  const startGame = useCallback(() => {
    setGameState('playing');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswers([]);
    setShowExplanation(false);
    setTimeLeft(300);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState('gameOver');
    }
  }, [gameState, timeLeft]);

  const selectAnswer = useCallback((answerIndex) => {
    setSelectedAnswer(answerIndex);
  }, []);

  const submitAnswer = useCallback(() => {
    const question = QUIZ_QUESTIONS[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;
    
    const newAnswer = {
      questionId: question.id,
      selected: selectedAnswer,
      correct: question.correct,
      isCorrect
    };
    
    setAnswers(prev => [...prev, newAnswer]);
    
    if (isCorrect) {
      setScore(prev => prev + 10);
    }
    
    setShowExplanation(true);
  }, [currentQuestion, selectedAnswer]);

  const nextQuestion = useCallback(() => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setGameState('gameOver');
    }
  }, [currentQuestion]);

  // Game complete
  useEffect(() => {
    if (gameState === 'gameOver') {
      setTimeout(() => {
        const percentage = Math.round((score / (QUIZ_QUESTIONS.length * 10)) * 100);
        onGameComplete({
          passed: percentage >= 70,
          score,
          accuracy: percentage,
          gameType: 'fraud-quiz'
        });
      }, 2000);
    }
  }, [gameState, score, onGameComplete]);

  if (gameState === 'start') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-8" style={{ backgroundColor: theme.background }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-black mb-6" style={{ color: theme.text }}>
            🧠 Final Fraud Prevention Quiz
          </h1>
          <div className="text-lg space-y-4 text-left mb-8 p-6 rounded-lg" style={{ backgroundColor: theme.secondary + '30', color: theme.text }}>
            <h3 className="text-2xl font-bold text-center" style={{ color: theme.accent }}>Your Final Test:</h3>
            <p>📚 <strong>Comprehensive Review</strong> of all 9 training islands</p>
            <p>❓ <strong>10 Multiple Choice Questions</strong> covering key fraud prevention concepts</p>
            <p>⏱️ <strong>5 Minutes Total</strong> to complete the entire quiz</p>
            <p>🎯 <strong>70% Score Required</strong> to pass final certification</p>
            <p>💡 <strong>Explanations Provided</strong> for each question after answering</p>
            <p>🏆 <strong>Earn Your Badge</strong> as a certified fraud prevention expert!</p>
          </div>
          <button 
            onClick={startGame}
            className="px-10 py-4 rounded-lg text-2xl font-bold transition-all hover:scale-105"
            style={{ backgroundColor: theme.primary, color: theme.text }}
          >
            🧠 Start Final Quiz
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    const percentage = Math.round((score / (QUIZ_QUESTIONS.length * 10)) * 100);
    const passed = percentage >= 70;
    
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-8" style={{ backgroundColor: theme.background }}>
        <h1 className="text-5xl font-extrabold mb-6" style={{ color: theme.text }}>
          {passed ? '🏆 Fraud Expert Certified!' : '📚 Keep Learning!'}
        </h1>
        <div className="text-2xl mb-6" style={{ color: theme.text }}>
          <p>Final Score: <span className="font-bold text-4xl" style={{ color: theme.accent }}>{score}/{QUIZ_QUESTIONS.length * 10}</span></p>
          <p className="mt-2">Percentage: {percentage}%</p>
          <p className="mt-4">{passed ? `Congratulations ${dogName}! You're now a certified fraud prevention expert!` : 'Review the training materials and try again to earn your certification!'}</p>
        </div>
        
        {/* Summary of incorrect answers */}
        <div className="mt-6 max-w-4xl">
          <h3 className="text-xl font-bold mb-4" style={{ color: theme.accent }}>Review Summary:</h3>
          <div className="grid gap-4">
            {answers.map((answer, index) => {
              const question = QUIZ_QUESTIONS[index];
              return (
                <div key={index} className={`p-4 rounded-lg ${answer.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                  <p className="font-semibold text-black">{question.game}: {answer.isCorrect ? '✅' : '❌'}</p>
                  {!answer.isCorrect && (
                    <p className="text-sm mt-1 text-black">{question.explanation}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <button 
          onClick={startGame}
          className="mt-6 px-8 py-3 rounded-lg text-xl font-bold transition-all hover:scale-105"
          style={{ backgroundColor: theme.primary, color: theme.text }}
        >
          🔄 Retake Quiz
        </button>
      </div>
    );
  }

  // Playing state
  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="w-full h-full p-8" style={{ backgroundColor: theme.background }}>
      {/* Progress and Timer */}
      <div className="flex justify-between items-center mb-6">
        <div style={{ color: theme.text }}>
          <div className="text-xl font-bold">Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</div>
          <div className="w-64 h-2 bg-gray-300 rounded-full mt-2">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: theme.accent }}
            />
          </div>
        </div>
        <div className="text-right" style={{ color: theme.text }}>
          <div className="text-xl font-bold">Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
          <div className="text-lg">Score: {score}</div>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 border-2" style={{ borderColor: theme.accent }}>
          <div className="mb-6">
            <div className="text-sm font-semibold mb-2" style={{ color: theme.accent }}>
              {question.game} - Review Question
            </div>
            <h2 className="text-2xl font-bold mb-6 text-black">
              {question.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                disabled={showExplanation}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === index 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="font-semibold text-black">
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`p-4 rounded-lg mb-6 ${
              selectedAnswer === question.correct ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <div className="font-semibold mb-2">
                {selectedAnswer === question.correct ? '✅ Correct!' : '❌ Incorrect'}
              </div>
              <p className="text-gray-700">{question.explanation}</p>
              {selectedAnswer !== question.correct && (
                <p className="text-gray-600 mt-2">
                  <strong>Correct answer:</strong> {String.fromCharCode(65 + question.correct)}. {question.options[question.correct]}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center">
            {!showExplanation ? (
              <button
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className={`px-8 py-3 rounded-lg text-lg font-bold transition-all ${
                  selectedAnswer !== null
                    ? 'hover:scale-105'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={{ 
                  backgroundColor: selectedAnswer !== null ? theme.primary : '#gray-400', 
                  color: theme.text 
                }}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="px-8 py-3 rounded-lg text-lg font-bold transition-all hover:scale-105"
                style={{ backgroundColor: theme.primary, color: theme.text }}
              >
                {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudQuizGame;