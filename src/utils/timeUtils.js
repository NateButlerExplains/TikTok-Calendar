import { parse, format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const TIMEZONE = 'America/New_York'

/**
 * Resolve time for a given date and event.
 * Returns default time if event.time not provided.
 */
export function resolveTime(dateString, event) {
  // If event has explicit time, use it
  if (event?.time) {
    return event.time
  }

  // Parse date to determine day of week
  const date = parse(dateString, 'yyyy-MM-dd', new Date())
  const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Monday (1) or Wednesday (3): 12 PM
  if (dayOfWeek === 1 || dayOfWeek === 3) {
    return { hour: 12, minute: 0, durationMinutes: 60 }
  }

  // All other days: 8 PM
  return { hour: 20, minute: 0, durationMinutes: 60 }
}

/**
 * Get stream start time as a Date object in the America/New_York timezone.
 */
export function getStreamStart(dateString, event) {
  const time = resolveTime(dateString, event)

  // Create a date string with the time
  const dateTimeString = `${dateString} ${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`

  // Parse as if in the target timezone, then convert to UTC
  const localDate = parse(dateTimeString, 'yyyy-MM-dd HH:mm', new Date())

  // Convert to zoned time
  return toZonedTime(localDate, TIMEZONE)
}

/**
 * Format a date/time as "h:mm A Z" (e.g., "8:00 PM EDT", "12:00 PM EST")
 */
export function formatTime(date, timeObj) {
  if (!date && !timeObj) {
    return ''
  }

  // If only timeObj provided, create a date with those values
  let dateToFormat = date
  if (!date && timeObj) {
    dateToFormat = new Date()
    dateToFormat.setHours(timeObj.hour || 0, timeObj.minute || 0, 0, 0)
  }

  // Convert to America/New_York timezone and format
  const zonedDate = toZonedTime(dateToFormat, TIMEZONE)
  return format(zonedDate, 'h:mm a zzz')
}

/**
 * Format time in both EST and GMT+5 (e.g., "12:00 PM EST / 5:00 PM GMT+5")
 */
export function formatTimeWithGMT(date, timeObj) {
  if (!date && !timeObj) {
    return ''
  }

  // If only timeObj provided, create a date with those values
  let dateToFormat = date
  if (!date && timeObj) {
    dateToFormat = new Date()
    dateToFormat.setHours(timeObj.hour || 0, timeObj.minute || 0, 0, 0)
  }

  // Get EST time
  const estZoned = toZonedTime(dateToFormat, TIMEZONE)
  const estTime = format(estZoned, 'h:mm a')

  // Calculate GMT+5 time (EST is UTC-5 or UTC-4 depending on DST)
  // GMT+5 is 10 or 9 hours ahead of EST
  const estOffset = estZoned.getTimezoneOffset() // In minutes
  const gmtDate = new Date(dateToFormat.getTime() + (estOffset * 60 * 1000)) // Convert to UTC
  const gmtPlusFiveDate = new Date(gmtDate.getTime() + (5 * 60 * 60 * 1000)) // Add 5 hours

  // Format GMT+5 time
  const gmtTime = format(gmtPlusFiveDate, 'h:mm a')

  return `${estTime} EST / ${gmtTime} GMT+5`
}

/**
 * Check if a date is in the past.
 */
export function isPastDate(dateString) {
  const date = parse(dateString, 'yyyy-MM-dd', new Date())
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

/**
 * Get today's date as YYYY-MM-DD string.
 */
export function getTodayString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Add days to a date string.
 */
export function addDays(dateString, numDays) {
  const date = parse(dateString, 'yyyy-MM-dd', new Date())
  date.setDate(date.getDate() + numDays)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format date string as readable day of week + date.
 */
export function formatDateHeader(dateString) {
  const date = parse(dateString, 'yyyy-MM-dd', new Date())
  return format(date, 'EEEE, MMMM d')
}
