// OTP Security Fortress Game for Island 5
import Phaser from 'phaser';

class OTPSecurityFortressGame extends Phaser.Scene {
  constructor() {
    super({ key: 'OTPSecurityFortressGame' });
    this.score = 0;
    this.lives = 3;
    this.timeLeft = 120;
    this.attackWaves = [];
    this.gameEnded = false;
    this.wavesBlocked = 0;
    this.totalWaves = 0;
    this.fortress = null;
    this.defenseLevel = 1;
  }

  init(data) {
    this.onGameComplete = data.onGameComplete;
    this.dogName = data.dogName || 'Detective Dog';
  }

  preload() {
    // Create fortress and defense elements
    this.load.image('fortress-bg', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#skyGrad)"/>
        <rect x="0" y="450" width="800" height="150" fill="#8FBC8F"/>
      </svg>
    `));

    // Fortress with guardian dog
    this.load.image('otp-fortress', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect x="50" y="80" width="100" height="70" fill="#A0522D"/>
        <polygon points="40,80 100,40 160,80" fill="#8B4513"/>
        <rect x="90" y="110" width="20" height="30" fill="#654321"/>
        <rect x="60" y="100" width="15" height="15" fill="#000"/>
        <rect x="125" y="100" width="15" height="15" fill="#000"/>
        <circle cx="100" cy="60" r="15" fill="#8B4513"/>
        <circle cx="95" cy="55" r="2" fill="#000"/>
        <circle cx="105" cy="55" r="2" fill="#000"/>
        <ellipse cx="100" cy="65" rx="3" ry="2" fill="#000"/>
        <text x="100" y="35" text-anchor="middle" fill="#FFD700" font-size="12" font-weight="bold">🛡️OTP</text>
      </svg>
    `));

