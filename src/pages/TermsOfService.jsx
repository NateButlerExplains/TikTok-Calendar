import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logCustomEvent } from '../firebase';
import '../styles/legal.css';

export function TermsOfService() {
  useEffect(() => {
    logCustomEvent('page_visited', { page: 'terms' })
  }, [])

  return (
    <div className="legal-page">
      <header className="legal-header">
        <h1>Terms of Service</h1>
        <p>Last updated: April 2026</p>
      </header>

      <main className="legal-content">
        <section>
          <h2>Use License</h2>
          <p>
            This website is provided for personal, non-commercial use only. You may view and use
            the Cyber Talks Calendar to discover live stream schedules and guest information. You
            may not:
          </p>
          <ul>
            <li>Reproduce, distribute, or sell content from this website</li>
            <li>Use this website for commercial purposes without permission</li>
            <li>Attempt to gain unauthorized access to systems or data</li>
          </ul>
        </section>

        <section>
          <h2>Guest Information & Content</h2>
          <p>
            Guest information, headshots, and stream schedules are provided for informational
            purposes. Guest profiles are owned by the respective guests and creators. External
            links to TikTok profiles are governed by TikTok's terms of service.
          </p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>
            This website is provided "as is" without warranties of any kind. Cyber Talks and Nate
            Butler are not responsible for:
          </p>
          <ul>
            <li>Changes to stream schedules or guest information</li>
            <li>Technical issues or downtime</li>
            <li>Content from external links or third-party services</li>
            <li>Any damages resulting from use of this website</li>
          </ul>
        </section>

        <section>
          <h2>Changes to Terms</h2>
          <p>
            These terms may be updated at any time. Continued use of the website constitutes
            acceptance of updated terms.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            For questions about these terms, please contact:
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
