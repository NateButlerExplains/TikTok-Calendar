import { createEvent } from 'ics'
import { resolveTime } from './timeUtils'

/**
 * Generate an .ics calendar file for a single event.
 * Returns { value: iCalendarString, filename: "cyber-talks-YYYY-MM-DD.ics" }
 */
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

  // Parse date string
  const parts = dateString.split('-')
  const year = parseInt(parts[0])
  const month = parseInt(parts[1])
  const day = parseInt(parts[2])

  // Convert EST time (fixed UTC-5 offset) to UTC
  // 12 PM EST = 17:00 UTC, 9 PM EST = 02:00 UTC (next day)
  // Use Date.UTC to handle month/year boundaries correctly
  const estOffsetMs = 5 * 60 * 60 * 1000
  const naiveDate = new Date(Date.UTC(year, month - 1, day, time.hour, time.minute, 0))
  const startUTC = new Date(naiveDate.getTime() + estOffsetMs)

  const startArray = [
    startUTC.getUTCFullYear(),
    startUTC.getUTCMonth() + 1,
    startUTC.getUTCDate(),
    startUTC.getUTCHours(),
    startUTC.getUTCMinutes()
  ]

  // Calculate end time in UTC
  const endUTC = new Date(startUTC.getTime() + (time.durationMinutes || 60) * 60 * 1000)

  const endArray = [
    endUTC.getUTCFullYear(),
    endUTC.getUTCMonth() + 1,
    endUTC.getUTCDate(),
    endUTC.getUTCHours(),
    endUTC.getUTCMinutes()
  ]

  // Generate ics file with UTC times
  const { value, error } = createEvent({
    title,
    description,
    startInputType: 'utc',
    start: startArray,
    end: endArray,
    location: 'TikTok Live - @natebutlerexplains',
    url: `https://cybertalks-guest.web.app/?date=${dateString}`,
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    organizer: { name: 'Nate Butler', email: 'nate@cybertalks.tv' }
  })

  if (error) {
    console.error('Error generating .ics file:', error)
    return null
  }

  // UTC times in ICS will automatically convert to user's timezone
  // The calendar app will show: 12 PM EST (UTC-5) and convert to 11 AM CST (UTC-6)
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
