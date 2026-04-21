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
