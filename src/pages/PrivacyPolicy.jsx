// ===================
// © AngelaMos | 2026
// PrivacyPolicy.jsx
// ===================

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { logCustomEvent } from '../firebase'
import '../styles/legal.css'

export function PrivacyPolicy() {
  useEffect(() => {
    logCustomEvent('page_visited', { page: 'privacy' })
  }, [])

  return (
    <div className="legal-page">
      <div className="legal-topStrip">
        <span className="legal-topStrip-left">CYB-DOC / PRIVACY</span>
        <span>FILE 01 / 04</span>
      </div>

      <header className="legal-header">
        <div className="legal-kicker">
          // DOC REV <em>//</em> 2026.04
        </div>
        <h1>Privacy <em>Policy.</em></h1>
        <p>Last updated &middot; April 2026</p>
      </header>

      <main className="legal-content">
        <section>
          <h2>Data Collection</h2>
          <p>
            This site uses Firebase Analytics to collect anonymous usage data &mdash; which pages
            you visit, how you interact with the calendar, and which views you prefer. The data
            helps us understand behavior and improve the experience.
          </p>
          <p>
            <strong>No personally identifiable information (PII)</strong> is collected.
            Names, emails, and precise location data are not stored. Analytics are pseudonymous
            and aggregated.
          </p>
        </section>

        <section>
          <h2>Booking Requests</h2>
          <p>
            If you request a broadcast slot, we store the <strong>TikTok handle you submit</strong>,
            the requested date, a timestamp, and a hashed IP for rate limiting. That&rsquo;s the
            entire record &mdash; no email, no phone, no account. Requests are visible to the
            operator (Nate) via a Telegram bot and are deleted after the event airs or is rejected.
          </p>
        </section>

        <section>
          <h2>Cookies &amp; Storage</h2>
          <p>
            The site uses a service worker to cache assets for fast loads and offline access.
            Browser local storage is used for a signed admin session token (operator only). No
            third-party tracking cookies are used.
          </p>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <ul>
            <li><strong>Firebase (Google)</strong> &mdash; Hosting, Analytics, Firestore</li>
            <li><strong>Google Fonts</strong> &mdash; Inter + JetBrains Mono delivery</li>
            <li><strong>Telegram Bot API</strong> &mdash; Operator notifications only</li>
          </ul>
          <p>
            Each service has its own privacy policy &mdash; review them for detail on how your
            data is handled upstream.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about this policy:
          </p>
          <p>
            <a href="https://www.tiktok.com/@natebutlerexplains" target="_blank" rel="noopener noreferrer">
              @natebutlerexplains on TikTok
            </a>
          </p>
        </section>

        <div className="legal-footer">
          <Link to="/" className="back-link">&larr; BACK TO SCHEDULE</Link>
        </div>
      </main>
    </div>
  )
}
