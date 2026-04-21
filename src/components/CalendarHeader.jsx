import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { addDays, formatDateHeader } from '../utils/timeUtils';
import styles from './CalendarHeader.module.css';

export function CalendarHeader({ currentView, currentDate, onViewChange, onDateChange }) {
  const formattedDate = formatDateHeader(currentDate);

  const handlePrevDay = () => {
    onDateChange(addDays(currentDate, -1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(currentDate, 1));
  };

  const handleToggleView = () => {
    const newView = currentView === 'day' ? 'three-day' : 'day';
    onViewChange(newView);
  };

  return (
    <header className={styles.header}>
      <div className={styles.navSection}>
        <button
          className={styles.arrowButton}
          onClick={handlePrevDay}
          aria-label="Previous day"
        >
          ← Prev
        </button>
        <div className={styles.dateDisplay}>{formattedDate}</div>
        <button
          className={styles.arrowButton}
          onClick={handleNextDay}
          aria-label="Next day"
        >
          Next →
        </button>
      </div>

      <div className={styles.toggleSection}>
        <button
          className={styles.toggleButton}
          onClick={handleToggleView}
          aria-label="Toggle view"
        >
          {currentView === 'day' ? 'View: Day' : 'View: 3-Day'}
        </button>
      </div>
    </header>
  );
}
