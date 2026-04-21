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

  // All other days: 9 PM
  return { hour: 21, minute: 0, durationMinutes: 60 }
}

/**
 * Get stream start time as a Date object representing EST/EDT time.
 * Since icsGenerator uses startInputType: 'local', this returns the time
 * as it should appear in the calendar (12 PM EST = 12 noon in EST timezone).
 */
export function getStreamStart(dateString, event) {
  const time = resolveTime(dateString, event)
  const parts = dateString.split('-')

  // Create a Date representing the desired time in EST
  // We create it in UTC, then adjust for the difference between EST and browser timezone
  const estDate = new Date(
    parseInt(parts[0]),           // year
    parseInt(parts[1]) - 1,       // month (0-indexed)
    parseInt(parts[2]),           // day
    time.hour,                    // hour in EST
    time.minute,                  // minute
    0,                            // seconds
    0                             // milliseconds
  )

  // The Date object stores time in UTC internally, but we need to account for
  // the fact that when we pass it to ICS with startInputType: 'local',
  // it will use the browser's timezone. We need to return a Date that represents
  // "12 PM EST" such that when ICS converts it with the browser's timezone offset,
  // it shows up correctly in the calendar app.

  // Get browser timezone offset in minutes (e.g., -300 for EST/CDT)
  const browserOffsetMinutes = estDate.getTimezoneOffset()

  // EST is UTC-5 (300 minutes)
  const estOffsetMinutes = 300

  // Adjust: if browser is in CST (UTC-6 = 360 min), we need to add 60 minutes
  // to compensate so that when ICS applies the browser offset, we get EST
  const adjustment = (browserOffsetMinutes - estOffsetMinutes) * 60 * 1000

  return new Date(estDate.getTime() + adjustment)
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
 * Uses fixed UTC-5 offset for EST (no DST, consistent display)
 */
export function formatTimeWithGMT(dateStringOrObj, timeObj) {
  let dateString = null
  let timeToUse = null

  // If first arg is a string, it's a date string
  if (typeof dateStringOrObj === 'string') {
    dateString = dateStringOrObj
    timeToUse = timeObj
  }
  // If first arg is a Date object with time already set
  else if (dateStringOrObj instanceof Date) {
    // Format in local time
    const estTime = format(dateStringOrObj, 'h:mm a')
    // For GMT+5: add 10 hours (EST UTC-5 to GMT+5 is 10 hours)
    const gmtDateTime = new Date(dateStringOrObj.getTime() + (10 * 60 * 60 * 1000))
    const gmtTime = format(gmtDateTime, 'h:mm a')
    return `${estTime} EST / ${gmtTime} GMT+5`
  }

  if (!dateString || !timeToUse) {
    return ''
  }

  // Manually format time (simpler approach)
  const hour = timeToUse.hour
  const minute = timeToUse.minute

  // Convert 24-hour format to 12-hour with AM/PM
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
  const minuteStr = String(minute).padStart(2, '0')
  const estTime = `${displayHour}:${minuteStr} ${ampm}`

  // Calculate GMT+5 time (EST UTC-5 + 10 hours = UTC+5)
  let gmtHour = hour + 10
  let gmtDay = 0
  if (gmtHour >= 24) {
    gmtHour -= 24
    gmtDay = 1
  }

  const gmtAmpm = gmtHour >= 12 ? 'PM' : 'AM'
  const gmtDisplayHour = gmtHour > 12 ? gmtHour - 12 : (gmtHour === 0 ? 12 : gmtHour)
  const gmtTime = `${gmtDisplayHour}:${minuteStr} ${gmtAmpm}`

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
