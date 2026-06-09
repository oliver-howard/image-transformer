import { Router, Request, Response } from "express";
import { deleteImage, ImageNotFoundError } from "../services/cloudStorage";

interface DeleteSuccessResponse {
  success: true;
  message: string;
}

interface DeleteErrorResponse {
  success: false;
  error: string;
}

const router = Router();

router.delete(
  "/:publicId",
  async (
    req: Request<{ publicId: string }>,
    res: Response<DeleteSuccessResponse | DeleteErrorResponse>
  ) => {
    const publicId = decodeURIComponent(req.params.publicId);

    if (!publicId || publicId.trim().length === 0) {
      res.status(400).json({ success: false, error: "Invalid image ID" });
      return;
    }

    if (publicId.includes("..") || publicId.startsWith("/")) {
      res.status(400).json({ success: false, error: "Invalid image ID" });
      return;
    }

    try {
      await deleteImage(publicId);
      res.json({ success: true, message: "Image deleted" });
    } catch (err) {
      if (err instanceof ImageNotFoundError) {
        res.status(404).json({ success: false, error: "Image not found" });
        return;
      }
      const message = err instanceof Error ? err.message : "Unexpected error";
      res.status(502).json({ success: false, error: message });
    }
  }
);

export default router;
