import { format } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import styles from './DateNavigator.module.css'

export function DateNavigator({ selectedDate, onDateChange }) {
  const dateObj = new Date(selectedDate)

  // Format date as "Monday, April 21"
  const formattedDate = formatInTimeZone(
    dateObj,
    'America/New_York',
    'EEEE, MMMM d'
  )

  return (
    <div className={styles.container}>
      <span className={styles.dateDisplay}>{formattedDate}</span>
    </div>
  )
}
