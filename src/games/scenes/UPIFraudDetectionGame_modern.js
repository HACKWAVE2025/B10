// Modern UPI Fraud Detection Game with Real Banking App Styling
import Phaser from 'phaser';

class UPIFraudDetectionGame extends Phaser.Scene {
  constructor() {
    super({ key: 'UPIFraudDetectionGame' });
    this.score = 0;
    this.lives = 3;
    this.timeLeft = 30;
    this.gameEnded = false;
    this.correctDecisions = 0;
    this.totalDecisions = 0;
    this.currentUI = [];
  }

  init(data) {
    this.onGameComplete = data.onGameComplete;
    this.dogName = data.dogName || 'Detective Dog';
  }

  create() {
    // Modern banking app interface
    const gameWidth = 800;
    const gameHeight = 600;
    
    // Modern gradient background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x667EEA, 0x667EEA, 0x764BA2, 0x764BA2);
    bg.fillRect(0, 0, gameWidth, gameHeight);
    
    // Phone frame with modern styling
    const phoneFrame = this.add.graphics();
    phoneFrame.fillStyle(0x1A1A2E);
    phoneFrame.fillRoundedRect(100, 20, 600, 560, 35);
    phoneFrame.fillStyle(0xFFFFFF);
    phoneFrame.fillRoundedRect(110, 30, 580, 540, 30);
    
    // App header with modern UPI colors
    const header = this.add.graphics();
    header.fillGradientStyle(0x667EEA, 0x667EEA, 0x764BA2, 0x764BA2);
    header.fillRect(110, 30, 580, 90);
    
    // Header elements
    this.add.text(400, 60, '💳 UPI Payment App', {
      fontSize: '22px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    this.add.text(400, 85, 'Secure • Fast • Reliable', {
      fontSize: '12px',
      fill: '#E0E7FF'
    }).setOrigin(0.5);
    
    // Modern status bar
    this.add.text(130, 50, '📶 Jio 4G', { fontSize: '10px', fill: '#ffffff' });
    this.add.text(640, 50, '🔋 85%', { fontSize: '10px', fill: '#ffffff' });
    this.add.text(600, 50, '⏰ 2:30 PM', { fontSize: '10px', fill: '#ffffff' });
    
    // Main content area with modern cards
    const contentBg = this.add.graphics();
    contentBg.fillStyle(0xF8FAFC);
    contentBg.fillRect(110, 120, 580, 350);
    
    // Score panel with modern design
    const scoreCard = this.add.graphics();
    scoreCard.fillStyle(0x10B981);
    scoreCard.fillRoundedRect(130, 140, 160, 60, 15);
    
    this.scoreText = this.add.text(210, 170, `Score: ${this.score}`, {
      fontSize: '16px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Lives panel
    const livesCard = this.add.graphics();
    livesCard.fillStyle(0xEF4444);
    livesCard.fillRoundedRect(310, 140, 120, 60, 15);
    
    this.livesText = this.add.text(370, 170, `Lives: ${this.lives}`, {
      fontSize: '16px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Timer panel
    const timerCard = this.add.graphics();
    timerCard.fillStyle(0xF59E0B);
    timerCard.fillRoundedRect(450, 140, 120, 60, 15);
    
    this.timerText = this.add.text(510, 170, `Time: ${this.timeLeft}s`, {
      fontSize: '16px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Title
    this.add.text(400, 230, '🎯 Training in fraud detection', {
      fontSize: '16px',
      fill: '#64748B',
      fontStyle: 'italic'
    }).setOrigin(0.5);
    
    // Start timer
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
    
    // Start first scenario
    this.showUrgentPaymentRequest();
  }
  
  updateTimer() {
    if (this.gameEnded) return;
    
    this.timeLeft--;
    this.timerText.setText(`Time: ${this.timeLeft}s`);
    
    if (this.timeLeft <= 0) {
      this.endGame();
    }
  }
  
  showUrgentPaymentRequest() {
    this.clearCurrentUI();
    
    // Modern notification card
    const notificationCard = this.add.graphics();
    notificationCard.fillStyle(0xFFFFFF);
    notificationCard.lineStyle(2, 0xE5E7EB);
    notificationCard.fillRoundedRect(130, 260, 540, 120, 15);
    notificationCard.strokeRoundedRect(130, 260, 540, 120, 15);
    
    // Notification content
    this.add.text(150, 280, '📱 Payment Request Received', {
      fontSize: '14px',
      fill: '#EF4444',
      fontWeight: 'bold'
    });
    
    this.add.text(150, 300, 'From: +91 98765-43210 (Unknown)', {
      fontSize: '12px',
      fill: '#64748B'
    });
    
    this.add.text(150, 320, '💰 Amount: ₹15,000', {
      fontSize: '16px',
      fill: '#1F2937',
      fontWeight: 'bold'
    });
    
    this.add.text(150, 340, '📝 Message: "Hi! Emergency hospital bill for mom.\nPlease send money urgently!"', {
      fontSize: '11px',
      fill: '#374151',
      wordWrap: { width: 500 }
    });
    
    this.add.text(150, 365, '⚠️ This number is not in your contacts', {
      fontSize: '10px',
      fill: '#DC2626',
      fontWeight: 'bold'
    });
    
    // Modern action buttons
    this.time.delayedCall(2000, () => {
      this.showModernDecisionButtons();
    });
  }
  
  showModernDecisionButtons() {
    // Button container
    const buttonContainer = this.add.graphics();
    buttonContainer.fillStyle(0xFFFFFF);
    buttonContainer.fillRoundedRect(130, 400, 540, 100, 15);
    
    this.add.text(400, 420, '🤔 What should you do?', {
      fontSize: '16px',
      fill: '#1F2937',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Modern button styling
    const buttonStyle = {
      fontSize: '13px',
      fill: '#ffffff',
      fontWeight: 'bold'
    };
    
    // Pay immediately button (dangerous)
    const payBtn = this.add.graphics();
    payBtn.fillStyle(0xDC2626);
    payBtn.fillRoundedRect(150, 450, 120, 40, 20);
    payBtn.setInteractive(new Phaser.Geom.Rectangle(150, 450, 120, 40), Phaser.Geom.Rectangle.Contains)
      .on('pointerover', () => {
        payBtn.clear();
        payBtn.fillStyle(0xB91C1C);
        payBtn.fillRoundedRect(150, 450, 120, 40, 20);
      })
      .on('pointerout', () => {
        payBtn.clear();
        payBtn.fillStyle(0xDC2626);
        payBtn.fillRoundedRect(150, 450, 120, 40, 20);
      })
      .on('pointerdown', () => this.handleDecision('pay'));
    
    this.add.text(210, 470, '💸 Pay Now', buttonStyle).setOrigin(0.5);
    
    // Call to verify button (good)
    const callBtn = this.add.graphics();
    callBtn.fillStyle(0x059669);
    callBtn.fillRoundedRect(290, 450, 120, 40, 20);
    callBtn.setInteractive(new Phaser.Geom.Rectangle(290, 450, 120, 40), Phaser.Geom.Rectangle.Contains)
      .on('pointerover', () => {
        callBtn.clear();
        callBtn.fillStyle(0x047857);
        callBtn.fillRoundedRect(290, 450, 120, 40, 20);
      })
      .on('pointerout', () => {
        callBtn.clear();
        callBtn.fillStyle(0x059669);
        callBtn.fillRoundedRect(290, 450, 120, 40, 20);
      })
      .on('pointerdown', () => this.handleDecision('call'));
    
    this.add.text(350, 470, '📞 Call First', buttonStyle).setOrigin(0.5);
    
    // Ignore/Block button (safe)
    const ignoreBtn = this.add.graphics();
    ignoreBtn.fillStyle(0x6366F1);
    ignoreBtn.fillRoundedRect(430, 450, 120, 40, 20);
    ignoreBtn.setInteractive(new Phaser.Geom.Rectangle(430, 450, 120, 40), Phaser.Geom.Rectangle.Contains)
      .on('pointerover', () => {
        ignoreBtn.clear();
        ignoreBtn.fillStyle(0x4F46E5);
        ignoreBtn.fillRoundedRect(430, 450, 120, 40, 20);
      })
      .on('pointerout', () => {
        ignoreBtn.clear();
        ignoreBtn.fillStyle(0x6366F1);
        ignoreBtn.fillRoundedRect(430, 450, 120, 40, 20);
      })
      .on('pointerdown', () => this.handleDecision('ignore'));
    
    this.add.text(490, 470, '🚫 Block', buttonStyle).setOrigin(0.5);
    
    this.currentUI.push(buttonContainer, payBtn, callBtn, ignoreBtn);
  }
  
  handleDecision(decision) {
    this.clearCurrentUI();
    this.totalDecisions++;
    
    let scoreChange = 0;
    let message = '';
    let bgColor = 0xDC2626;
    
    switch (decision) {
      case 'pay':
        message = '💸 FRAUD ALERT!\n\nYou just lost ₹15,000!\n\n❌ Never pay unknown numbers\n❌ Always verify identity first\n❌ Real emergencies don\'t demand instant payments\n\n🔍 Red flags you missed:\n• Unknown number\n• Urgency pressure\n• Emotional manipulation';
        scoreChange = -50;
        this.lives -= 2;
        bgColor = 0xDC2626;
        break;
        
      case 'call':
        message = '✅ EXCELLENT DECISION!\n\n📞 You called to verify and discovered:\n• The number belongs to a scammer\n• Your family is safe\n• No emergency exists\n\n🎯 Always verify before paying!\n💡 Scammers create fake urgency';
        scoreChange = 50;
        this.correctDecisions++;
        bgColor = 0x059669;
        break;
        
      case 'ignore':
        message = '✅ SMART MOVE!\n\n🛡️ You protected yourself by:\n• Not responding to unknown numbers\n• Avoiding emotional manipulation\n• Preventing fraud attempts\n\n💡 When in doubt, don\'t pay out!';
        scoreChange = 30;
        this.correctDecisions++;
        bgColor = 0x6366F1;
        break;
        
      default:
        message = '⚠️ Stay alert for fraud attempts!';
        scoreChange = 0;
        bgColor = 0x6B7280;
        break;
    }
    
    this.score += scoreChange;
    this.scoreText.setText(`Score: ${this.score}`);
    this.livesText.setText(`Lives: ${this.lives}`);
    
    // Show modern result popup
    this.showModernResultPopup(message, bgColor);
    
    this.time.delayedCall(4000, () => {
      if (this.lives > 0 && this.timeLeft > 0) {
        this.showSecondScenario();
      } else {
        this.endGame();
      }
    });
  }
  
  showModernResultPopup(message, bgColor) {
    // Modern modal overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, 800, 600);
    
    // Modern popup card
    const popup = this.add.graphics();
    popup.fillStyle(0xFFFFFF);
    popup.fillRoundedRect(150, 100, 500, 400, 25);
    
    // Colored header
    const header = this.add.graphics();
    header.fillStyle(bgColor);
    header.fillRoundedRect(150, 100, 500, 80, 25);
    header.fillRect(150, 155, 500, 25);
    
    // Header text
    const headerText = bgColor === 0xDC2626 ? '⚠️ FRAUD DETECTED!' : '✅ WELL DONE!';
    this.add.text(400, 140, headerText, {
      fontSize: '20px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Message content
    this.add.text(400, 320, message, {
      fontSize: '13px',
      fill: '#1F2937',
      fontFamily: 'Arial',
      align: 'center',
      lineSpacing: 4,
      wordWrap: { width: 450 }
    }).setOrigin(0.5);
    
    this.currentUI.push(overlay, popup, header);
  }
  
  showSecondScenario() {
    this.clearCurrentUI();
    
    // Second scenario: Different scam type
    const notificationCard = this.add.graphics();
    notificationCard.fillStyle(0xFFFFFF);
    notificationCard.lineStyle(2, 0xF59E0B);
    notificationCard.fillRoundedRect(130, 260, 540, 120, 15);
    notificationCard.strokeRoundedRect(130, 260, 540, 120, 15);
    
    this.add.text(150, 280, '🎁 Congratulations! You Won!', {
      fontSize: '14px',
      fill: '#F59E0B',
      fontWeight: 'bold'
    });
    
    this.add.text(150, 300, 'From: +91 77777-12345', {
      fontSize: '12px',
      fill: '#64748B'
    });
    
    this.add.text(150, 320, '💰 Prize: ₹50,000 Cash!', {
      fontSize: '16px',
      fill: '#1F2937',
      fontWeight: 'bold'
    });
    
    this.add.text(150, 340, '📝 "Claim your lottery prize!\nPay ₹500 processing fee to get ₹50,000"', {
      fontSize: '11px',
      fill: '#374151',
      wordWrap: { width: 500 }
    });
    
    this.time.delayedCall(2000, () => {
      this.showSecondDecisionButtons();
    });
  }
  
  showSecondDecisionButtons() {
    // Similar modern button layout for second scenario
    const buttonContainer = this.add.graphics();
    buttonContainer.fillStyle(0xFFFFFF);
    buttonContainer.fillRoundedRect(130, 400, 540, 100, 15);
    
    this.add.text(400, 420, '🎰 Lottery scam detected! What do you do?', {
      fontSize: '16px',
      fill: '#1F2937',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Pay fee button (bad choice)
    const payBtn = this.add.graphics();
    payBtn.fillStyle(0xDC2626);
    payBtn.fillRoundedRect(200, 450, 130, 40, 20);
    payBtn.setInteractive(new Phaser.Geom.Rectangle(200, 450, 130, 40), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => this.handleSecondDecision('pay'));
    
    this.add.text(265, 470, '💸 Pay Fee', {
      fontSize: '13px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Ignore/Delete button (good choice)
    const ignoreBtn = this.add.graphics();
    ignoreBtn.fillStyle(0x059669);
    ignoreBtn.fillRoundedRect(350, 450, 130, 40, 20);
    ignoreBtn.setInteractive(new Phaser.Geom.Rectangle(350, 450, 130, 40), Phaser.Geom.Rectangle.Contains)
      .on('pointerdown', () => this.handleSecondDecision('ignore'));
    
    this.add.text(415, 470, '🗑️ Delete & Ignore', {
      fontSize: '13px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    this.currentUI.push(buttonContainer, payBtn, ignoreBtn);
  }
  
  handleSecondDecision(decision) {
    this.clearCurrentUI();
    this.totalDecisions++;
    
    let scoreChange = 0;
    let message = '';
    let bgColor = 0xDC2626;
    
    switch (decision) {
      case 'pay':
        message = '🎰 LOTTERY SCAM!\n\nYou lost ₹500 and got nothing!\n\n❌ Real lotteries don\'t ask for fees\n❌ You never entered any lottery\n❌ "Processing fees" are always scams\n\n🚨 If it sounds too good to be true, it is!';
        scoreChange = -25;
        this.lives--;
        bgColor = 0xDC2626;
        break;
        
      case 'ignore':
        message = '🛡️ SCAM AVOIDED!\n\n✅ You recognized the lottery scam:\n• No legitimate lottery asks for fees\n• You never participated in any lottery\n• Real prizes don\'t require payments\n\n💡 Delete and block such messages!';
        scoreChange = 30;
        this.correctDecisions++;
        bgColor = 0x059669;
        break;
        
      default:
        message = '⚠️ Stay alert for lottery scams!';
        scoreChange = 0;
        bgColor = 0x6B7280;
        break;
    }
    
    this.score += scoreChange;
    this.scoreText.setText(`Score: ${this.score}`);
    this.livesText.setText(`Lives: ${this.lives}`);
    
    this.showModernResultPopup(message, bgColor);
    
    this.time.delayedCall(3000, () => {
      this.endGame();
    });
  }
  
  clearCurrentUI() {
    this.currentUI.forEach(element => {
      if (element && element.destroy) {
        element.destroy();
      }
    });
    this.currentUI = [];
  }
  
  endGame() {
    this.gameEnded = true;
    this.timer.destroy();
    this.clearCurrentUI();
    
    const passed = this.correctDecisions >= 1 && this.lives > 0;
    const accuracy = this.totalDecisions > 0 ? ((this.correctDecisions / this.totalDecisions) * 100).toFixed(1) : 0;
    
    // Modern game over screen
    const endBg = this.add.graphics();
    endBg.fillGradientStyle(0x0F172A, 0x0F172A, 0x1E293B, 0x1E293B);
    endBg.fillRect(0, 0, 800, 600);
    
    this.add.text(400, 80, passed ? '🎉 Mission Complete!' : '😓 Training Failed', {
      fontSize: '28px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Stats card
    const statsCard = this.add.graphics();
    statsCard.fillStyle(0xFFFFFF);
    statsCard.fillRoundedRect(100, 120, 600, 120, 15);
    
    this.add.text(400, 150, '📊 Your Performance', {
      fontSize: '18px',
      fill: '#1F2937',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    this.add.text(200, 180, `Score: ${this.score}`, {
      fontSize: '16px',
      fill: '#059669',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    this.add.text(400, 180, `Accuracy: ${accuracy}%`, {
      fontSize: '16px',
      fill: '#2563EB',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    this.add.text(600, 180, `Scams Avoided: ${this.correctDecisions}`, {
      fontSize: '16px',
      fill: '#7C3AED',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Tips section
    const tipsCard = this.add.graphics();
    tipsCard.fillStyle(0x1E293B);
    tipsCard.fillRoundedRect(100, 260, 600, 180, 15);
    
    this.add.text(400, 290, '🎯 UPI Fraud Prevention Tips', {
      fontSize: '18px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    this.add.text(400, 340, '• Always verify unknown payment requests\n• Call the person directly before sending money\n• Never pay "processing fees" for prizes\n• Be suspicious of urgent payment demands\n• Real emergencies can wait for verification\n• Block and report suspicious numbers', {
      fontSize: '13px',
      fill: '#E2E8F0',
      align: 'left',
      lineSpacing: 6
    }).setOrigin(0.5);
    
    // Modern continue button
    const continueBtn = this.add.graphics();
    continueBtn.fillStyle(0x10B981);
    continueBtn.fillRoundedRect(300, 460, 200, 50, 25);
    continueBtn.setInteractive(new Phaser.Geom.Rectangle(300, 460, 200, 50), Phaser.Geom.Rectangle.Contains)
      .on('pointerover', () => {
        continueBtn.clear();
        continueBtn.fillStyle(0x059669);
        continueBtn.fillRoundedRect(300, 460, 200, 50, 25);
      })
      .on('pointerout', () => {
        continueBtn.clear();
        continueBtn.fillStyle(0x10B981);
        continueBtn.fillRoundedRect(300, 460, 200, 50, 25);
      })
      .on('pointerdown', () => {
        continueBtn.setAlpha(0.8);
        this.time.delayedCall(100, () => {
          if (this.onGameComplete) {
            this.onGameComplete({
              passed,
              score: Math.max(0, this.score),
              accuracy: parseFloat(accuracy),
              scamsAvoided: this.correctDecisions
            });
          }
        });
      });
    
    this.add.text(400, 485, 'Continue Adventure', {
      fontSize: '16px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
  }
}

export default UPIFraudDetectionGame;