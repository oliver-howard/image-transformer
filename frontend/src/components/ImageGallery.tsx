import type { ImageRecord } from "../hooks/useImageUpload";
import { ImageCard } from "./ImageCard";
import styles from "./ImageGallery.module.css";

interface Props {
  images: ImageRecord[];
  onRequestDelete: (publicId: string) => void;
}

export function ImageGallery({ images, onRequestDelete }: Props) {
  if (images.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Transformed images</h2>
      <div className={styles.grid}>
        {images.map((img) => (
          <ImageCard key={img.publicId} image={img} onRequestDelete={onRequestDelete} />
        ))}
      </div>
    </section>
  );
}
