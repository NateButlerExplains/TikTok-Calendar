// ===================
// © AngelaMos | 2026
// Contact.jsx
// ===================

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { logCustomEvent } from '../firebase'
import '../styles/legal.css'

export function Contact() {
  useEffect(() => {
    logCustomEvent('page_visited', { page: 'contact' })
  }, [])

  return (
    <div className="legal-page">
      <div className="legal-topStrip">
        <span className="legal-topStrip-left">CYB-DOC / CONTACT</span>
        <span>FILE 04 / 04</span>
      </div>

      <header className="legal-header">
        <div className="legal-kicker">
          // INBOUND CHANNEL <em>//</em> CYBER TALKS
        </div>
        <h1>Open a <em>Channel.</em></h1>
        <p>Guest suggestions &middot; Feedback &middot; Questions</p>
      </header>

      <main className="legal-content">
        <section>
          <h2>Reach Out</h2>
          <p>
            Want to pitch a guest, suggest a topic, or send feedback? Easiest path is below.
          </p>
        </section>

        <section className="contact-options">
          <div className="contact-item">
            <h3>TikTok DM</h3>
            <p>Primary inbound channel &mdash; fastest reply.</p>
            <a
              href="https://www.tiktok.com/@natebutlerexplains"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-link"
            >
              @natebutlerexplains
            </a>
          </div>
        </section>

        <section>
          <h2>Response Window</h2>
          <p>
            Most messages get a reply within a day or two. Live-stream days push replies to the
            next morning &mdash; appreciate the patience.
          </p>
        </section>

        <div className="legal-footer">
          <Link to="/" className="back-link">&larr; BACK TO SCHEDULE</Link>
        </div>
      </main>
    </div>
  )
}
