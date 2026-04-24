// ===================
// © AngelaMos | 2026
// DayCard.jsx
// ===================

import { useCalendarData } from '../hooks/useCalendarData'
import { formatTimeWithGMT } from '../utils/timeUtils'
import { logCustomEvent } from '../firebase'
import styles from './DayCard.module.css'

function dayTypeLabel(t) {
  if (t === 'guest') return 'GUEST'
  if (t === 'solo-talk') return 'SOLO'
  if (t === 'open-floor') return 'OPEN'
  return 'BROADCAST'
}

function formatSerial(date) {
  const [y, m, d] = date.split('-')
  return `CYB-${y}.${m}.${d}`
}

function formatShortDate(date) {
  const [y, m, d] = date.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()
}

export function DayCard({ date, events, config, onRequestBooking }) {
  const dayData = useCalendarData(date, events)

  const [year, month, day] = date.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  const scheduleStart = new Date(2026, 4, 1)
  const isBeforeSchedule = dateObj < scheduleStart

  if (!dayData || isBeforeSchedule) {
    return (
      <div className={styles.container}>
        <div className={styles.noEvent}>
          <span className={styles.noEventKicker}>
            {formatSerial(date)} // NO TRANSMISSION
          </span>
          <h2 className={styles.noEventTitle}>Dark<br/>Slot.</h2>
          <span className={styles.noEventText}>&mdash; Check back for pop-ups</span>
        </div>
      </div>
    )
  }

  const handleImageError = (e) => {
    e.target.src = '/Speakers/Nate Default.jpg'
  }

  const extractHandle = (tiktokUrl) => {
    if (!tiktokUrl) return ''
    const match = tiktokUrl.match(/@([a-zA-Z0-9._-]+)/)
    return match ? match[1] : tiktokUrl.split('/').pop()
  }

  const handleTiktokClick = (guestName, handle) => {
    logCustomEvent('tiktok_link_clicked', { date, guest_name: guestName, handle })
  }

  const displayTime = dayData.time ? formatTimeWithGMT(date, dayData.time) : ''
  const isPending = dayData.status === 'pending'
  const locked = config?.bookingLocked === true
  const isPast = dayData.isPastDate === true
  const canRequest =
    !isPast &&
    !isBeforeSchedule &&
    (!dayData.hasEvent || dayData.dayType !== 'guest') &&
    !locked

  const statusPill = (() => {
    if (isPast) return <span className={`${styles.statusPill} ${styles.statusPast}`}>AIRED</span>
    if (isPending) return <span className={`${styles.statusPill} ${styles.statusPending}`}>PENDING</span>
    if (dayData.dayType === 'guest') return <span className={`${styles.statusPill} ${styles.statusApproved}`}>CONFIRMED</span>
    if (dayData.hasEvent) return <span className={`${styles.statusPill} ${styles.statusApproved}`}>SCHEDULED</span>
    if (locked) return <span className={`${styles.statusPill} ${styles.statusPending}`}>LOCKED</span>
    return <span className={`${styles.statusPill} ${styles.statusOpen}`}>OPEN SLOT</span>
  })()

  const metaBar = (
    <div className={styles.metaBar}>
      <span className={styles.metaUnit}>{formatSerial(date)}</span>
      <span className={styles.metaCenter}>{dayTypeLabel(dayData.dayType)} &middot; {formatShortDate(date)}</span>
      {statusPill}
    </div>
  )

  if (dayData.dayType === 'guest' && dayData.guests && dayData.guests.length > 0) {
    const guest = dayData.guests[0]
    const handle = extractHandle(guest.tiktokUrl)

    return (
      <div className={`${styles.card} ${isPast ? styles.past : ''}`}>
        {metaBar}
        <div className={styles.headshotWrap}>
          {guest.headshot ? (
            <img
              src={guest.headshot}
              alt={guest.name}
              className={styles.headshot}
              onError={handleImageError}
            />
          ) : (
            <div className={`${styles.headshot} ${styles.headshotPlaceholder}`} aria-hidden="true">
              <span>@{handle || guest.name}</span>
            </div>
          )}
          <span className={styles.headshotCorners} aria-hidden="true" />
          <span className={styles.headshotBadge}>UNIT {String(day).padStart(2, '0')}</span>
        </div>

        <div className={styles.body}>
          <div className={styles.kickerRow}>
            <span>GUEST &middot; <b>{handle ? `@${handle}` : 'TIKTOK'}</b></span>
            {displayTime && <span>{displayTime}</span>}
          </div>
          <h2 className={styles.name}>{guest.name}</h2>
          {guest.topic && <p className={styles.topic}>{guest.topic}</p>}
          {guest.tiktokUrl && (
            <div className={styles.footerRow}>
              <a
                href={guest.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.tiktokLink}
                onClick={() => handleTiktokClick(guest.name, handle)}
              >
                @{handle}
              </a>
              <span className={styles.footerMeta}>LIVE / TIKTOK</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (dayData.dayType === 'solo-talk') {
    return (
      <div className={`${styles.card} ${isPast ? styles.past : ''}`}>
        {metaBar}
        <div className={styles.headshotWrap}>
          <img
            src="/Speakers/Nate Default.jpg"
            alt="Nate Butler"
            className={styles.headshot}
            onError={handleImageError}
          />
          <span className={styles.headshotCorners} aria-hidden="true" />
          <span className={styles.headshotBadge}>SOLO</span>
        </div>
        <div className={styles.body}>
          <div className={styles.kickerRow}>
            <span>HOST &middot; <b>NATE BUTLER</b></span>
            {displayTime && <span>{displayTime}</span>}
          </div>
          <h2 className={styles.title}>{dayData.topic || 'Solo Talk'}</h2>
          <div className={styles.footerRow}>
            <span className={styles.footerMeta}>PRESENTED BY NATE BUTLER</span>
            <span className={styles.footerMeta}>LIVE / TIKTOK</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.card} ${isPast ? styles.past : ''}`}>
      {metaBar}
      <div className={styles.headshotWrap}>
        <img
          src="/Speakers/Nate Default.jpg"
          alt="Nate Butler"
          className={styles.headshot}
          onError={handleImageError}
        />
        <span className={styles.headshotCorners} aria-hidden="true" />
        <span className={styles.headshotBadge}>OPEN FLOOR</span>
      </div>
      <div className={styles.body}>
        <div className={styles.kickerRow}>
          <span>HOST &middot; <b>NATE BUTLER</b></span>
          {displayTime && <span>{displayTime}</span>}
        </div>
        <h2 className={styles.title}>Open <em>Floor</em></h2>
        <p className={styles.topic}>Live discussion &mdash; jump in, ask anything, talk shop.</p>
      </div>

      {canRequest && (
        <div className={styles.requestBlock}>
          <span className={styles.requestKicker}>SIGNAL ACQUIRED &middot; OPEN TRANSMISSION SLOT</span>
          <button
            type="button"
            className={styles.requestButton}
            onClick={() => onRequestBooking?.(date)}
          >
            REQUEST THIS DATE
          </button>
        </div>
      )}
      {locked && !dayData.hasEvent && !isPast && (
        <div className={styles.pausedNote}>PUBLIC BOOKING PAUSED &mdash; CHECK BACK SOON</div>
      )}
    </div>
  )
}
