import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { useCalendarData } from '../hooks/useCalendarData'
import { getTodayString, addDays, formatDateHeader } from '../utils/timeUtils'
import { downloadIcs } from '../utils/icsGenerator'
import { GuestCard } from './GuestCard'
import { SoloTalkCard } from './SoloTalkCard'
import { OpenFloorCard } from './OpenFloorCard'
import styles from './DayView.module.css'

export function DayView({ initialDate = null, onDateChange = null, onViewChange = null }) {
  const [currentDate, setCurrentDate] = useState(initialDate || getTodayString())
  const dayData = useCalendarData(currentDate)

  const handlePrevDay = () => {
    const newDate = addDays(currentDate, -1)
    setCurrentDate(newDate)
    onDateChange?.(newDate)
  }

  const handleNextDay = () => {
    const newDate = addDays(currentDate, 1)
    setCurrentDate(newDate)
    onDateChange?.(newDate)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/?date=${currentDate}`
    try {
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownloadIcs = () => {
    downloadIcs(currentDate, dayData)
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextDay,
    onSwipedRight: handlePrevDay,
    trackMouse: true
  })

  if (!dayData) {
    return <div className={styles.container}>Loading...</div>
  }

  return (
    <div className={styles.container} {...swipeHandlers}>
      <header className={styles.header}>
        <h1 className="heading-1">Cyber Talks Calendar</h1>
        <p className={`body-sm muted ${styles.date}`}>{formatDateHeader(currentDate)}</p>
      </header>

      <main className={`center ${styles.main}`}>
        {dayData.dayType === 'guest' && dayData.guests.length > 0 && (
          <div className={styles.cardContainer}>
            {dayData.guests.map((guest, idx) => (
              <GuestCard key={idx} guest={guest} time={dayData.time} isPastDate={dayData.isPastDate} />
            ))}
          </div>
        )}

        {dayData.dayType === 'solo-talk' && (
          <div className={styles.cardContainer}>
            <SoloTalkCard topic={dayData.topic} time={dayData.time} isPastDate={dayData.isPastDate} />
          </div>
        )}

        {dayData.dayType === 'open-floor' && (
          <div className={styles.cardContainer}>
            <OpenFloorCard time={dayData.time} isPastDate={dayData.isPastDate} />
          </div>
        )}

        <div className={styles.controls}>
          <button className={styles.navButton} onClick={handlePrevDay} aria-label="Previous day">
            ← Prev
          </button>
          <button className={styles.navButton} onClick={handleNextDay} aria-label="Next day">
            Next →
          </button>
        </div>

        <div className={styles.actions}>
          <button className={styles.actionButton} onClick={handleShare}>
            📋 Copy Link
          </button>
          <button className={styles.actionButton} onClick={handleDownloadIcs}>
            📥 Download .ics
          </button>
        </div>
      </main>
    </div>
  )
}
