import { resolveTime } from './timeUtils'

/**
 * Generate an .ics calendar file for a single event.
 * Returns { value: iCalendarString, filename: "cyber-talks-YYYY-MM-DD.ics" }
 */
/**
 * Format a date/time array as ICS local datetime: YYYYMMDDTHHMMSS (no Z suffix)
 */
function formatIcsLocal(year, month, day, hour, minute) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(minute)}00`
}

/**
 * Format current time as UTC ICS datetime: YYYYMMDDTHHMMSSZ
 */
function formatIcsUtc(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
}

/**
 * Escape text for ICS format (commas, semicolons, backslashes, newlines)
 */
function escapeIcsText(text) {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/**
 * Generate a random UID for the event
 */
function generateUid() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}@cybertalks-guest`
}

export function generateIcs(dateString, event) {
  // Resolve event details
  const time = resolveTime(dateString, event)

  // Build title based on event type
  let title = 'Cyber Talks'
  let description = ''

  if (event?.dayType === 'guest' && event?.guests?.length > 0) {
    const guest = event.guests[0]
    title = `Cyber Talks: ${guest.name}`
    description = `Guest: ${guest.name}\nTopic: ${guest.topic || ''}`
    if (guest.tiktokUrl) {
      description += `\nTikTok: ${guest.tiktokUrl}`
    }
  } else if (event?.dayType === 'solo-talk') {
    title = event.topic || 'Cyber Talks: Solo Talk'
    description = `Topic: ${event.topic || ''}`
  } else {
    title = 'Cyber Talks: Open Floor'
    description = 'Open floor discussion with Nate Butler'
  }

  description += `\n\nDate: ${dateString}`

  // Parse date
  const parts = dateString.split('-')
  const year = parseInt(parts[0])
  const month = parseInt(parts[1])
  const day = parseInt(parts[2])

  // Calculate end time (add duration, handle day rollover)
  const endMinute = time.minute + (time.durationMinutes || 60)
  let endHour = time.hour + Math.floor(endMinute / 60)
  let endDay = day
  let endMonth = month
  let endYear = year

  if (endHour >= 24) {
    endHour -= 24
    endDay += 1
    // Simple day rollover - doesn't cross month boundary for 1hr events
  }

  const startLocal = formatIcsLocal(year, month, day, time.hour, time.minute)
  const endLocal = formatIcsLocal(endYear, endMonth, endDay, endHour, endMinute % 60)
  const dtstamp = formatIcsUtc(new Date())

  // Build ICS with proper VTIMEZONE block for America/New_York
  // This ensures calendar apps on any device correctly convert to local time
  // and show proper timezone labels (EDT/EST/CDT/CST etc)
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cyber Talks//Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    'TZID:America/New_York',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0400',
    'TZNAME:EDT',
    'DTSTART:19700308T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:-0400',
    'TZOFFSETTO:-0500',
    'TZNAME:EST',
    'DTSTART:19701101T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${generateUid()}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;TZID=America/New_York:${startLocal}`,
    `DTEND;TZID=America/New_York:${endLocal}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText('TikTok Live - @natebutlerexplains')}`,
    `URL:https://cybertalks-guest.web.app/?date=${dateString}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'ORGANIZER;CN=Nate Butler:MAILTO:nate@cybertalks.tv',
    'END:VEVENT',
    'END:VCALENDAR'
  ]

  const value = icsLines.join('\r\n')

  console.log('[ICS Debug] Generated ICS:\n' + value)

  return {
    value,
    filename: `cyber-talks-${dateString}.ics`
  }
}

/**
 * Trigger browser download of .ics file.
 */
export function downloadIcs(dateString, event) {
  const icsData = generateIcs(dateString, event)
  if (!icsData) return

  // Log ICS content so we can verify UTC output in browser console
  console.log('[ICS Debug] Generated ICS:\n', icsData.value)

  const blob = new Blob([icsData.value], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  // Use window.open for all devices — works on iOS Safari and triggers Calendar.app
  // A hidden <a download> doesn't work reliably on iOS
  const a = document.createElement('a')
  a.href = url
  a.download = icsData.filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  setTimeout(() => URL.revokeObjectURL(url), 5000)
}
