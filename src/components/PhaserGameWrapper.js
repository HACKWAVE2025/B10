import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

function PhaserGameWrapper({ gameConfig, onGameComplete, width = 800, height = 600 }) {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  useEffect(() => {
    if (gameRef.current && !phaserGameRef.current) {
      const config = {
        type: Phaser.AUTO,
        width: width,
        height: height,
        parent: gameRef.current,
        backgroundColor: '#2c3e50',
        scale: {
          mode: Phaser.Scale.NONE,
          autoCenter: Phaser.Scale.CENTER_BOTH
        },
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0 }, // Remove gravity for QR scanner game
            debug: false
          }
        },
        ...gameConfig
      };

      phaserGameRef.current = new Phaser.Game(config);

      // Pass callback to game scenes after they are created
      phaserGameRef.current.events.on('ready', () => {
        const sceneManager = phaserGameRef.current.scene;
        sceneManager.getScenes().forEach(scene => {
          if (scene.init) {
            // Pass the callback data to scene init
            scene.onGameComplete = onGameComplete;
          }
        });
      });
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [gameConfig, onGameComplete, width, height]);

  return (
    <div className="flex flex-col items-center">
      <div 
        ref={gameRef} 
        className="border-4 border-blue-500 rounded-lg shadow-2xl bg-gray-800"
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          overflow: 'hidden',
          position: 'relative'
        }}
      />
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          🎮 Use arrow keys or WASD to move • Complete the challenge!
        </p>
      </div>
    </div>
  );
}

export default PhaserGameWrapper;