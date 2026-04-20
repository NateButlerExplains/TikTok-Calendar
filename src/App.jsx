import { useState } from 'react'
import { DayView } from './components/DayView'
import { ThreeDayView } from './components/ThreeDayView'

function App() {
  const [view, setView] = useState('day')

  return (
    <div>
      {view === 'day' && (
        <DayView
          onDateChange={(date) => console.log('Date changed to:', date)}
          onViewChange={(newView) => setView(newView)}
        />
      )}

      {view === '3day' && (
        <ThreeDayView
          onDateChange={(date) => console.log('Date changed to:', date)}
        />
      )}

      <div style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 100
      }}>
        <button
          onClick={() => setView('day')}
          style={{
            padding: '0.5rem 1rem',
            background: view === 'day' ? '#00f5ff' : '#1a1a2e',
            color: view === 'day' ? '#0a0a0f' : '#00f5ff',
            border: '1px solid #00f5ff',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Day
        </button>
        <button
          onClick={() => setView('3day')}
          style={{
            padding: '0.5rem 1rem',
            background: view === '3day' ? '#00f5ff' : '#1a1a2e',
            color: view === '3day' ? '#0a0a0f' : '#00f5ff',
            border: '1px solid #00f5ff',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          3-Day
        </button>
      </div>
    </div>
  )
}

export default App
