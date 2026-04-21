import { useMemo } from 'react'
import { events } from '../data/events'
import { resolveTime, isPastDate } from '../utils/timeUtils'

/**
 * Hook that resolves calendar data for a given date.
 * Returns event data or synthetic open-floor event if date not in events array.
 * Dates before May 1, 2026 return null (no events scheduled, only pop-ups).
 */
export function useCalendarData(dateString) {
  return useMemo(() => {
    if (!dateString) {
      return null
    }

    // Check if date is before May 1, 2026 - no scheduled events before this date
    const [year, month, day] = dateString.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    const scheduleStart = new Date(2026, 4, 1) // May 1, 2026

    if (dateObj < scheduleStart) {
      return null // No events before May 1, 2026
    }

    // Find event for this date
    const event = events.find(e => e.date === dateString)

    if (event) {
      // Event found in array — return as-is
      return {
        date: event.date,
        dayType: event.dayType,
        time: event.time || resolveTime(dateString, event),
        guests: event.guests || [],
        topic: event.topic,
        isPastDate: isPastDate(dateString),
        hasEvent: true
      }
    }

    // No event found on or after May 1 — return synthetic open-floor event
    return {
      date: dateString,
      dayType: 'open-floor',
      time: resolveTime(dateString, null),
      guests: [],
      topic: undefined,
      isPastDate: isPastDate(dateString),
      hasEvent: false
    }
  }, [dateString])
}
