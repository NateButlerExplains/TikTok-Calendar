// ===================
// © AngelaMos | 2026
// useCalendarData.js
// ===================

import { useMemo } from 'react'
import { resolveTime, isPastDate } from '../utils/timeUtils'

/**
 * Resolves calendar data for a given date from the already-fetched events array.
 * Returns synthetic open-floor event if date not in events.
 */
export function useCalendarData(dateString, events) {
  return useMemo(() => {
    if (!dateString) return null

    const event = (events || []).find((e) => e.date === dateString)

    if (event) {
      return {
        id: event.id,
        date: event.date,
        dayType: event.dayType,
        status: event.status || 'published',
        time: event.time || resolveTime(dateString, event),
        guests: event.guests || [],
        topic: event.topic,
        isPastDate: isPastDate(dateString),
        hasEvent: true
      }
    }

    return {
      id: null,
      date: dateString,
      dayType: 'open-floor',
      status: 'published',
      time: resolveTime(dateString, null),
      guests: [],
      topic: undefined,
      isPastDate: isPastDate(dateString),
      hasEvent: false
    }
  }, [dateString, events])
}
