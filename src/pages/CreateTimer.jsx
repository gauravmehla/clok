import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { blindStructurePresets } from '../data/blindStructures'
import { createTournament, formatDuration, estimateTotalTime, formatNumber } from '../utils/helpers'
import { addTournament } from '../hooks/useLocalStorage'
import BlindStructureEditor from '../components/BlindStructureEditor'

const steps = [
  { id: 'name', title: 'Tournament Name' },
  { id: 'players', title: 'Players' },
  { id: 'blinds', title: 'Blind Structure' },
  { id: 'breaks', title: 'Breaks' },
  { id: 'review', title: 'Review' },
]

export default function CreateTimer() {
  const { theme } = useTheme()
  const navigate = useNavigate()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    players: [],
    blindStructureType: 'medium',
    customLevels: null,
    breaks: [],
  })
  const [newPlayerName, setNewPlayerName] = useState('')

  // Get current blind structure levels
  const getBlindLevels = () => {
    if (formData.blindStructureType === 'custom' && formData.customLevels) {
      return formData.customLevels
    }
    return blindStructurePresets[formData.blindStructureType]?.levels || []
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAddPlayer = (e) => {
    e.preventDefault()
    if (newPlayerName.trim()) {
      setFormData(prev => ({
        ...prev,
        players: [...prev.players, newPlayerName.trim()],
      }))
      setNewPlayerName('')
    }
  }

  const handleRemovePlayer = (index) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index),
    }))
  }

  const handleBlindStructureChange = (type) => {
    if (type === 'custom' && !formData.customLevels) {
      // Initialize custom levels from current preset
      setFormData(prev => ({
        ...prev,
        blindStructureType: type,
        customLevels: [...blindStructurePresets[prev.blindStructureType].levels],
      }))
    } else {
      setFormData(prev => ({ ...prev, blindStructureType: type }))
    }
  }

  const handleCustomLevelsChange = (levels) => {
    setFormData(prev => ({ ...prev, customLevels: levels }))
  }

  const handleAddBreak = () => {
    const levels = getBlindLevels()
    const nextBreakLevel = formData.breaks.length > 0
      ? Math.max(...formData.breaks.map(b => b.afterLevel)) + 2
      : 4

    if (nextBreakLevel <= levels.length) {
      setFormData(prev => ({
        ...prev,
        breaks: [...prev.breaks, { afterLevel: nextBreakLevel, duration: 600 }],
      }))
    }
  }

  const handleBreakChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      breaks: prev.breaks.map((b, i) =>
        i === index ? { ...b, [field]: parseInt(value) || 0 } : b
      ),
    }))
  }

  const handleRemoveBreak = (index) => {
    setFormData(prev => ({
      ...prev,
      breaks: prev.breaks.filter((_, i) => i !== index),
    }))
  }

  const handleCreate = () => {
    const levels = getBlindLevels()
    const tournament = createTournament({
      name: formData.name || `Tournament ${new Date().toLocaleDateString()}`,
      players: formData.players,
      blindStructure: {
        type: formData.blindStructureType,
        levels,
      },
      breaks: formData.breaks,
    })

    addTournament(tournament)
    navigate(`/timer/${tournament.id}`)
  }

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case 'name':
        return true // Name is optional
      case 'players':
        return true // Players can be added later
      case 'blinds':
        return getBlindLevels().length > 0
      case 'breaks':
        return true // Breaks are optional
      case 'review':
        return true
      default:
        return true
    }
  }

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'name':
        return (
          <div className="max-w-md mx-auto">
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Tournament Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Friday Night Poker"
              className={`w-full px-4 py-3 rounded-xl text-lg ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white placeholder-gray-500 border-gray-700'
                  : 'bg-white text-gray-900 placeholder-gray-400 border-gray-300'
              } border focus:outline-none focus:ring-2 focus:ring-accent-500`}
              autoFocus
            />
            <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Give your tournament a memorable name, or leave blank for a default name.
            </p>
          </div>
        )

      case 'players':
        return (
          <div className="max-w-md mx-auto">
            <form onSubmit={handleAddPlayer} className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Add Players
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Player name"
                  className={`flex-1 px-4 py-3 rounded-xl ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white placeholder-gray-500 border-gray-700'
                      : 'bg-white text-gray-900 placeholder-gray-400 border-gray-300'
                  } border focus:outline-none focus:ring-2 focus:ring-accent-500`}
                />
                <button
                  type="submit"
                  disabled={!newPlayerName.trim()}
                  className="px-4 py-3 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                >
                  Add
                </button>
              </div>
            </form>

            {formData.players.length > 0 ? (
              <div className="space-y-2">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formData.players.length} player{formData.players.length !== 1 ? 's' : ''} added
                </p>
                <div className={`rounded-xl border ${theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'} divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {formData.players.map((player, index) => (
                    <div key={index} className="flex items-center justify-between px-4 py-3">
                      <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{player}</span>
                      <button
                        onClick={() => handleRemovePlayer(index)}
                        className={`p-1 rounded transition-colors ${
                          theme === 'dark'
                            ? 'hover:bg-red-500/20 text-gray-500 hover:text-red-400'
                            : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                No players added yet. You can also add players later.
              </p>
            )}
          </div>
        )

      case 'blinds':
        return (
          <div className="max-w-3xl mx-auto">
            {/* Preset Selection */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Select Blind Structure
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {Object.entries(blindStructurePresets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => handleBlindStructureChange(key)}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      formData.blindStructureType === key
                        ? 'border-accent-500 bg-accent-500/10'
                        : theme === 'dark'
                          ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className={`font-medium ${
                      formData.blindStructureType === key
                        ? 'text-accent-500'
                        : theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {preset.name}
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {preset.levelDuration}min levels
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => handleBlindStructureChange('custom')}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    formData.blindStructureType === 'custom'
                      ? 'border-accent-500 bg-accent-500/10'
                      : theme === 'dark'
                        ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className={`font-medium ${
                    formData.blindStructureType === 'custom'
                      ? 'text-accent-500'
                      : theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Custom
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Edit levels
                  </div>
                </button>
              </div>
            </div>

            {/* Level Preview/Editor */}
            <div className={`rounded-xl border p-4 ${theme === 'dark' ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-white'}`}>
              {formData.blindStructureType === 'custom' ? (
                <BlindStructureEditor
                  levels={formData.customLevels || []}
                  onChange={handleCustomLevelsChange}
                />
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className={`sticky top-0 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <tr className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        <th className="text-left py-2 px-2 font-medium">Level</th>
                        <th className="text-left py-2 px-2 font-medium">Small</th>
                        <th className="text-left py-2 px-2 font-medium">Big</th>
                        <th className="text-left py-2 px-2 font-medium">Ante</th>
                        <th className="text-left py-2 px-2 font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      {getBlindLevels().slice(0, 15).map((level, index) => (
                        <tr key={index} className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                          <td className="py-2 px-2 font-mono">{index + 1}</td>
                          <td className="py-2 px-2 font-mono">{formatNumber(level.smallBlind)}</td>
                          <td className="py-2 px-2 font-mono">{formatNumber(level.bigBlind)}</td>
                          <td className="py-2 px-2 font-mono">{level.ante > 0 ? formatNumber(level.ante) : '-'}</td>
                          <td className="py-2 px-2 font-mono">{Math.floor(level.duration / 60)}m</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {getBlindLevels().length > 15 && (
                    <p className={`text-center py-2 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      +{getBlindLevels().length - 15} more levels
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Estimated Time */}
            <p className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Estimated tournament length: {formatDuration(estimateTotalTime(getBlindLevels(), formData.breaks))}
            </p>
          </div>
        )

      case 'breaks':
        return (
          <div className="max-w-md mx-auto">
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Schedule breaks between blind levels. Breaks are optional.
            </p>

            {formData.breaks.length > 0 && (
              <div className="space-y-3 mb-6">
                {formData.breaks.map((brk, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex-1">
                      <label className={`block text-xs mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        After Level
                      </label>
                      <select
                        value={brk.afterLevel}
                        onChange={(e) => handleBreakChange(index, 'afterLevel', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-white border-gray-600'
                            : 'bg-white text-gray-900 border-gray-300'
                        } border focus:outline-none focus:ring-2 focus:ring-accent-500`}
                      >
                        {Array.from({ length: getBlindLevels().length }, (_, i) => i + 1).map(level => (
                          <option key={level} value={level}>Level {level}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className={`block text-xs mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Duration
                      </label>
                      <select
                        value={brk.duration}
                        onChange={(e) => handleBreakChange(index, 'duration', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg ${
                          theme === 'dark'
                            ? 'bg-gray-700 text-white border-gray-600'
                            : 'bg-white text-gray-900 border-gray-300'
                        } border focus:outline-none focus:ring-2 focus:ring-accent-500`}
                      >
                        <option value={300}>5 minutes</option>
                        <option value={600}>10 minutes</option>
                        <option value={900}>15 minutes</option>
                        <option value={1200}>20 minutes</option>
                      </select>
                    </div>
                    <button
                      onClick={() => handleRemoveBreak(index)}
                      className={`p-2 rounded-lg transition-colors mt-5 ${
                        theme === 'dark'
                          ? 'hover:bg-red-500/20 text-gray-500 hover:text-red-400'
                          : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleAddBreak}
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
                Add Break
              </span>
            </button>
          </div>
        )

      case 'review':
        const levels = getBlindLevels()
        return (
          <div className="max-w-md mx-auto">
            <div className={`rounded-xl border divide-y ${
              theme === 'dark' ? 'border-gray-700 bg-gray-800/50 divide-gray-700' : 'border-gray-200 bg-white divide-gray-200'
            }`}>
              <div className="p-4">
                <div className={`text-xs uppercase tracking-wide mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Tournament Name
                </div>
                <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {formData.name || `Tournament ${new Date().toLocaleDateString()}`}
                </div>
              </div>
              <div className="p-4">
                <div className={`text-xs uppercase tracking-wide mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Players
                </div>
                <div className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {formData.players.length > 0
                    ? `${formData.players.length} player${formData.players.length !== 1 ? 's' : ''}`
                    : 'No players added'}
                </div>
              </div>
              <div className="p-4">
                <div className={`text-xs uppercase tracking-wide mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Blind Structure
                </div>
                <div className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {formData.blindStructureType === 'custom'
                    ? `Custom (${levels.length} levels)`
                    : `${blindStructurePresets[formData.blindStructureType]?.name} (${levels.length} levels)`}
                </div>
              </div>
              <div className="p-4">
                <div className={`text-xs uppercase tracking-wide mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Breaks
                </div>
                <div className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {formData.breaks.length > 0
                    ? `${formData.breaks.length} break${formData.breaks.length !== 1 ? 's' : ''} scheduled`
                    : 'No breaks'}
                </div>
              </div>
              <div className="p-4">
                <div className={`text-xs uppercase tracking-wide mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Estimated Duration
                </div>
                <div className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {formatDuration(estimateTotalTime(levels, formData.breaks))}
                </div>
              </div>
            </div>

            <button
              onClick={handleCreate}
              className="w-full mt-6 py-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors text-lg shadow-lg shadow-accent-500/25"
            >
              Start Tournament
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`border-b ${theme === 'dark' ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-white/80'} backdrop-blur-sm sticky top-0 z-10`}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
          <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Create Tournament
          </h1>
        </div>
      </header>

      {/* Progress Steps */}
      <div className={`border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => index < currentStep && setCurrentStep(index)}
                  disabled={index > currentStep}
                  className={`flex items-center gap-2 ${index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      index < currentStep
                        ? 'bg-accent-500 text-white'
                        : index === currentStep
                          ? 'bg-accent-500 text-white ring-4 ring-accent-500/20'
                          : theme === 'dark'
                            ? 'bg-gray-800 text-gray-500'
                            : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {index < currentStep ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`hidden sm:block text-sm font-medium ${
                    index <= currentStep
                      ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                      : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                    index < currentStep
                      ? 'bg-accent-500'
                      : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {steps[currentStep].title}
          </h2>
        </div>

        {renderStepContent()}
      </main>

      {/* Footer Navigation */}
      {currentStep < steps.length - 1 && (
        <footer className={`fixed bottom-0 left-0 right-0 border-t ${
          theme === 'dark' ? 'border-gray-800 bg-gray-900/95' : 'border-gray-200 bg-white/95'
        } backdrop-blur-sm`}>
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`px-6 py-2 rounded-xl font-medium transition-colors disabled:opacity-0 ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-6 py-2 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
            >
              {currentStep === steps.length - 2 ? 'Review' : 'Next'}
            </button>
          </div>
        </footer>
      )}
    </div>
  )
}

