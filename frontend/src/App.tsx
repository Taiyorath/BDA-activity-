import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import AppShell from './components/layout/AppShell'
import Overview from './pages/Overview'
import AccidentAnalytics from './pages/AccidentAnalytics'
import BlackSpotDetection from './pages/BlackSpotDetection'
import TimeAnalysis from './pages/TimeAnalysis'
import WeatherAnalysis from './pages/WeatherAnalysis'
import SeverityAnalysis from './pages/SeverityAnalysis'
import HadoopOperations from './pages/HadoopOperations'
import DataManagement from './pages/DataManagement'
import About from './pages/About'

export default function App() {
  const theme = useAppStore(s => s.theme)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview"   element={<Overview />} />
        <Route path="analytics"  element={<AccidentAnalytics />} />
        <Route path="blackspots" element={<BlackSpotDetection />} />
        <Route path="time"       element={<TimeAnalysis />} />
        <Route path="weather"    element={<WeatherAnalysis />} />
        <Route path="severity"   element={<SeverityAnalysis />} />
        <Route path="hadoop"     element={<HadoopOperations />} />
        <Route path="data"       element={<DataManagement />} />
        <Route path="about"      element={<About />} />
      </Route>
    </Routes>
  )
}

