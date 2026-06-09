import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { randomUUID } from "crypto";

dotenv.config();

import { config } from "./config";
import { removeBackground } from "./services/backgroundRemoval";
import { flipHorizontal } from "./services/flipImage";
import { uploadImage } from "./services/cloudStorage";
import { UpstreamError } from "./errors";
import deleteRouter from "./routes/delete";

const app = express();
const PORT = config.port;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type "${file.mimetype}". Allowed types: JPEG, PNG, WebP.`
        )
      );
    }
  },
});

interface HealthResponse {
  status: string;
}

interface UploadSuccessResponse {
  success: true;
  url: string;
  publicId: string;
}

interface UploadErrorResponse {
  success: false;
  error: string;
}

app.use(cors({ origin: config.frontendUrl }));
app.use(express.json());
app.use("/api/images", deleteRouter);

app.get("/health", (_req: Request, res: Response<HealthResponse>) => {
  res.json({ status: "ok" });
});

app.post(
  "/api/upload",
  upload.single("image"),
  async (
    req: Request,
    res: Response<UploadSuccessResponse | UploadErrorResponse>
  ) => {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No image file provided" });
      return;
    }

    try {
      const noBg = await removeBackground(req.file.buffer, req.file.mimetype);
      const flipped = await flipHorizontal(noBg);
      const filename = `processed-${randomUUID()}`;
      const { url, publicId } = await uploadImage(flipped, filename);
      res.json({ success: true, url, publicId });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      const status = err instanceof UpstreamError ? 502 : 500;
      res.status(status).json({ success: false, error: message });
    }
  }
);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    res
      .status(413)
      .json({ success: false, error: "File too large. Maximum size is 20 MB." });
    return;
  }
  const message = err instanceof Error ? err.message : "Unexpected error";
  // File-filter rejections (invalid MIME type) arrive as plain Error instances
  if (err instanceof Error && err.message.startsWith("Invalid file type")) {
    res.status(400).json({ success: false, error: message });
    return;
  }
  res.status(500).json({ success: false, error: message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
