// ===================
// © AngelaMos | 2026
// DateNavigator.jsx
// ===================

import { formatInTimeZone } from 'date-fns-tz'
import styles from './DateNavigator.module.css'

export function DateNavigator({ selectedDate }) {
  const [year, month, day] = selectedDate.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)

  const formattedDate = formatInTimeZone(
    dateObj,
    'America/New_York',
    'EEE, MMM d'
  ).toUpperCase()

  return (
    <div className={styles.container}>
      <span className={styles.kicker}>// VIEWING SLOT</span>
      <span className={styles.dateDisplay}>{formattedDate}</span>
    </div>
  )
}
