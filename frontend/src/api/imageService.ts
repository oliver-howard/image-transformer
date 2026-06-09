const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export interface UploadResult {
  url: string;
  publicId: string;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append("image", file);

  const response = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    body: form,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Upload failed");
  }
  return data as UploadResult;
}

export async function deleteImage(publicId: string): Promise<void> {
  const encoded = encodeURIComponent(publicId);
  const response = await fetch(`${BASE_URL}/api/images/${encoded}`, {
    method: "DELETE",
  });

  if (response.status === 404) return;

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error ?? "Delete failed");
  }
}
