import { useState, useEffect, useCallback, useRef } from 'react'
import { updateTournament, getTournament } from './useLocalStorage'

export function useTimer(tournamentId) {
  const [tournament, setTournament] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const initialTimeRef = useRef(null)

  // Load tournament from localStorage
  useEffect(() => {
    const loaded = getTournament(tournamentId)
    if (loaded) {
      // If tournament was running, calculate elapsed time since last tick
      if (loaded.status === 'running' && loaded.lastTickAt) {
        const elapsed = Math.floor((Date.now() - loaded.lastTickAt) / 1000)
        loaded.timeRemaining = Math.max(0, loaded.timeRemaining - elapsed)
      }
      setTournament(loaded)
    }
    setIsLoading(false)
  }, [tournamentId])

  // Save tournament to localStorage whenever it changes
  const saveTournament = useCallback((updates) => {
    setTournament(prev => {
      if (!prev) return prev
      const updated = { ...prev, ...updates, lastTickAt: Date.now() }
      updateTournament(tournamentId, updated)
      return updated
    })
  }, [tournamentId])

  // Timer tick - using precise elapsed time calculation
  const tick = useCallback(() => {
    setTournament(prev => {
      if (!prev || prev.status !== 'running') return prev

      const now = Date.now()
      const elapsedSinceStart = Math.floor((now - startTimeRef.current) / 1000)
      let newTimeRemaining = Math.max(0, initialTimeRef.current - elapsedSinceStart)
      let newLevelIndex = prev.currentLevelIndex
      let newStatus = prev.status

      // Check if level ended
      if (newTimeRemaining <= 0) {
        const nextLevelIndex = prev.currentLevelIndex + 1
        
        // Check if there are more levels
        if (nextLevelIndex < prev.blindStructure.levels.length) {
          newLevelIndex = nextLevelIndex
          newTimeRemaining = prev.blindStructure.levels[nextLevelIndex].duration
          // Reset timing references for new level
          startTimeRef.current = now
          initialTimeRef.current = newTimeRemaining
        } else {
          // Tournament finished (no more levels)
          newStatus = 'finished'
          newTimeRemaining = 0
        }
      }

      const updated = {
        ...prev,
        timeRemaining: newTimeRemaining,
        currentLevelIndex: newLevelIndex,
        status: newStatus,
        lastTickAt: now,
      }

      // Save to localStorage periodically (every 5 seconds to reduce writes)
      if (newTimeRemaining % 5 === 0 || newTimeRemaining <= 0 || newStatus !== prev.status) {
        updateTournament(tournamentId, updated)
      }
      
      return updated
    })
  }, [tournamentId])

  // Start/stop interval based on status
  useEffect(() => {
    if (tournament?.status === 'running') {
      // Clear any existing interval first
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      // Initialize timing references
      startTimeRef.current = Date.now()
      initialTimeRef.current = tournament.timeRemaining
      // Use 200ms interval for smoother updates while keeping accuracy
      intervalRef.current = setInterval(tick, 200)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [tournament?.status, tick])

  // Control functions
  const start = useCallback(() => {
    saveTournament({ status: 'running', lastTickAt: Date.now() })
  }, [saveTournament])

  const pause = useCallback(() => {
    saveTournament({ status: 'paused' })
  }, [saveTournament])

  const reset = useCallback(() => {
    if (!tournament) return
    const newTime = tournament.blindStructure.levels[0]?.duration || 900
    // Reset timing references for accurate calculation
    startTimeRef.current = Date.now()
    initialTimeRef.current = newTime
    saveTournament({
      status: 'paused',
      currentLevelIndex: 0,
      timeRemaining: newTime,
      players: tournament.players.map(p => ({ ...p, bustedAt: null, position: null })),
    })
  }, [tournament, saveTournament])

  const endTournament = useCallback(() => {
    if (!tournament) return
    
    // Mark all remaining active players with positions
    const activePlayers = tournament.players.filter(p => p.bustedAt === null)
    const updatedPlayers = tournament.players.map(p => {
      if (p.bustedAt === null) {
        // All remaining players tie for 1st (or you could assign based on chip count)
        return { ...p, position: 1 }
      }
      return p
    })
    
    saveTournament({ 
      status: 'finished',
      players: updatedPlayers
    })
  }, [tournament, saveTournament])

  const advanceLevel = useCallback(() => {
    if (!tournament) return
    const nextIndex = tournament.currentLevelIndex + 1
    if (nextIndex < tournament.blindStructure.levels.length) {
      const newTime = tournament.blindStructure.levels[nextIndex].duration
      // Reset timing references for accurate calculation
      startTimeRef.current = Date.now()
      initialTimeRef.current = newTime
      saveTournament({
        currentLevelIndex: nextIndex,
        timeRemaining: newTime,
      })
    }
  }, [tournament, saveTournament])

  const previousLevel = useCallback(() => {
    if (!tournament) return
    const prevIndex = tournament.currentLevelIndex - 1
    if (prevIndex >= 0) {
      const newTime = tournament.blindStructure.levels[prevIndex].duration
      // Reset timing references for accurate calculation
      startTimeRef.current = Date.now()
      initialTimeRef.current = newTime
      saveTournament({
        currentLevelIndex: prevIndex,
        timeRemaining: newTime,
      })
    }
  }, [tournament, saveTournament])

  const setLevel = useCallback((levelIndex) => {
    if (!tournament) return
    if (levelIndex >= 0 && levelIndex < tournament.blindStructure.levels.length) {
      const newTime = tournament.blindStructure.levels[levelIndex].duration
      // Reset timing references for accurate calculation
      startTimeRef.current = Date.now()
      initialTimeRef.current = newTime
      saveTournament({
        currentLevelIndex: levelIndex,
        timeRemaining: newTime,
      })
    }
  }, [tournament, saveTournament])

  const bustPlayer = useCallback((playerId) => {
    if (!tournament) return
    
    const activePlayers = tournament.players.filter(p => p.bustedAt === null)
    const position = activePlayers.length // Position is based on remaining players
    
    const updatedPlayers = tournament.players.map(p =>
      p.id === playerId
        ? { ...p, bustedAt: Date.now(), position }
        : p
    )

    // Check if tournament is finished (only 1 player left)
    const remainingActive = updatedPlayers.filter(p => p.bustedAt === null)
    let newStatus = tournament.status
    
    if (remainingActive.length === 1) {
      // Mark the winner
      updatedPlayers.forEach(p => {
        if (p.bustedAt === null) {
          p.position = 1
        }
      })
      newStatus = 'finished'
    }

    saveTournament({ players: updatedPlayers, status: newStatus })
  }, [tournament, saveTournament])

  const unBustPlayer = useCallback((playerId) => {
    if (!tournament) return
    
    const updatedPlayers = tournament.players.map(p =>
      p.id === playerId
        ? { ...p, bustedAt: null, position: null }
        : p
    )

    saveTournament({ 
      players: updatedPlayers, 
      status: tournament.status === 'finished' ? 'paused' : tournament.status 
    })
  }, [tournament, saveTournament])

  const addPlayer = useCallback((name) => {
    if (!tournament) return
    const newPlayer = {
      id: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      bustedAt: null,
      position: null,
    }
    saveTournament({
      players: [...tournament.players, newPlayer],
    })
  }, [tournament, saveTournament])

  const removePlayer = useCallback((playerId) => {
    if (!tournament) return
    saveTournament({
      players: tournament.players.filter(p => p.id !== playerId),
    })
  }, [tournament, saveTournament])

  const updatePlayerName = useCallback((playerId, newName) => {
    if (!tournament) return
    saveTournament({
      players: tournament.players.map(p =>
        p.id === playerId ? { ...p, name: newName } : p
      ),
    })
  }, [tournament, saveTournament])

  const addTime = useCallback((seconds) => {
    if (!tournament) return
    const newTime = tournament.timeRemaining + seconds
    // Reset timing references for accurate calculation
    startTimeRef.current = Date.now()
    initialTimeRef.current = newTime
    saveTournament({
      timeRemaining: newTime,
    })
  }, [tournament, saveTournament])

  const subtractTime = useCallback((seconds) => {
    if (!tournament) return
    const newTime = Math.max(0, tournament.timeRemaining - seconds)
    // Reset timing references for accurate calculation
    startTimeRef.current = Date.now()
    initialTimeRef.current = newTime
    saveTournament({
      timeRemaining: newTime,
    })
  }, [tournament, saveTournament])

  return {
    tournament,
    isLoading,
    // Status
    isRunning: tournament?.status === 'running',
    isPaused: tournament?.status === 'paused',
    isFinished: tournament?.status === 'finished',
    // Timer controls
    start,
    pause,
    reset,
    endTournament,
    addTime,
    subtractTime,
    // Level controls
    advanceLevel,
    previousLevel,
    setLevel,
    // Player controls
    bustPlayer,
    unBustPlayer,
    addPlayer,
    removePlayer,
    updatePlayerName,
    // Direct save
    saveTournament,
  }
}
