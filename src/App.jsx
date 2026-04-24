// ===================
// © AngelaMos | 2026
// App.jsx
// ===================

import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Footer } from './components/Footer'
import { MonthlyCalendar } from './components/MonthlyCalendar'
import { DateNavigator } from './components/DateNavigator'
import { DayCard } from './components/DayCard'
import { ShareButton } from './components/ShareButton'
import { DownloadIcsButton } from './components/DownloadIcsButton'
import { BookingModal } from './components/BookingModal'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { TermsOfService } from './pages/TermsOfService'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { AdminPage } from './pages/Admin'
import { getTodayString } from './utils/timeUtils'
import { useEvents, useConfig } from './hooks/useEvents'
import { logCustomEvent } from './firebase'
import styles from './App.module.css'

function HomePage({ selectedDate, onDateChange, onRequestBooking, events, config }) {
  const bookedCount = (events || []).filter((e) => e.status === 'published' && e.dayType === 'guest').length
  const pendingCount = (events || []).filter((e) => e.status === 'pending').length

  return (
    <>
      <header className={styles.appHeader}>
        <div className={styles.topStrip}>
          <span className={styles.topStripLeft}>
            <span className={styles.liveDot} />
            <span>CYB-TRNS-01 / BROADCAST OPS</span>
          </span>
          <span className={styles.topStripRight}>
            <span>EST. 2026</span>
          </span>
        </div>

        <div className={styles.titleBlock}>
          <div className={styles.titleKicker}>
            TRANSMISSION SCHEDULE <em>//</em> UNIT 01
          </div>
          <h1 className={styles.title}>
            Cyber <span className={styles.titleAccent}>Talks</span>
            <sup className={styles.titleMark}>(R)</sup>
          </h1>
        </div>

        <div className={styles.subtitleRow}>
          <div className={styles.subtitle}>
            Nightly broadcasts with Nate Butler &mdash; reserve a slot, go live on TikTok.
          </div>
          <div className={styles.subtitleMeta}>
            <span>BOOKED <b>{String(bookedCount).padStart(2, '0')}</b></span>
            <span>PENDING <b>{String(pendingCount).padStart(2, '0')}</b></span>
          </div>
        </div>

        {config?.bookingLocked && (
          <div className={styles.lockBanner}>PUBLIC BOOKING &middot; LOCKED</div>
        )}
      </header>

      <main className={styles.mainContent}>
        <section className={styles.calendarSection}>
          <DateNavigator selectedDate={selectedDate} onDateChange={onDateChange} />
          <MonthlyCalendar
            selectedDate={selectedDate}
            onDayClick={onDateChange}
            events={events}
          />
        </section>

        <section className={styles.cardSection}>
          <DayCard
            date={selectedDate}
            events={events}
            config={config}
            onRequestBooking={onRequestBooking}
          />
        </section>

        <section className={styles.actionsSection}>
          <ShareButton date={selectedDate} events={events} />
          <DownloadIcsButton date={selectedDate} events={events} />
        </section>
      </main>
    </>
  )
}

function App() {
  const [selectedDate, setSelectedDate] = useState(getTodayString())
  const [bookingDate, setBookingDate] = useState(null)
  const { events } = useEvents()
  const config = useConfig()

  useEffect(() => {
    const parseParams = () => {
      const params = new URLSearchParams(window.location.search)
      const dateParam = params.get('date')
      if (dateParam) setSelectedDate(dateParam)
    }

    parseParams()
    window.addEventListener('popstate', parseParams)
    return () => window.removeEventListener('popstate', parseParams)
  }, [])

  const handleDateChange = (date) => {
    setSelectedDate(date)
    const params = new URLSearchParams(window.location.search)
    params.set('date', date)
    window.history.replaceState(null, '', `?${params.toString()}`)
    logCustomEvent('date_selected', { date })
  }

  const handleRequestBooking = (date) => {
    setBookingDate(date)
    logCustomEvent('booking_modal_opened', { date })
  }

  return (
    <BrowserRouter>
      <div className={styles.appContainer}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                onRequestBooking={handleRequestBooking}
                events={events}
                config={config}
              />
            }
          />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <Footer />

        {bookingDate && (
          <BookingModal date={bookingDate} onClose={() => setBookingDate(null)} />
        )}
      </div>
    </BrowserRouter>
  )
}

export default App
