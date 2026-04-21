import { useState, useMemo, useEffect } from 'react'
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
import { getTodayString } from '../utils/timeUtils'
import { events } from '../data/events'
import styles from './MonthlyCalendar.module.css'

export function MonthlyCalendar({ selectedDate, onDayClick }) {
  const today = new Date()

  // Parse date string correctly in local timezone (not UTC)
  const [year, month, day] = selectedDate.split('-').map(Number)
  const selectedDateObj = new Date(year, month - 1, day)

  // Determine initial month to display (use correctly parsed date in local timezone)
  const [displayMonth, setDisplayMonth] = useState(selectedDateObj)

  // Update displayed month when selected date changes
  useEffect(() => {
    setDisplayMonth(selectedDateObj)
  }, [selectedDate])

  // Allow navigation to all months (no arbitrary bounds)
  const isWithinBounds = (date) => {
    // Enforce ±2 months from today for forward limit
    const monthDiff = (date.getFullYear() - today.getFullYear()) * 12 +
                      (date.getMonth() - today.getMonth())
    // Allow any past month and up to 2 months in the future
    return monthDiff <= 2
  }

  // Get all dates to display (including days from prev/next month)
  // Week starts on Sunday (weekStartsOn: 0)
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(displayMonth)
    const monthEnd = endOfMonth(displayMonth)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [displayMonth])

  // Check if a date has a GUEST event (show green dot only for guests)
  const hasGuestEvent = (dateString) => {
    const event = events.find(e => e.date === dateString)
    return event && event.dayType === 'guest' && event.guests && event.guests.length > 0
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

  const handleTodayClick = () => {
    const todayString = getTodayString()
    onDayClick(todayString)
  }

  const isNextMonthDisabled = !isWithinBounds(addMonths(displayMonth, 1))
  const isPrevMonthDisabled = !isWithinBounds(subMonths(displayMonth, 1))

  const monthYear = format(displayMonth, 'MMMM yyyy')

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.navGroup}>
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
        <button
          className={styles.todayButton}
          onClick={handleTodayClick}
          aria-label="Go to today"
        >
          Today
        </button>
      </div>

      <div className={styles.weekDays}>
        <div className={styles.weekDay}>Su</div>
        <div className={styles.weekDay}>Mo</div>
        <div className={styles.weekDay}>Tu</div>
        <div className={styles.weekDay}>We</div>
        <div className={styles.weekDay}>Th</div>
        <div className={styles.weekDay}>Fr</div>
        <div className={styles.weekDay}>Sa</div>
      </div>

      <div className={styles.grid}>
        {calendarDays.map((date) => {
          const dateString = format(date, 'yyyy-MM-dd')
          const isSelected = isSameDay(date, selectedDateObj)
          const isToday = isSameDay(date, today)
          const isCurrentMonth = isSameMonth(date, displayMonth)
          const hasGuestOnDate = hasGuestEvent(dateString)

          return (
            <button
              key={dateString}
              className={`${styles.day} ${isCurrentMonth ? '' : styles.otherMonth} ${
                isSelected ? styles.selected : ''
              } ${isToday ? styles.today : ''}`}
              onClick={() => handleDayClick(date)}
              aria-label={`${format(date, 'MMMM d, yyyy')}${hasGuestOnDate ? ' - has guest' : ''}${isToday ? ' - today' : ''}`}
              aria-pressed={isSelected}
            >
              <span className={styles.dayNumber}>{format(date, 'd')}</span>
              {hasGuestOnDate && <span className={styles.eventIndicator}>•</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
