import { useEffect } from "react";
import styles from "./ConfirmModal.module.css";

interface Props {
  publicId: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ publicId, onConfirm, onCancel }: Props) {
  useEffect(() => {
    if (!publicId) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [publicId, onCancel]);

  if (!publicId) return null;

  function handleTabTrap(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;
    const focusable = e.currentTarget.querySelectorAll<HTMLElement>("button");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleTabTrap}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmModalMessage"
      >
        <p id="confirmModalMessage" className={styles.message}>
          Delete this image? This can't be undone.
        </p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button className={styles.deleteBtn} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
