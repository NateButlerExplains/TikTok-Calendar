import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { useCalendarData } from '../hooks/useCalendarData'
import { getTodayString, addDays, formatDateHeader } from '../utils/timeUtils'
import { GuestCard } from './GuestCard'
import { SoloTalkCard } from './SoloTalkCard'
import { OpenFloorCard } from './OpenFloorCard'
import styles from './ThreeDayView.module.css'

export function ThreeDayView({ initialDate = null, onDateChange = null }) {
  const [centerDate, setCenterDate] = useState(initialDate || getTodayString())

  const yesterdayDate = addDays(centerDate, -1)
  const tomorrowDate = addDays(centerDate, 1)

  const yesterdayData = useCalendarData(yesterdayDate)
  const todayData = useCalendarData(centerDate)
  const tomorrowData = useCalendarData(tomorrowDate)

  const handlePrevDay = () => {
    const newDate = addDays(centerDate, -1)
    setCenterDate(newDate)
    onDateChange?.(newDate)
  }

  const handleNextDay = () => {
    const newDate = addDays(centerDate, 1)
    setCenterDate(newDate)
    onDateChange?.(newDate)
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextDay,
    onSwipedRight: handlePrevDay,
    trackMouse: true
  })

  const renderDay = (dayData, dateString, isCenter) => {
    return (
      <div key={dateString} className={`${styles.dayColumn} ${isCenter ? styles.center : ''}`}>
        <h3 className={`heading-3 ${styles.dayLabel}`}>{formatDateHeader(dateString)}</h3>

        <div className={styles.card}>
          {dayData.dayType === 'guest' && dayData.guests.length > 0 && (
            <GuestCard guest={dayData.guests[0]} time={dayData.time} isPastDate={dayData.isPastDate} />
          )}

          {dayData.dayType === 'solo-talk' && (
            <SoloTalkCard topic={dayData.topic} time={dayData.time} isPastDate={dayData.isPastDate} />
          )}

          {dayData.dayType === 'open-floor' && (
            <OpenFloorCard time={dayData.time} isPastDate={dayData.isPastDate} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container} {...swipeHandlers}>
      <header className={styles.header}>
        <h1 className="heading-1">Cyber Talks Calendar</h1>
        <p className={`body-sm muted ${styles.subtitle}`}>3-Day View</p>
      </header>

      <main className={styles.main}>
        <div className={styles.dayGrid}>
          {yesterdayData && renderDay(yesterdayData, yesterdayDate, false)}
          {todayData && renderDay(todayData, centerDate, true)}
          {tomorrowData && renderDay(tomorrowData, tomorrowDate, false)}
        </div>

        <div className={styles.controls}>
          <button className={styles.navButton} onClick={handlePrevDay} aria-label="Previous day">
            ← Prev
          </button>
          <button className={styles.navButton} onClick={handleNextDay} aria-label="Next day">
            Next →
          </button>
        </div>
      </main>
    </div>
  )
}
