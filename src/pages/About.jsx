// ===================
// © AngelaMos | 2026
// About.jsx
// ===================

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { logCustomEvent } from '../firebase'
import '../styles/legal.css'

export function About() {
  useEffect(() => {
    logCustomEvent('page_visited', { page: 'about' })
  }, [])

  return (
    <div className="legal-page">
      <div className="legal-topStrip">
        <span className="legal-topStrip-left">CYB-DOC / ABOUT</span>
        <span>FILE 02 / 04</span>
      </div>

      <header className="legal-header">
        <div className="legal-kicker">
          // SIGNAL ORIGIN <em>//</em> CYBER TALKS
        </div>
        <h1>About <em>Cyber Talks.</em></h1>
        <p>Est. 2026 &middot; Broadcast Ops &middot; Nate Butler</p>
      </header>

      <main className="legal-content">
        <section>
          <h2>What is Cyber Talks?</h2>
          <p>
            Cyber Talks is a live TikTok broadcast dedicated to cybersecurity &mdash; deep-diving
            technical topics, hosting industry guests, and fielding questions in real time from
            the community.
          </p>
        </section>

        <section>
          <h2>Mission</h2>
          <p>
            Make cybersecurity knowledge accessible, technical, and honest. For curious beginners
            and senior operators alike &mdash; no fluff, no vendor spin.
          </p>
        </section>

        <section>
          <h2>The Operator</h2>
          <p>
            <strong>Nate Butler</strong> (@natebutlerexplains) hosts Cyber Talks. He brings in guests
            from across the security community to discuss current threats, emerging practices, and
            the unglamorous realities of the work.
          </p>
          <p>
            <a
              href="https://www.tiktok.com/@natebutlerexplains"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-link"
            >
              Follow on TikTok
            </a>
          </p>
        </section>

        <section>
          <h2>This Calendar</h2>
          <p>
            A live broadcast schedule &mdash; see who&rsquo;s up next, request a slot, save an event
            to your calendar, and follow along. If you&rsquo;re a creator who wants to come on, tap
            an open date and drop your handle.
          </p>
        </section>

        <div className="legal-footer">
          <Link to="/" className="back-link">&larr; BACK TO SCHEDULE</Link>
        </div>
      </main>
    </div>
  )
}
