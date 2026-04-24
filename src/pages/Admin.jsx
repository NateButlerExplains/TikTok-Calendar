// ===================
// © AngelaMos | 2026
// Admin.jsx
// ===================

import { useCallback, useEffect, useState } from 'react'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../firebase'
import styles from './Admin.module.css'

const TOKEN_KEY = 'cybertalks_admin_token'

function readTokenFromLocation() {
  const params = new URLSearchParams(window.location.search)
  return params.get('t')
}

export function AdminPage() {
  const [adminToken, setAdminToken] = useState(() => {
    const fromUrl = typeof window !== 'undefined' ? readTokenFromLocation() : null
    if (fromUrl) {
      try {
        localStorage.setItem(TOKEN_KEY, fromUrl)
      } catch {}
      const params = new URLSearchParams(window.location.search)
      params.delete('t')
      const qs = params.toString()
      window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
      return fromUrl
    }
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  })

  const [bookings, setBookings] = useState([])
  const [events, setEvents] = useState([])
  const [config, setConfig] = useState({ bookingLocked: false })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    if (!adminToken) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const [bookingsRes, eventsRes] = await Promise.all([
        httpsCallable(functions, 'adminListBookings')({ adminToken }),
        httpsCallable(functions, 'adminListEvents')({ adminToken })
      ])
      setBookings(bookingsRes.data.bookings || [])
      setEvents(eventsRes.data.events || [])
    } catch (err) {
      setError(err?.message || 'Failed to load admin data')
      if (err?.code === 'functions/unauthenticated' || err?.code === 'functions/permission-denied') {
        setAdminToken(null)
        try { localStorage.removeItem(TOKEN_KEY) } catch {}
      }
    } finally {
      setLoading(false)
    }
  }, [adminToken])

  useEffect(() => { refresh() }, [refresh])

  const handleLockToggle = async () => {
    setBusy(true)
    try {
      const res = await httpsCallable(functions, 'adminSetLock')({
        adminToken,
        locked: !config.bookingLocked
      })
      setConfig({ bookingLocked: res.data.locked })
    } catch (err) {
      setError(err?.message || 'Failed to toggle lock')
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Delete this booking?')) return
    setBusy(true)
    try {
      await httpsCallable(functions, 'adminDeleteBooking')({ adminToken, bookingId })
      await refresh()
    } catch (err) {
      setError(err?.message || 'Failed to delete')
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Delete this event?')) return
    setBusy(true)
    try {
      await httpsCallable(functions, 'adminDeleteEvent')({ adminToken, eventId })
      await refresh()
    } catch (err) {
      setError(err?.message || 'Failed to delete')
    } finally {
      setBusy(false)
    }
  }

  const handleLogout = () => {
    try { localStorage.removeItem(TOKEN_KEY) } catch {}
    setAdminToken(null)
  }

  if (!adminToken) {
    return (
      <div className={styles.container}>
        <div className={styles.topStrip}>
          <span className={styles.topStripLeft}>CYB-ADMIN / MISSION CONTROL</span>
          <span>AUTH REQUIRED</span>
        </div>
        <div className={styles.card}>
          <div className={styles.titleKicker}>// SESSION // IDLE</div>
          <h1 className={styles.title}>
            Mission <em>Control.</em>
          </h1>
          <p className={styles.subtitle}>
            DM <code>/admin</code> to the Telegram bot to receive a signed magic link.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.topStrip}>
        <span className={styles.topStripLeft}>CYB-ADMIN / MISSION CONTROL</span>
        <span>SESSION: ACTIVE</span>
      </div>

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.titleKicker}>// OPS &mdash; CYBER TALKS BROADCAST</div>
          <h1 className={styles.title}>
            Mission <em>Control.</em>
          </h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryButton} onClick={refresh} disabled={loading || busy}>
            Refresh
          </button>
          <button className={styles.secondaryButton} onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Public Booking</h2>
          <button
            className={config.bookingLocked ? styles.dangerButton : styles.primaryButton}
            onClick={handleLockToggle}
            disabled={busy}
          >
            {config.bookingLocked ? 'LOCKED · UNLOCK' : 'OPEN · LOCK'}
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Bookings</h2>
          <span className={styles.serial}>{bookings.length} ENTRIES</span>
        </div>
        {loading ? (
          <p className={styles.muted}>LOADING&hellip;</p>
        ) : bookings.length === 0 ? (
          <p className={styles.muted}>NO BOOKINGS YET</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>TikTok</th>
                  <th>Status</th>
                  <th>Topic</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.date}</td>
                    <td>
                      <a
                        href={`https://www.tiktok.com/@${b.tiktokUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @{b.tiktokUsername}
                      </a>
                    </td>
                    <td>
                      <span className={`${styles.statusPill} ${styles[`status_${b.status}`]}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className={styles.topicCell}>{b.topic || <span className={styles.subText}>&mdash;</span>}</td>
                    <td className={styles.rightAlign}>
                      <button
                        className={styles.iconButton}
                        onClick={() => handleDeleteBooking(b.id)}
                        disabled={busy}
                        aria-label="Delete"
                        title="Delete"
                      >
                        DEL
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Events</h2>
          <span className={styles.serial}>{events.length} ENTRIES</span>
        </div>
        {loading ? (
          <p className={styles.muted}>LOADING&hellip;</p>
        ) : events.length === 0 ? (
          <p className={styles.muted}>NO EVENTS</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Guest / Topic</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id}>
                    <td>{e.date}</td>
                    <td>{(e.dayType || '').toUpperCase()}</td>
                    <td>
                      <span className={`${styles.statusPill} ${styles[`status_${e.status || 'published'}`]}`}>
                        {e.status || 'published'}
                      </span>
                    </td>
                    <td className={styles.topicCell}>
                      {e.guests?.[0]?.name || e.topic || <span className={styles.subText}>&mdash;</span>}
                      {e.guests?.[0]?.topic && (
                        <div className={styles.subText}>{e.guests[0].topic}</div>
                      )}
                    </td>
                    <td className={styles.rightAlign}>
                      <button
                        className={styles.iconButton}
                        onClick={() => handleDeleteEvent(e.id)}
                        disabled={busy}
                        aria-label="Delete"
                        title="Delete"
                      >
                        DEL
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
