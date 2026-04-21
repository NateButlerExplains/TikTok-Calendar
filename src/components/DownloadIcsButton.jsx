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

  const isDisabled = !dayData || !dayData.hasEvent
  const tooltipText = isDisabled ? 'No scheduled event for this date' : 'Download as .ics calendar file'

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
