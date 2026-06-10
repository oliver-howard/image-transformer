import { useState, useEffect } from "react";
import { uploadImage, deleteImage } from "../api/imageService";

export interface ImageRecord {
  publicId: string;
  url: string;
  uploadedAt: string;
}

type UploadState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "success"; url: string; publicId: string }
  | { status: "error"; error: string };

const STORAGE_KEY = "transformed-images";

function loadImages(): ImageRecord[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function useImageUpload() {
  const [images, setImages] = useState<ImageRecord[]>(loadImages);
  const [uploadState, setUploadState] = useState<UploadState>({ status: "idle" });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  }, [images]);

  async function upload(file: File) {
    setUploadState({ status: "uploading" });
    try {
      const result = await uploadImage(file);
      setImages((prev) => [
        { publicId: result.publicId, url: result.url, uploadedAt: new Date().toISOString() },
        ...prev,
      ]);
      setUploadState({ status: "success", url: result.url, publicId: result.publicId });
    } catch (err) {
      const error = err instanceof Error ? err.message : "Something went wrong";
      setUploadState({ status: "error", error });
    }
  }

  async function remove(publicId: string): Promise<void> {
    const snapshot = images.find((img) => img.publicId === publicId);
    setImages((prev) => prev.filter((img) => img.publicId !== publicId));
    try {
      await deleteImage(publicId);
    } catch (err) {
      if (snapshot) {
        setImages((prev) =>
          [...prev, snapshot].sort(
            (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
          )
        );
      }
      throw err;
    }
  }

  function processAnother() {
    setUploadState({ status: "idle" });
  }

  function dismissError() {
    setUploadState({ status: "idle" });
  }

  return { uploadState, images, upload, remove, processAnother, dismissError };
}
