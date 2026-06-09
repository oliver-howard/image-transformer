import styles from "./LoadingSpinner.module.css";

export function LoadingSpinner() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} aria-hidden="true" />
      <p className={styles.text}>Processing your image…</p>
    </div>
  );
}
