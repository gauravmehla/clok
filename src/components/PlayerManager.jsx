import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function PlayerManager({ players, onAdd, onRemove, onUpdate }) {
  const { theme } = useTheme()
  const [newPlayerName, setNewPlayerName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (newPlayerName.trim()) {
      onAdd(newPlayerName.trim())
      setNewPlayerName('')
    }
  }

  const handleStartEdit = (player) => {
    setEditingId(player.id)
    setEditingName(player.name)
  }

  const handleSaveEdit = () => {
    if (editingName.trim() && editingId) {
      onUpdate(editingId, editingName.trim())
    }
    setEditingId(null)
    setEditingName('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  return (
    <div className="space-y-4">
      {/* Add Player Form */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="Enter player name"
          className={`flex-1 px-4 py-2 rounded-xl ${
            theme === 'dark'
              ? 'bg-gray-800 text-white placeholder-gray-500 border-gray-700'
              : 'bg-white text-gray-900 placeholder-gray-400 border-gray-300'
          } border focus:outline-none focus:ring-2 focus:ring-accent-500`}
        />
        <button
          type="submit"
          disabled={!newPlayerName.trim()}
          className="px-4 py-2 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
        >
          Add
        </button>
      </form>

      {/* Player List */}
      {players.length > 0 ? (
        <div className={`rounded-xl border divide-y ${
          theme === 'dark' 
            ? 'border-gray-700 bg-gray-800/50 divide-gray-700' 
            : 'border-gray-200 bg-white divide-gray-100'
        }`}>
          {players.map((player, index) => (
            <div key={player.id || index} className="flex items-center gap-3 p-3">
              <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium ${
                theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}>
                {index + 1}
              </span>
              
              {editingId === (player.id || index) ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className={`flex-1 px-2 py-1 rounded ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-gray-50 text-gray-900 border-gray-300'
                    } border focus:outline-none focus:ring-2 focus:ring-accent-500`}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit()
                      if (e.key === 'Escape') handleCancelEdit()
                    }}
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="p-1 text-green-500 hover:text-green-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className={`p-1 ${theme === 'dark' ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <span className={`flex-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {typeof player === 'string' ? player : player.name}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    {onUpdate && (
                      <button
                        onClick={() => handleStartEdit(typeof player === 'string' ? { id: index, name: player } : player)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-gray-700 text-gray-500 hover:text-white'
                            : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                        }`}
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => onRemove(player.id || index)}
                      className={`p-1 rounded transition-colors ${
                        theme === 'dark'
                          ? 'hover:bg-red-500/20 text-gray-500 hover:text-red-400'
                          : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                      }`}
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-8 rounded-xl border-2 border-dashed ${
          theme === 'dark' ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'
        }`}>
          No players added yet
        </div>
      )}

      {/* Player count */}
      {players.length > 0 && (
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {players.length} player{players.length !== 1 ? 's' : ''} added
        </p>
      )}
    </div>
  )
}

