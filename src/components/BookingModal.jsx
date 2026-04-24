// ===================
// © AngelaMos | 2026
// BookingModal.jsx
// ===================

import { useEffect, useRef, useState } from 'react'
import { httpsCallable } from 'firebase/functions'
import { functions, logCustomEvent } from '../firebase'
import { formatDateHeader } from '../utils/timeUtils'
import styles from './BookingModal.module.css'

const USERNAME_RE = /^@?[a-zA-Z0-9._-]{2,30}$/

function formatSerial(date) {
  const [y, m, d] = date.split('-')
  return `CYB-${y}.${m}.${d}`
}

export function BookingModal({ date, onClose }) {
  const [username, setUsername] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [successInfo, setSuccessInfo] = useState(null)
  const inputRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const validUsername = USERNAME_RE.test(username.trim())
  const canSubmit = validUsername && status !== 'submitting'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('submitting')
    setErrorMsg('')

    try {
      const call = httpsCallable(functions, 'createBooking')
      const res = await call({
        date,
        tiktokUsername: username.trim(),
        honeypot
      })
      setSuccessInfo(res.data)
      setStatus('success')
      logCustomEvent('booking_submitted', { date })
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMsg(
        err?.message?.replace(/^.*?\//, '') ||
          'Something went wrong. Try again in a moment.'
      )
    }
  }

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="presentation"
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        ref={dialogRef}
      >
        <div className={styles.termBar}>
          <span className={styles.termBarLabel}>
            {status === 'success' ? 'TRANSMISSION LOGGED' : 'REQUEST A SLOT'}
          </span>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {status === 'success' ? (
          <div className={styles.success}>
            <span className={styles.successKicker}>RECEIVED &middot; {formatSerial(date)}</span>
            <h2 id="booking-title" className={styles.successTitle}>
              Request <em>sent.</em>
            </h2>
            <p className={styles.successBody}>
              Nate just got a Telegram ping &mdash; he&rsquo;ll review your request shortly.
              Your date will show as{' '}
              <span className={styles.pendingInline}>PENDING</span>{' '}
              on the calendar until he confirms.
            </p>
            <button type="button" className={styles.submitButton} onClick={onClose}>
              GOT IT
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.formBody}>
            <div className={styles.kicker}>
              {formatSerial(date)} <em>//</em> TRANSMISSION SLOT
            </div>
            <h2 id="booking-title" className={styles.title}>
              Request <em>this</em> date
            </h2>
            <p className={styles.date}>{formatDateHeader(date)}</p>

            <label htmlFor="tiktok-username" className={styles.label}>
              Your TikTok Handle
            </label>
            <div className={styles.inputWrap}>
              <span className={styles.at}>@</span>
              <input
                id="tiktok-username"
                ref={inputRef}
                type="text"
                autoComplete="off"
                spellCheck="false"
                autoCapitalize="none"
                className={styles.input}
                placeholder="yourhandle"
                value={username.replace(/^@/, '')}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={31}
                disabled={status === 'submitting'}
              />
            </div>
            {username && !validUsername && (
              <p className={styles.hint}>Letters, numbers, dots, _ or &mdash;. 2-30 chars.</p>
            )}

            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className={styles.honeypot}
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              aria-hidden="true"
            />

            {errorMsg && <p className={styles.error}>{errorMsg}</p>}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={!canSubmit}
            >
              {status === 'submitting' ? 'SENDING\u2026' : 'SEND REQUEST'}
            </button>

            <p className={styles.fineprint}>
              Nate approves or declines from Telegram.
              <br />One request per IP / hour.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
