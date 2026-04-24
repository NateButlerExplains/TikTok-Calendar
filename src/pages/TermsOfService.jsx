// ===================
// © AngelaMos | 2026
// TermsOfService.jsx
// ===================

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { logCustomEvent } from '../firebase'
import '../styles/legal.css'

export function TermsOfService() {
  useEffect(() => {
    logCustomEvent('page_visited', { page: 'terms' })
  }, [])

  return (
    <div className="legal-page">
      <div className="legal-topStrip">
        <span className="legal-topStrip-left">CYB-DOC / TERMS</span>
        <span>FILE 03 / 04</span>
      </div>

      <header className="legal-header">
        <div className="legal-kicker">
          // DOC REV <em>//</em> 2026.04
        </div>
        <h1>Terms of <em>Service.</em></h1>
        <p>Last updated &middot; April 2026</p>
      </header>

      <main className="legal-content">
        <section>
          <h2>Use License</h2>
          <p>
            This site is provided for personal, non-commercial use. You may view the schedule,
            request a broadcast slot, and save events to your own calendar. You may not:
          </p>
          <ul>
            <li>Reproduce, redistribute, or sell content from this site</li>
            <li>Use this site for commercial purposes without permission</li>
            <li>Attempt unauthorized access to systems, data, or the operator console</li>
            <li>Submit fraudulent or automated booking requests</li>
          </ul>
        </section>

        <section>
          <h2>Booking Requests</h2>
          <p>
            Submitting a booking request is a non-binding expression of interest. Approval is at
            the sole discretion of Nate Butler. Submitted requests may be approved, declined, or
            deleted without notice. Approved slots may be rescheduled if circumstances change.
          </p>
        </section>

        <section>
          <h2>Guest Content</h2>
          <p>
            Guest names, handles, headshots, and topics are shown for scheduling purposes. Guest
            profiles belong to the respective creators. External links to TikTok profiles are
            governed by TikTok&rsquo;s terms of service.
          </p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            This site is provided &ldquo;as is&rdquo; without warranty of any kind. Cyber Talks
            and Nate Butler are not responsible for:
          </p>
          <ul>
            <li>Schedule changes, cancellations, or guest no-shows</li>
            <li>Technical issues, downtime, or data loss</li>
            <li>Content accessed via external links or third-party services</li>
            <li>Any damages arising from use of this site</li>
          </ul>
        </section>

        <section>
          <h2>Changes</h2>
          <p>
            These terms may be updated at any time. Continued use of the site constitutes
            acceptance of the current version.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about these terms:
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
