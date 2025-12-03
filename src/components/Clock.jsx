import { useTheme } from '../context/ThemeContext'
import { formatTime } from '../utils/helpers'

export default function Clock({ timeRemaining, totalTime, isRunning, isWarning }) {
  const { theme } = useTheme()
  
  // Calculate progress percentage
  const progress = totalTime > 0 ? ((totalTime - timeRemaining) / totalTime) * 100 : 0
  
  // Determine color based on state
  const getClockColor = () => {
    if (isWarning) return 'text-red-500'
    if (isRunning) return 'text-accent-500'
    return theme === 'dark' ? 'text-white' : 'text-gray-900'
  }

  return (
    <div className="relative">
      {/* Progress Ring Background */}
      <div className="relative w-full max-w-md mx-auto aspect-square">
        {/* SVG Progress Ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="2"
            className={theme === 'dark' ? 'stroke-gray-800' : 'stroke-gray-200'}
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.83} 283`}
            className={`transition-all duration-1000 ${
              isWarning ? 'stroke-red-500' : 'stroke-accent-500'
            }`}
          />
        </svg>

        {/* Clock Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={`font-mono font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight transition-colors ${getClockColor()} ${
              isWarning ? 'animate-pulse-warning' : ''
            }`}
          >
            {formatTime(timeRemaining)}
          </div>
          
          {/* Status indicator */}
          {isRunning && (
            <div className="flex items-center gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Running
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

