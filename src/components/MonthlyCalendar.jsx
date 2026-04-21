import { useState, useMemo } from 'react'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths
} from 'date-fns'
import { events } from '../data/events'
import styles from './MonthlyCalendar.module.css'

export function MonthlyCalendar({ selectedDate, onDayClick }) {
  const today = new Date()
  const selectedDateObj = new Date(selectedDate)

  // Determine initial month to display
  const [displayMonth, setDisplayMonth] = useState(new Date(selectedDate))

  // Check if a date is within ±2 months from today
  const isWithinBounds = (date) => {
    const monthDiff = (date.getFullYear() - today.getFullYear()) * 12 +
                      (date.getMonth() - today.getMonth())
    return monthDiff >= -2 && monthDiff <= 2
  }

  // Get all dates to display (including days from prev/next month)
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(displayMonth)
    const monthEnd = endOfMonth(displayMonth)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [displayMonth])

  // Check if a date has an event
  const hasEvent = (dateString) => {
    return events.some(e => e.date === dateString)
  }

  const handlePrevMonth = () => {
    const newMonth = subMonths(displayMonth, 1)
    if (isWithinBounds(newMonth)) {
      setDisplayMonth(newMonth)
    }
  }

  const handleNextMonth = () => {
    const newMonth = addMonths(displayMonth, 1)
    if (isWithinBounds(newMonth)) {
      setDisplayMonth(newMonth)
    }
  }

  const handleDayClick = (date) => {
    // Convert date to YYYY-MM-DD format
    const dateString = format(date, 'yyyy-MM-dd')
    onDayClick(dateString)
  }

  const isNextMonthDisabled = !isWithinBounds(addMonths(displayMonth, 1))
  const isPrevMonthDisabled = !isWithinBounds(subMonths(displayMonth, 1))

  const monthYear = format(displayMonth, 'MMMM yyyy')

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.navButton}
          onClick={handlePrevMonth}
          disabled={isPrevMonthDisabled}
          aria-label="Previous month"
        >
          ← Prev
        </button>
        <h2 className={styles.monthYear}>{monthYear}</h2>
        <button
          className={styles.navButton}
          onClick={handleNextMonth}
          disabled={isNextMonthDisabled}
          aria-label="Next month"
        >
          Next →
        </button>
      </div>

      <div className={styles.weekDays}>
        <div className={styles.weekDay}>Mo</div>
        <div className={styles.weekDay}>Tu</div>
        <div className={styles.weekDay}>We</div>
        <div className={styles.weekDay}>Th</div>
        <div className={styles.weekDay}>Fr</div>
        <div className={styles.weekDay}>Sa</div>
        <div className={styles.weekDay}>Su</div>
      </div>

      <div className={styles.grid}>
        {calendarDays.map((date) => {
          const dateString = format(date, 'yyyy-MM-dd')
          const isSelected = isSameDay(date, selectedDateObj)
          const isToday = isSameDay(date, today)
          const isCurrentMonth = isSameMonth(date, displayMonth)
          const hasEventOnDate = hasEvent(dateString)

          return (
            <button
              key={dateString}
              className={`${styles.day} ${isCurrentMonth ? '' : styles.otherMonth} ${
                isSelected ? styles.selected : ''
              } ${isToday ? styles.today : ''}`}
              onClick={() => handleDayClick(date)}
              aria-label={`${format(date, 'MMMM d, yyyy')}${hasEventOnDate ? ' - has event' : ''}${isToday ? ' - today' : ''}`}
              aria-pressed={isSelected}
            >
              <span className={styles.dayNumber}>{format(date, 'd')}</span>
              {hasEventOnDate && <span className={styles.eventIndicator}>•</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
