// Investment Radar Game for Island 3
import Phaser from 'phaser';

class InvestmentRadarGame extends Phaser.Scene {
  constructor() {
    super({ key: 'InvestmentRadarGame' });
    this.score = 0;
    this.lives = 3;
    this.timeLeft = 60;
    this.investmentDeals = [];
    this.radarRange = 150;
    this.gameEnded = false;
    this.totalCorrect = 0;
    this.totalDeals = 0;
  }

  init(data) {
    this.onGameComplete = data.onGameComplete;
    this.dogName = data.dogName || 'Detective Dog';
  }

  preload() {
    // Create colored rectangles for game elements
    this.load.image('background', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#bg)"/>
      </svg>
    `));

    // Dog sprite
    this.load.image('radar-dog', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="35" r="20" fill="#8B4513"/>
        <circle cx="25" cy="30" r="3" fill="#000"/>
        <circle cx="35" cy="30" r="3" fill="#000"/>
        <ellipse cx="30" cy="40" rx="3" ry="2" fill="#000"/>
        <ellipse cx="20" cy="25" rx="8" ry="15" fill="#8B4513"/>
        <ellipse cx="40" cy="25" rx="8" ry="15" fill="#8B4513"/>
        <rect x="25" y="45" width="10" height="3" fill="#FF0000"/>
      </svg>
    `));

