import { useMemo } from 'react'
import { events } from '../data/events'
import { resolveTime, isPastDate } from '../utils/timeUtils'

/**
 * Hook that resolves calendar data for a given date.
 * Returns event data or synthetic open-floor event if date not in events array.
 */
export function useCalendarData(dateString) {
  return useMemo(() => {
    if (!dateString) {
      return null
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

    // No event found — return synthetic open-floor event with hasEvent: false
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
