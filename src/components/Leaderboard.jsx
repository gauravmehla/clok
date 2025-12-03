import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { sortPlayersForLeaderboard } from '../utils/helpers'
import TrophyBadge from './TrophyBadge'

export default function Leaderboard({
  players,
  onBust,
  onUnbust,
  onRemove,
  isFinished,
  onAddPlayer,
}) {
  const { theme } = useTheme()
  const [confirmBust, setConfirmBust] = useState(null)
  
  const sortedPlayers = sortPlayersForLeaderboard(players)
  const activePlayers = players.filter(p => p.bustedAt === null)
  const bustedPlayers = players.filter(p => p.bustedAt !== null)

  // Calculate positions for display
  const totalPlayers = players.length
  const getDisplayPosition = (player) => {
    if (player.position) return player.position
    if (player.bustedAt === null && isFinished && activePlayers.length === 1) return 1
    return null
  }

  const handleBustClick = (playerId) => {
    if (confirmBust === playerId) {
      onBust(playerId)
      setConfirmBust(null)
    } else {
      setConfirmBust(playerId)
      // Auto-dismiss confirmation after 3 seconds
      setTimeout(() => setConfirmBust(null), 3000)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <h2 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Leaderboard
          </h2>
          <button
            onClick={onAddPlayer}
            className={`p-1.5 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
            title="Add player"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </button>
        </div>
        <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {activePlayers.length} active • {bustedPlayers.length} busted
        </div>
      </div>

      {/* Player List */}
      <div className="flex-1 overflow-y-auto">
        {players.length === 0 ? (
          <div className={`p-8 text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>No players yet</p>
            <button
              onClick={onAddPlayer}
              className="mt-3 text-accent-500 hover:underline text-sm"
            >
              Add players
            </button>
          </div>
        ) : (
          <>
            {/* Active Players */}
            {activePlayers.length > 0 && (
              <div className="p-2">
                <div className={`text-xs uppercase tracking-wide px-2 py-1 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Active Players
                </div>
                {sortedPlayers.filter(p => p.bustedAt === null).map((player) => {
                  const position = getDisplayPosition(player)
                  const isWinner = position === 1 && isFinished
                  
                  return (
                    <div
                      key={player.id}
                      className={`group flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        isWinner
                          ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10'
                          : theme === 'dark'
                            ? 'hover:bg-gray-800/50'
                            : 'hover:bg-gray-100'
                      }`}
                    >
                      {isWinner && <TrophyBadge position={1} />}
                      
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium truncate ${
                          isWinner
                            ? 'text-amber-500'
                            : theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {player.name}
                          {isWinner && <span className="ml-2 text-sm">Winner!</span>}
                        </div>
                      </div>

                      {!isFinished && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleBustClick(player.id)}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              confirmBust === player.id
                                ? 'bg-red-500 text-white'
                                : theme === 'dark'
                                  ? 'bg-gray-700 hover:bg-red-500/20 text-gray-400 hover:text-red-400'
                                  : 'bg-gray-200 hover:bg-red-50 text-gray-500 hover:text-red-500'
                            }`}
                          >
                            {confirmBust === player.id ? 'Confirm?' : 'Bust'}
                          </button>
                          <button
                            onClick={() => onRemove(player.id)}
                            className={`p-1 rounded transition-colors ${
                              theme === 'dark'
                                ? 'hover:bg-gray-700 text-gray-500 hover:text-white'
                                : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'
                            }`}
                            title="Remove player"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Busted Players */}
            {bustedPlayers.length > 0 && (
              <div className={`p-2 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className={`text-xs uppercase tracking-wide px-2 py-1 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Busted
                </div>
                {sortedPlayers.filter(p => p.bustedAt !== null).map((player) => {
                  const position = player.position || (totalPlayers - bustedPlayers.indexOf(player))
                  
                  return (
                    <div
                      key={player.id}
                      className={`group flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        theme === 'dark' ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'
                      }`}
                    >
                      {position <= 3 && isFinished ? (
                        <TrophyBadge position={position} />
                      ) : (
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          theme === 'dark' ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                        }`}>
                          {position}
                        </span>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium truncate line-through ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {player.name}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onUnbust(player.id)}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                            theme === 'dark'
                              ? 'bg-gray-700 hover:bg-green-500/20 text-gray-400 hover:text-green-400'
                              : 'bg-gray-200 hover:bg-green-50 text-gray-500 hover:text-green-500'
                          }`}
                        >
                          Undo
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Summary Footer */}
      {players.length > 0 && (
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {activePlayers.length}
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Remaining
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {bustedPlayers.length}
              </div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Busted
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

