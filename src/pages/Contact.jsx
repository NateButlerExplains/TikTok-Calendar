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
        <h1>Contact</h1>
        <p>Reach out to Cyber Talks</p>
      </header>

      <main className="legal-content">
        <section>
          <h2>Get in Touch</h2>
          <p>
            Want to reach out, suggest a guest, or have feedback about Cyber Talks? Here&rsquo;s how
            you can connect:
          </p>
        </section>

        <section className="contact-options">
          <div className="contact-item">
            <h3>TikTok</h3>
            <p>Follow and message on TikTok:</p>
            <a
              href="https://www.tiktok.com/@natebutlerexplains"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-link"
            >
              @natebutlerexplains
            </a>
          </div>

          <div className="contact-item">
            <h3>GitHub</h3>
            <p>Code and project discussions:</p>
            <a
              href="https://github.com/NateButlerExplains"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-link"
            >
              github.com/NateButlerExplains
            </a>
          </div>

          <div className="contact-item">
            <h3>Email</h3>
            <p>For direct inquiries, you can reach out via email:</p>
            <a href="mailto:contact@cybertalks.dev" className="cta-link">
              contact@cybertalks.dev
            </a>
          </div>
        </section>

        <section>
          <h2>Response Time</h2>
          <p>
            We appreciate all inquiries. Please allow time for a response, as we manage
            communications alongside live streams and other commitments.
          </p>
        </section>

        <div className="legal-footer">
          <Link to="/" className="back-link">&larr; BACK TO SCHEDULE</Link>
        </div>
      </main>
    </div>
  )
}