    // Attack elements
    this.load.image('phishing-attack', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="60" height="40" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30" cy="20" rx="25" ry="15" fill="#FF4444"/>
        <text x="30" y="25" text-anchor="middle" fill="white" font-size="10">🎣PHISH</text>
      </svg>
    `));

    this.load.image('sim-swap-attack', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="60" height="40" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30" cy="20" rx="25" ry="15" fill="#FF6600"/>
        <text x="30" y="25" text-anchor="middle" fill="white" font-size="10">📱SWAP</text>
      </svg>
    `));

    this.load.image('social-eng-attack', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="60" height="40" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30" cy="20" rx="25" ry="15" fill="#9932CC"/>
        <text x="30" y="25" text-anchor="middle" fill="white" font-size="10">👥SOCIAL</text>
      </svg>
    `));

    // Defense barrier
    this.load.image('defense-barrier', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="80" height="20" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="20" fill="#4CAF50" rx="10"/>
        <text x="40" y="15" text-anchor="middle" fill="white" font-size="12" font-weight="bold">BLOCK</text>
      </svg>
    `));

    // OTP verification panel
    this.load.image('otp-panel', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="150" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="100" fill="#E0E0E0" stroke="#000" stroke-width="2" rx="10"/>
        <text x="75" y="25" text-anchor="middle" fill="#000" font-size="14" font-weight="bold">OTP VERIFY</text>
        <rect x="25" y="40" width="100" height="25" fill="#FFF" stroke="#000"/>
        <text x="75" y="57" text-anchor="middle" fill="#000" font-size="12">Enter Code</text>
        <rect x="50" y="75" width="50" height="20" fill="#4CAF50"/>
        <text x="75" y="87" text-anchor="middle" fill="white" font-size="10">VERIFY</text>
      </svg>
    `));
  }

  create() {
    // Background
    this.add.image(400, 300, 'fortress-bg');

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

    this.defenseText = this.add.text(16, 118, `Defense Level: ${this.defenseLevel}`, {
      fontSize: '18px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    });

    // Title
    this.add.text(400, 30, `${this.dogName}'s OTP Security Fortress`, {
      fontSize: '24px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.add.text(400, 60, 'Defend your fortress! Click attacks to verify OTP and block them!', {
      fontSize: '16px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);

    // Fortress
    this.fortress = this.add.image(400, 400, 'otp-fortress');

    // Defense barriers (clickable areas)
    this.createDefenseBarriers();

    // OTP verification panel
    this.otpPanel = this.add.image(400, 150, 'otp-panel').setVisible(false);
    this.currentOTP = '';
    this.expectedOTP = '';

    // Input handling for attacks
    this.input.on('pointerdown', (pointer) => {
      this.handleAttackClick(pointer.x, pointer.y);
    });

    // Spawn attack waves
    this.attackSpawnTimer = this.time.addEvent({
      delay: 3000,
      callback: this.spawnAttackWave,
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

    // Spawn initial attack
    this.time.delayedCall(1000, () => this.spawnAttackWave());
  }

  createDefenseBarriers() {
    this.defenseBarriers = [];
    
    // Create multiple defense lines
    for (let i = 0; i < 3; i++) {
      const y = 320 - (i * 40);
      for (let j = 0; j < 5; j++) {
        const x = 200 + (j * 100);
        const barrier = this.add.image(x, y, 'defense-barrier');
        barrier.setScale(0.8);
        barrier.setAlpha(0.7);
        this.defenseBarriers.push(barrier);
      }
    }
  }

  spawnAttackWave() {
    if (this.gameEnded) return;

    const attackTypes = ['phishing-attack', 'sim-swap-attack', 'social-eng-attack'];
    const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
    
    const startX = -50;
    const startY = Phaser.Math.Between(200, 350);
    const targetX = 400;
    const targetY = 400;

    const attack = this.add.image(startX, startY, attackType);
    attack.attackType = attackType;
    attack.setScale(0.8);
    attack.setInteractive();

    // Attack details for OTP verification
    attack.otpChallenge = this.generateOTPChallenge(attackType);

    // Move attack towards fortress
    this.tweens.add({
      targets: attack,
      x: targetX,
      y: targetY,
      duration: 8000 - (this.defenseLevel * 500), // Attacks get faster as game progresses
      ease: 'Linear',
      onComplete: () => {
        if (attack.active) {
          this.handleAttackReachFortress(attack);
        }
      }
    });

    // Add floating effect
    this.tweens.add({
      targets: attack,
      y: startY + 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.attackWaves.push(attack);
    this.totalWaves++;
  }

  generateOTPChallenge(attackType) {
    const challenges = {
      'phishing-attack': {
        message: 'Phishing email detected!\nBefore sharing OTP, verify the sender.',
        correctAction: 'Block',
        wrongAction: 'Share',
        otpCode: Math.floor(100000 + Math.random() * 900000).toString(),
        warning: 'Never share OTP with suspicious emails!'
      },
      'sim-swap-attack': {
        message: 'SIM swap attempt detected!\nVerify identity before any OTP.',
        correctAction: 'Block',
        wrongAction: 'Allow',
        otpCode: Math.floor(100000 + Math.random() * 900000).toString(),
        warning: 'Contact your bank directly if SIM issues occur!'
      },
      'social-eng-attack': {
        message: 'Social engineering call!\nBank will never ask for OTP over phone.',
        correctAction: 'Block',
        wrongAction: 'Share',
        otpCode: Math.floor(100000 + Math.random() * 900000).toString(),
        warning: 'Hang up and call bank using official number!'
      }
    };
    
    return challenges[attackType];
  }

  handleAttackClick(x, y) {
    if (this.gameEnded) return;

    // Find clicked attack
    let clickedAttack = null;
    let minDistance = Infinity;

    this.attackWaves.forEach(attack => {
      if (attack.active) {
        const distance = Phaser.Math.Distance.Between(x, y, attack.x, attack.y);
        if (distance < 40 && distance < minDistance) {
          minDistance = distance;
          clickedAttack = attack;
        }
      }
    });

    if (clickedAttack) {
      this.showOTPVerification(clickedAttack);
    }
  }

  showOTPVerification(attack) {
    this.currentAttack = attack;
    this.otpPanel.setVisible(true);
    
    // Pause attack movement
    this.tweens.killTweensOf(attack);
    
    // Show challenge details
    const challenge = attack.otpChallenge;
    
    this.challengeText = this.add.text(400, 200, challenge.message, {
      fontSize: '16px',
      fill: '#000000',
      backgroundColor: '#ffffff',
      padding: { x: 15, y: 10 },
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(400, 250, `Received OTP: ${challenge.otpCode}`, {
      fontSize: '18px',
      fill: '#ff0000',
      backgroundColor: '#ffffff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    // Action buttons
    const blockButton = this.add.rectangle(320, 300, 120, 40, 0x4CAF50)
      .setInteractive()
      .on('pointerdown', () => this.handleOTPAction('Block'));

    this.add.text(320, 300, 'BLOCK', {
      fontSize: '16px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const shareButton = this.add.rectangle(480, 300, 120, 40, 0xF44336)
      .setInteractive()
      .on('pointerdown', () => this.handleOTPAction('Share'));

    this.add.text(480, 300, 'SHARE/ALLOW', {
      fontSize: '14px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.otpButtons = [blockButton, shareButton];
  }

  handleOTPAction(action) {
    const challenge = this.currentAttack.otpChallenge;
    const isCorrect = action === challenge.correctAction;

    // Clean up OTP interface
    this.otpPanel.setVisible(false);
    if (this.challengeText) this.challengeText.destroy();
    this.otpButtons.forEach(button => button.destroy());
    this.otpButtons = [];

    if (isCorrect) {
      this.score += 25;
      this.wavesBlocked++;
      this.showFeedback(this.currentAttack.x, this.currentAttack.y, 'Attack Blocked! +25', '#00ff00');
      this.removeAttack(this.currentAttack);
      
      // Level up defense occasionally
      if (this.wavesBlocked % 3 === 0) {
        this.defenseLevel++;
        this.defenseText.setText(`Defense Level: ${this.defenseLevel}`);
        this.showFeedback(400, 100, `Defense Level Up! ${this.defenseLevel}`, '#ffff00');
      }
    } else {
      this.score -= 15;
      this.lives--;
      this.showFeedback(this.currentAttack.x, this.currentAttack.y, `Wrong! ${challenge.warning}`, '#ff0000');
      
      // Continue attack movement
      this.tweens.add({
        targets: this.currentAttack,
        x: 400,
        y: 400,
        duration: 2000,
        ease: 'Linear',
        onComplete: () => {
          if (this.currentAttack.active) {
            this.handleAttackReachFortress(this.currentAttack);
          }
        }
      });

      if (this.lives <= 0) {
        this.endGame(false);
        return;
      }
    }

    this.scoreText.setText(`Score: ${this.score}`);
    this.livesText.setText(`Lives: ${this.lives}`);
    this.currentAttack = null;
  }

  handleAttackReachFortress(attack) {
    this.lives--;
    this.livesText.setText(`Lives: ${this.lives}`);
    this.showFeedback(attack.x, attack.y, 'Fortress Breached!', '#ff0000');
    this.removeAttack(attack);

    if (this.lives <= 0) {
      this.endGame(false);
    }
  }

  removeAttack(attack) {
    const index = this.attackWaves.indexOf(attack);
    if (index > -1) {
      this.attackWaves.splice(index, 1);
    }
    
    this.tweens.add({
      targets: attack,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        if (attack && attack.destroy) {
          attack.destroy();
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
      y: y - 60,
      alpha: 0,
      duration: 2000,
      onComplete: () => feedback.destroy()
    });
  }

  updateTimer() {
    this.timeLeft--;
    this.timeText.setText(`Time: ${this.timeLeft}`);
    
    if (this.timeLeft <= 0) {
      this.endGame(this.score > 100);
    }
  }

  endGame(passed) {
    if (this.gameEnded) return;
    this.gameEnded = true;

    // Stop timers
    if (this.attackSpawnTimer) this.attackSpawnTimer.remove();
    if (this.gameTimer) this.gameTimer.remove();

    // Clear all attacks
    this.attackWaves.forEach(attack => {
      if (attack && attack.destroy) attack.destroy();
    });

    // Clean up OTP interface
    this.otpPanel.setVisible(false);
    if (this.challengeText) this.challengeText.destroy();
    if (this.otpButtons) {
      this.otpButtons.forEach(button => button.destroy());
    }

    const blockRate = this.totalWaves > 0 ? (this.wavesBlocked / this.totalWaves * 100).toFixed(1) : 0;

    // Show results
    const resultText = passed ? 'OTP Security Master!' : 'Keep Learning OTP Security!';
    const resultColor = passed ? '#00ff00' : '#ff0000';

    this.add.rectangle(400, 300, 700, 500, 0x000000, 0.9);
    
    this.add.text(400, 150, resultText, {
      fontSize: '28px',
      fill: resultColor,
      stroke: '#ffffff',
      strokeThickness: 2
    }).setOrigin(0.5);

    this.add.text(400, 200, `Final Score: ${this.score}`, {
      fontSize: '22px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 240, `Block Rate: ${blockRate}%`, {
      fontSize: '20px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 280, `Attacks Blocked: ${this.wavesBlocked}/${this.totalWaves}`, {
      fontSize: '18px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 320, `Final Defense Level: ${this.defenseLevel}`, {
      fontSize: '18px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 370, 'Remember OTP Security Rules:\n• Never share OTP over phone/email\n• Always verify sender authenticity\n• Contact bank directly if suspicious\n• OTP is only for your own transactions', {
      fontSize: '14px',
      fill: '#ffff00',
      align: 'center'
    }).setOrigin(0.5);

    // Continue button
    this.add.rectangle(400, 470, 200, 50, 0x4CAF50)
      .setInteractive()
      .on('pointerdown', () => {
        if (this.onGameComplete) {
          this.onGameComplete({
            passed,
            score: Math.max(0, this.score),
            blockRate: parseFloat(blockRate),
            attacksBlocked: this.wavesBlocked,
            defenseLevel: this.defenseLevel
          });
        }
      });

    this.add.text(400, 470, 'Continue', {
      fontSize: '20px',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }
}

export default OTPSecurityFortressGame;