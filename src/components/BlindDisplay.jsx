import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { formatNumber } from '../utils/helpers'

export default function BlindDisplay({
  currentLevel,
  currentLevelIndex,
  totalLevels,
  nextLevel,
  isBreak,
  onAdvance,
  onPrevious,
  onSelectLevel,
}) {
  const { theme } = useTheme()
  const [showLevelPicker, setShowLevelPicker] = useState(false)

  if (isBreak) {
    return (
      <div
        className={`text-center py-8 px-6 rounded-2xl ${
          theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'
        }`}
      >
        <div className="text-4xl mb-2">☕</div>
        <div className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          BREAK TIME
        </div>
        <div className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Take a break, stretch, grab a drink
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Main blind display with navigation buttons */}
      <div className="flex items-center gap-4">
        {/* Previous Level Button */}
        <button
          onClick={onPrevious}
          disabled={currentLevelIndex === 0}
          className={`p-3 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            theme === 'dark'
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-700'
          }`}
          title="Previous level"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Current Level Display */}
        <div
          className={`flex-1 relative rounded-2xl transition-all cursor-pointer ${
            theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => setShowLevelPicker(!showLevelPicker)}
        >
          <div className="text-center py-6 px-6">
            <div className={`text-sm uppercase tracking-wider mb-2 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Level {currentLevelIndex + 1} of {totalLevels}
              <span className="ml-2 text-xs">(click to jump)</span>
            </div>
            
            {currentLevel && (
              <div className="space-y-2">
                <div className={`text-4xl sm:text-5xl font-bold font-mono ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {formatNumber(currentLevel.smallBlind)} / {formatNumber(currentLevel.bigBlind)}
                </div>
                
                {currentLevel.ante > 0 && (
                  <div className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Ante: {formatNumber(currentLevel.ante)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Next Level Preview */}
          {nextLevel && (
            <div className={`border-t py-4 px-6 ${
              theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-center gap-3">
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Next:
                </span>
                <span className={`font-mono font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {formatNumber(nextLevel.smallBlind)} / {formatNumber(nextLevel.bigBlind)}
                  {nextLevel.ante > 0 && ` (Ante: ${formatNumber(nextLevel.ante)})`}
                </span>
              </div>
            </div>
          )}

          {/* Level Picker Dropdown */}
          {showLevelPicker && (
            <div 
              className={`absolute left-0 right-0 top-full mt-2 max-h-48 overflow-y-auto rounded-xl shadow-xl z-20 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {Array.from({ length: totalLevels }, (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelectLevel(i)
                    setShowLevelPicker(false)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    i === currentLevelIndex
                      ? 'bg-accent-500 text-white'
                      : theme === 'dark'
                        ? 'hover:bg-gray-700 text-white'
                        : 'hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  Level {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Next Level Button */}
        <button
          onClick={onAdvance}
          disabled={currentLevelIndex >= totalLevels - 1}
          className={`p-3 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
            theme === 'dark'
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-700'
          }`}
          title="Next level"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Click outside to close level picker */}
      {showLevelPicker && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowLevelPicker(false)}
        />
      )}
    </div>
  )
}
