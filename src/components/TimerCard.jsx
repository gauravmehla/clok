import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { formatTime, formatBlindLevel, getRelativeTime } from '../utils/helpers'

const statusColors = {
  running: {
    bg: 'bg-green-500/10',
    text: 'text-green-500',
    dot: 'bg-green-500',
    border: 'border-green-500/30',
  },
  paused: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    dot: 'bg-amber-500',
    border: 'border-amber-500/30',
  },
  finished: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-500',
    dot: 'bg-gray-500',
    border: 'border-gray-500/30',
  },
}

export default function TimerCard({ tournament, onDelete }) {
  const { theme } = useTheme()
  const status = statusColors[tournament.status] || statusColors.paused
  
  const currentLevel = tournament.blindStructure.levels[tournament.currentLevelIndex]
  const activePlayers = tournament.players.filter(p => p.bustedAt === null).length
  const totalPlayers = tournament.players.length

  // Calculate real-time remaining for running tournaments
  const calculateRealTimeRemaining = () => {
    if (tournament.status === 'running' && tournament.lastTickAt) {
      const elapsed = Math.floor((Date.now() - tournament.lastTickAt) / 1000)
      return Math.max(0, tournament.timeRemaining - elapsed)
    }
    return tournament.timeRemaining
  }

  const [displayTime, setDisplayTime] = useState(calculateRealTimeRemaining)

  // Update display time every second for running tournaments
  useEffect(() => {
    if (tournament.status !== 'running') {
      setDisplayTime(tournament.timeRemaining)
      return
    }

    // Initial calculation
    setDisplayTime(calculateRealTimeRemaining())

    // Update every second
    const interval = setInterval(() => {
      setDisplayTime(calculateRealTimeRemaining())
    }, 1000)

    return () => clearInterval(interval)
  }, [tournament.status, tournament.timeRemaining, tournament.lastTickAt])

  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm(`Delete "${tournament.name}"?`)) {
      onDelete(tournament.id)
    }
  }

  return (
    <Link
      to={`/timer/${tournament.id}`}
      className={`block rounded-2xl border-2 p-5 transition-all hover:scale-[1.02] ${
        theme === 'dark'
          ? `bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800`
          : `bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg`
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-lg truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {tournament.name}
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {getRelativeTime(tournament.createdAt)}
          </p>
        </div>
        
        {/* Status Badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${tournament.status === 'running' ? 'animate-pulse' : ''}`} />
          {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
        </div>
      </div>

      {/* Current Level Info */}
      <div className={`rounded-xl p-4 mb-4 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs uppercase tracking-wide mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Level {tournament.currentLevelIndex + 1}
            </p>
            <p className={`font-mono font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {currentLevel ? formatBlindLevel(currentLevel) : 'N/A'}
            </p>
          </div>
          <div className="text-right">
            <p className={`text-xs uppercase tracking-wide mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Time Left
            </p>
            <p className={`font-mono font-semibold text-xl ${
              tournament.status === 'running' && displayTime <= 60
                ? 'text-red-500 animate-pulse'
                : tournament.status === 'running'
                  ? 'text-accent-500'
                  : theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {formatTime(displayTime)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{activePlayers}/{totalPlayers} players</span>
        </div>
        
        <button
          onClick={handleDelete}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'hover:bg-red-500/20 text-gray-500 hover:text-red-400'
              : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
          }`}
          title="Delete tournament"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </Link>
  )
}

