// Realistic UPI Fraud Detection Game for Island 1
import Phaser from 'phaser';

class UPIFraudDetectionGame extends Phaser.Scene {
  constructor() {
    super({ key: 'UPIFraudDetectionGame' });
    this.score = 0;
    this.lives = 3;
    this.currentScenario = 0;
    this.gameEnded = false;
    this.correctDecisions = 0;
    this.totalScenarios = 0;
    this.timeLeft = 15; // Short time to create urgency
  }

  init(data) {
    this.onGameComplete = data.onGameComplete;
    this.dogName = data.dogName || 'Detective Dog';
  }

  preload() {
    // Create simple graphics instead of complex SVGs to avoid encoding issues
    
    // Simple phone background
    this.add.graphics()
      .fillStyle(0x000000)
      .fillRoundedRect(0, 0, 400, 600, 25)
      .fillStyle(0xFFFFFF)
      .fillRoundedRect(10, 10, 380, 580, 15)
      .generateTexture('phone-bg', 400, 600);

    // UPI header
    this.add.graphics()
      .fillStyle(0x6B46C1)
      .fillRect(0, 0, 360, 80)
      .generateTexture('upi-header', 360, 80);

    // Request card
    this.add.graphics()
      .fillStyle(0xFEF3C7)
      .lineStyle(2, 0xF59E0B)
      .fillRoundedRect(0, 0, 320, 200, 10)
      .strokeRoundedRect(0, 0, 320, 200, 10)
      .generateTexture('request-card', 320, 200);

    // Simple colored buttons
    this.add.graphics()
      .fillStyle(0xDC2626)
      .fillRoundedRect(0, 0, 280, 50, 25)
      .generateTexture('pay-button', 280, 50);

    this.add.graphics()
      .fillStyle(0x059669)
      .fillRoundedRect(0, 0, 280, 50, 25)
      .generateTexture('verify-button', 280, 50);

    this.add.graphics()
      .fillStyle(0x2563EB)
      .fillRoundedRect(0, 0, 280, 50, 25)
      .generateTexture('call-button', 280, 50);

    // Warning popup
    this.add.graphics()
      .fillStyle(0xFEE2E2)
      .lineStyle(3, 0xDC2626)
      .fillRoundedRect(0, 0, 350, 200, 10)
      .strokeRoundedRect(0, 0, 350, 200, 10)
      .generateTexture('scam-warning', 350, 200);

    // Success popup
    this.add.graphics()
      .fillStyle(0xECFDF5)
      .lineStyle(3, 0x059669)
      .fillRoundedRect(0, 0, 350, 200, 10)
      .strokeRoundedRect(0, 0, 350, 200, 10)
      .generateTexture('success-popup', 350, 200);
  }

