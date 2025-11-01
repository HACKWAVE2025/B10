import Phaser from 'phaser';

export default class SMSFilterGame extends Phaser.Scene {
  constructor() {
    super({ key: 'SMSFilterGame' });
    this.gameCompleteCallback = null;
    this.score = 0;
    this.lives = 3;
    this.messages = [];
    this.dog = null;
  }

  setGameCompleteCallback(callback) {
    this.gameCompleteCallback = callback;
  }

  preload() {
    // Create dog sprite
    this.add.graphics()
      .fillStyle(0x8B4513)
      .fillRect(0, 0, 60, 40)
      .generateTexture('dog-sms', 60, 40);

    // Create message bubbles
    this.add.graphics()
      .fillStyle(0x00ff00)
      .fillRect(0, 0, 120, 60)
      .generateTexture('msg-safe', 120, 60);

    this.add.graphics()
      .fillStyle(0xff0000)
      .fillRect(0, 0, 120, 60)
      .generateTexture('msg-fraud', 120, 60);

    // Create trash bin
    this.add.graphics()
      .fillStyle(0x666666)
      .fillRect(0, 0, 80, 100)
      .generateTexture('trash-bin', 80, 100);
  }

  create() {
    // Background
    this.add.rectangle(400, 300, 800, 600, 0xE6F3FF);
    
    // Title
    this.add.text(400, 50, '📱 SMS Filter Challenge', {
      fontSize: '24px',
      fill: '#000',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Instructions
    this.add.text(400, 100, 'Drag FRAUD messages (red) to trash, let SAFE messages (green) reach the inbox!\nDrag your dog to intercept messages.', {
      fontSize: '14px',
      fill: '#000',
      fontFamily: 'Arial',
      align: 'center'
    }).setOrigin(0.5);

    // Create dog
    this.dog = this.add.sprite(400, 400, 'dog-sms');
    this.dog.setInteractive({ draggable: true });
    this.dog.on('drag', (pointer, dragX, dragY) => {
      this.dog.x = dragX;
      this.dog.y = dragY;
    });

    // Create trash bin
    this.trashBin = this.add.sprite(100, 500, 'trash-bin');
    
    // Create inbox area
    this.add.rectangle(700, 500, 150, 100, 0x90EE90, 0.5);
    this.add.text(700, 500, '📥 INBOX', {
      fontSize: '16px',
      fill: '#000',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    // Message group
    this.messages = this.add.group();

    // UI
    this.scoreText = this.add.text(50, 50, 'Score: 0', {
      fontSize: '18px',
      fill: '#000',
      fontFamily: 'Arial'
    });

    this.livesText = this.add.text(50, 80, 'Lives: ❤️❤️❤️', {
      fontSize: '18px',
      fill: '#000',
      fontFamily: 'Arial'
    });

    // SMS data
    this.smsTypes = [
      { text: 'Bank Alert', isSafe: true },
      { text: 'Click for Prize!', isSafe: false },
      { text: 'OTP: 123456', isSafe: true },
      { text: 'Urgent! Click Link', isSafe: false },
      { text: 'Meeting Reminder', isSafe: true },
      { text: 'You Won Lottery!', isSafe: false },
      { text: 'Bill Payment Due', isSafe: true },
      { text: 'Share Your PIN', isSafe: false }
    ];

    // Start spawning messages
    this.spawnTimer = this.time.addEvent({
      delay: 3000,
      callback: this.spawnMessage,
      callbackScope: this,
      loop: true
    });

    this.gameActive = true;
    this.messageCount = 0;
  }

  spawnMessage() {
    if (!this.gameActive || this.messageCount >= 15) {
      if (this.messageCount >= 15) {
        this.endGame();
      }
      return;
    }

    const smsData = Phaser.Utils.Array.GetRandom(this.smsTypes);
    const message = this.add.sprite(400, 50, smsData.isSafe ? 'msg-safe' : 'msg-fraud');
    
    // Add text to message
    const messageText = this.add.text(message.x, message.y, smsData.text, {
      fontSize: '12px',
      fill: '#000',
      fontFamily: 'Arial',
      wordWrap: { width: 100 }
    }).setOrigin(0.5);

    // Make message draggable
    message.setInteractive({ draggable: true });
    message.setData('isSafe', smsData.isSafe);
    message.setData('textObject', messageText);
    
    message.on('drag', (pointer, dragX, dragY) => {
      message.x = dragX;
      message.y = dragY;
      messageText.x = dragX;
      messageText.y = dragY;
    });

    message.on('dragend', () => {
      this.checkMessageDrop(message);
    });

    // Auto-move message down if not interacted with
    this.tweens.add({
      targets: [message, messageText],
      y: 550,
      duration: 8000,
      onComplete: () => {
        this.checkMessageReachedBottom(message);
      }
    });

    this.messages.add(message);
    this.messageCount++;
  }

  checkMessageDrop(message) {
    const messageText = message.getData('textObject');
    const isSafe = message.getData('isSafe');
    
    // Check if dropped in trash
    const trashDistance = Phaser.Math.Distance.Between(
      message.x, message.y,
      this.trashBin.x, this.trashBin.y
    );

    // Check if dropped in inbox
    const inboxDistance = Phaser.Math.Distance.Between(
      message.x, message.y,
      700, 500
    );

    if (trashDistance < 100) {
      // Dropped in trash
      if (!isSafe) {
        this.score += 15; // Correctly identified fraud
        this.showFeedback('✅ Fraud blocked!', message.x, message.y, 0x00ff00);
      } else {
        this.lives--;
        this.showFeedback('❌ Safe message deleted!', message.x, message.y, 0xff0000);
      }
      message.destroy();
      messageText.destroy();
      this.updateUI();
    } else if (inboxDistance < 100) {
      // Dropped in inbox
      if (isSafe) {
        this.score += 10; // Correctly allowed safe message
        this.showFeedback('✅ Safe message delivered!', message.x, message.y, 0x00ff00);
      } else {
        this.lives--;
        this.showFeedback('❌ Fraud reached inbox!', message.x, message.y, 0xff0000);
      }
      message.destroy();
      messageText.destroy();
      this.updateUI();
    }
  }

  checkMessageReachedBottom(message) {
    if (!message.active) return;
    
    const messageText = message.getData('textObject');
    const isSafe = message.getData('isSafe');
    
    if (isSafe) {
      this.score += 5; // Safe message naturally reached inbox
    } else {
      this.lives--; // Fraud message slipped through
      this.showFeedback('❌ Fraud slipped through!', message.x, message.y, 0xff0000);
    }
    
    message.destroy();
    messageText.destroy();
    this.updateUI();
  }

  showFeedback(text, x, y, color) {
    const feedback = this.add.text(x, y, text, {
      fontSize: '16px',
      fill: `#${color.toString(16).padStart(6, '0')}`,
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: feedback,
      y: y - 50,
      alpha: 0,
      duration: 1500,
      onComplete: () => {
        feedback.destroy();
      }
    });
  }

  updateUI() {
    this.scoreText.setText('Score: ' + this.score);
    
    let heartsDisplay = '';
    for (let i = 0; i < this.lives; i++) {
      heartsDisplay += '❤️';
    }
    for (let i = this.lives; i < 3; i++) {
      heartsDisplay += '🤍';
    }
    this.livesText.setText('Lives: ' + heartsDisplay);

    if (this.lives <= 0) {
      this.endGame();
    }
  }

  endGame() {
    this.gameActive = false;
    this.spawnTimer.destroy();
    
    // Destroy remaining messages
    this.messages.children.entries.forEach(message => {
      const textObject = message.getData('textObject');
      if (textObject) textObject.destroy();
      message.destroy();
    });

    const passed = this.score >= 50 && this.lives > 0;
    
    // Show results
    this.add.rectangle(400, 300, 600, 400, 0x000000, 0.8);
    this.add.text(400, 200, passed ? '🎉 SMS Expert!' : '😔 More Training Needed!', {
      fontSize: '28px',
      fill: passed ? '#00ff00' : '#ff0000',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(400, 260, `Final Score: ${this.score}`, {
      fontSize: '22px',
      fill: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(400, 300, `Lives Remaining: ${this.lives}`, {
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
      if (this.gameCompleteCallback) {
        this.gameCompleteCallback({
          passed: passed,
          score: this.score,
          gameType: 'sms-filter',
          island: 2
        });
      }
    });
  }
}