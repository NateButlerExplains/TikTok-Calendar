// ===================
// © AngelaMos | 2026
// MonthlyCalendar.jsx
// ===================

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
import { logCustomEvent } from '../firebase'
import styles from './MonthlyCalendar.module.css'

export function MonthlyCalendar({ selectedDate, onDayClick, events }) {
  const today = new Date()

  const [year, month, day] = selectedDate.split('-').map(Number)
  const selectedDateObj = new Date(year, month - 1, day)

  const [displayMonth, setDisplayMonth] = useState(selectedDateObj)

  useEffect(() => {
    setDisplayMonth(selectedDateObj)
  }, [selectedDate])

  const isWithinBounds = (date) => {
    const monthDiff = (date.getFullYear() - today.getFullYear()) * 12 +
                      (date.getMonth() - today.getMonth())
    return monthDiff <= 2
  }

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(displayMonth)
    const monthEnd = endOfMonth(displayMonth)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [displayMonth])

  const eventByDate = useMemo(() => {
    const m = new Map()
    for (const e of events || []) {
      if (e.date && e.dayType === 'guest') m.set(e.date, e)
    }
    return m
  }, [events])

  const getDateStatus = (dateString) => {
    const e = eventByDate.get(dateString)
    if (!e) return null
    if (e.status === 'pending') return 'pending'
    if (e.status === 'published') return 'booked'
    return null
  }

  const handlePrevMonth = () => {
    const newMonth = subMonths(displayMonth, 1)
    if (isWithinBounds(newMonth)) {
      setDisplayMonth(newMonth)
      logCustomEvent('month_changed', { direction: 'prev', month_year: format(newMonth, 'MMMM yyyy') })
    }
  }

  const handleNextMonth = () => {
    const newMonth = addMonths(displayMonth, 1)
    if (isWithinBounds(newMonth)) {
      setDisplayMonth(newMonth)
      logCustomEvent('month_changed', { direction: 'next', month_year: format(newMonth, 'MMMM yyyy') })
    }
  }

  const handleDayClick = (date) => {
    const dateString = format(date, 'yyyy-MM-dd')
    onDayClick(dateString)
  }

  const handleTodayClick = () => {
    const todayString = getTodayString()
    onDayClick(todayString)
    logCustomEvent('today_clicked', { date: todayString })
  }

  const isNextMonthDisabled = !isWithinBounds(addMonths(displayMonth, 1))
  const isPrevMonthDisabled = !isWithinBounds(subMonths(displayMonth, 1))
  const monthYear = format(displayMonth, 'MMMM yyyy')

  const monthName = format(displayMonth, 'MMMM').toUpperCase()
  const yearNum = format(displayMonth, 'yyyy')

  return (
    <div className={styles.container}>
      <div className={styles.headerBar}>
        <span className={styles.headerBarLabel}>ROSTER // {monthName}</span>
        <span>M-{format(displayMonth, 'MM')} / {yearNum}</span>
      </div>

      <div className={styles.header}>
        <div className={styles.navGroup}>
          <button
            className={styles.navButton}
            onClick={handlePrevMonth}
            disabled={isPrevMonthDisabled}
            aria-label="Previous month"
          >
            &larr;
          </button>
          <h2 className={styles.monthYear}>
            {monthName} <b>{yearNum}</b>
          </h2>
          <button
            className={styles.navButton}
            onClick={handleNextMonth}
            disabled={isNextMonthDisabled}
            aria-label="Next month"
          >
            &rarr;
          </button>
        </div>
        <button className={styles.todayButton} onClick={handleTodayClick} aria-label="Go to today">
          NOW
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
          const status = getDateStatus(dateString)

          const dayClasses = [
            styles.day,
            !isCurrentMonth && styles.otherMonth,
            isSelected && styles.selected,
            isToday && styles.today,
            status === 'booked' && styles.booked,
            status === 'pending' && styles.pending
          ]
            .filter(Boolean)
            .join(' ')

          const ariaLabel = [
            format(date, 'MMMM d, yyyy'),
            status === 'booked' ? ' - booked' : '',
            status === 'pending' ? ' - pending' : '',
            isToday ? ' - today' : ''
          ].join('')

          return (
            <button
              key={dateString}
              className={dayClasses}
              onClick={() => handleDayClick(date)}
              aria-label={ariaLabel}
              aria-pressed={isSelected}
            >
              <span className={styles.dayNumber}>{format(date, 'd')}</span>
              <span className={styles.statusBar} />
            </button>
          )
        })}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}><span className={styles.legendDotBooked} />Booked</span>
        <span className={styles.legendItem}><span className={styles.legendDotPending} />Pending</span>
        <span className={styles.legendItem}><span className={styles.legendDotOpen} />Open</span>
      </div>
    </div>
  )
}
