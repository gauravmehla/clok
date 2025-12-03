import { Routes, Route } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'
import HomePage from './pages/HomePage'
import CreateTimer from './pages/CreateTimer'
import TimerView from './pages/TimerView'
import SettingsPage from './pages/SettingsPage'

function App() {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateTimer />} />
        <Route path="/timer/:id" element={<TimerView />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  )
}

export default App
