import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { removeBackground } from "./services/backgroundRemoval";
import { flipHorizontal } from "./services/flipImage";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;
const upload = multer({ storage: multer.memoryStorage() });

interface HealthResponse {
  status: string;
}

interface UploadSuccessResponse {
  success: true;
  message: string;
  size: number;
}

interface UploadErrorResponse {
  success: false;
  error: string;
}

app.use(cors());
app.use(express.json());

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
      const result = await flipHorizontal(noBg);
      res.json({
        success: true,
        message: "processed",
        size: result.length,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      res.status(502).json({ success: false, error: message });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
