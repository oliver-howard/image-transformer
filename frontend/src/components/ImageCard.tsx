import { useState } from "react";
import type { ImageRecord } from "../hooks/useImageUpload";
import styles from "./ImageCard.module.css";

interface Props {
  image: ImageRecord;
  onDelete: (publicId: string) => void;
}

export function ImageCard({ image, onDelete }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(image.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownload() {
    const response = await fetch(image.url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `${image.publicId}.png`;
    a.click();
    URL.revokeObjectURL(objectUrl);
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
        <img src={image.url} alt="Transformed" className={styles.image} />
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
              className={styles.actionBtn}
            >
              Open
            </a>
            <button className={styles.actionBtn} onClick={handleDownload}>
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
