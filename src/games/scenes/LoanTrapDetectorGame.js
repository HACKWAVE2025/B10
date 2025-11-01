// Loan Trap Detector Game for Island 4
import Phaser from 'phaser';

class LoanTrapDetectorGame extends Phaser.Scene {
  constructor() {
    super({ key: 'LoanTrapDetectorGame' });
    this.score = 0;
    this.lives = 3;
    this.timeLeft = 90;
    this.loanApplications = [];
    this.gameEnded = false;
    this.correctDecisions = 0;
    this.totalApplications = 0;
  }

  init(data) {
    this.onGameComplete = data.onGameComplete;
    this.dogName = data.dogName || 'Detective Dog';
  }

  preload() {
    // Create colored rectangles for game elements
    this.load.image('office-bg', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="600" fill="#F5F5DC"/>
        <rect x="0" y="500" width="800" height="100" fill="#8B4513"/>
        <rect x="100" y="100" width="600" height="300" fill="#FFFFFF" stroke="#000" stroke-width="2"/>
      </svg>
    `));

    // Detective dog with magnifying glass
    this.load.image('detective-dog', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="45" r="25" fill="#8B4513"/>
        <circle cx="32" cy="38" r="3" fill="#000"/>
        <circle cx="48" cy="38" r="3" fill="#000"/>
        <ellipse cx="40" cy="50" rx="4" ry="3" fill="#000"/>
        <ellipse cx="25" cy="32" rx="10" ry="18" fill="#8B4513"/>
        <ellipse cx="55" cy="32" rx="10" ry="18" fill="#8B4513"/>
        <circle cx="65" cy="25" r="15" fill="#FFD700" fill-opacity="0.3" stroke="#FFD700" stroke-width="3"/>
        <circle cx="65" cy="25" r="8" fill="none" stroke="#FFD700" stroke-width="2"/>
      </svg>
    `));

