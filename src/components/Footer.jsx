// ===================
// © AngelaMos | 2026
// Footer.jsx
// ===================

import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.topRow}>
        <p className={styles.copyright}>
          <span className={styles.liveDot} /> &nbsp;&copy; 2026 CYBER TALKS &middot; NATE BUTLER
        </p>
        <a
          href="https://www.tiktok.com/@natebutlerexplains"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          @NATEBUTLEREXPLAINS &rarr;
        </a>
      </div>

      <nav className={styles.links}>
        <Link to="/privacy" className={styles.link}>PRIVACY</Link>
        <span className={styles.divider}>/</span>
        <Link to="/terms" className={styles.link}>TERMS</Link>
        <span className={styles.divider}>/</span>
        <Link to="/about" className={styles.link}>ABOUT</Link>
        <span className={styles.divider}>/</span>
        <Link to="/contact" className={styles.link}>CONTACT</Link>
      </nav>
    </footer>
  )
}
