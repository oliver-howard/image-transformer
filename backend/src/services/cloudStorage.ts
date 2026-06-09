import { v2 as cloudinary } from "cloudinary";
import { config } from "../config";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

interface UploadResult {
  url: string;
  publicId: string;
}

export async function uploadImage(
  imageBuffer: Buffer,
  filename: string
): Promise<UploadResult> {
  const dataUri = `data:image/png;base64,${imageBuffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    public_id: filename,
    overwrite: true,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export class ImageNotFoundError extends Error {
  constructor(publicId: string) {
    super(`Image not found: ${publicId}`);
    this.name = "ImageNotFoundError";
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  const result = await cloudinary.uploader.destroy(publicId);
  if (result.result === "not found") {
    throw new ImageNotFoundError(publicId);
  }
}
