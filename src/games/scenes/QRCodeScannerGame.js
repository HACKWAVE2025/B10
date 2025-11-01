import Phaser from 'phaser';

export default class QRCodeScannerGame extends Phaser.Scene {
  constructor() {
    super({ key: 'QRCodeScannerGame' });
    this.gameCompleteCallback = null;
    this.score = 0;
    this.timeLeft = 30;
    this.qrCodes = [];
    this.dog = null;
    this.onGameComplete = null;
    this.dogName = 'Detective Dog';
  }

  init(data) {
    this.onGameComplete = data.onGameComplete;
    this.dogName = data.dogName || 'Detective Dog';
  }

  setGameCompleteCallback(callback) {
    this.gameCompleteCallback = callback;
  }

  preload() {
    // Create simple colored rectangles as placeholders for sprites
    this.load.image('background', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    
    // Create dog sprite (simple rectangle)
    this.add.graphics()
      .fillStyle(0x8B4513)
      .fillRect(0, 0, 40, 30)
      .generateTexture('dog', 40, 30);

    // Create QR codes (squares)
    this.add.graphics()
      .fillStyle(0x000000)
      .fillRect(0, 0, 30, 30)
      .generateTexture('qr-safe', 30, 30);

    this.add.graphics()
      .fillStyle(0xFF0000)
      .fillRect(0, 0, 30, 30)
      .generateTexture('qr-fraud', 30, 30);
  }

  create() {
    // Set fixed world bounds
    this.physics.world.setBounds(0, 0, 800, 600);
    
    // Background
    this.add.rectangle(400, 300, 800, 600, 0x87CEEB);
    
    // Title
    this.add.text(400, 50, '🔍 QR Code Scanner Challenge', {
      fontSize: '24px',
      fill: '#000',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Instructions
    this.add.text(400, 100, 'Help your dog find SAFE QR codes (black) and avoid FRAUD codes (red)!\nUse arrow keys to move your dog.', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);

    // Create dog player
    this.dog = this.physics.add.sprite(400, 500, 'dog');
    this.dog.setCollideWorldBounds(true);
    this.dog.setBounce(0);
    this.dog.setDrag(300); // Add drag for better movement control

    // Create QR codes
    this.qrCodes = this.physics.add.group();
    this.spawnQRCodes();

    // Setup collisions
    this.physics.add.overlap(this.dog, this.qrCodes, this.collectQRCode, null, this);

    // Controls (arrow keys + WASD)
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');

    // UI
    this.scoreText = this.add.text(50, 50, 'Safe QR Codes: 0', {
      fontSize: '18px',
      fill: '#000',
      fontFamily: 'Arial'
    });

    this.timeText = this.add.text(50, 80, 'Time: 30s', {
      fontSize: '18px',
      fill: '#000',
      fontFamily: 'Arial'
    });

    this.fraudText = this.add.text(50, 110, 'Frauds Avoided: 0', {
      fontSize: '18px',
      fill: '#000',
      fontFamily: 'Arial'
    });

    // Timer
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });

    // Spawn timer
    this.spawnTimer = this.time.addEvent({
      delay: 2000,
      callback: this.spawnQRCodes,
      callbackScope: this,
      loop: true
    });

    this.fraudsAvoided = 0;
    this.gameActive = true;
  }

  spawnQRCodes() {
    if (!this.gameActive) return;

    // Spawn 2-3 QR codes
    for (let i = 0; i < Phaser.Math.Between(2, 3); i++) {
      const x = Phaser.Math.Between(50, 750);
      const isSafe = Math.random() > 0.4; // 60% safe, 40% fraud
      const qrCode = this.qrCodes.create(x, 0, isSafe ? 'qr-safe' : 'qr-fraud');
      qrCode.setVelocityY(Phaser.Math.Between(50, 100));
      qrCode.setData('isSafe', isSafe);
      
      // Remove QR codes that fall off screen
      this.time.delayedCall(8000, () => {
        if (qrCode && qrCode.active) {
          if (!qrCode.getData('isSafe')) {
            this.fraudsAvoided++;
            this.fraudText.setText('Frauds Avoided: ' + this.fraudsAvoided);
          }
          qrCode.destroy();
        }
      });
    }
  }

  collectQRCode(dog, qrCode) {
    const isSafe = qrCode.getData('isSafe');
    
    if (isSafe) {
      this.score += 10;
      this.scoreText.setText('Safe QR Codes: ' + this.score / 10);
      
      // Happy dog animation (simple scale)
      this.tweens.add({
        targets: this.dog,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 200,
        yoyo: true
      });
    } else {
      this.score -= 5;
      this.timeLeft -= 3; // Penalty time
      
      // Sad dog animation
      this.tweens.add({
        targets: this.dog,
        tint: 0xff0000,
        duration: 300,
        yoyo: true,
        onComplete: () => {
          this.dog.setTint(0xffffff);
        }
      });
    }
    
    qrCode.destroy();
  }

  updateTimer() {
    this.timeLeft--;
    this.timeText.setText('Time: ' + this.timeLeft + 's');
    
    if (this.timeLeft <= 0) {
      this.endGame();
    }
  }

  update() {
    if (!this.gameActive) return;

    // Dog movement (arrow keys + WASD)
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      this.dog.setVelocityX(-200);
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      this.dog.setVelocityX(200);
    } else {
      this.dog.setVelocityX(0);
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      this.dog.setVelocityY(-200);
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      this.dog.setVelocityY(200);
    } else {
      this.dog.setVelocityY(0);
    }
  }

  endGame() {
    this.gameActive = false;
    this.timer.destroy();
    this.spawnTimer.destroy();
    
    // Calculate final score
    const finalScore = Math.max(0, this.score + (this.fraudsAvoided * 5));
    const passed = finalScore >= 30; // Need 30 points to pass
    
    // Show results
    this.add.rectangle(400, 300, 600, 400, 0x000000, 0.8);
    this.add.text(400, 200, passed ? '🎉 Mission Complete!' : '😔 Try Again!', {
      fontSize: '32px',
      fill: passed ? '#00ff00' : '#ff0000',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(400, 260, `Final Score: ${finalScore}`, {
      fontSize: '24px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(400, 300, `Safe QR Codes Collected: ${this.score / 10}`, {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(400, 330, `Fraud QR Codes Avoided: ${this.fraudsAvoided}`, {
      fontSize: '18px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(400, 380, 'Click to continue...', {
      fontSize: '16px',
      fill: '#ffff00',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Handle game completion
    this.input.once('pointerdown', () => {
      const result = {
        passed: passed,
        score: finalScore,
        gameType: 'qr-scanner',
        island: 1,
        safeCollected: this.score / 10,
        fraudsAvoided: this.fraudsAvoided
      };

      if (this.onGameComplete) {
        this.onGameComplete(result);
      } else if (this.gameCompleteCallback) {
        this.gameCompleteCallback(result);
      }
    });
  }
}