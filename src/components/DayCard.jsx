import { useCalendarData } from '../hooks/useCalendarData'
import { formatTimeWithGMT } from '../utils/timeUtils'
import styles from './DayCard.module.css'

export function DayCard({ date }) {
  const dayData = useCalendarData(date)

  if (!dayData) {
    return <div className={styles.container}>Loading...</div>
  }

  const handleImageError = (e) => {
    e.target.src = '/Speakers/Nate Default.jpg'
  }

  const extractHandle = (tiktokUrl) => {
    if (!tiktokUrl) return ''
    const match = tiktokUrl.match(/@([a-zA-Z0-9._-]+)/)
    return match ? match[1] : tiktokUrl.split('/').pop()
  }

  const displayTime = dayData.time ? formatTimeWithGMT(date, dayData.time) : ''

  // Guest card
  if (dayData.dayType === 'guest' && dayData.guests && dayData.guests.length > 0) {
    const guest = dayData.guests[0] // Display first guest
    const handle = extractHandle(guest.tiktokUrl)

    return (
      <div className={`card ${dayData.isPastDate ? 'past-event' : ''} ${styles.card}`}>
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

  // Solo-talk card
  if (dayData.dayType === 'solo-talk') {
    return (
      <div className={`card ${dayData.isPastDate ? 'past-event' : ''} ${styles.card}`}>
        <img
          src="/Speakers/Nate Default.jpg"
          alt="Nate Butler"
          className={styles.headshot}
          onError={handleImageError}
        />
        <h2 className={`heading-2 ${styles.title}`}>{dayData.topic || 'Solo Talk'}</h2>
        {displayTime && <p className={`body-sm muted ${styles.time}`}>{displayTime}</p>}
        <p className={`body-sm muted ${styles.subtitle}`}>Presented by Nate Butler</p>
      </div>
    )
  }

  // Open-floor card (default)
  return (
    <div className={`card ${dayData.isPastDate ? 'past-event' : ''} ${styles.card}`}>
      <img
        src="/Speakers/Nate Default.jpg"
        alt="Nate Butler"
        className={styles.headshot}
        onError={handleImageError}
      />
      <h2 className={`heading-2 ${styles.title}`}>Open Floor</h2>
      {displayTime && <p className={`body-sm muted ${styles.time}`}>{displayTime}</p>}
      <p className={`body-sm muted ${styles.subtitle}`}>Join Nate for live discussion</p>
    </div>
  )
}
