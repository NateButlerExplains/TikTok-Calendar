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

  // Disable for: no data, open floor events, or events without actual content
  const isDisabled = !dayData || dayData.dayType === 'open-floor'
  const tooltipText = isDisabled
    ? 'Download not available for open floor events'
    : 'Download as .ics calendar file'

  return (
    <button
      className={styles.button}
      onClick={handleDownloadIcs}
      disabled={isDisabled}
      aria-label="Download calendar event"
      title={tooltipText}
    >
      📥 Download .ics
    </button>
  )
}
