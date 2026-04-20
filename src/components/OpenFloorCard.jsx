import { formatTime } from '../utils/timeUtils'
import styles from './OpenFloorCard.module.css'

export function OpenFloorCard({ time, isPastDate }) {
  const handleImageError = (e) => {
    e.target.src = '/Speakers/Nate Default.png'
  }

  const displayTime = time ? formatTime(new Date(), time) : ''

  return (
    <div className={`card ${isPastDate ? 'past-event' : ''} ${styles.card}`}>
      <img
        src="/Speakers/Nate Default.png"
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
