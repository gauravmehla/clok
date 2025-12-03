import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useTimer } from '../hooks/useTimer'
import { exportTournamentConfig } from '../utils/exportImport'
import { formatTime, getBreakAfterLevel } from '../utils/helpers'
import Clock from '../components/Clock'
import BlindDisplay from '../components/BlindDisplay'
import Leaderboard from '../components/Leaderboard'

export default function TimerView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const containerRef = useRef(null)
  
  const {
    tournament,
    isLoading,
    isRunning,
    isPaused,
    isFinished,
    start,
    pause,
    reset,
    endTournament,
    advanceLevel,
    previousLevel,
    setLevel,
    bustPlayer,
    unBustPlayer,
    addPlayer,
    removePlayer,
    addTime,
    subtractTime,
  } = useTimer(id)

  const [showLeaderboard, setShowLeaderboard] = useState(true)
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [levelChanged, setLevelChanged] = useState(false)
  const prevLevelRef = useRef(null)

  // Detect level changes for visual alert
  useEffect(() => {
    if (tournament && prevLevelRef.current !== null && prevLevelRef.current !== tournament.currentLevelIndex) {
      setLevelChanged(true)
      setTimeout(() => setLevelChanged(false), 1000)
    }
    prevLevelRef.current = tournament?.currentLevelIndex ?? null
  }, [tournament?.currentLevelIndex])

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return
      
      switch (e.key) {
        case ' ':
          e.preventDefault()
          isRunning ? pause() : start()
          break
        case 'ArrowRight':
          advanceLevel()
          break
        case 'ArrowLeft':
          previousLevel()
          break
        case 'f':
          toggleFullscreen()
          break
        case 'l':
          setShowLeaderboard(prev => !prev)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isRunning, start, pause, advanceLevel, previousLevel])

  const handleAddPlayer = (e) => {
    e.preventDefault()
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim())
      setNewPlayerName('')
      setShowAddPlayer(false)
    }
  }

  const handleExport = () => {
    if (tournament) {
      exportTournamentConfig(tournament)
    }
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <h1 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Tournament not found
        </h1>
        <Link to="/" className="text-accent-500 hover:underline">
          Go back home
        </Link>
      </div>
    )
  }

  const currentLevel = tournament.blindStructure.levels[tournament.currentLevelIndex]
  const nextLevel = tournament.blindStructure.levels[tournament.currentLevelIndex + 1]
  const totalLevels = tournament.blindStructure.levels.length
  const isWarning = tournament.timeRemaining <= 60 && tournament.timeRemaining > 0 && isRunning

  // Check if current level is a break
  const currentBreak = getBreakAfterLevel(tournament.currentLevelIndex - 1, tournament.breaks)
  const isBreak = false // You can implement break logic here

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} ${
        levelChanged ? 'animate-flash' : ''
      }`}
    >
      {/* Flash overlay for level change */}
      {levelChanged && (
        <div className="fixed inset-0 bg-accent-500 opacity-20 pointer-events-none z-50 animate-flash" />
      )}

      {/* Header */}
      <header className={`border-b ${theme === 'dark' ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-white/80'} backdrop-blur-sm sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className={`text-lg font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {tournament.name}
            </h1>
            {isFinished && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-500/10 text-gray-500">
                Finished
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className={`p-2 rounded-lg transition-colors ${
                showLeaderboard
                  ? 'bg-accent-500 text-white'
                  : theme === 'dark'
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              title="Toggle leaderboard (L)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
            
            <button
              onClick={handleExport}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              title="Export config"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
              title="Toggle fullscreen (F)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isFullscreen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Timer Section */}
        <div className={`flex-1 flex flex-col items-center justify-center p-4 md:p-8 ${
          showLeaderboard ? 'lg:pr-0' : ''
        }`}>
          {/* Clock */}
          <div className="w-full max-w-2xl mb-8">
            <Clock
              timeRemaining={tournament.timeRemaining}
              totalTime={currentLevel?.duration || 0}
              isRunning={isRunning}
              isWarning={isWarning}
            />
          </div>

          {/* Blind Display */}
          <div className="w-full max-w-lg mb-8">
            <BlindDisplay
              currentLevel={currentLevel}
              currentLevelIndex={tournament.currentLevelIndex}
              totalLevels={totalLevels}
              nextLevel={nextLevel}
              isBreak={isBreak}
              onAdvance={advanceLevel}
              onPrevious={previousLevel}
              onSelectLevel={setLevel}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Time adjustment buttons */}
            <button
              onClick={() => subtractTime(60)}
              className={`p-3 rounded-xl transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
              }`}
              title="Subtract 1 minute"
            >
              <span className="text-sm font-medium">-1m</span>
            </button>

            {/* Main play/pause button */}
            {!isFinished && (
              <button
                onClick={isRunning ? pause : start}
                className={`p-6 rounded-full transition-all shadow-lg ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                    : 'bg-accent-500 hover:bg-accent-600 shadow-accent-500/25'
                }`}
              >
                {isRunning ? (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            )}

            {/* Reset button for finished tournaments */}
            {isFinished && (
              <button
                onClick={reset}
                className="p-6 rounded-full bg-accent-500 hover:bg-accent-600 shadow-lg shadow-accent-500/25 transition-all"
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* Time adjustment buttons */}
            <button
              onClick={() => addTime(60)}
              className={`p-3 rounded-xl transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
              }`}
              title="Add 1 minute"
            >
              <span className="text-sm font-medium">+1m</span>
            </button>
          </div>

          {/* End Tournament Button */}
          {!isFinished && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to end this tournament?')) {
                  endTournament()
                }
              }}
              className={`mt-6 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300'
                  : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700'
              }`}
            >
              End Tournament
            </button>
          )}

          {/* Keyboard shortcuts hint */}
          <div className={`mt-6 text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
            Space: Play/Pause • Arrow keys: Change level • F: Fullscreen • L: Leaderboard
          </div>
        </div>

        {/* Leaderboard Sidebar */}
        {showLeaderboard && (
          <div className={`w-80 border-l flex-shrink-0 ${
            theme === 'dark' ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white'
          }`}>
            <Leaderboard
              players={tournament.players}
              onBust={bustPlayer}
              onUnbust={unBustPlayer}
              onRemove={removePlayer}
              isFinished={isFinished}
              onAddPlayer={() => setShowAddPlayer(true)}
            />
          </div>
        )}
      </main>

      {/* Add Player Modal */}
      {showAddPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Add Player
            </h2>
            <form onSubmit={handleAddPlayer}>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Player name"
                className={`w-full px-4 py-3 rounded-xl mb-4 ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white placeholder-gray-500 border-gray-600'
                    : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-300'
                } border focus:outline-none focus:ring-2 focus:ring-accent-500`}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPlayer(false)
                    setNewPlayerName('')
                  }}
                  className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPlayerName.trim()}
                  className="flex-1 py-3 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

