import { Router } from "express";
import { UploadMiddleware } from "../middleware/upload.middleware";
import { DicomController } from "../controller/dicom.controller";

/**
 * Routes for DICOM operations.
 */
export class DicomRoutes {
  public static getRoutes(): Router {
    const router = Router();
    // Upload DICOM file
    router.post("/", UploadMiddleware.upload, DicomController.uploadDicom);
    // Convert DICOM to PNG
    router.get("/", DicomController.convertToPng);
    // Extract DICOM Tag
    router.get("/extract", DicomController.getDicomTag);
    return router;
  }
}
