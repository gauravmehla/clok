# Poker Timer

A modern, offline poker tournament timer for home games. Built with React and Tailwind CSS.

## Features

- **Tournament Management**: Create and manage multiple poker tournaments
- **Customizable Blind Structures**: Choose from preset structures (Slow, Medium, Fast, Turbo) or create your own
- **Player Tracking**: Add players, mark busts, and see live leaderboard standings
- **Trophy Badges**: Gold, silver, and bronze trophies for top 3 finishers
- **Break Scheduling**: Add optional breaks between blind levels
- **Visual Alerts**: Screen flash and color changes when blinds increase
- **Export/Import**: Share tournament configurations with friends
- **Dark/Light Mode**: Toggle between themes or use system preference
- **Customizable Accent Colors**: Choose from 7 accent color options
- **Fullscreen Mode**: Optimized for TV display
- **Keyboard Shortcuts**: Quick controls for play/pause, level changes, etc.
- **100% Offline**: All data stored locally in browser localStorage

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Usage

1. **Create a Tournament**: Click "New Tournament" on the home page
2. **Set Up**:
   - Enter a tournament name
   - Add player names
   - Select a blind structure (or create custom)
   - Optionally add breaks
3. **Start Playing**:
   - Click play to start the timer
   - Mark players as busted as they're eliminated
   - The leaderboard updates automatically
4. **Winner**: When one player remains, they're crowned the winner with a trophy!

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play/Pause timer |
| → | Advance to next blind level |
| ← | Go back to previous blind level |
| F | Toggle fullscreen |
| L | Toggle leaderboard sidebar |

## Export/Import

- **Export**: Download your tournament configuration as a JSON file
- **Import**: Load a configuration file to create a new tournament with the same settings

This is great for:
- Sharing your favorite blind structure with friends
- Backing up tournament templates
- Using the same settings across different devices

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **localStorage** - Data persistence

## License

MIT
