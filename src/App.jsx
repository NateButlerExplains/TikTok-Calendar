import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Footer } from './components/Footer'
import { MonthlyCalendar } from './components/MonthlyCalendar'
import { DateNavigator } from './components/DateNavigator'
import { DayCard } from './components/DayCard'
import { ShareButton } from './components/ShareButton'
import { DownloadIcsButton } from './components/DownloadIcsButton'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { TermsOfService } from './pages/TermsOfService'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { getTodayString } from './utils/timeUtils'
import { logCustomEvent } from './firebase'
import styles from './App.module.css'

function App() {
  const [selectedDate, setSelectedDate] = useState(getTodayString())

  // Parse query params on mount
  useEffect(() => {
    const parseParams = () => {
      const params = new URLSearchParams(window.location.search)
      const dateParam = params.get('date')

      if (dateParam) {
        setSelectedDate(dateParam)
      }
    }

    parseParams()

    // Handle browser back/forward
    window.addEventListener('popstate', parseParams)
    return () => window.removeEventListener('popstate', parseParams)
  }, [])

  // Sync state to URL when it changes
  const handleDateChange = (date) => {
    setSelectedDate(date)
    const params = new URLSearchParams(window.location.search)
    params.set('date', date)
    window.history.replaceState(null, '', `?${params.toString()}`)

    logCustomEvent('date_selected', { date })
  }

  return (
    <BrowserRouter>
      <div className={styles.appContainer}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <header className={styles.appHeader}>
                  <div className={styles.titleBlock}>
                    <span className={styles.titleKicker}>Live Broadcast &middot; <em>CYBER</em></span>
                    <h1>
                      Cyber <span className={styles.titleAccent}>Talks</span>
                      <span className={styles.titleMark}>LIVE</span>
                    </h1>
                  </div>
                </header>

                <main className={styles.mainContent}>
                  <section className={styles.calendarSection}>
                    <DateNavigator selectedDate={selectedDate} onDateChange={handleDateChange} />
                    <MonthlyCalendar
                      selectedDate={selectedDate}
                      onDayClick={handleDateChange}
                    />
                  </section>

                  <section className={styles.cardSection}>
                    <DayCard date={selectedDate} />
                  </section>
                </main>
              </>
            }
          />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
