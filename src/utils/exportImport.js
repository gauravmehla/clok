import { createTournament } from './helpers'

// Export tournament configuration as JSON
export function exportTournamentConfig(tournament) {
  const config = {
    name: tournament.name,
    blindStructure: tournament.blindStructure,
    breaks: tournament.breaks,
    players: tournament.players.map(p => p.name), // Only export names
    exportedAt: Date.now(),
    version: '1.0',
  }

  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${tournament.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-config.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Import tournament configuration from JSON file
export function importTournamentConfig(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result)
        
        // Validate required fields
        if (!config.blindStructure || !config.blindStructure.levels) {
          throw new Error('Invalid config: missing blind structure')
        }
        
        // Create new tournament from config
        const tournament = createTournament({
          name: config.name || 'Imported Tournament',
          players: config.players || [],
          blindStructure: config.blindStructure,
          breaks: config.breaks || [],
        })
        
        resolve(tournament)
      } catch (error) {
        reject(new Error(`Failed to parse config file: ${error.message}`))
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

// Export full tournament state (for backup/resume)
export function exportFullTournament(tournament) {
  const blob = new Blob([JSON.stringify(tournament, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${tournament.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-full-backup.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Import full tournament state
export function importFullTournament(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const tournament = JSON.parse(e.target.result)
        
        // Validate required fields
        if (!tournament.id || !tournament.blindStructure) {
          throw new Error('Invalid tournament file')
        }
        
        resolve(tournament)
      } catch (error) {
        reject(new Error(`Failed to parse tournament file: ${error.message}`))
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

