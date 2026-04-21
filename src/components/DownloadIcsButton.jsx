import { useCalendarData } from '../hooks/useCalendarData'
import { downloadIcs } from '../utils/icsGenerator'
import { logCustomEvent } from '../firebase'
import styles from './DownloadIcsButton.module.css'

export function DownloadIcsButton({ date }) {
  const dayData = useCalendarData(date)

  const handleDownloadIcs = () => {
    downloadIcs(date, dayData)
    const guestName = dayData.guests?.[0]?.name || dayData.topic || 'Event'
    logCustomEvent('download_ics', { date, event_name: guestName })
  }

  return (
    <button
      className={styles.button}
      onClick={handleDownloadIcs}
      aria-label="Download calendar event"
      title="Download as .ics calendar file"
    >
      📥 Download .ics
    </button>
  )
}
