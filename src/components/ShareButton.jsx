import { useState } from 'react'
import { logCustomEvent } from '../firebase'
import styles from './ShareButton.module.css'

export function ShareButton({ date }) {
  const [shareStatus, setShareStatus] = useState('')

  const handleShare = async () => {
    const url = `${window.location.origin}/?date=${date}`
    const title = `Cyber Talks Calendar`
    const text = `Join me for Cyber Talks on ${new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })}`

    try {
      if (navigator.share) {
        // Use native Web Share API if available
        await navigator.share({
          title,
          text,
          url
        })
        logCustomEvent('share_link', { date, method: 'native' })
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url)
        setShareStatus('Copied to clipboard!')
        setTimeout(() => setShareStatus(''), 2000)
        logCustomEvent('share_link', { date, method: 'clipboard' })
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
      🔗 {shareStatus || 'Share'}
    </button>
  )
}
