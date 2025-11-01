import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

const initialState = {
  currentLevel: 1,
  currentIsland: 1,
  score: 0,
  totalScore: 0,
  lives: 3,
  completedLevels: [],
  gameStartTime: null,
  user: null,
  leaderboard: []
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameStartTime: Date.now(),
        user: action.payload.user
      };
    
    case 'COMPLETE_LEVEL':
      const { levelId, score, timeBonus, perfect } = action.payload;
      const newCompletedLevels = [...state.completedLevels, levelId];
      const totalPoints = score + timeBonus + (perfect ? 15 : 0);
      
      // Calculate new island and level - simple mapping
      let newLevel = state.currentLevel + 1;
      let newIsland = state.currentIsland;
      
      if (newLevel > 2) {
        newLevel = 2; // Max level for now (since we only have 2 islands)
      }
      
      // Simple island mapping: Level 1 = Island 1, Level 2 = Island 2
      if (newLevel === 2) {
        newIsland = 2;
      }
      
      return {
        ...state,
        currentLevel: newLevel,
        currentIsland: newIsland,
        score: state.score + totalPoints,
        totalScore: state.totalScore + totalPoints,
        completedLevels: newCompletedLevels
      };
    
    case 'WRONG_ANSWER':
      return {
        ...state,
        lives: Math.max(0, state.lives - 1),
        score: Math.max(0, state.score - 5)
      };
    
    case 'RESET_GAME':
      return {
        ...initialState,
        user: state.user,
        leaderboard: state.leaderboard
      };
    
    case 'UPDATE_LEADERBOARD':
      return {
        ...state,
        leaderboard: action.payload
      };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };
    
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Calculate current dog evolution based on level
  const getCurrentDog = () => {
    const level = state.currentLevel;
    if (level >= 10) return { emoji: "🦸‍♂️🐕", name: "Security Hero" };
    if (level >= 7) return { emoji: "🐕‍🦺", name: "Fraud Hunter" };
    if (level >= 5) return { emoji: "🦮", name: "Cyber Sentinel" };
    if (level >= 3) return { emoji: "🐕", name: "Alert Guardian" };
    return { emoji: "🐶", name: "Puppy Detective" };
  };

  // Save game state to localStorage
  useEffect(() => {
    localStorage.setItem('fraudGameState', JSON.stringify(state));
  }, [state]);

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('fraudGameState');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      dispatch({ type: 'SET_STATE', payload: parsed });
    }
  }, []);

  const value = {
    ...state,
    currentDog: getCurrentDog(),
    dispatch
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}