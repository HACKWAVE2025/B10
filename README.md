# 🐕 Fraud Detection Academy - Gamified Fraud Awareness Platform

A fun and interactive web application where users train their virtual dog companion to detect digital payment frauds across 10 engaging scenarios spanning 5 themed islands.

## 🎯 Overview

**Fraud Detection Academy** is a hackathon project designed to educate users about digital payment security through gamification. Players adopt a virtual dog and train it to recognize various fraud patterns, creating an engaging learning experience around cybersecurity awareness.


## 🌟 Features

### 🎮 Core Gameplay
- **Virtual Dog Companion**: Name and train your cyber-detective dog
- **10 Fraud Scenarios**: Real-world examples across different categories
- **5 Themed Islands**: Progress through different fraud landscapes
- **Dog Evolution**: Watch your companion grow stronger with each level

### 🏆 Game Mechanics
- **Points System**: 
  - ✅ Correct Choice: +10 points
  - ❌ Wrong Choice: -5 points
  - 🎯 Level Completion: +5 points
  - ⚡ Quick Answer (<10s): +2 points
  - 💎 Perfect Level: +15 points
- **Lives System**: 3 lives per game session
- **Leaderboard**: Real-time competitive ranking
- **Progress Tracking**: Visual progress across islands and levels

### 📱 Technical Features
- **Responsive Design**: Mobile and desktop friendly
- **Real-time Updates**: Firebase integration for live leaderboards
- **Tailwind CSS**: Modern, responsive UI components
- **State Management**: React Context for game state
- **Local Storage**: Progress persistence

## 🏝️ Game Content

### Islands & Scenarios
1. **🏝️ Basics Island** (Levels 1-2)
   - Fake UPI Request
   - QR Code Trap

2. **📱 Communication Cove** (Levels 3-4)
   - Phishing SMS Detector
   - Refund Scam

3. **💰 Money Mountain** (Levels 5-6)
   - Wallet Jackpot
   - KYC Update Trap

4. **📈 Investment Isle** (Levels 7-8)
   - Investment Trap
   - Loan Offer Spam

5. **🛒 Shopping Shore** (Levels 9-10)
   - Fake E-commerce Seller
   - OTP Sharing Trap

### Dog Evolution Stages
- 🐶 **Puppy Detective** (Level 1)
- 🐕 **Alert Guardian** (Level 3)
- 🦮 **Cyber Sentinel** (Level 5)
- 🐕‍🦺 **Fraud Hunter** (Level 7)
- 🦸‍♂️🐕 **Security Hero** (Level 10)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Firebase** (Optional)
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication and Firestore
   - Update `src/config/firebase.js` with your Firebase config

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   - Navigate to http://localhost:3000
   - Start training your fraud detection companion!

### Build for Production
```bash
npm run build
```

## 🛠️ Tech Stack

- **Frontend**: React.js with JavaScript
- **Styling**: Tailwind CSS v3
- **Backend**: Firebase (Firestore, Authentication)
- **State Management**: React Context API
- **Deployment**: Firebase Hosting

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── GameIntro.js     # Welcome screen and dog naming
│   ├── GamePlay.js      # Main game interface
│   ├── ScenarioCard.js  # Individual scenario presentation
│   ├── GameProgress.js  # Progress tracking sidebar
│   ├── DogCompanion.js  # Virtual dog display
│   └── Leaderboard.js   # Rankings and statistics
├── contexts/            # React Context providers
│   └── GameContext.js   # Game state management
├── config/              # Configuration files
│   └── firebase.js      # Firebase setup
├── data/                # Game content
│   └── gameData.js      # Scenarios, islands, dog evolution
├── App.js               # Main application component
├── index.js             # Application entry point
└── index.css            # Global styles with Tailwind
```

## 🎨 Customization

### Adding New Scenarios
1. Edit `src/data/gameData.js`
2. Add new scenario objects with unique ID, level, island assignment, scenario description, multiple choice options, feedback messages, and dog reactions

### Styling Changes
- Modify `tailwind.config.js` for theme customization
- Update `src/index.css` for custom CSS classes

### Firebase Integration
- Configure authentication providers in `src/config/firebase.js`
- Set up Firestore collections for leaderboards
- Implement real-time data synchronization

## 🏆 Scoring System

The game uses a comprehensive scoring system to encourage learning with immediate feedback, time bonuses, perfect level bonuses, and visual progress tracking.

## 🚧 Future Enhancements

- User authentication with Firebase Auth
- Real-time multiplayer features  
- Additional fraud scenarios
- Advanced dog customization
- Achievement system
- Social sharing features

## 🎪 Hackathon Context

**Duration**: 16-hour hackathon project  
**Focus**: Simple, functional, and quickly deployable  
**Goal**: Fraud awareness education through gamification

---

**🐕 Ready to train your fraud detection companion? Let's make digital payments safer, one bark at a time! 🔍**

---

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