    // Loan application documents
    this.load.image('trap-loan', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="120" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#FF6B6B" stroke="#000" stroke-width="2"/>
        <text x="60" y="25" text-anchor="middle" fill="white" font-size="12" font-weight="bold">LOAN</text>
        <text x="60" y="40" text-anchor="middle" fill="white" font-size="10">999% APR</text>
        <text x="60" y="55" text-anchor="middle" fill="white" font-size="8">No Credit Check!</text>
        <text x="60" y="70" text-anchor="middle" fill="white" font-size="8">⚠️ TRAP</text>
      </svg>
    `));

    this.load.image('safe-loan', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="120" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="80" fill="#4ECDC4" stroke="#000" stroke-width="2"/>
        <text x="60" y="25" text-anchor="middle" fill="white" font-size="12" font-weight="bold">LOAN</text>
        <text x="60" y="40" text-anchor="middle" fill="white" font-size="10">5.5% APR</text>
        <text x="60" y="55" text-anchor="middle" fill="white" font-size="8">Bank Verified</text>
        <text x="60" y="70" text-anchor="middle" fill="white" font-size="8">✅ SAFE</text>
      </svg>
    `));

    // Accept/Reject zones
    this.load.image('accept-zone', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="150" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="100" fill="#4CAF50" rx="10"/>
        <text x="75" y="35" text-anchor="middle" fill="white" font-size="16" font-weight="bold">APPROVE</text>
        <text x="75" y="55" text-anchor="middle" fill="white" font-size="14">✅</text>
        <text x="75" y="75" text-anchor="middle" fill="white" font-size="12">Safe Loans</text>
      </svg>
    `));

    this.load.image('reject-zone', 'data:image/svg+xml;base64,' + btoa(`
      <svg width="150" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="150" height="100" fill="#F44336" rx="10"/>
        <text x="75" y="35" text-anchor="middle" fill="white" font-size="16" font-weight="bold">REJECT</text>
        <text x="75" y="55" text-anchor="middle" fill="white" font-size="14">❌</text>
        <text x="75" y="75" text-anchor="middle" fill="white" font-size="12">Trap Loans</text>
      </svg>
    `));
  }

  create() {
    // Background
    this.add.image(400, 300, 'office-bg');

    // UI Elements
    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
      fontSize: '20px',
      fill: '#000000',
      backgroundColor: '#ffffff',
      padding: { x: 10, y: 5 }
    });

    this.livesText = this.add.text(16, 60, `Lives: ${this.lives}`, {
      fontSize: '20px',
      fill: '#000000',
      backgroundColor: '#ffffff',
      padding: { x: 10, y: 5 }
    });

    this.timeText = this.add.text(16, 104, `Time: ${this.timeLeft}`, {
      fontSize: '20px',
      fill: '#000000',
      backgroundColor: '#ffffff',
      padding: { x: 10, y: 5 }
    });

    // Title
    this.add.text(400, 30, `${this.dogName}'s Loan Trap Detector`, {
      fontSize: '24px',
      fill: '#000000',
      backgroundColor: '#ffffff',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);

    this.add.text(400, 70, 'Drag loan applications to APPROVE (safe) or REJECT (trap) zones!', {
      fontSize: '16px',
      fill: '#000000',
      backgroundColor: '#ffffff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    // Detective dog
    this.dog = this.add.image(400, 150, 'detective-dog');

    // Drop zones
    this.acceptZone = this.add.image(150, 450, 'accept-zone').setInteractive();
    this.rejectZone = this.add.image(650, 450, 'reject-zone').setInteractive();

    // Drop zone areas for collision detection
    this.acceptArea = new Phaser.Geom.Rectangle(75, 400, 150, 100);
    this.rejectArea = new Phaser.Geom.Rectangle(575, 400, 150, 100);

    // Enable drag and drop
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragend', (pointer, gameObject) => {
      this.handleLoanDrop(gameObject);
    });

    // Spawn loan applications
    this.loanSpawnTimer = this.time.addEvent({
      delay: 3000,
      callback: this.spawnLoanApplication,
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

    // Spawn initial loan
    this.spawnLoanApplication();
  }

  spawnLoanApplication() {
    if (this.gameEnded) return;

    const isTrap = Math.random() < 0.7; // 70% chance of trap loan
    const x = Phaser.Math.Between(300, 500);
    const y = 250;

    const loan = this.add.image(x, y, isTrap ? 'trap-loan' : 'safe-loan');
    loan.isTrap = isTrap;
    loan.setScale(0);
    loan.setInteractive();
    this.input.setDraggable(loan);

    // Store loan details for educational popup
    loan.details = this.getLoanDetails(isTrap);

    // Animate appearance
    this.tweens.add({
      targets: loan,
      scaleX: 1,
      scaleY: 1,
      duration: 500,
      ease: 'Back.easeOut'
    });

    this.loanApplications.push(loan);
    this.totalApplications++;

    // Auto-remove if not processed in time
    this.time.delayedCall(10000, () => {
      if (loan && loan.active) {
        this.removeLoanApplication(loan);
        this.lives--;
        this.livesText.setText(`Lives: ${this.lives}`);
        this.showFeedback(loan.x, loan.y, 'Time Up!', '#ff0000');
        if (this.lives <= 0) {
          this.endGame(false);
        }
      }
    });
  }

  getLoanDetails(isTrap) {
    if (isTrap) {
      const trapTypes = [
        { apr: '999%', warning: 'Extremely high interest rate!', type: 'Payday Loan Trap' },
        { apr: '89%', warning: 'No credit verification - suspicious!', type: 'No-Check Loan' },
        { apr: '156%', warning: 'Hidden fees and charges!', type: 'Fee-Heavy Loan' },
        { apr: '200%', warning: 'Predatory lending practices!', type: 'Predatory Loan' }
      ];
      return trapTypes[Math.floor(Math.random() * trapTypes.length)];
    } else {
      const safeTypes = [
        { apr: '4.5%', warning: 'Reasonable rate from bank', type: 'Personal Loan' },
        { apr: '6.2%', warning: 'Credit union verified', type: 'Credit Union Loan' },
        { apr: '8.1%', warning: 'Government backed', type: 'Government Loan' },
        { apr: '5.8%', warning: 'Established lender', type: 'Bank Loan' }
      ];
      return safeTypes[Math.floor(Math.random() * safeTypes.length)];
    }
  }

  handleLoanDrop(loan) {
    const loanBounds = loan.getBounds();
    const acceptOverlap = Phaser.Geom.Rectangle.Overlaps(this.acceptArea, loanBounds);
    const rejectOverlap = Phaser.Geom.Rectangle.Overlaps(this.rejectArea, loanBounds);

    if (acceptOverlap || rejectOverlap) {
      const correctDecision = (acceptOverlap && !loan.isTrap) || (rejectOverlap && loan.isTrap);
      
      if (correctDecision) {
        this.score += 15;
        this.correctDecisions++;
        const message = acceptOverlap ? 'Correct Approval!' : 'Trap Detected!';
        this.showLoanDetails(loan, message, '#00ff00');
      } else {
        this.score -= 10;
        this.lives--;
        const message = acceptOverlap ? 'Approved a Trap!' : 'Rejected Safe Loan!';
        this.showLoanDetails(loan, message, '#ff0000');
        
        if (this.lives <= 0) {
          this.endGame(false);
          return;
        }
      }

      this.scoreText.setText(`Score: ${this.score}`);
      this.livesText.setText(`Lives: ${this.lives}`);
      this.removeLoanApplication(loan);
    } else {
      // Return to original position if not dropped in a zone
      this.tweens.add({
        targets: loan,
        x: 400,
        y: 250,
        duration: 300,
        ease: 'Back.easeOut'
      });
    }
  }

  showLoanDetails(loan, message, color) {
    const details = loan.details;
    const x = loan.x;
    const y = loan.y - 50;

    const feedback = this.add.text(x, y, `${message}\n${details.type}\nAPR: ${details.apr}\n${details.warning}`, {
      fontSize: '14px',
      fill: color,
      backgroundColor: '#ffffff',
      padding: { x: 8, y: 5 },
      align: 'center'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: feedback,
      y: y - 80,
      alpha: 0,
      duration: 2500,
      onComplete: () => feedback.destroy()
    });
  }

  showFeedback(x, y, text, color) {
    const feedback = this.add.text(x, y, text, {
      fontSize: '18px',
      fill: color,
      backgroundColor: '#ffffff',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5);

    this.tweens.add({
      targets: feedback,
      y: y - 60,
      alpha: 0,
      duration: 2000,
      onComplete: () => feedback.destroy()
    });
  }

  removeLoanApplication(loan) {
    const index = this.loanApplications.indexOf(loan);
    if (index > -1) {
      this.loanApplications.splice(index, 1);
    }
    
    this.tweens.add({
      targets: loan,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        if (loan && loan.destroy) {
          loan.destroy();
        }
      }
    });
  }

  updateTimer() {
    this.timeLeft--;
    this.timeText.setText(`Time: ${this.timeLeft}`);
    
    if (this.timeLeft <= 0) {
      this.endGame(this.score > 60);
    }
  }

  endGame(passed) {
    if (this.gameEnded) return;
    this.gameEnded = true;

    // Stop timers
    if (this.loanSpawnTimer) this.loanSpawnTimer.remove();
    if (this.gameTimer) this.gameTimer.remove();

    // Clear all loans
    this.loanApplications.forEach(loan => {
      if (loan && loan.destroy) loan.destroy();
    });

    const accuracy = this.totalApplications > 0 ? (this.correctDecisions / this.totalApplications * 100).toFixed(1) : 0;

    // Show results
    const resultText = passed ? 'Loan Detective Expert!' : 'Keep Learning About Loans!';
    const resultColor = passed ? '#00ff00' : '#ff0000';

    this.add.rectangle(400, 300, 700, 450, 0x000000, 0.9);
    
    this.add.text(400, 180, resultText, {
      fontSize: '28px',
      fill: resultColor,
      backgroundColor: '#ffffff',
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5);

    this.add.text(400, 230, `Final Score: ${this.score}`, {
      fontSize: '22px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 270, `Accuracy: ${accuracy}%`, {
      fontSize: '20px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 310, `Correct Decisions: ${this.correctDecisions}/${this.totalApplications}`, {
      fontSize: '18px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 350, 'Remember: Always check APR, lender reputation,\nand watch for predatory lending tactics!', {
      fontSize: '16px',
      fill: '#ffff00',
      align: 'center'
    }).setOrigin(0.5);

    // Continue button
    this.add.rectangle(400, 420, 200, 50, 0x4CAF50)
      .setInteractive()
      .on('pointerdown', () => {
        if (this.onGameComplete) {
          this.onGameComplete({
            passed,
            score: Math.max(0, this.score),
            accuracy: parseFloat(accuracy),
            correctDecisions: this.correctDecisions
          });
        }
      });

    this.add.text(400, 420, 'Continue', {
      fontSize: '20px',
      fill: '#ffffff'
    }).setOrigin(0.5);
  }
}

export default LoanTrapDetectorGame;