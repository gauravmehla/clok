import { v4 as uuidv4 } from 'uuid'

// Format time in MM:SS or HH:MM:SS
export function formatTime(seconds) {
  if (seconds < 0) seconds = 0
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

// Format number with commas (1000 -> 1,000)
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Format blind level string
export function formatBlindLevel(level) {
  const sb = formatNumber(level.smallBlind)
  const bb = formatNumber(level.bigBlind)
  if (level.ante > 0) {
    return `${sb}/${bb} (Ante: ${formatNumber(level.ante)})`
  }
  return `${sb}/${bb}`
}

// Generate unique ID
export function generateId() {
  return uuidv4()
}

// Create a new tournament object
export function createTournament({
  name,
  players = [],
  blindStructure,
  breaks = [],
}) {
  const now = Date.now()
  
  return {
    id: generateId(),
    name: name || `Tournament ${new Date().toLocaleDateString()}`,
    status: 'paused', // 'running', 'paused', 'finished'
    createdAt: now,
    players: players.map(p => ({
      id: generateId(),
      name: typeof p === 'string' ? p : p.name,
      bustedAt: null,
      position: null,
    })),
    blindStructure: {
      type: blindStructure.type || 'custom',
      levels: blindStructure.levels,
    },
    breaks: breaks.map(b => ({
      afterLevel: b.afterLevel,
      duration: b.duration,
    })),
    currentLevelIndex: 0,
    timeRemaining: blindStructure.levels[0]?.duration || 900,
    lastTickAt: now,
  }
}

// Calculate bust position based on active players
export function calculateBustPosition(players) {
  const activePlayers = players.filter(p => p.bustedAt === null)
  return activePlayers.length // Position is number of remaining players
}

// Sort players for leaderboard display
export function sortPlayersForLeaderboard(players) {
  const active = players
    .filter(p => p.bustedAt === null)
    .sort((a, b) => a.name.localeCompare(b.name))
  
  const busted = players
    .filter(p => p.bustedAt !== null)
    .sort((a, b) => b.bustedAt - a.bustedAt) // Most recently busted first
  
  return [...active, ...busted]
}

// Get total tournament time estimate
export function estimateTotalTime(levels, breaks = []) {
  const levelTime = levels.reduce((sum, l) => sum + l.duration, 0)
  const breakTime = breaks.reduce((sum, b) => sum + b.duration, 0)
  return levelTime + breakTime
}

// Format duration as "X hours Y minutes"
export function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  const parts = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0 || hours === 0) parts.push(`${minutes}m`)
  
  return parts.join(' ')
}

// Check if there's a break after a specific level
export function getBreakAfterLevel(levelIndex, breaks) {
  return breaks.find(b => b.afterLevel === levelIndex + 1) || null
}

// Calculate tournament progress percentage
export function calculateProgress(currentLevel, timeRemaining, levels) {
  const totalLevels = levels.length
  const currentLevelDuration = levels[currentLevel]?.duration || 0
  const levelProgress = currentLevelDuration > 0 
    ? (currentLevelDuration - timeRemaining) / currentLevelDuration 
    : 0
  
  const overallProgress = ((currentLevel + levelProgress) / totalLevels) * 100
  return Math.min(100, Math.max(0, overallProgress))
}

// Get relative time string (e.g., "2 hours ago")
export function getRelativeTime(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  
  return new Date(timestamp).toLocaleDateString()
}

