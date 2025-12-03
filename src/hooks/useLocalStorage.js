import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use default
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Update localStorage when value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

// Helper to get all tournaments from localStorage
export function getTournaments() {
  try {
    const tournaments = window.localStorage.getItem('poker-tournaments')
    return tournaments ? JSON.parse(tournaments) : []
  } catch (error) {
    console.error('Error reading tournaments:', error)
    return []
  }
}

// Helper to save tournaments
export function saveTournaments(tournaments) {
  try {
    window.localStorage.setItem('poker-tournaments', JSON.stringify(tournaments))
  } catch (error) {
    console.error('Error saving tournaments:', error)
  }
}

// Helper to get a single tournament by ID
export function getTournament(id) {
  const tournaments = getTournaments()
  return tournaments.find(t => t.id === id) || null
}

// Helper to update a single tournament
export function updateTournament(id, updates) {
  const tournaments = getTournaments()
  const index = tournaments.findIndex(t => t.id === id)
  if (index !== -1) {
    tournaments[index] = { ...tournaments[index], ...updates }
    saveTournaments(tournaments)
    return tournaments[index]
  }
  return null
}

// Helper to delete a tournament
export function deleteTournament(id) {
  const tournaments = getTournaments()
  const filtered = tournaments.filter(t => t.id !== id)
  saveTournaments(filtered)
}

// Helper to add a new tournament
export function addTournament(tournament) {
  const tournaments = getTournaments()
  tournaments.unshift(tournament) // Add to beginning
  saveTournaments(tournaments)
}

