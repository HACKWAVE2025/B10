import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';

// Placeholder data - in a real app, this would come from Firebase
const mockLeaderboardData = [
  { id: 1, name: 'Alex & Buddy', score: 150, completedLevels: 10, dogName: 'Buddy' },
  { id: 2, name: 'Sarah & Luna', score: 135, completedLevels: 9, dogName: 'Luna' },
  { id: 3, name: 'Mike & Max', score: 120, completedLevels: 8, dogName: 'Max' },
  { id: 4, name: 'Emma & Bella', score: 105, completedLevels: 7, dogName: 'Bella' },
  { id: 5, name: 'John & Rocky', score: 95, completedLevels: 6, dogName: 'Rocky' },
  { id: 6, name: 'Lisa & Coco', score: 80, completedLevels: 5, dogName: 'Coco' },
  { id: 7, name: 'Tom & Scout', score: 70, completedLevels: 4, dogName: 'Scout' },
  { id: 8, name: 'Amy & Daisy', score: 60, completedLevels: 3, dogName: 'Daisy' },
  { id: 9, name: 'Chris & Zeus', score: 45, completedLevels: 2, dogName: 'Zeus' },
  { id: 10, name: 'Nina & Milo', score: 30, completedLevels: 1, dogName: 'Milo' }
];

function Leaderboard({ onBackToGame, onResetGame }) {
  const { score, currentLevel } = useGame();
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerRank, setPlayerRank] = useState(null);
  const [showPersonalStats, setShowPersonalStats] = useState(true);

  useEffect(() => {
    // In a real app, this would be a Firebase query
    // For now, we'll use mock data and add current player
    const currentPlayerEntry = {
      id: 'current',
      name: 'You',
      score: score,
      completedLevels: currentLevel - 1,
      dogName: 'Your Dog',
      isCurrentPlayer: true
    };

    const allEntries = [...mockLeaderboardData, currentPlayerEntry]
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    setLeaderboard(allEntries);
    
    const currentPlayerRank = allEntries.find(entry => entry.isCurrentPlayer)?.rank;
    setPlayerRank(currentPlayerRank);
  }, [score, currentLevel]);

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏅';
  };

  const getDogEvolutionEmoji = (completedLevels) => {
    if (completedLevels >= 10) return '🦸‍♂️🐕';
    if (completedLevels >= 7) return '🐕‍🦺';
    if (completedLevels >= 5) return '🦮';
    if (completedLevels >= 3) return '🐕';
    return '🐶';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gradient bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
            🏆 Fraud Fighters Leaderboard 🏆
          </h2>
          <p className="text-lg text-gray-600">
            Top trainers and their cyber-detective companions
          </p>
        </div>

        {/* Personal Stats */}
        {showPersonalStats && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your Performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{score}</div>
                    <div className="text-sm text-gray-600">Total Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">#{playerRank}</div>
                    <div className="text-sm text-gray-600">Current Rank</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{currentLevel - 1}</div>
                    <div className="text-sm text-gray-600">Levels Complete</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl">{getDogEvolutionEmoji(currentLevel - 1)}</div>
                    <div className="text-sm text-gray-600">Dog Evolution</div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowPersonalStats(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Trainer & Dog</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Score</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Levels</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Evolution</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.slice(0, 10).map((entry) => (
                <tr 
                  key={entry.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    entry.isCurrentPlayer ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{getRankEmoji(entry.rank)}</span>
                      <span className="font-bold text-lg">{entry.rank}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-semibold text-gray-800">
                        {entry.isCurrentPlayer ? 'You' : entry.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        with {entry.dogName}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-xl font-bold text-blue-600">{entry.score}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-lg font-semibold text-purple-600">
                      {entry.completedLevels}/10
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-3xl">
                    {getDogEvolutionEmoji(entry.completedLevels)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center space-y-4">
          <div className="space-x-4">
            <button
              onClick={onBackToGame}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
            >
              🎮 Continue Training
            </button>
            <button
              onClick={onResetGame}
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
            >
              🆕 New Adventure
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>💡 Tip: Complete all levels to unlock your dog's ultimate form!</p>
          </div>
        </div>

        {/* Game Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold text-yellow-800">Goal</h4>
              <p className="text-sm text-yellow-700">Train your dog to detect all 10 fraud types</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl mb-2">🏝️</div>
              <h4 className="font-semibold text-green-800">Journey</h4>
              <p className="text-sm text-green-700">Explore 5 islands with unique challenges</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl mb-2">🦸‍♂️</div>
              <h4 className="font-semibold text-purple-800">Evolution</h4>
              <p className="text-sm text-purple-700">Watch your companion grow stronger</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;