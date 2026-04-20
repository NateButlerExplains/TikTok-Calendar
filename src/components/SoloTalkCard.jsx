import { formatTime } from '../utils/timeUtils'
import styles from './SoloTalkCard.module.css'

export function SoloTalkCard({ topic, time, isPastDate }) {
  const handleImageError = (e) => {
    e.target.src = '/headshots/mystery.jpg'
  }

  const displayTime = time ? formatTime(new Date(), time) : ''

  return (
    <div className={`card ${isPastDate ? 'past-event' : ''} ${styles.card}`}>
      <img
        src="/headshots/nate.jpg"
        alt="Nate Butler"
        className={styles.headshot}
        onError={handleImageError}
      />
      <h2 className={`heading-2 ${styles.title}`}>{topic || 'Solo Talk'}</h2>
      {displayTime && <p className={`body-sm muted ${styles.time}`}>{displayTime}</p>}
      <p className={`body-sm muted ${styles.subtitle}`}>Presented by Nate Butler</p>
    </div>
  )
}
