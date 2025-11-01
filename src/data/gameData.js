export const gameScenarios = [
  // Island 1: Basic Awareness (Levels 1-2)
  {
    id: 1,
    island: 1,
    level: 1,
    title: "Fake UPI Request",
    scenario: "You receive a message: 'Hi! I accidentally sent you ₹500. Please send it back to UPI ID: scammer@paytm'",
    choices: [
      {
        text: "Send the money back immediately",
        isSafe: false,
        feedback: "❌ Never send money to unknown UPI IDs! This is a common scam. The scammer never sent you money."
      },
      {
        text: "Check your transaction history first",
        isSafe: true,
        feedback: "✅ Smart! Always verify your transaction history. You'll find no incoming payment - it's a scam!"
      },
      {
        text: "Call the person to confirm",
        isSafe: true,
        feedback: "✅ Good thinking! Verification is key, but you'll find this person doesn't exist."
      }
    ],
    dogReaction: "🐕 *sniff sniff* Something smells fishy here!",
    points: { correct: 10, wrong: -5, completion: 5, fast: 2, perfect: 15 }
  },
  {
    id: 2,
    island: 1,
    level: 2,
    title: "QR Code Trap",
    scenario: "You see a QR code poster saying 'Scan to get ₹100 cashback!' outside a shop.",
    choices: [
      {
        text: "Scan immediately for free money",
        isSafe: false,
        feedback: "❌ Random QR codes can steal your money! Fraudsters place fake QR codes to redirect payments."
      },
      {
        text: "Ask the shopkeeper about it first",
        isSafe: true,
        feedback: "✅ Excellent! Always verify QR codes with the merchant. Legitimate offers come with proper verification."
      },
      {
        text: "Ignore the QR code",
        isSafe: true,
        feedback: "✅ Safe choice! When in doubt, don't scan unknown QR codes."
      }
    ],
    dogReaction: "🐕 *barks* That QR code doesn't belong to the shop!",
    points: { correct: 10, wrong: -5, completion: 5, fast: 2, perfect: 15 }
  },

  // Island 2: SMS & Communication (Levels 3-4)
  {
    id: 3,
    island: 2,
    level: 3,
    title: "Phishing SMS Detector",
    scenario: "SMS: 'URGENT! Your bank account will be blocked in 2 hours. Click link to verify: http://fakebank.com'",
    choices: [
      {
        text: "Click the link to verify quickly",
        isSafe: false,
        feedback: "❌ Banks never send urgent verification links via SMS! This steals your login details."
      },
      {
        text: "Call your bank's official number",
        isSafe: true,
        feedback: "✅ Perfect! Always contact your bank directly using their official contact information."
      },
      {
        text: "Delete the SMS and ignore",
        isSafe: true,
        feedback: "✅ Smart! Legitimate banks don't send such urgent SMS messages."
      }
    ],
    dogReaction: "🐕 *growls* That website smells like a trap!",
    points: { correct: 10, wrong: -5, completion: 5, fast: 2, perfect: 15 }
  },
  {
    id: 4,
    island: 2,
    level: 4,
    title: "Refund Scam",
    scenario: "Call: 'Hello, this is customer service. We need to refund ₹2000 to your account. Please install AnyDesk app to receive it.'",
    choices: [
      {
        text: "Install the app to get my refund",
        isSafe: false,
        feedback: "❌ Screen sharing apps like AnyDesk give fraudsters complete control of your device!"
      },
      {
        text: "Ask for refund via official bank process",
        isSafe: true,
        feedback: "✅ Correct! Legitimate refunds happen through official banking channels, not screen sharing apps."
      },
      {
        text: "Hang up and call the company directly",
        isSafe: true,
        feedback: "✅ Excellent! Always verify such calls by contacting the company through official channels."
      }
    ],
    dogReaction: "🐕 *whimpers* Don't let strangers control your phone!",
    points: { correct: 10, wrong: -5, completion: 5, fast: 2, perfect: 15 }
  },

  // Island 3: Financial Offers (Levels 5-6)
  {
    id: 5,
    island: 3,
    level: 5,
    title: "Wallet Jackpot",
    scenario: "Pop-up: 'Congratulations! You've won ₹50,000 in Paytm lottery! Pay ₹500 processing fee to claim.'",
    choices: [
      {
        text: "Pay the processing fee to claim prize",
        isSafe: false,
        feedback: "❌ Legitimate lotteries never ask for fees upfront! This is a classic advance fee scam."
      },
      {
        text: "Close the pop-up without paying",
        isSafe: true,
        feedback: "✅ Smart! Real prize winnings never require you to pay money first."
      },
      {
        text: "Report the pop-up as spam",
        isSafe: true,
        feedback: "✅ Great! Reporting helps protect others from the same scam."
      }
    ],
    dogReaction: "🐕 *tilts head* Free money that costs money? That's suspicious!",
    points: { correct: 10, wrong: -5, completion: 5, fast: 2, perfect: 15 }
  },
  {
    id: 6,
    island: 3,
    level: 6,
    title: "KYC Update Trap",
    scenario: "Email: 'Your KYC will expire today. Update immediately or lose ₹25,000 wallet balance. Click here.'",
    choices: [
      {
        text: "Click to update KYC immediately",
        isSafe: false,
        feedback: "❌ KYC updates happen through official bank/wallet apps, not email links!"
      },
      {
        text: "Update KYC through official app",
        isSafe: true,
        feedback: "✅ Perfect! Always use official apps or websites for sensitive financial updates."
      },
      {
        text: "Contact customer service to verify",
        isSafe: true,
        feedback: "✅ Excellent approach! When in doubt, always verify through official channels."
      }
    ],
    dogReaction: "🐕 *sniffs email* This doesn't smell like real customer service!",
    points: { correct: 10, wrong: -5, completion: 5, fast: 2, perfect: 15 }
  },

  // Island 4: Investment & Loans (Levels 7-8)
  {
    id: 7,
    island: 4,
    level: 7,
    title: "Investment Trap",
    scenario: "WhatsApp message: 'Join our crypto group! Guaranteed 300% returns in 30 days. Minimum investment ₹5000.'",
    choices: [
      {
        text: "Invest ₹5000 for quick returns",
        isSafe: false,
        feedback: "❌ Guaranteed high returns are always scams! Real investments carry risks and no guarantees."
      },
      {
        text: "Research the company first",
        isSafe: true,
        feedback: "✅ Good! But you'll find this 'company' doesn't exist. Always verify investment opportunities."
      },
      {
        text: "Ignore and block the sender",
        isSafe: true,
        feedback: "✅ Smart! Legitimate investment opportunities don't come through random WhatsApp messages."
      }
    ],
    dogReaction: "🐕 *barks loudly* 300% returns? Even I know that's impossible!",
    points: { correct: 10, wrong: -5, completion: 5, fast: 2, perfect: 15 }
  },
  {
    id: 8,
    island: 4,
    level: 8,
    title: "Loan Offer Spam",
    scenario: "SMS: 'Pre-approved loan of ₹5 lakhs! No documents needed. Pay ₹2000 processing fee for instant approval.'",
    choices: [
      {
        text: "Pay processing fee for quick loan",
        isSafe: false,
        feedback: "❌ Legitimate loans never ask for upfront fees! This is an advance fee fraud."
      },
      {
        text: "Apply through official bank channels",
        isSafe: true,
        feedback: "✅ Correct! Real loans require proper documentation and verification through official channels."
      },
      {
        text: "Delete SMS and report as spam",
        isSafe: true,
        feedback: "✅ Wise choice! Pre-approved loans via SMS are always scams."
      }
    ],
    dogReaction: "🐕 *digs ground* Something's buried and smells rotten here!",
    points: { correct: 10, wrong: -5, completion: 5, fast: 2, perfect: 15 }
  },

  // Island 5: E-commerce & OTP (Levels 9-10)
  {
    id: 9,
    island: 5,
    level: 9,
    title: "Fake E-commerce Seller",
    scenario: "Online deal: 'iPhone 15 for ₹15,000! 90% discount. Pay now via direct bank transfer for express delivery.'",
    choices: [
      {
        text: "Transfer money for great deal",
        isSafe: false,
        feedback: "❌ Too good to be true prices are red flags! Direct bank transfers offer no buyer protection."
      },
      {
        text: "Check seller reviews and ratings",
        isSafe: true,
        feedback: "✅ Smart! You'll find this seller has fake reviews. Always verify seller credibility."
      },
      {
        text: "Buy from official retailer instead",
        isSafe: true,
        feedback: "✅ Excellent! Official retailers provide genuine products and buyer protection."
      }
    ],
    dogReaction: "🐕 *howls* That price is way too low! Something's fishy!",
    points: { correct: 10, wrong: -5, completion: 5, fast: 2, perfect: 15 }
  },
  {
    id: 10,
    island: 5,
    level: 10,
    title: "OTP Sharing Trap",
    scenario: "Call: 'Sir, I'm calling from your bank. For security verification, please share the OTP we just sent to your phone.'",
    choices: [
      {
        text: "Share OTP for verification",
        isSafe: false,
        feedback: "❌ NEVER share OTP with anyone! Banks never ask for OTP over phone calls."
      },
      {
        text: "Hang up and call bank directly",
        isSafe: true,
        feedback: "✅ Perfect! Your bank will confirm they never called you. OTPs are for your use only."
      },
      {
        text: "Ask for caller's employee ID",
        isSafe: true,
        feedback: "✅ Good thinking! But remember, even with ID, never share OTP over phone."
      }
    ],
    dogReaction: "🐕 *barks frantically* Keep that OTP secret! It's your digital key!",
    points: { correct: 10, wrong: -5, completion: 5, fast: 2, perfect: 15 }
  }
];

export const islands = [
  { id: 1, name: "Basics Island", theme: "🏝️ Foundation", levels: [1, 2] },
  { id: 2, name: "Communication Cove", theme: "📱 Messages & Calls", levels: [3, 4] },
  { id: 3, name: "Money Mountain", theme: "💰 Financial Offers", levels: [5, 6] },
  { id: 4, name: "Investment Isle", theme: "📈 Investments & Loans", levels: [7, 8] },
  { id: 5, name: "Shopping Shore", theme: "🛒 E-commerce & Security", levels: [9, 10] }
];

export const dogEvolution = [
  { level: 1, emoji: "🐶", name: "Puppy Detective" },
  { level: 3, emoji: "🐕", name: "Alert Guardian" },
  { level: 5, emoji: "🦮", name: "Cyber Sentinel" },
  { level: 7, emoji: "🐕‍🦺", name: "Fraud Hunter" },
  { level: 10, emoji: "🦸‍♂️🐕", name: "Security Hero" }
];