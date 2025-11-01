// React-based game imports
import ScamScannerGame from '../components/games/ScamScannerGame';
import ITSecurityDashGame from '../components/games/ITSecurityDashGame';
import WhatsAppDashGame from '../components/games/WhatsAppDashGame';
import WhatsAppRunnerGame from '../components/games/WhatsAppRunnerGame';
import ScamSleuthGame from '../components/games/ScamSleuthGame';
import CreditStackerGame from '../components/games/CreditStackerGame';

console.log('Game imports:', { ScamScannerGame, ITSecurityDashGame, WhatsAppDashGame, WhatsAppRunnerGame, ScamSleuthGame, CreditStackerGame });

// Game configurations for 10 islands (Island 1, 2 & 3 implemented)
export const gameConfigs = {
  island1: {
    component: ScamScannerGame,
    title: "🕵️‍♂️ Scam Scanner: Cyber Defense Unit",
    description: "Malicious emails and messages detected! Sort them into SECURE or THREAT zones before they infiltrate the system!",
    theme: "among-us-red",
    instructions: [
      "🚨 Malicious messages falling from cyber space",
      "🖱️ Drag items to the correct security zone", 
      "🛡️ Green zone for SECURE messages",
      "⚠️ Red zone for THREAT/SCAM messages",
      "⏱️ Defend the system for 60 seconds!"
    ]
  },
  island2: {
    component: ITSecurityDashGame,
    title: "🔒 IT Security Dash: Network Defense",
    description: "Security alerts flooding the network! Clear safe notifications and fix critical breaches with mini-games!",
    theme: "among-us-blue",
    instructions: [
      "🖥️ Monitor multiple network stations",
      "🟢 Click green alerts to clear routine tasks",
      "🔴 Click red alerts to start security fixes",
      "🎮 Complete keypad sequences and upload patches",
      "⚡ Work fast - 60 seconds to secure the network!"
    ]
  },
  island3: {
    component: WhatsAppDashGame,
    title: "📱 WhatsApp Dash: Data Breach Island",
    description: "Navigate through the digital world! Jump over obstacles, slide under barriers, and collect safe messages!",
    theme: "among-us-green",
    instructions: [
      "🏃‍♂️ Run through the digital messaging landscape",
      "⬆️ Press SPACE or ↑ to jump over red obstacles",
      "⬇️ Press ↓ to slide under barriers",
      "💚 Collect green items for points",
      "🎯 Survive as long as possible!"
    ]
  },
  island4: {
    component: WhatsAppRunnerGame,
    title: "🏃‍♂️ WhatsApp Runner: Message Sprint",
    description: "Sprint through the messaging world! Jump over spam, slide under pop-ups, and collect safe messages!",
    theme: "among-us-yellow",
    instructions: [
      "🏃‍♂️ Run through the WhatsApp messaging landscape",
      "⬆️ Press SPACE or ↑ to jump over red spam messages",
      "⬇️ Press ↓ to slide under orange pop-up alerts",
      "💚 Collect green safe messages for points",
      "🎮 Avoid obstacles to keep your lives!"
    ]
  },
  island5: {
    component: ScamSleuthGame,
    title: "🔍 Scam Sleuth: Overpayment Detective",
    description: "Investigate suspicious overpayment messages! Click on red flags to expose the scam before time runs out!",
    theme: "among-us-purple",
    instructions: [
      "📱 Read incoming messages carefully",
      "🚩 Click on suspicious red flag phrases",
      "⏰ Find all 3 red flags before timer runs out",
      "💰 +50 points for each flag, -25 for safe text",
      "🎯 Make the right decision for a +200 bonus!"
    ]
  },
  island6: {
    component: CreditStackerGame,
    title: "🏗️ Credit Stacker: Financial Tower",
    description: "Build your credit score by stacking good financial habits! Avoid predatory loans that will damage your credit!",
    theme: "among-us-cyan",
    instructions: [
      "� ↑ Arrow or Space = Keep/Drop the block",
      "🗑️ ↓ Arrow = Discard/Skip the block",
      "💚 Stack green 'good habit' blocks for points",
      "🚫 Discard red 'instant loan' trap blocks (+25 bonus)",
      "⚡ Speed increases as your tower grows higher!"
    ]
  }
};

// Among Us color themes
export const themes = {
  'among-us-red': {
    primary: '#C51111',
    secondary: '#FF6B6B',
    background: '#1a1a1a',
    text: '#ffffff',
    accent: '#FFD93D'
  },
  'among-us-blue': {
    primary: '#132ED1', 
    secondary: '#6BCFFF',
    background: '#0F1419',
    text: '#ffffff',
    accent: '#50C4ED'
  },
  'among-us-green': {
    primary: '#117F2D',
    secondary: '#7EE068', 
    background: '#0A1A0F',
    text: '#ffffff',
    accent: '#42FF00'
  },
  'among-us-yellow': {
    primary: '#F07613',
    secondary: '#FFEB3B',
    background: '#1A1508', 
    text: '#000000',
    accent: '#FFC107'
  },
  'among-us-orange': {
    primary: '#EF7D00',
    secondary: '#FF9800',
    background: '#1A0F08',
    text: '#ffffff', 
    accent: '#FFB74D'
  },
  'among-us-pink': {
    primary: '#ED54BA',
    secondary: '#FF69B4',
    background: '#1A081A',
    text: '#ffffff',
    accent: '#FFB6C1'
  },
  'among-us-purple': {
    primary: '#6B2FBB',
    secondary: '#9C27B0',
    background: '#130A1A',
    text: '#ffffff',
    accent: '#E1BEE7'
  },
  'among-us-brown': {
    primary: '#71491E',
    secondary: '#8D6E63',
    background: '#1A130A',
    text: '#ffffff',
    accent: '#BCAAA4'
  },
  'among-us-cyan': {
    primary: '#38FFDD',
    secondary: '#00BCD4',
    background: '#0A1A1A',
    text: '#000000',
    accent: '#4DD0E1'
  },
  'among-us-lime': {
    primary: '#50EF39',
    secondary: '#8BC34A',
    background: '#0F1A0A',
    text: '#000000', 
    accent: '#CDDC39'
  }
};