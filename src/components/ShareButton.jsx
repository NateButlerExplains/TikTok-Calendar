import { useState } from 'react'
import { useCalendarData } from '../hooks/useCalendarData'
import { logCustomEvent } from '../firebase'
import { formatTimeWithGMT } from '../utils/timeUtils'
import styles from './ShareButton.module.css'

export function ShareButton({ date, events }) {
  const [shareStatus, setShareStatus] = useState('')
  const dayData = useCalendarData(date, events)

  const handleShare = async () => {
    const url = `${window.location.origin}/?date=${date}`
    const title = `Cyber Talks Calendar`

    // Parse date correctly in local timezone (not UTC)
    const [year, month, day] = date.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    const dateStr = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })

    // Build share message with guest/topic info
    let text = `Join me for Cyber Talks on ${dateStr}\n`

    if (dayData?.dayType === 'guest' && dayData?.guests?.length > 0) {
      const guest = dayData.guests[0]
      text += `\nGuest: ${guest.name}`
      if (guest.topic) {
        text += `\nTopic: ${guest.topic}`
      }
      if (guest.tiktokUrl) {
        const handle = guest.tiktokUrl.match(/@([a-zA-Z0-9._-]+)/)
        if (handle) {
          text += `\nTikTok: ${handle[0]}`
        }
      }
    } else if (dayData?.dayType === 'solo-talk') {
      text += `\nTopic: ${dayData.topic || 'Solo Talk'}`
    } else {
      text += `\nOpen floor discussion`
    }

    // Add time info
    if (dayData?.time) {
      const timeStr = formatTimeWithGMT(date, dayData.time)
      text += `\nTime: ${timeStr}`
    }

    text += `\n\n${url}`

    try {
      if (navigator.share) {
        // Use native Web Share API if available
        await navigator.share({
          title,
          text,
          url
        })
        logCustomEvent('share_link', {
          date,
          method: 'native',
          event_type: dayData?.dayType || 'open-floor'
        })
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url)
        setShareStatus('Copied to clipboard!')
        setTimeout(() => setShareStatus(''), 2000)
        logCustomEvent('share_link', {
          date,
          method: 'clipboard',
          event_type: dayData?.dayType || 'open-floor'
        })
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        // User cancelled the share
        return
      }
      console.error('Share failed:', error)
      // Try clipboard as final fallback
      try {
        await navigator.clipboard.writeText(url)
        setShareStatus('Copied to clipboard!')
        setTimeout(() => setShareStatus(''), 2000)
        logCustomEvent('share_link', {
          date,
          method: 'fallback',
          event_type: dayData?.dayType || 'open-floor'
        })
      } catch (clipboardError) {
        setShareStatus('Share failed')
        setTimeout(() => setShareStatus(''), 2000)
      }
    }
  }

  return (
    <button
      className={styles.button}
      onClick={handleShare}
      aria-label="Share this event"
      title="Share this event"
    >
      {shareStatus || 'Share Slot'}
    </button>
  )
}
