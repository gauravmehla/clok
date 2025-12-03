import { createContext, useContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const ThemeContext = createContext()

// Accent color definitions with RGB values for CSS variables
const accentColors = {
  emerald: {
    50: '236 253 245',
    100: '209 250 229',
    200: '167 243 208',
    300: '110 231 183',
    400: '52 211 153',
    500: '16 185 129',
    600: '5 150 105',
    700: '4 120 87',
    800: '6 95 70',
    900: '4 78 56',
  },
  blue: {
    50: '239 246 255',
    100: '219 234 254',
    200: '191 219 254',
    300: '147 197 253',
    400: '96 165 250',
    500: '59 130 246',
    600: '37 99 235',
    700: '29 78 216',
    800: '30 64 175',
    900: '30 58 138',
  },
  red: {
    50: '254 242 242',
    100: '254 226 226',
    200: '254 202 202',
    300: '252 165 165',
    400: '248 113 113',
    500: '239 68 68',
    600: '220 38 38',
    700: '185 28 28',
    800: '153 27 27',
    900: '127 29 29',
  },
  amber: {
    50: '255 251 235',
    100: '254 243 199',
    200: '253 230 138',
    300: '252 211 77',
    400: '251 191 36',
    500: '245 158 11',
    600: '217 119 6',
    700: '180 83 9',
    800: '146 64 14',
    900: '120 53 15',
  },
  purple: {
    50: '250 245 255',
    100: '243 232 255',
    200: '233 213 255',
    300: '216 180 254',
    400: '192 132 252',
    500: '168 85 247',
    600: '147 51 234',
    700: '126 34 206',
    800: '107 33 168',
    900: '88 28 135',
  },
  rose: {
    50: '255 241 242',
    100: '255 228 230',
    200: '254 205 211',
    300: '253 164 175',
    400: '251 113 133',
    500: '244 63 94',
    600: '225 29 72',
    700: '190 18 60',
    800: '159 18 57',
    900: '136 19 55',
  },
  cyan: {
    50: '236 254 255',
    100: '207 250 254',
    200: '165 243 252',
    300: '103 232 249',
    400: '34 211 238',
    500: '6 182 212',
    600: '8 145 178',
    700: '14 116 144',
    800: '21 94 117',
    900: '22 78 99',
  },
}

const defaultSettings = {
  theme: 'system',
  accentColor: 'emerald',
}

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('poker-settings', defaultSettings)

  // Compute actual theme based on setting and system preference
  const computedTheme = (() => {
    if (settings.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return settings.theme
  })()

  // Apply theme class to document and update accent colors
  useEffect(() => {
    const root = document.documentElement
    
    // Apply dark/light class
    if (computedTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Apply accent color CSS variables
    const accent = accentColors[settings.accentColor] || accentColors.emerald
    Object.entries(accent).forEach(([key, value]) => {
      root.style.setProperty(`--accent-${key}`, value)
    })
  }, [computedTheme, settings.accentColor])

  // Listen for system theme changes
  useEffect(() => {
    if (settings.theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      // Force re-render by updating a timestamp or similar
      setSettings(prev => ({ ...prev }))
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [settings.theme, setSettings])

  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  const value = {
    settings,
    updateSettings,
    theme: computedTheme,
    accentColor: settings.accentColor,
    availableAccentColors: Object.keys(accentColors),
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