    // Investment deals
    this.load.image('scam-deal', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="5" fill="#FF4444"/>
        <text x="20" y="25" text-anchor="middle" fill="white" font-size="12">💀</text>
      </svg>
    `));

    this.load.image('legit-deal', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="5" fill="#44FF44"/>
        <text x="20" y="25" text-anchor="middle" fill="white" font-size="12">💎</text>
      </svg>
    `));
  }

  create() {
    // Background
    this.add.image(400, 300, 'background');

    // UI Elements
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: '20px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    });

    this.livesText = this.add.text(16, 50, `Lives: ${this.lives}`, {
      fontSize: '20px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    });

    this.timeText = this.add.text(16, 84, `Time: ${this.timeLeft}`, {
      fontSize: '20px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    });

    // Instructions
    this.add.text(400, 30, `${this.dogName}'s Investment Radar`, {
      fontSize: '24px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.add.text(400, 60, 'Use radar to detect investment scams! Click near suspicious deals!', {
      fontSize: '16px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Create dog with radar
    this.dog = this.add.image(400, 300, 'radar-dog');
    this.dog.setInteractive();
    this.input.setDraggable(this.dog);

    // Radar circle
    this.radarGraphics = this.add.graphics();
    this.updateRadar();

    // Input handlers
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      if (gameObject === this.dog) {
        this.dog.x = dragX;
        this.dog.y = dragY;
        this.updateRadar();
        this.checkRadarDetection();
      }
    });

    this.input.on('pointerdown', (pointer) => {
      if (!this.gameEnded) {
        this.detectInvestment(pointer.x, pointer.y);
      }
    });

    // Spawn investment deals
    this.dealSpawnTimer = this.time.addEvent({
      delay: 2000,
      callback: this.spawnInvestmentDeal,
      callbackScope: this,
      loop: true
    });

    // Game timer
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });

    // Spawn initial deals
    this.spawnInvestmentDeal();
    this.time.delayedCall(1000, () => this.spawnInvestmentDeal());
  }

  updateRadar() {
    this.radarGraphics.clear();
    this.radarGraphics.lineStyle(3, 0x00ff00, 0.5);
    this.radarGraphics.strokeCircle(this.dog.x, this.dog.y, this.radarRange);
    this.radarGraphics.fillStyle(0x00ff00, 0.1);
    this.radarGraphics.fillCircle(this.dog.x, this.dog.y, this.radarRange);
  }

  spawnInvestmentDeal() {
    if (this.gameEnded) return;

    const isScam = Math.random() < 0.6; // 60% chance of scam
    const x = Phaser.Math.Between(50, 750);
    const y = Phaser.Math.Between(120, 550);

    const deal = this.add.image(x, y, isScam ? 'scam-deal' : 'legit-deal');
    deal.isScam = isScam;
    deal.detected = false;
    deal.setScale(0);

    // Animate appearance
    this.tweens.add({
      targets: deal,
      scaleX: 1,
      scaleY: 1,
      duration: 300,
      ease: 'Back.easeOut'
    });

    // Add floating effect
    this.tweens.add({
      targets: deal,
      y: y - 20,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.investmentDeals.push(deal);
    this.totalDeals++;

    // Remove deal after time
    this.time.delayedCall(8000, () => {
      if (deal && deal.active && !deal.detected) {
        this.removeDeal(deal);
        if (deal.isScam) {
          this.lives--;
          this.livesText.setText(`Lives: ${this.lives}`);
          this.showFeedback(deal.x, deal.y, 'Missed Scam!', '#ff0000');
          if (this.lives <= 0) {
            this.endGame(false);
          }
        }
      }
    });
  }

  checkRadarDetection() {
    this.investmentDeals.forEach(deal => {
      if (!deal.detected && deal.active) {
        const distance = Phaser.Math.Distance.Between(
          this.dog.x, this.dog.y, deal.x, deal.y
        );
        
        if (distance <= this.radarRange) {
          if (deal.isScam) {
            deal.setTint(0xff0000); // Red highlight for scams in range
          } else {
            deal.setTint(0xffff00); // Yellow highlight for legit deals in range
          }
        } else {
          deal.clearTint();
        }
      }
    });
  }

  detectInvestment(x, y) {
    // Check if click is within radar range of dog
    const distanceFromDog = Phaser.Math.Distance.Between(
      this.dog.x, this.dog.y, x, y
    );

    if (distanceFromDog > this.radarRange) {
      this.showFeedback(x, y, 'Out of radar range!', '#ffaa00');
      return;
    }

    // Find closest deal to click point
    let closestDeal = null;
    let closestDistance = Infinity;

    this.investmentDeals.forEach(deal => {
      if (!deal.detected && deal.active) {
        const distance = Phaser.Math.Distance.Between(x, y, deal.x, deal.y);
        if (distance < 50 && distance < closestDistance) {
          closestDistance = distance;
          closestDeal = deal;
        }
      }
    });

    if (closestDeal) {
      closestDeal.detected = true;
      
      if (closestDeal.isScam) {
        this.score += 20;
        this.totalCorrect++;
        this.showFeedback(closestDeal.x, closestDeal.y, '+20 Scam Detected!', '#00ff00');
      } else {
        this.score -= 10;
        this.lives--;
        this.showFeedback(closestDeal.x, closestDeal.y, '-10 Legit Deal Marked!', '#ff0000');
        if (this.lives <= 0) {
          this.endGame(false);
          return;
        }
      }

      this.scoreText.setText(`Score: ${this.score}`);
      this.livesText.setText(`Lives: ${this.lives}`);
      this.removeDeal(closestDeal);
    }
  }

  removeDeal(deal) {
    const index = this.investmentDeals.indexOf(deal);
    if (index > -1) {
      this.investmentDeals.splice(index, 1);
    }
    
    this.tweens.add({
      targets: deal,
      scaleX: 0,
      scaleY: 0,
      duration: 200,
      onComplete: () => {
        if (deal && deal.destroy) {
          deal.destroy();
        }
      }
    });
  }

  showFeedback(x, y, text, color) {
    const feedback = this.add.text(x, y, text, {
      fontSize: '16px',
      fill: color,
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.tweens.add({
      targets: feedback,
      y: y - 50,
      alpha: 0,
      duration: 1500,
      onComplete: () => feedback.destroy()
    });
  }

  updateTimer() {
    this.timeLeft--;
    this.timeText.setText(`Time: ${this.timeLeft}`);
    
    if (this.timeLeft <= 0) {
      this.endGame(this.score > 50);
    }
  }

  endGame(passed) {
    if (this.gameEnded) return;
    this.gameEnded = true;

    // Stop timers
    if (this.dealSpawnTimer) this.dealSpawnTimer.remove();
    if (this.gameTimer) this.gameTimer.remove();

    // Clear all deals
    this.investmentDeals.forEach(deal => {
      if (deal && deal.destroy) deal.destroy();
    });

    const accuracy = this.totalDeals > 0 ? (this.totalCorrect / this.totalDeals * 100).toFixed(1) : 0;

    // Show results
    const resultText = passed ? 'Investment Radar Mastered!' : 'Keep Learning!';
    const resultColor = passed ? '#00ff00' : '#ff0000';

    this.add.rectangle(400, 300, 600, 400, 0x000000, 0.8);
    
    this.add.text(400, 200, resultText, {
      fontSize: '32px',
      fill: resultColor,
      stroke: '#ffffff',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.add.text(400, 250, `Final Score: ${this.score}`, {
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 280, `Accuracy: ${accuracy}%`, {
      fontSize: '20px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 320, `Scams Detected: ${this.totalCorrect}/${this.totalDeals}`, {
      fontSize: '18px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Continue button
    this.add.rectangle(400, 380, 200, 50, 0x4CAF50)
      .setInteractive()
      .on('pointerdown', () => {
        if (this.onGameComplete) {
          this.onGameComplete({
            passed,
            score: Math.max(0, this.score),
            accuracy: parseFloat(accuracy),
            scamsDetected: this.totalCorrect
          });
        }
      });

    this.add.text(400, 380, 'Continue', {
      fontSize: '20px',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }
}

export default InvestmentRadarGame;