  create() {
    // Phone mockup background
    this.add.image(400, 300, 'phone-bg');
    
    // UPI app header
    this.add.image(400, 120, 'upi-header');
    this.add.text(400, 105, '💳 UPI Pay', {
      fontSize: '18px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    this.add.text(400, 130, 'Secure Payment Gateway', {
      fontSize: '12px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Game UI
    this.scoreText = this.add.text(50, 50, `Score: ${this.score}`, {
      fontSize: '18px',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });

    this.livesText = this.add.text(50, 80, `Lives: ${this.lives}`, {
      fontSize: '18px',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    });

    this.timerText = this.add.text(400, 50, `⏰ ${this.timeLeft}s`, {
      fontSize: '20px',
      fill: '#ffffff',
      backgroundColor: '#DC2626',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);

    // Title
    this.add.text(400, 20, `${this.dogName}'s UPI Fraud Detection`, {
      fontSize: '20px',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    // Start first scenario
    this.startScenario();
  }

  startScenario() {
    this.timeLeft = 15; // Reset timer for urgency
    this.totalScenarios++;
    
    // Clear any existing elements
    if (this.currentUI) {
      this.currentUI.forEach(element => {
        if (element && element.destroy) element.destroy();
      });
    }
    this.currentUI = [];

    // Show UPI payment request card
    const requestCard = this.add.image(400, 250, 'request-card');
    this.currentUI.push(requestCard);

    // Add text over the request card
    const paymentTitle = this.add.text(400, 190, '💸 Payment Request', {
      fontSize: '16px',
      fill: '#92400E',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const fromText = this.add.text(400, 220, 'From: Rahul Sharma', {
      fontSize: '14px',
      fill: '#000000'
    }).setOrigin(0.5);

    const phoneText = this.add.text(400, 240, '+91 98765-43210', {
      fontSize: '12px',
      fill: '#000000'
    }).setOrigin(0.5);

    const amountText = this.add.text(400, 270, '₹999', {
      fontSize: '20px',
      fill: '#DC2626',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const urgentText = this.add.text(400, 295, 'Emergency - Need urgently!', {
      fontSize: '11px',
      fill: '#000000'
    }).setOrigin(0.5);

    const pleaseText = this.add.text(400, 315, 'Please send immediately 🙏', {
      fontSize: '11px',
      fill: '#000000'
    }).setOrigin(0.5);

    this.currentUI.push(paymentTitle, fromText, phoneText, amountText, urgentText, pleaseText);

    // Create decision buttons
    const payButton = this.add.image(400, 370, 'pay-button')
      .setInteractive()
      .on('pointerdown', () => this.handleDecision('pay'));

    const payButtonText = this.add.text(400, 370, '💳 PAY NOW ₹999', {
      fontSize: '16px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const verifyButton = this.add.image(400, 430, 'verify-button')
      .setInteractive()
      .on('pointerdown', () => this.handleDecision('verify'));

    const verifyButtonText = this.add.text(400, 430, '📞 VERIFY CONTACT', {
      fontSize: '16px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const callButton = this.add.image(400, 490, 'call-button')
      .setInteractive()
      .on('pointerdown', () => this.handleDecision('call'));

    const callButtonText = this.add.text(400, 490, '📱 CALL TO CONFIRM', {
      fontSize: '16px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    this.currentUI.push(payButton, payButtonText, verifyButton, verifyButtonText, callButton, callButtonText);

    // Add urgency text
    const urgencyText = this.add.text(400, 330, '⚡ URGENT REQUEST ⚡', {
      fontSize: '16px',
      fill: '#DC2626',
      fontWeight: 'bold'
    }).setOrigin(0.5);
    this.currentUI.push(urgencyText);

    // Start countdown timer
    this.startTimer();
  }

  startTimer() {
    if (this.countdownTimer) this.countdownTimer.remove();
    
    this.countdownTimer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.timeLeft--;
        this.timerText.setText(`⏰ ${this.timeLeft}s`);
        
        // Change color as time runs out
        if (this.timeLeft <= 5) {
          this.timerText.setBackgroundColor('#DC2626');
        } else if (this.timeLeft <= 10) {
          this.timerText.setBackgroundColor('#F59E0B');
        }
        
        if (this.timeLeft <= 0) {
          this.handleDecision('timeout');
        }
      },
      callbackScope: this,
      loop: true
    });
  }

  handleDecision(decision) {
    if (this.countdownTimer) this.countdownTimer.remove();
    
    // Clear current UI
    this.currentUI.forEach(element => {
      if (element && element.destroy) element.destroy();
    });
    this.currentUI = [];

    let popupImage = '';
    let message = '';
    let scoreChange = 0;

    switch (decision) {
      case 'pay':
        // Show scam warning - they fell for it!
        popupImage = 'scam-warning';
        message = 'You sent money to a scammer! Always verify identity first.';
        scoreChange = -20;
        this.lives--;
        break;
        
      case 'verify':
      case 'call':
        // Correct decision!
        popupImage = 'success-popup';
        message = 'Smart move! You avoided sending money to an unknown number.';
        scoreChange = 25;
        this.correctDecisions++;
        break;
        
      case 'timeout':
        // Time ran out - explain the urgency tactic
        popupImage = 'scam-warning';
        message = 'Time pressure is a common scam tactic! Always take time to verify.';
        scoreChange = -10;
        this.lives--;
        break;
        
      default:
        // Fallback case
        popupImage = 'scam-warning';
        message = 'Something went wrong. Always be cautious with payments.';
        scoreChange = 0;
        break;
    }

    this.score += scoreChange;
    this.scoreText.setText(`Score: ${this.score}`);
    this.livesText.setText(`Lives: ${this.lives}`);

    // Show result popup
    const popup = this.add.image(400, 350, popupImage);
    this.currentUI.push(popup);

    // Add popup text based on result
    let popupTitle = '';
    let popupContent = '';
    let titleColor = '#000000';

    if (decision === 'pay') {
      popupTitle = '⚠️ SCAM DETECTED!';
      popupContent = 'Transaction Failed\nThis number is not in your contacts!\nAlways verify before sending money\nto unknown numbers or urgent requests';
      titleColor = '#DC2626';
    } else if (decision === 'verify' || decision === 'call') {
      popupTitle = '✅ GOOD DECISION!';
      popupContent = 'You avoided a potential scam!\nAlways verify the identity before\nsending money to urgent requests\n🛡️ Your money is safe!';
      titleColor = '#059669';
    } else if (decision === 'timeout') {
      popupTitle = '⚠️ TIME UP!';
      popupContent = 'Time pressure is a scam tactic!\nAlways take time to verify\nbefore making payments';
      titleColor = '#DC2626';
    }

    const popupTitleText = this.add.text(400, 310, popupTitle, {
      fontSize: '18px',
      fill: titleColor,
      fontWeight: 'bold'
    }).setOrigin(0.5);

    const popupContentText = this.add.text(400, 370, popupContent, {
      fontSize: '12px',
      fill: '#000000',
      align: 'center'
    }).setOrigin(0.5);

    const understandButton = this.add.rectangle(400, 420, 120, 35, titleColor === '#DC2626' ? 0xDC2626 : 0x059669)
      .setInteractive()
      .on('pointerdown', () => {
        // Auto continue after clicking understand
      });

    const understandText = this.add.text(400, 420, 'UNDERSTOOD', {
      fontSize: '12px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.currentUI.push(popupTitleText, popupContentText, understandButton, understandText);

    // Show educational message
    const eduText = this.add.text(400, 520, message, {
      fontSize: '14px',
      fill: '#000000',
      backgroundColor: '#ffffff',
      padding: { x: 15, y: 10 },
      align: 'center',
      wordWrap: { width: 350 }
    }).setOrigin(0.5);
    this.currentUI.push(eduText);

    // Continue or end game
    this.time.delayedCall(3000, () => {
      if (this.lives <= 0) {
        this.endGame(false);
      } else if (this.totalScenarios >= 3) {
        this.endGame(this.score > 40);
      } else {
        this.startScenario();
      }
    });
  }

  endGame(passed) {
    if (this.gameEnded) return;
    this.gameEnded = true;

    // Stop timer
    if (this.countdownTimer) this.countdownTimer.remove();

    // Clear UI
    this.currentUI.forEach(element => {
      if (element && element.destroy) element.destroy();
    });

    const accuracy = this.totalScenarios > 0 ? (this.correctDecisions / this.totalScenarios * 100).toFixed(1) : 0;

    // Show final results
    this.add.rectangle(400, 300, 700, 500, 0x000000, 0.9);
    
    const resultText = passed ? 'UPI Fraud Expert!' : 'Keep Learning UPI Safety!';
    const resultColor = passed ? '#00ff00' : '#ff0000';

    this.add.text(400, 150, resultText, {
      fontSize: '28px',
      fill: resultColor,
      fontWeight: 'bold'
    }).setOrigin(0.5);

    this.add.text(400, 200, `Final Score: ${this.score}`, {
      fontSize: '22px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 240, `Accuracy: ${accuracy}%`, {
      fontSize: '20px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 280, `Scams Avoided: ${this.correctDecisions}/${this.totalScenarios}`, {
      fontSize: '18px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Educational tips
    this.add.text(400, 330, 'UPI Safety Tips:', {
      fontSize: '18px',
      fill: '#ffff00',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    this.add.text(400, 370, '• Always verify contact identity before sending money\n• Be suspicious of urgent payment requests\n• Check if number is in your contacts\n• Call to confirm before large payments\n• Never share UPI PIN or OTP with anyone', {
      fontSize: '14px',
      fill: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    // Continue button with better functionality
    const continueBtn = this.add.rectangle(400, 470, 200, 50, 0x4CAF50)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => continueBtn.setScale(1.05))
      .on('pointerout', () => continueBtn.setScale(1))
      .on('pointerdown', () => {
        // Add visual feedback by changing fill color
        continueBtn.setFillStyle(0x45A049);
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

    this.add.text(400, 470, 'Continue', {
      fontSize: '20px',
      fill: '#ffffff',
      fontWeight: 'bold'
    }).setOrigin(0.5);
  }
}

export default UPIFraudDetectionGame;