import { Request, Response } from "express";
import { DicomService } from "../service/dicom.service";

/**
 * Controller for handling DICOM file operations.
 */
export class DicomController {
  /**
   * Upload a DICOM file.
   * @param req Request object.
   * @param res Response object.
   * @returns Response with the uploaded file path.
   */
  public static async uploadDicom(req: Request, res: Response): Promise<void> {
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: "DICOM file is required" });
      return;
    }

    res.json({ message: "File uploaded successfully", filePath: file.path, fileId: file.filename });
  }

  /**
   * Convert a DICOM file to PNG format.
   * @param req Request object.
   * @param res Response object.
   * @returns Response with the converted PNG file path.
   */
  public static async convertToPng(req: Request, res: Response): Promise<void> {
    const { fileId } = req.query as { fileId: string };

    if (!fileId) {
      res.status(400).json({ error: "fileId query parameter is required" });
      return;
    }

    try {
      const outputFilePath = DicomService.convertDicomToPng(fileId);
      res.json({ message: "DICOM file successfully converted to PNG", outputFilePath });
    } catch (error) {
      console.error("Error converting DICOM to PNG:", error);
      res.status(500).json({ error: "Failed to convert DICOM to PNG" });
    }
  }

  /**
   *  Extract a DICOM tag from a DICOM file.
   * @param req Request object.
   * @param res Response object.
   * @returns Response with the extracted DICOM tag value.
   */
  public static async getDicomTag(req: Request, res: Response): Promise<void> {
    const { fileId, tag } = req.query as { fileId: string; tag: string };

    if (!fileId || !tag) {
      res.status(400).json({ error: "fileId and tag query parameters are required" });
      return;
    }

    try {
      const value = DicomService.extractDicomTag(fileId, tag);
      if (value) {
        res.json({ tag, value });
      } else {
        res.json({ tag, value: "Tag not found or empty" });
      }
    } catch (error) {
      console.error("Error extracting DICOM tag:", error);
      res.status(500).json({ error: "Failed to extract DICOM tag" });
    }
  }
}
