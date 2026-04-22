import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logCustomEvent } from '../firebase';
import '../styles/legal.css';

export function Contact() {
  useEffect(() => {
    logCustomEvent('page_visited', { page: 'contact' })
  }, [])

  return (
    <div className="legal-page">
      <header className="legal-header">
        <h1>Contact</h1>
        <p>Reach out to Cyber Talks</p>
      </header>

      <main className="legal-content">
        <section>
          <h2>Get in Touch</h2>
          <p>
            Want to reach out, suggest a guest, or have feedback about Cyber Talks? Here's how
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
        </section>

        <section>
          <h2>Response Time</h2>
          <p>
            We appreciate all inquiries. Please allow time for a response, as we manage
            communications alongside live streams and other commitments.
          </p>
        </section>

        <div className="legal-footer">
          <Link to="/" className="back-link">← Back to Calendar</Link>
        </div>
      </main>
    </div>
  );
}
