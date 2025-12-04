import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { getTournaments, saveTournaments, addTournament } from '../hooks/useLocalStorage'
import { importTournamentConfig } from '../utils/exportImport'
import TimerCard from '../components/TimerCard'

export default function HomePage() {
  const { theme } = useTheme()
  const [tournaments, setTournaments] = useState(() => getTournaments())
  const [importError, setImportError] = useState(null)
  const fileInputRef = useRef(null)

  const handleDelete = (id) => {
    const updated = tournaments.filter(t => t.id !== id)
    saveTournaments(updated)
    setTournaments(updated)
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setImportError(null)
      const tournament = await importTournamentConfig(file)
      addTournament(tournament)
      setTournaments(getTournaments())
    } catch (error) {
      setImportError(error.message)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Separate running, paused, and finished tournaments
  const runningTournaments = tournaments.filter(t => t.status === 'running')
  const pausedTournaments = tournaments.filter(t => t.status === 'paused')
  const finishedTournaments = tournaments.filter(t => t.status === 'finished')

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`border-b ${theme === 'dark' ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-white/80'} backdrop-blur-sm sticky top-0 z-10`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center">
              <span className="text-white text-xl">♠</span>
            </div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Pokerlab Timer
            </h1>
          </div>
          
          <Link
            to="/settings"
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            title="Settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-accent-500/25"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Tournament
          </Link>
          
          <label className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-colors cursor-pointer ${
            theme === 'dark'
              ? 'bg-gray-800 hover:bg-gray-700 text-white'
              : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import Config
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {/* Import Error */}
        {importError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">Import failed</p>
                <p className="text-sm opacity-80">{importError}</p>
              </div>
              <button
                onClick={() => setImportError(null)}
                className="ml-auto p-1 hover:bg-red-500/20 rounded"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Tournament Lists */}
        {tournaments.length === 0 ? (
          <div className={`text-center py-20 rounded-2xl border-2 border-dashed ${
            theme === 'dark' ? 'border-gray-700 bg-gray-800/20' : 'border-gray-300 bg-gray-50'
          }`}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent-500/10 flex items-center justify-center">
              <span className="text-3xl">♠</span>
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              No tournaments yet
            </h3>
            <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Create your first tournament to get started
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Tournament
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Running Tournaments */}
            {runningTournaments.length > 0 && (
              <section>
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Running
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {runningTournaments.map(tournament => (
                    <TimerCard key={tournament.id} tournament={tournament} onDelete={handleDelete} />
                  ))}
                </div>
              </section>
            )}

            {/* Paused Tournaments */}
            {pausedTournaments.length > 0 && (
              <section>
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Paused
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pausedTournaments.map(tournament => (
                    <TimerCard key={tournament.id} tournament={tournament} onDelete={handleDelete} />
                  ))}
                </div>
              </section>
            )}

            {/* Finished Tournaments */}
            {finishedTournaments.length > 0 && (
              <section>
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  <span className="w-2 h-2 rounded-full bg-gray-500" />
                  Finished
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {finishedTournaments.map(tournament => (
                    <TimerCard key={tournament.id} tournament={tournament} onDelete={handleDelete} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

