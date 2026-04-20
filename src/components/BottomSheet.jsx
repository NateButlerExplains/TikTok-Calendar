import styles from './BottomSheet.module.css';

export function BottomSheet({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className={styles.overlay}
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className={styles.sheet}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <div className={styles.content}>{children}</div>
      </div>
    </>
  );
}
