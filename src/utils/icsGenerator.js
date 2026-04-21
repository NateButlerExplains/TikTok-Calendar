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

  // Convert EST time (UTC-5) to UTC
  // Example: 12 PM EST = 5 PM UTC
  const estToUtcHours = 5
  const startUtcHour = (time.hour + estToUtcHours) % 24
  const startUtcDay = day + Math.floor((time.hour + estToUtcHours) / 24)

  const startArray = [year, month, startUtcDay, startUtcHour, time.minute]

  // Calculate end time in UTC
  const endMinute = time.minute + (time.durationMinutes || 60)
  const endTotalHours = startUtcHour + Math.floor(endMinute / 60)
  const endUtcHour = endTotalHours % 24
  const endUtcDay = startUtcDay + Math.floor(endTotalHours / 24)

  const endArray = [year, month, endUtcDay, endUtcHour, endMinute % 60]

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
 * Detect iOS device.
 */
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

/**
 * Trigger browser download of .ics file.
 * Uses device-specific approaches for compatibility.
 */
export function downloadIcs(dateString, event) {
  const icsData = generateIcs(dateString, event)
  if (!icsData) return

  if (isIOS()) {
    downloadIcsIOS(icsData)
  } else {
    downloadIcsDesktop(icsData)
  }
}

/**
 * Desktop download using Blob + ObjectURL.
 */
function downloadIcsDesktop(icsData) {
  const blob = new Blob([icsData.value], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)

  const element = document.createElement('a')
  element.setAttribute('href', url)
  element.setAttribute('download', icsData.filename)
  element.style.display = 'none'

  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)

  URL.revokeObjectURL(url)
}

/**
 * iOS download: Opens file in new tab (user can save from there).
 * iOS Safari doesn't support blob: downloads, so we use data: URI instead.
 */
function downloadIcsIOS(icsData) {
  const dataUri = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsData.value)
  const element = document.createElement('a')
  element.setAttribute('href', dataUri)
  element.setAttribute('download', icsData.filename)
  element.setAttribute('target', '_blank')
  element.style.display = 'none'

  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
