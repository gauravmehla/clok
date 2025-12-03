// Standard poker blind levels
const standardLevels = [
  { smallBlind: 25, bigBlind: 50, ante: 0 },
  { smallBlind: 50, bigBlind: 100, ante: 0 },
  { smallBlind: 75, bigBlind: 150, ante: 0 },
  { smallBlind: 100, bigBlind: 200, ante: 0 },
  { smallBlind: 150, bigBlind: 300, ante: 0 },
  { smallBlind: 200, bigBlind: 400, ante: 0 },
  { smallBlind: 300, bigBlind: 600, ante: 0 },
  { smallBlind: 400, bigBlind: 800, ante: 100 },
  { smallBlind: 500, bigBlind: 1000, ante: 100 },
  { smallBlind: 600, bigBlind: 1200, ante: 200 },
  { smallBlind: 800, bigBlind: 1600, ante: 200 },
  { smallBlind: 1000, bigBlind: 2000, ante: 300 },
  { smallBlind: 1500, bigBlind: 3000, ante: 400 },
  { smallBlind: 2000, bigBlind: 4000, ante: 500 },
  { smallBlind: 2500, bigBlind: 5000, ante: 500 },
  { smallBlind: 3000, bigBlind: 6000, ante: 1000 },
  { smallBlind: 4000, bigBlind: 8000, ante: 1000 },
  { smallBlind: 5000, bigBlind: 10000, ante: 1000 },
  { smallBlind: 6000, bigBlind: 12000, ante: 2000 },
  { smallBlind: 8000, bigBlind: 16000, ante: 2000 },
  { smallBlind: 10000, bigBlind: 20000, ante: 3000 },
  { smallBlind: 15000, bigBlind: 30000, ante: 4000 },
  { smallBlind: 20000, bigBlind: 40000, ante: 5000 },
  { smallBlind: 30000, bigBlind: 60000, ante: 10000 },
  { smallBlind: 40000, bigBlind: 80000, ante: 10000 },
  { smallBlind: 50000, bigBlind: 100000, ante: 10000 },
]

// Create levels with specific duration
function createLevelsWithDuration(durationMinutes, maxLevels = 20) {
  return standardLevels.slice(0, maxLevels).map(level => ({
    ...level,
    duration: durationMinutes * 60, // Convert to seconds
  }))
}

// Preset blind structures
export const blindStructurePresets = {
  slow: {
    name: 'Slow',
    description: '20-minute levels - Relaxed pace for casual home games',
    levelDuration: 20,
    levels: createLevelsWithDuration(20, 20),
  },
  medium: {
    name: 'Medium',
    description: '15-minute levels - Standard tournament pace',
    levelDuration: 15,
    levels: createLevelsWithDuration(15, 20),
  },
  fast: {
    name: 'Fast',
    description: '10-minute levels - Quicker game, more action',
    levelDuration: 10,
    levels: createLevelsWithDuration(10, 20),
  },
  turbo: {
    name: 'Turbo',
    description: '5-minute levels - Fast-paced action',
    levelDuration: 5,
    levels: createLevelsWithDuration(5, 20),
  },
}

// Get a copy of the standard levels for custom structure creation
export function getStandardLevels() {
  return [...standardLevels]
}

// Create a custom blind structure
export function createCustomStructure(levels, name = 'Custom') {
  return {
    name,
    description: 'Custom blind structure',
    levelDuration: null, // Variable durations
    levels: levels.map(level => ({
      smallBlind: level.smallBlind,
      bigBlind: level.bigBlind,
      ante: level.ante || 0,
      duration: level.duration || 600, // Default 10 minutes
    })),
  }
}

// Default structure
export const defaultBlindStructure = blindStructurePresets.medium

