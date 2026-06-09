import { Router, Request, Response } from "express";
import { deleteImage, ImageNotFoundError } from "../services/cloudStorage";

interface DeleteSuccessResponse {
  success: true;
  message: string;
}

interface DeleteErrorResponse {
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

    try {
      await deleteImage(publicId);
      res.json({ success: true, message: "Image deleted" });
    } catch (err) {
      if (err instanceof ImageNotFoundError) {
        res.status(404).json({ error: "Image not found" });
        return;
      }
      const message = err instanceof Error ? err.message : "Unexpected error";
      res.status(502).json({ error: message });
    }
  }
);

export default router;
