import { format } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import styles from './DateNavigator.module.css'

export function DateNavigator({ selectedDate, onDateChange }) {
  // Parse date string correctly in local timezone (not UTC)
  const [year, month, day] = selectedDate.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)

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
