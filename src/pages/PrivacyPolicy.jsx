import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logCustomEvent } from '../firebase';
import '../styles/legal.css';

export function PrivacyPolicy() {
  useEffect(() => {
    logCustomEvent('page_visited', { page: 'privacy' })
  }, [])

  return (
    <div className="legal-page">
      <header className="legal-header">
        <h1>Privacy Policy</h1>
        <p>Last updated: April 2026</p>
      </header>

      <main className="legal-content">
        <section>
          <h2>Data Collection</h2>
          <p>
            This website uses Firebase Analytics to collect anonymous usage data. We collect:
            information about which pages you visit, how you interact with the calendar, and
            which views you prefer. This data helps us understand user behavior and improve the
            calendar experience.
          </p>
          <p>
            <strong>We do not collect personally identifiable information (PII)</strong> such as
            names, email addresses, or location data. Analytics are pseudonymous and aggregated.
          </p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>
            This website uses a service worker (part of Progressive Web App technology) to cache
            assets and enable offline functionality. The service worker uses browser storage to
            cache content locally on your device. No tracking cookies are used.
          </p>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>
            This website uses the following third-party services:
          </p>
          <ul>
            <li><strong>Firebase (Google)</strong> — Hosting, Analytics, and Database services</li>
            <li><strong>Google Fonts</strong> — Web font delivery (Inter font)</li>
          </ul>
          <p>
            These services have their own privacy policies. Please review them for more information.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            If you have questions about this privacy policy, please contact:
          </p>
          <p>
            Nate Butler<br />
            <a href="https://www.tiktok.com/@natebutlerexplains" target="_blank" rel="noopener noreferrer">
              @natebutlerexplains on TikTok
            </a>
          </p>
        </section>

        <div className="legal-footer">
          <Link to="/" className="back-link">← Back to Calendar</Link>
        </div>
      </main>
    </div>
  );
}
