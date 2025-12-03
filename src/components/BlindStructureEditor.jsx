import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { formatNumber } from '../utils/helpers'

export default function BlindStructureEditor({ levels, onChange }) {
  const { theme } = useTheme()
  const [editingIndex, setEditingIndex] = useState(null)

  const handleLevelChange = (index, field, value) => {
    const newLevels = [...levels]
    newLevels[index] = { ...newLevels[index], [field]: parseInt(value) || 0 }
    onChange(newLevels)
  }

  const handleDurationChange = (index, minutes) => {
    const newLevels = [...levels]
    newLevels[index] = { ...newLevels[index], duration: minutes * 60 }
    onChange(newLevels)
  }

  const addLevel = () => {
    const lastLevel = levels[levels.length - 1]
    const newLevel = lastLevel
      ? {
          smallBlind: lastLevel.smallBlind * 2,
          bigBlind: lastLevel.bigBlind * 2,
          ante: lastLevel.ante * 2,
          duration: lastLevel.duration,
        }
      : { smallBlind: 25, bigBlind: 50, ante: 0, duration: 600 }
    onChange([...levels, newLevel])
  }

  const removeLevel = (index) => {
    if (levels.length <= 1) return
    onChange(levels.filter((_, i) => i !== index))
  }

  const moveLevel = (index, direction) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= levels.length) return
    const newLevels = [...levels]
    const [moved] = newLevels.splice(index, 1)
    newLevels.splice(newIndex, 0, moved)
    onChange(newLevels)
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className={`grid grid-cols-12 gap-2 text-xs font-medium uppercase tracking-wide px-2 ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
      }`}>
        <div className="col-span-1">#</div>
        <div className="col-span-2">Small Blind</div>
        <div className="col-span-2">Big Blind</div>
        <div className="col-span-2">Ante</div>
        <div className="col-span-2">Duration</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>

      {/* Levels */}
      <div className="space-y-2">
        {levels.map((level, index) => (
          <div
            key={index}
            className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl transition-colors ${
              theme === 'dark'
                ? 'bg-gray-800/50 hover:bg-gray-800'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className={`col-span-1 font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {index + 1}
            </div>

            {editingIndex === index ? (
              <>
                <input
                  type="number"
                  value={level.smallBlind}
                  onChange={(e) => handleLevelChange(index, 'smallBlind', e.target.value)}
                  className={`col-span-2 px-2 py-1 rounded-lg text-sm font-mono ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-accent-500`}
                />
                <input
                  type="number"
                  value={level.bigBlind}
                  onChange={(e) => handleLevelChange(index, 'bigBlind', e.target.value)}
                  className={`col-span-2 px-2 py-1 rounded-lg text-sm font-mono ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-accent-500`}
                />
                <input
                  type="number"
                  value={level.ante}
                  onChange={(e) => handleLevelChange(index, 'ante', e.target.value)}
                  className={`col-span-2 px-2 py-1 rounded-lg text-sm font-mono ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-accent-500`}
                />
                <input
                  type="number"
                  value={Math.floor(level.duration / 60)}
                  onChange={(e) => handleDurationChange(index, e.target.value)}
                  className={`col-span-2 px-2 py-1 rounded-lg text-sm font-mono ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white border-gray-600'
                      : 'bg-white text-gray-900 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-accent-500`}
                  min="1"
                />
              </>
            ) : (
              <>
                <div className={`col-span-2 font-mono text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {formatNumber(level.smallBlind)}
                </div>
                <div className={`col-span-2 font-mono text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {formatNumber(level.bigBlind)}
                </div>
                <div className={`col-span-2 font-mono text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {level.ante > 0 ? formatNumber(level.ante) : '-'}
                </div>
                <div className={`col-span-2 font-mono text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {Math.floor(level.duration / 60)}m
                </div>
              </>
            )}

            <div className="col-span-3 flex items-center justify-end gap-1">
              <button
                onClick={() => moveLevel(index, -1)}
                disabled={index === 0}
                className={`p-1 rounded transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-500 hover:text-white disabled:opacity-30'
                    : 'hover:bg-gray-200 text-gray-400 hover:text-gray-700 disabled:opacity-30'
                }`}
                title="Move up"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => moveLevel(index, 1)}
                disabled={index === levels.length - 1}
                className={`p-1 rounded transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-gray-700 text-gray-500 hover:text-white disabled:opacity-30'
                    : 'hover:bg-gray-200 text-gray-400 hover:text-gray-700 disabled:opacity-30'
                }`}
                title="Move down"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                className={`p-1 rounded transition-colors ${
                  editingIndex === index
                    ? 'bg-accent-500 text-white'
                    : theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-500 hover:text-white'
                      : 'hover:bg-gray-200 text-gray-400 hover:text-gray-700'
                }`}
                title={editingIndex === index ? 'Done editing' : 'Edit'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {editingIndex === index ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  )}
                </svg>
              </button>
              <button
                onClick={() => removeLevel(index)}
                disabled={levels.length <= 1}
                className={`p-1 rounded transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-red-500/20 text-gray-500 hover:text-red-400 disabled:opacity-30'
                    : 'hover:bg-red-50 text-gray-400 hover:text-red-500 disabled:opacity-30'
                }`}
                title="Remove level"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Level Button */}
      <button
        onClick={addLevel}
        className={`w-full py-3 rounded-xl border-2 border-dashed transition-colors ${
          theme === 'dark'
            ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50 text-gray-400'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-500'
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Level
        </span>
      </button>
    </div>
  )
}

