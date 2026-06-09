import { useState } from "react";
import { useImageUpload } from "./hooks/useImageUpload";
import { UploadZone } from "./components/UploadZone";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ImageGallery } from "./components/ImageGallery";
import { downloadImage } from "./utils/download";
import styles from "./App.module.css";

export default function App() {
  const { uploadState, images, upload, remove, processAnother, dismissError } = useImageUpload();
  const [copied, setCopied] = useState(false);

  async function handleCopy(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }


  const previewUrl =
    uploadState.status === "success" ? uploadState.url : null;

  return (
    <div className={styles.page}>
      <div className={styles.hero}>

        {/* Left column */}
        <div className={styles.left}>
          <header className={styles.header}>
            <h1 className={styles.title}>Image Transformer</h1>
            <p className={styles.subtitle}>
              Remove backgrounds and flip images in seconds.
            </p>
          </header>

          <div className={styles.card}>
            {uploadState.status === "idle" && <UploadZone onFile={upload} />}

            {uploadState.status === "uploading" && <LoadingSpinner />}

            {uploadState.status === "success" && (
              <div className={styles.successPanel}>
                <p className={styles.successLabel}>Done! Your image is ready.</p>
                <div className={styles.resultUrlRow}>
                  <span className={styles.resultUrl}>{uploadState.url}</span>
                  <button className={styles.copyBtn} onClick={() => handleCopy(uploadState.url)}>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className={styles.successActions}>
                  <div className={styles.successActionsLeft}>
                    <a
                      href={uploadState.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.actionBtn}
                    >
                      Open
                    </a>
                    <button
                      className={styles.actionBtn}
                      onClick={() => downloadImage(uploadState.url, uploadState.publicId)}
                    >
                      Download
                    </button>
                  </div>
                  <button className={styles.processAnotherBtn} onClick={processAnother}>
                    Process another
                  </button>
                </div>
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
        </div>

        {/* Right column */}
        <div className={styles.right}>
          {previewUrl ? (
            <div className={styles.previewWrap}>
              <img src={previewUrl} alt="Processed result" className={styles.previewImage} />
            </div>
          ) : (
            <div className={styles.placeholder}>
              <p className={styles.placeholderText}>Your result will appear here</p>
            </div>
          )}
        </div>

      </div>

      {images.length > 0 && (
        <div className={styles.gallerySection}>
          <ImageGallery images={images} onDelete={remove} />
        </div>
      )}
    </div>
  );
}
