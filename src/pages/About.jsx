import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logCustomEvent } from '../firebase';
import '../styles/legal.css';

export function About() {
  useEffect(() => {
    logCustomEvent('page_visited', { page: 'about' })
  }, [])

  return (
    <div className="legal-page">
      <header className="legal-header">
        <h1>About Cyber Talks</h1>
      </header>

      <main className="legal-content">
        <section>
          <h2>What is Cyber Talks?</h2>
          <p>
            Cyber Talks is a daily TikTok live stream dedicated to exploring cybersecurity topics
            and hosting conversations with industry experts, researchers, and thought leaders in
            the cybersecurity space.
          </p>
        </section>

        <section>
          <h2>Our Mission</h2>
          <p>
            We aim to make cybersecurity knowledge accessible, engaging, and relevant to everyone—from
            beginners curious about security basics to professionals seeking deep technical insights.
          </p>
        </section>

        <section>
          <h2>About the Creator</h2>
          <p>
            <strong>Nate Butler</strong> (@natebutlerexplains) creates Cyber Talks to share
            cybersecurity education and foster conversation about security topics. With a passion
            for teaching and industry expertise, Nate brings guests from across the cybersecurity
            community to discuss relevant topics, emerging threats, and best practices.
          </p>
          <p>
            <a
              href="https://www.tiktok.com/@natebutlerexplains"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-link"
            >
              Follow @natebutlerexplains on TikTok
            </a>
          </p>
        </section>

        <section>
          <h2>This Calendar</h2>
          <p>
            This calendar helps viewers discover when Cyber Talks streams go live, learn about
            featured guests, and quickly add events to their personal calendars. It's a simple
            tool designed to make it easier to tune in to episodes you're interested in.
          </p>
        </section>

        <div className="legal-footer">
          <Link to="/" className="back-link">← Back to Calendar</Link>
        </div>
      </main>
    </div>
  );
}
