import { useState } from "react";
import { useImageUpload } from "./hooks/useImageUpload";
import { UploadZone } from "./components/UploadZone";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ImageGallery } from "./components/ImageGallery";
import styles from "./App.module.css";

export default function App() {
  const { uploadState, images, upload, remove, processAnother, dismissError } = useImageUpload();
  const [copied, setCopied] = useState(false);

  async function handleCopy(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Image Transformation Service</h1>
        <p className={styles.subtitle}>Remove background &amp; flip</p>
      </header>

      <main className={styles.content}>
        <div className={styles.card}>
          {uploadState.status === "idle" && (
            <UploadZone onFile={upload} />
          )}

          {uploadState.status === "uploading" && <LoadingSpinner />}

          {uploadState.status === "success" && (
            <div className={styles.result}>
              <div className={styles.resultImageWrap}>
                <img src={uploadState.url} alt="Processed result" className={styles.resultImage} />
              </div>
              <div className={styles.resultUrlRow}>
                <span className={styles.resultUrl}>{uploadState.url}</span>
                <button className={styles.copyBtn} onClick={() => handleCopy(uploadState.url)}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <button className={styles.processAnotherBtn} onClick={processAnother}>
                Process another
              </button>
            </div>
          )}

          {uploadState.status === "error" && (
            <div className={styles.errorState}>
              <p className={styles.errorMessage}>{uploadState.error}</p>
              <button className={styles.dismissBtn} onClick={dismissError}>
                Try again
              </button>
            </div>
          )}
        </div>

        <ImageGallery images={images} onDelete={remove} />
      </main>
    </div>
  );
}
