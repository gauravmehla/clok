import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const themeOptions = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
]

const accentColorOptions = [
  { value: 'emerald', label: 'Emerald', class: 'bg-emerald-500' },
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'amber', label: 'Amber', class: 'bg-amber-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'rose', label: 'Rose', class: 'bg-rose-500' },
  { value: 'cyan', label: 'Cyan', class: 'bg-cyan-500' },
]

export default function SettingsPage() {
  const { settings, updateSettings, theme } = useTheme()

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Settings
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Theme Section */}
        <section className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Theme
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateSettings({ theme: option.value })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  settings.theme === option.value
                    ? 'border-accent-500 bg-accent-500/10'
                    : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <div className={`font-medium ${
                  settings.theme === option.value
                    ? 'text-accent-500'
                    : theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {option.label}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Accent Color Section */}
        <section className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Accent Color
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {accentColorOptions.map((color) => (
              <button
                key={color.value}
                onClick={() => updateSettings({ accentColor: color.value })}
                className={`aspect-square rounded-xl transition-all flex items-center justify-center ${color.class} ${
                  settings.accentColor === color.value
                    ? 'ring-4 ring-offset-2 ring-offset-gray-900 ring-white scale-110'
                    : 'hover:scale-105'
                }`}
                title={color.label}
              >
                {settings.accentColor === color.value && (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <p className={`mt-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            The accent color is used for buttons, highlights, and important information throughout the app.
          </p>
        </section>

        {/* About Section */}
        <section className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            About
          </h2>
          <div className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>
              <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Poker Timer</strong> — A tournament timer for home poker games.
            </p>
            <p>
              All data is stored locally in your browser. No account required.
            </p>
          </div>
        </section>

        {/* Future Settings Placeholder */}
        <section className={`rounded-2xl p-6 border-2 border-dashed ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800/20' : 'border-gray-300 bg-gray-50'
        }`}>
          <div className={`text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <p className="font-medium">More settings coming soon</p>
            <p className="text-sm mt-1">Audio alerts, default blind structures, and more...</p>
          </div>
        </section>
      </main>
    </div>
  )
}

