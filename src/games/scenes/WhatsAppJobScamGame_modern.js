// Modern WhatsApp Job Scam Detection Game with Real WhatsApp Styling
import Phaser from 'phaser';

class WhatsAppJobScamGame extends Phaser.Scene {
  constructor() {
    super({ key: 'WhatsAppJobScamGame' });
    this.score = 0;
    this.lives = 3;
    this.currentScenario = 1;
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
    // Modern WhatsApp-style interface with proper dimensions
    const gameWidth = 800;
    const gameHeight = 600;
    
    // WhatsApp green background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x075E54, 0x075E54, 0x128C7E, 0x128C7E);
    bg.fillRect(0, 0, gameWidth, gameHeight);
    
    // Phone frame with modern styling
    const phoneFrame = this.add.graphics();
    phoneFrame.fillStyle(0x000000);
    phoneFrame.fillRoundedRect(50, 20, 700, 560, 30);
    phoneFrame.fillStyle(0xFFFFFF);
    phoneFrame.fillRoundedRect(60, 30, 680, 540, 25);
    
    // WhatsApp header with authentic styling
    const header = this.add.graphics();
    header.fillStyle(0x075E54);
    header.fillRect(60, 30, 680, 80);
    
    // Header elements
    this.add.circle(110, 70, 25, 0xE5E5E5); // Profile picture
    this.add.text(120, 70, '👤', { fontSize: '30px' }).setOrigin(0.5);
    
    this.add.text(150, 55, 'TechCorp HR', {
      fontSize: '18px',
      fill: '#ffffff',
      fontWeight: 'bold'
    });
    
    this.add.text(150, 75, 'online', {
      fontSize: '12px',
      fill: '#B3B3B3'
    });
    
    // WhatsApp icons in header
    this.add.text(650, 70, '📞', { fontSize: '20px' }).setOrigin(0.5);
    this.add.text(690, 70, '📹', { fontSize: '20px' }).setOrigin(0.5);
    this.add.text(730, 70, '⋮', { fontSize: '20px', fill: '#ffffff' }).setOrigin(0.5);
    
    // Chat area background
    const chatBg = this.add.graphics();
    chatBg.fillStyle(0xE5DDD5);
    chatBg.fillRect(60, 110, 680, 350);
    
    // Add WhatsApp wallpaper pattern
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 10; j++) {
        this.add.text(80 + i * 45, 120 + j * 35, '•', {
          fontSize: '8px',
          fill: '#D1C4B8',
          alpha: 0.3
        });
      }
    }
    
    // Score and lives with modern styling
    const scorePanel = this.add.graphics();
    scorePanel.fillStyle(0x25D366);
    scorePanel.fillRoundedRect(70, 470, 150, 40, 10);
    
    this.scoreText = this.add.text(145, 490, `Score: ${this.score}`, {
      fontSize: '14px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    const livesPanel = this.add.graphics();
    livesPanel.fillStyle(0xFF3333);
    livesPanel.fillRoundedRect(230, 470, 120, 40, 10);
    
    this.livesText = this.add.text(290, 490, `Lives: ${this.lives}`, {
      fontSize: '14px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Start the first scenario
    this.showScenario1();
  }
  
  showScenario1() {
    this.clearCurrentUI();
    
    // Scenario 1: Fake job offer with urgency
    this.createIncomingMessage(
      "🎉 Hello! Congratulations!\nYou've been selected for a Work from Home\njob at TechCorp! Salary: ₹45,000/month",
      120, true
    );
    
    this.time.delayedCall(2000, () => {
      this.createIncomingMessage(
        "⚡ LIMITED TIME OFFER - Reply within 10 min!",
        180, false, 0xFF6B6B
      );
      
      this.time.delayedCall(1500, () => {
        this.createOutgoingMessage(
          "This sounds great! What do I need to do?",
          240
        );
        
        this.time.delayedCall(2000, () => {
          this.createIncomingMessage(
            "To confirm your position, we need a small\nregistration fee of ₹2,500 for laptop setup\n\n💳 Pay via UPI: techcorp.hr@paytm",
            300, true
          );
          
          this.time.delayedCall(1000, () => {
            this.showDecisionButtons();
          });
        });
      });
    });
  }
  
  createIncomingMessage(text, y, isLong = false, bgColor = 0xFFFFFF) {
    const bubbleWidth = isLong ? 320 : 280;
    const bubbleHeight = isLong ? 80 : 50;
    
    // Message bubble with proper WhatsApp styling
    const bubble = this.add.graphics();
    bubble.fillStyle(bgColor);
    bubble.fillRoundedRect(80, y, bubbleWidth, bubbleHeight, 15);
    
    // Message tail (WhatsApp style)
    bubble.fillTriangle(
      80, y + bubbleHeight - 10,
      80, y + bubbleHeight,
      70, y + bubbleHeight - 5
    );
    
    // Message text with proper wrapping
    const messageText = this.add.text(90, y + (bubbleHeight / 2), text, {
      fontSize: '12px',
      fill: '#000000',
      fontFamily: 'Arial',
      wordWrap: { width: bubbleWidth - 20 },
      align: 'left'
    }).setOrigin(0, 0.5);
    
    // Timestamp
    this.add.text(80 + bubbleWidth - 10, y + bubbleHeight - 5, '12:30', {
      fontSize: '9px',
      fill: '#999999'
    }).setOrigin(1, 1);
    
    this.currentUI.push(bubble, messageText);
  }
  
  createOutgoingMessage(text, y) {
    const bubbleWidth = 280;
    const bubbleHeight = 40;
    
    // Outgoing message bubble (green)
    const bubble = this.add.graphics();
    bubble.fillStyle(0xDCF8C6);
    bubble.fillRoundedRect(460, y, bubbleWidth, bubbleHeight, 15);
    
    // Message tail (right side)
    bubble.fillTriangle(
      740, y + bubbleHeight - 10,
      740, y + bubbleHeight,
      750, y + bubbleHeight - 5
    );
    
    // Message text
    const messageText = this.add.text(470, y + (bubbleHeight / 2), text, {
      fontSize: '12px',
      fill: '#000000',
      fontFamily: 'Arial',
      wordWrap: { width: bubbleWidth - 20 },
      align: 'left'
    }).setOrigin(0, 0.5);
    
    // Timestamp and read receipt
    this.add.text(730, y + bubbleHeight - 5, '12:31 ✓✓', {
      fontSize: '9px',
      fill: '#4FC3F7'
    }).setOrigin(1, 1);
    
    this.currentUI.push(bubble, messageText);
  }
  
  showDecisionButtons() {
    // Warning message
    this.add.text(400, 390, '⚠️ What should you do? Choose wisely!', {
      fontSize: '16px',
      fill: '#FF6B6B',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    // Modern button styling
    const buttonStyle = {
      fontSize: '12px',
      fill: '#ffffff',
      fontWeight: 'bold'
    };
    
    // Top row buttons
    const payBtn = this.add.graphics();
    payBtn.fillStyle(0xFF4444);
    payBtn.fillRoundedRect(100, 420, 140, 45, 10);
    payBtn.setInteractive(new Phaser.Geom.Rectangle(100, 420, 140, 45), Phaser.Geom.Rectangle.Contains)
      .on('pointerover', () => payBtn.setAlpha(0.8))
      .on('pointerout', () => payBtn.setAlpha(1))
      .on('pointerdown', () => this.handleDecision('pay'));
    
    this.add.text(170, 442, '💳 PAY NOW', buttonStyle).setOrigin(0.5);
    
    const verifyBtn = this.add.graphics();
    verifyBtn.fillStyle(0x2196F3);
    verifyBtn.fillRoundedRect(260, 420, 140, 45, 10);
    verifyBtn.setInteractive(new Phaser.Geom.Rectangle(260, 420, 140, 45), Phaser.Geom.Rectangle.Contains)
      .on('pointerover', () => verifyBtn.setAlpha(0.8))
      .on('pointerout', () => verifyBtn.setAlpha(1))
      .on('pointerdown', () => this.handleDecision('verify'));
    
    this.add.text(330, 442, '🔍 VERIFY FIRST', buttonStyle).setOrigin(0.5);
    
    // Bottom row buttons
    const askBtn = this.add.graphics();
    askBtn.fillStyle(0x4CAF50);
    askBtn.fillRoundedRect(420, 420, 140, 45, 10);
    askBtn.setInteractive(new Phaser.Geom.Rectangle(420, 420, 140, 45), Phaser.Geom.Rectangle.Contains)
      .on('pointerover', () => askBtn.setAlpha(0.8))
      .on('pointerout', () => askBtn.setAlpha(1))
      .on('pointerdown', () => this.handleDecision('ask'));
    
    this.add.text(490, 442, '❓ ASK QUESTIONS', buttonStyle).setOrigin(0.5);
    
    const blockBtn = this.add.graphics();
    blockBtn.fillStyle(0x795548);
    blockBtn.fillRoundedRect(580, 420, 140, 45, 10);
    blockBtn.setInteractive(new Phaser.Geom.Rectangle(580, 420, 140, 45), Phaser.Geom.Rectangle.Contains)
      .on('pointerover', () => blockBtn.setAlpha(0.8))
      .on('pointerout', () => blockBtn.setAlpha(1))
      .on('pointerdown', () => this.handleDecision('block'));
    
    this.add.text(650, 442, '🚫 BLOCK & REPORT', buttonStyle).setOrigin(0.5);
    
    this.currentUI.push(payBtn, verifyBtn, askBtn, blockBtn);
  }
  
  handleDecision(decision) {
    this.clearCurrentUI();
    this.totalDecisions++;
    
    let scoreChange = 0;
    let message = '';
    
    switch (decision) {
      case 'pay':
        message = '⚠️ JOB SCAM ALERT!\n\nYou just lost ₹2,500!\n\nLegitimate companies NEVER ask for\nupfront payment for job offers!\n\nRed flags you missed:\n• Unsolicited job offer\n• Upfront payment demanded\n• Urgency tactics ("limited time")\n• No proper company verification';
        scoreChange = -30;
        this.lives -= 2;
        break;
        
      case 'verify':
      case 'ask':
      case 'block':
        message = '✅ SMART DECISION!\n\nYou spotted the job scam!\n\nReal companies never ask for upfront\npayments for legitimate job offers.\n\nAlways verify company details and\nbe suspicious of "too good to be true" offers!';
        scoreChange = 30;
        this.correctDecisions++;
        break;
        
      default:
        message = 'Stay alert for job scam red flags!';
        scoreChange = 0;
        break;
    }
    
    this.score += scoreChange;
    this.scoreText.setText(`Score: ${this.score}`);
    this.livesText.setText(`Lives: ${this.lives}`);
    
    // Show modern result popup
    this.showModernPopup(message, decision === 'pay' ? 0xFF4444 : 0x4CAF50);
    
    this.time.delayedCall(4000, () => {
      if (this.currentScenario < 2) {
        this.currentScenario++;
        this.showScenario2();
      } else {
        this.endGame();
      }
    });
  }
  
  showModernPopup(message, bgColor) {
    // Modern popup with blur effect
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, 800, 600);
    
    const popup = this.add.graphics();
    popup.fillStyle(0xFFFFFF);
    popup.fillRoundedRect(150, 150, 500, 300, 20);
    
    // Colored border
    popup.lineStyle(4, bgColor);
    popup.strokeRoundedRect(150, 150, 500, 300, 20);
    
    const popupText = this.add.text(400, 300, message, {
      fontSize: '14px',
      fill: '#333333',
      fontFamily: 'Arial',
      align: 'center',
      wordWrap: { width: 450 }
    }).setOrigin(0.5);
    
    this.currentUI.push(overlay, popup, popupText);
  }
  
  showScenario2() {
    this.clearCurrentUI();
    
    // Different job scam scenario
    this.createIncomingMessage(
      "Hi! I'm from Amazon HR. We have a\ndata entry job for you. ₹35,000/month!",
      120, true
    );
    
    this.time.delayedCall(2000, () => {
      this.createIncomingMessage(
        "Just pay ₹1,500 for training materials first!",
        200
      );
      
      this.time.delayedCall(1500, () => {
        this.createOutgoingMessage(
          "Why do I need to pay for training?",
          260
        );
        
        this.time.delayedCall(2000, () => {
          this.createIncomingMessage(
            "It's company policy. Pay now or lose this opportunity!",
            320
          );
          
          this.time.delayedCall(1000, () => {
            this.showDecisionButtons();
          });
        });
      });
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
    this.clearCurrentUI();
    this.gameEnded = true;
    
    const passed = this.correctDecisions >= 1 && this.lives > 0;
    const accuracy = ((this.correctDecisions / this.totalDecisions) * 100).toFixed(1);
    
    // Modern game over screen
    const endBg = this.add.graphics();
    endBg.fillGradientStyle(0x1976D2, 0x1976D2, 0x0D47A1, 0x0D47A1);
    endBg.fillRect(0, 0, 800, 600);
    
    this.add.text(400, 100, passed ? '🎉 Well Done!' : '😔 Game Over', {
      fontSize: '32px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    this.add.text(400, 150, `Score: ${this.score} | Accuracy: ${accuracy}%`, {
      fontSize: '18px',
      fill: '#ffffff'
    }).setOrigin(0.5);
    
    // Educational tips with modern styling
    const tipsBox = this.add.graphics();
    tipsBox.fillStyle(0xFFFFFF, 0.95);
    tipsBox.fillRoundedRect(50, 200, 700, 280, 15);
    
    this.add.text(400, 220, '🎓 Key Job Scam Red Flags:', {
      fontSize: '20px',
      fill: '#1976D2',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    
    this.add.text(400, 280, '• Upfront payment demands for jobs\n• Unsolicited "congratulations" messages\n• Urgency tactics ("limited time offer")\n• Too-good-to-be-true salary offers\n• Poor grammar and unprofessional communication\n• No official company email or verification\n• Asking for personal bank details upfront', {
      fontSize: '14px',
      fill: '#333333',
      align: 'left',
      lineSpacing: 8
    }).setOrigin(0.5);
    
    // Modern continue button
    const continueBtn = this.add.graphics();
    continueBtn.fillStyle(0x4CAF50);
    continueBtn.fillRoundedRect(300, 500, 200, 50, 25);
    continueBtn.setInteractive(new Phaser.Geom.Rectangle(300, 500, 200, 50), Phaser.Geom.Rectangle.Contains)
      .on('pointerover', () => {
        continueBtn.clear();
        continueBtn.fillStyle(0x45A049);
        continueBtn.fillRoundedRect(300, 500, 200, 50, 25);
      })
      .on('pointerout', () => {
        continueBtn.clear();
        continueBtn.fillStyle(0x4CAF50);
        continueBtn.fillRoundedRect(300, 500, 200, 50, 25);
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
    
    this.add.text(400, 525, 'Continue', {
      fontSize: '18px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
  }
}

export default WhatsAppJobScamGame;