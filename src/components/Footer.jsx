import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.section}>
        <p className={styles.copyright}>
          © 2026 Cyber Talks • Nate Butler
        </p>
      </div>

      <div className={styles.section}>
        <nav className={styles.links}>
          <Link to="/privacy" className={styles.link}>Privacy Policy</Link>
          <span className={styles.divider}>•</span>
          <Link to="/terms" className={styles.link}>Terms of Service</Link>
          <span className={styles.divider}>•</span>
          <Link to="/about" className={styles.link}>About</Link>
          <span className={styles.divider}>•</span>
          <Link to="/contact" className={styles.link}>Contact</Link>
        </nav>
      </div>

      <div className={styles.section}>
        <p className={styles.tagline}>
          <a
            href="https://www.tiktok.com/@natebutlerexplains"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            @natebutlerexplains
          </a>
        </p>
      </div>
    </footer>
  );
}
