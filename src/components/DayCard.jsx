import { useCalendarData } from '../hooks/useCalendarData'
import { formatTimeWithGMT } from '../utils/timeUtils'
import { logCustomEvent } from '../firebase'
import { downloadIcs } from '../utils/icsGenerator'
import styles from './DayCard.module.css'

export function DayCard({ date }) {
  const dayData = useCalendarData(date)

  // Check if date is before May 1, 2026 (no scheduled events, only pop-ups)
  const [year, month, day] = date.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  const scheduleStart = new Date(2026, 4, 1) // May 1, 2026
  const isBeforeSchedule = dateObj < scheduleStart

  async function shareEventWithImage(shareData, fallbackUrl, headshotPath) {
    if (typeof navigator.share !== 'function') {
      await navigator.clipboard.writeText(fallbackUrl)
      return 'clipboard'
    }
    if (headshotPath) {
      try {
        const absoluteUrl = encodeURI(window.location.origin + headshotPath)
        const response = await fetch(absoluteUrl)
        if (response.ok) {
          const blob = await response.blob()
          const ext = headshotPath.split('.').pop().toLowerCase()
          const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg'
          const fileName = headshotPath.split('/').pop()
          const file = new File([blob], fileName, { type: mimeType })
          let canShare = false
          try { canShare = navigator.canShare({ files: [file] }) } catch (_) {}
          if (canShare) {
            await navigator.share({ ...shareData, files: [file] })
            return 'native-with-image'
          }
        }
      } catch (_) {}
    }
    await navigator.share(shareData)
    return 'native'
  }

  if (!dayData || isBeforeSchedule) {
    return (
      <div className={styles.container}>
        <div className={styles.noEvent}>
          <p className={styles.noEventTitle}>No Event</p>
          <p className={styles.noEventText}>Check for pop-ups!</p>
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
    return match ? match[1] : ''
  }

  const isLinkedInUrl = (url) => {
    return url && url.includes('linkedin.com')
  }

  const handleTiktokClick = (guestName, handle) => {
    logCustomEvent('tiktok_link_clicked', {
      date,
      guest_name: guestName,
      handle
    })
  }

  const displayTime = dayData.time ? formatTimeWithGMT(date, dayData.time) : ''

  // Render single guest card
  const renderGuestCard = (guest) => {
    const handle = extractHandle(guest.tiktokUrl)
    const isLinkedIn = isLinkedInUrl(guest.tiktokUrl)
    const displayUrl = isLinkedIn ? guest.tiktokUrl : `https://www.tiktok.com/@${handle}`
    const linkLabel = isLinkedIn ? 'LinkedIn' : `@${handle}`
    const platform = isLinkedIn ? 'LINKEDIN' : 'TIKTOK'
    const guestTime = guest.time || dayData.time
    const guestDisplayTime = guestTime ? formatTimeWithGMT(date, guestTime) : ''

    return (
      <div key={guest.name} className={`${styles.card} ${dayData.isPastDate ? styles.past : ''}`}>
        <div className={styles.headshotWrap}>
          <img
            src={guest.headshot}
            alt={guest.name}
            className={styles.headshot}
            onError={handleImageError}
          />
          <span className={styles.headshotCorners} aria-hidden="true" />
          <span className={styles.headshotBadge}>GUEST</span>
        </div>
        <div className={styles.body}>
          <div className={styles.kickerRow}>
            <span>GUEST &middot; <b>{isLinkedIn ? 'LINKEDIN' : handle ? `@${handle}` : 'TIKTOK'}</b></span>
            {guestDisplayTime && <span>{guestDisplayTime}</span>}
          </div>
          <h2 className={styles.name}>{guest.name}</h2>
          {guest.topic && (
            <div className={styles.topicSection}>
              <h3 className={styles.topicTitle}>Topic</h3>
              <p className={styles.topicText}>{guest.topic}</p>
            </div>
          )}
          {guest.bio && (
            <div className={styles.bioSection}>
              <h3 className={styles.bioTitle}>Bio</h3>
              <p className={styles.bioText}>{guest.bio}</p>
            </div>
          )}
          {guest.links && guest.links.length > 0 && (
            <div className={styles.linksSection}>
              <h3 className={styles.linksTitle}>Resources</h3>
              <div className={styles.linksList}>
                {guest.links.map((link, idx) => {
                  const isEmail = link.url.startsWith('mailto:')
                  const displayText = isEmail ? link.url.replace('mailto:', '') : link.label
                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target={isEmail ? undefined : "_blank"}
                      rel={isEmail ? undefined : "noopener noreferrer"}
                      className={styles.guestLink}
                    >
                      {displayText}
                    </a>
                  )
                })}
              </div>
            </div>
          )}
          {guest.resource && (
            <div className={styles.resourceSection}>
              <img
                src={guest.resource}
                alt={`${guest.name} resource`}
                className={styles.resourceImage}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}
          {guest.tiktokUrl && (
            <div className={styles.footerRow}>
              <a
                href={displayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.tiktokLink}
                onClick={() => handleTiktokClick(guest.name, isLinkedIn ? 'LinkedIn' : handle)}
              >
                {linkLabel}
              </a>
              <span className={styles.footerMeta}>LIVE / {platform}</span>
            </div>
          )}
        </div>
        <div className={styles.cardActions}>
          <button
            className={styles.actionButton}
            onClick={() => handleShareGuest(guest.name)}
            title="Share this event"
            aria-label="Share this guest event"
          >
            Share
          </button>
          <button
            className={styles.actionButton}
            onClick={() => handleDownloadGuest(guest.name)}
            title="Download as .ics calendar file"
            aria-label="Download calendar event"
          >
            Download .ics
          </button>
        </div>
      </div>
    )
  }

  const handleShareGuest = async (guestName) => {
    const url = `${window.location.origin}/og?date=${date}`
    const title = `Cyber Talks Calendar`
    const [year, month, day] = date.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    const dateStr = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })

    let text = `Join me for Cyber Talks on ${dateStr}\n`
    const guest = dayData.guests.find(g => g.name === guestName)
    if (guest) {
      text += `\nGuest: ${guest.name}`
      if (guest.topic) {
        text += `\nTopic: ${guest.topic}`
      }
      if (guest.tiktokUrl) {
        if (isLinkedInUrl(guest.tiktokUrl)) {
          text += `\nLinkedIn: ${guest.tiktokUrl}`
        } else {
          const handle = guest.tiktokUrl.match(/@([a-zA-Z0-9._-]+)/)
          if (handle) {
            text += `\nTikTok: ${handle[0]}`
          }
        }
      }
    }
    if (displayTime) {
      text += `\nTime: ${displayTime}`
    }
    text += `\n\n${url}\nhttps://www.tiktok.com/@natebutlerexplains`

    try {
      const method = await shareEventWithImage({ title, text }, url, guest?.headshot || '/Speakers/Nate Default.jpg')
      logCustomEvent('share_link', {
        date,
        guest_name: guestName,
        method
      })
    } catch (error) {
      if (error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(url)
          logCustomEvent('share_link', {
            date,
            guest_name: guestName,
            method: 'fallback'
          })
        } catch (clipboardError) {
          console.error('Share failed:', clipboardError)
        }
      }
    }
  }

  const handleDownloadGuest = (guestName) => {
    const guest = dayData.guests.find(g => g.name === guestName)
    if (!guest) return

    // Build single-guest event object for ICS generation
    const guestEvent = {
      ...dayData,
      guests: [guest]
    }
    downloadIcs(date, guestEvent)
    logCustomEvent('download_ics', {
      date,
      guest_name: guestName,
      event_type: 'guest'
    })
  }

  // Guest card(s)
  if (dayData.dayType === 'guest' && dayData.guests && dayData.guests.length > 0) {
    if (dayData.guests.length === 1) {
      return renderGuestCard(dayData.guests[0])
    } else {
      return (
        <div className={styles.guestRow}>
          {dayData.guests.map((guest) => renderGuestCard(guest))}
        </div>
      )
    }
  }

  if (dayData.dayType === 'solo-talk') {
    return (
      <div className={`${styles.card} ${dayData.isPastDate ? styles.past : ''}`}>
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
        <div className={styles.cardActions}>
          <button
            className={styles.actionButton}
            onClick={() => handleShareSolo()}
            title="Share this event"
            aria-label="Share this solo talk event"
          >
            Share
          </button>
          <button
            className={styles.actionButton}
            onClick={handleDownloadSolo}
            title="Download as .ics calendar file"
            aria-label="Download calendar event"
          >
            Download .ics
          </button>
        </div>
      </div>
    )
  }

  const handleShareSolo = async () => {
    const url = `${window.location.origin}/og?date=${date}`
    const headshotPath = '/Speakers/Nate Default.jpg'
    const title = `Cyber Talks Calendar`
    const [year, month, day] = date.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    const dateStr = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })

    let text = `Join me for Cyber Talks on ${dateStr}\n`
    text += `\nTopic: ${dayData.topic || 'Solo Talk'}`
    if (displayTime) {
      text += `\nTime: ${displayTime}`
    }
    text += `\n\n${url}\nhttps://www.tiktok.com/@natebutlerexplains`

    try {
      const method = await shareEventWithImage({ title, text }, url, headshotPath)
      logCustomEvent('share_link', {
        date,
        event_type: 'solo-talk',
        method
      })
    } catch (error) {
      if (error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(url)
          logCustomEvent('share_link', {
            date,
            event_type: 'solo-talk',
            method: 'fallback'
          })
        } catch (clipboardError) {
          console.error('Share failed:', clipboardError)
        }
      }
    }
  }

  const handleDownloadSolo = () => {
    downloadIcs(date, dayData)
    logCustomEvent('download_ics', {
      date,
      event_type: 'solo-talk'
    })
  }

  return (
    <div className={`${styles.card} ${dayData.isPastDate ? styles.past : ''}`}>
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
      <div className={styles.cardActions}>
        <button
          className={styles.actionButton}
          onClick={() => handleShareOpen()}
          title="Share this event"
          aria-label="Share this open floor event"
          disabled
        >
          Share
        </button>
        <button
          className={styles.actionButton}
          onClick={handleDownloadOpen}
          title="Download not available for open floor events"
          aria-label="Download calendar event"
          disabled
        >
          Download .ics
        </button>
      </div>
    </div>
  )

  async function handleShareOpen() {
    const url = `${window.location.origin}/og?date=${date}`
    const headshotPath = '/Speakers/Nate Default.jpg'
    const title = `Cyber Talks Calendar`
    const [year, month, day] = date.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    const dateStr = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })

    let text = `Join me for Cyber Talks on ${dateStr}\nOpen floor discussion\n\n${url}\nhttps://www.tiktok.com/@natebutlerexplains`

    try {
      const method = await shareEventWithImage({ title, text }, url, headshotPath)
      logCustomEvent('share_link', {
        date,
        event_type: 'open-floor',
        method
      })
    } catch (error) {
      if (error.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(url)
          logCustomEvent('share_link', {
            date,
            event_type: 'open-floor',
            method: 'fallback'
          })
        } catch (clipboardError) {
          console.error('Share failed:', clipboardError)
        }
      }
    }
  }

  function handleDownloadOpen() {
    // Open floor downloads disabled
  }
}
