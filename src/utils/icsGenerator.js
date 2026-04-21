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

  // Use local time (no UTC conversion) with TZID so calendar apps interpret as EST
  // and convert to user's local timezone with proper label
  const parts = dateString.split('-')
  const year = parseInt(parts[0])
  const month = parseInt(parts[1])
  const day = parseInt(parts[2])

  const startArray = [year, month, day, time.hour, time.minute]

  // Calculate end time
  const endMinute = time.minute + (time.durationMinutes || 60)
  let endHour = time.hour + Math.floor(endMinute / 60)
  let endDay = day
  let endMonth = month
  let endYear = year

  if (endHour >= 24) {
    endHour -= 24
    endDay += 1
  }

  const endArray = [endYear, endMonth, endDay, endHour, endMinute % 60]

  // Generate ics file with local time (will add TZID after)
  const { value, error } = createEvent({
    title,
    description,
    startInputType: 'local',
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

  // Add TZID parameter to DTSTART/DTEND so calendar apps know these are EST times
  // and will convert to user's local timezone (CST, CDT, EDT, etc) with proper label
  const icsWithTzid = value
    .replace(/DTSTART:/g, 'DTSTART;TZID=America/New_York:')
    .replace(/DTEND:/g, 'DTEND;TZID=America/New_York:')

  console.log('[ICS Debug] Generated ICS with TZID:\n', icsWithTzid)

  return {
    value: icsWithTzid,
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
