import { useState } from "react";
import type { ImageRecord } from "../hooks/useImageUpload";
import { downloadImage } from "../utils/download";
import styles from "./ImageCard.module.css";

interface Props {
  image: ImageRecord;
  onDelete: (publicId: string) => void;
}

export function ImageCard({ image, onDelete }: Props) {
  const [copied, setCopied] = useState(false);
  const [broken, setBroken] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(image.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const date = new Date(image.uploadedAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        {broken ? (
          <div className={styles.brokenState}>
            <svg className={styles.brokenIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className={styles.brokenText}>Image no longer available</p>
          </div>
        ) : (
          <img
            src={image.url}
            alt="Transformed"
            className={styles.image}
            onError={() => setBroken(true)}
          />
        )}
      </div>
      <div className={styles.footer}>
        <span className={styles.date}>{date}</span>
        <div className={styles.urlRow}>
          <span className={styles.url}>{image.url}</span>
          <button className={styles.copyBtn} onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className={styles.actions}>
          <div className={styles.actionsLeft}>
            <a
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionBtn} ${broken ? styles.actionBtnDisabled : ""}`}
              aria-disabled={broken}
              onClick={broken ? (e) => e.preventDefault() : undefined}
            >
              Open
            </a>
            <button
              className={styles.actionBtn}
              onClick={() => downloadImage(image.url, image.publicId)}
              disabled={broken}
            >
              Download
            </button>
          </div>
          <button className={styles.deleteBtn} onClick={() => onDelete(image.publicId)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
