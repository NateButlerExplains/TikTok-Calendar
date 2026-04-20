import { useState, useEffect } from 'react'
import { CalendarHeader } from './components/CalendarHeader'
import { DayView } from './components/DayView'
import { ThreeDayView } from './components/ThreeDayView'
import { getTodayString } from './utils/timeUtils'
import { logCustomEvent } from './firebase'

function App() {
  const [currentView, setCurrentView] = useState('day')
  const [currentDate, setCurrentDate] = useState(getTodayString())

  // Parse query params on mount
  useEffect(() => {
    const parseParams = () => {
      const params = new URLSearchParams(window.location.search)
      const dateParam = params.get('date')
      const viewParam = params.get('view')

      if (dateParam) {
        setCurrentDate(dateParam)
      }
      if (viewParam && (viewParam === 'day' || viewParam === 'three-day')) {
        setCurrentView(viewParam)
      }
    }

    parseParams()

    // Handle browser back/forward
    window.addEventListener('popstate', parseParams)
    return () => window.removeEventListener('popstate', parseParams)
  }, [])

  // Sync state to URL when it changes
  const handleDateChange = (date) => {
    setCurrentDate(date)
    const params = new URLSearchParams(window.location.search)
    params.set('date', date)
    window.history.replaceState(null, '', `?${params.toString()}`)
  }

  const handleViewChange = (view) => {
    setCurrentView(view)
    const params = new URLSearchParams(window.location.search)
    params.set('view', view)
    window.history.replaceState(null, '', `?${params.toString()}`)

    // Log analytics event
    try {
      logCustomEvent('switch_view', {
        from: currentView,
        to: view
      })
    } catch (error) {
      console.error('Failed to log analytics event:', error)
    }
  }

  return (
    <div>
      <CalendarHeader
        currentView={currentView}
        currentDate={currentDate}
        onViewChange={handleViewChange}
        onDateChange={handleDateChange}
      />

      {currentView === 'day' && (
        <DayView
          key={currentDate}
          initialDate={currentDate}
          onDateChange={handleDateChange}
        />
      )}

      {currentView === 'three-day' && (
        <ThreeDayView
          key={currentDate}
          initialDate={currentDate}
          onDateChange={handleDateChange}
        />
      )}
    </div>
  )
}

export default App
