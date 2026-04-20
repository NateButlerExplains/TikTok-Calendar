import { formatTime } from '../utils/timeUtils'
import styles from './GuestCard.module.css'

export function GuestCard({ guest, time, isPastDate }) {
  if (!guest) return null

  const handleImageError = (e) => {
    e.target.src = '/headshots/mystery.jpg'
  }

  const extractHandle = (tiktokUrl) => {
    if (!tiktokUrl) return ''
    const match = tiktokUrl.match(/@([a-zA-Z0-9._-]+)/)
    return match ? match[1] : tiktokUrl.split('/').pop()
  }

  const handle = extractHandle(guest.tiktokUrl)
  const displayTime = time ? formatTime(new Date(), time) : ''

  return (
    <div className={`card ${isPastDate ? 'past-event' : ''} ${styles.card}`}>
      <img
        src={guest.headshot}
        alt={guest.name}
        className={styles.headshot}
        onError={handleImageError}
      />
      <h2 className={`heading-2 ${styles.name}`}>{guest.name}</h2>
      {guest.topic && <p className={`body ${styles.topic}`}>{guest.topic}</p>}
      {displayTime && <p className={`body-sm muted ${styles.time}`}>{displayTime}</p>}
      {guest.tiktokUrl && (
        <a
          href={guest.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`accent ${styles.tiktokLink}`}
        >
          → @{handle}
        </a>
      )}
    </div>
  )
}
