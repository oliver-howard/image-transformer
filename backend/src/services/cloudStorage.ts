import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import { config } from "../config";
import { UpstreamError } from "../errors";

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
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { public_id: filename, overwrite: true },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          reject(new UpstreamError(`Cloudinary upload failed: ${error.message}`));
        } else if (!result) {
          reject(new UpstreamError("Cloudinary upload returned no result"));
        } else {
          resolve(result);
        }
      }
    );
    stream.end(imageBuffer);
  });

  if (!result.secure_url) {
    throw new UpstreamError("Cloudinary upload did not return a secure URL");
  }

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
  // Cloudinary's destroy() returns { result: 'not found' } when the resource doesn't exist
  // See: https://cloudinary.com/documentation/image_upload_api_reference#destroy_method
  if (result.result === "not found") {
    throw new ImageNotFoundError(publicId);
  }
}
