import React, { useState, useEffect } from 'react';

function ScenarioCard({ scenario, onComplete, onWrongAnswer, dogName }) {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [allChoicesCorrect, setAllChoicesCorrect] = useState(true);

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedChoice(null);
    setShowFeedback(false);
    setAllChoicesCorrect(true);
    setTimeElapsed(0);
  }, [scenario]);

  useEffect(() => {
    if (startTime && !showFeedback) {
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, showFeedback]);

  const handleChoiceClick = (choiceIndex) => {
    if (showFeedback) return;

    const choice = scenario.choices[choiceIndex];
    setSelectedChoice(choiceIndex);
    setShowFeedback(true);

    const endTime = Date.now();
    const responseTime = Math.floor((endTime - startTime) / 1000);
    
    // Calculate bonuses
    const timeBonus = responseTime < 10 ? 2 : 0;
    const isCorrect = choice.isSafe;
    
    if (!isCorrect) {
      setAllChoicesCorrect(false);
      onWrongAnswer();
    }

    setTimeout(() => {
      const levelResult = {
        correct: isCorrect,
        timeBonus,
        perfect: allChoicesCorrect && isCorrect,
        responseTime
      };
      onComplete(levelResult);
    }, 3000);
  };

  const getChoiceButtonClass = (choiceIndex) => {
    const baseClass = "choice-button w-full text-left p-4 rounded-lg border-2 transition-all duration-200";
    
    if (!showFeedback) {
      return `${baseClass} bg-gray-50 border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer`;
    }
    
    const choice = scenario.choices[choiceIndex];
    if (selectedChoice === choiceIndex) {
      return choice.isSafe 
        ? `${baseClass} bg-green-100 border-green-500 text-green-800`
        : `${baseClass} bg-red-100 border-red-500 text-red-800`;
    }
    
    return choice.isSafe 
      ? `${baseClass} bg-green-50 border-green-300 text-green-700`
      : `${baseClass} bg-gray-100 border-gray-300 text-gray-600`;
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
      {/* Level Header */}
      <div className="text-center mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-semibold text-gray-600">
            🏝️ Island {scenario.island} • Level {scenario.level}
          </div>
          <div className="text-sm font-semibold text-blue-600">
            ⏱️ {timeElapsed}s
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          {scenario.title}
        </h2>
      </div>

      {/* Scenario */}
      <div className="scenario-card mb-8 p-6">
        <div className="text-lg text-gray-700 leading-relaxed mb-4">
          {scenario.scenario}
        </div>
        
        {showFeedback && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <div className="text-lg font-semibold text-blue-800 mb-2">
              {scenario.dogReaction}
            </div>
            <div className="text-sm text-blue-700">
              {dogName} is analyzing the situation...
            </div>
          </div>
        )}
      </div>

      {/* Choices */}
      <div className="space-y-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          What should you do?
        </h3>
        {scenario.choices.map((choice, index) => (
          <div key={index}>
            <button
              onClick={() => handleChoiceClick(index)}
              className={getChoiceButtonClass(index)}
              disabled={showFeedback}
            >
              <div className="flex items-start">
                <span className="inline-block w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-bold mr-3 flex items-center justify-center flex-shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{choice.text}</span>
                {showFeedback && (
                  <span className="ml-2">
                    {choice.isSafe ? '✅' : '❌'}
                  </span>
                )}
              </div>
            </button>
            
            {showFeedback && selectedChoice === index && (
              <div className={`mt-2 p-3 rounded-lg ${
                choice.isSafe 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm ${
                  choice.isSafe ? 'text-green-800' : 'text-red-800'
                }`}>
                  {choice.feedback}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="text-center text-sm text-gray-600">
        <div className="flex justify-center space-x-2 mb-2">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < scenario.level 
                  ? 'bg-green-400' 
                  : i === scenario.level - 1 
                    ? 'bg-blue-400' 
                    : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p>Scenario {scenario.level} of 10</p>
      </div>

      {showFeedback && (
        <div className="mt-6 text-center">
          <div className="text-lg font-semibold text-gray-700">
            {selectedChoice !== null && scenario.choices[selectedChoice].isSafe 
              ? '🎉 Well done! Moving to next level...' 
              : '💪 Learning experience! Next level coming up...'}
          </div>
        </div>
      )}
    </div>
  );
}

export default ScenarioCard;