import { useRef, useState } from "react";
import type { DragEvent, ChangeEvent } from "react";
import styles from "./UploadZone.module.css";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

interface Props {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function UploadZone({ onFile, disabled = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validate(file: File): boolean {
    if (!ACCEPTED.includes(file.type)) {
      setError("Only JPG, PNG, and WebP files are accepted.");
      return false;
    }
    setError(null);
    return true;
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && validate(file)) onFile(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && validate(file)) onFile(file);
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.zone} ${dragging ? styles.dragging : ""} ${disabled ? styles.disabled : ""}`}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={disabled ? undefined : handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => e.key === "Enter" && !disabled && inputRef.current?.click()}
        aria-label="Upload image"
        aria-disabled={disabled}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p className={styles.primary}>Drag &amp; drop your image here</p>
        <p className={styles.secondary}>or <span className={styles.link}>click to browse</span></p>
        <p className={styles.hint}>JPG, PNG, WebP accepted</p>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className={styles.hidden}
        onChange={handleChange}
      />
    </div>
  );
}
