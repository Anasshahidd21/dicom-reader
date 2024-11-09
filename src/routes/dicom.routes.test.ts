import { Request, Response } from "express";
import { DicomService } from "../service/dicom.service";
import { DicomController } from "../controller/dicom.controller";

jest.mock("../service/dicom.service");

describe("DicomController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe("uploadDicom", () => {
    test("should return 400 if no file is provided", async () => {
      req.file = undefined;

      await DicomController.uploadDicom(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "DICOM file is required" });
    });

    test("should return filePath and fileId if file is provided", async () => {
      req.file = { filename: "test-file", path: "public/uploads/test-file" } as any;

      await DicomController.uploadDicom(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({
        message: "File uploaded successfully",
        filePath: "public/uploads/test-file",
        fileId: "test-file",
      });
    });
  });

  describe("convertToPng", () => {
    test("should return 400 if fileId is missing", async () => {
      req.query = {};

      await DicomController.convertToPng(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "fileId query parameter is required" });
    });

    test("should return converted PNG file path on success", async () => {
      req.query = { fileId: "test-file" };
      (DicomService.convertDicomToPng as jest.Mock).mockReturnValue("public/exports/test.png");

      await DicomController.convertToPng(req as Request, res as Response);

      expect(DicomService.convertDicomToPng).toHaveBeenCalledWith("test-file");
      expect(res.json).toHaveBeenCalledWith({
        message: "DICOM file successfully converted to PNG",
        outputFilePath: "public/exports/test.png",
      });
    });

    test("should return 500 if conversion fails", async () => {
      req.query = { fileId: "test-file" };
      (DicomService.convertDicomToPng as jest.Mock).mockImplementation(() => {
        throw new Error("Conversion error");
      });

      await DicomController.convertToPng(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to convert DICOM to PNG" });
    });
  });

  describe("getDicomTag", () => {
    test("should return 400 if fileId or tag is missing", async () => {
      req.query = { fileId: undefined, tag: undefined };

      await DicomController.getDicomTag(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "fileId and tag query parameters are required" });
    });

    test("should return extracted DICOM tag value on success", async () => {
      req.query = { fileId: "test-file", tag: "x00100010" };
      (DicomService.extractDicomTag as jest.Mock).mockReturnValue("John Doe");

      await DicomController.getDicomTag(req as Request, res as Response);

      expect(DicomService.extractDicomTag).toHaveBeenCalledWith("test-file", "x00100010");
      expect(res.json).toHaveBeenCalledWith({ tag: "x00100010", value: "John Doe" });
    });

    test("should return 'Tag not found or empty' if tag value is undefined", async () => {
      req.query = { fileId: "test-file", tag: "x00100010" };
      (DicomService.extractDicomTag as jest.Mock).mockReturnValue(undefined);

      await DicomController.getDicomTag(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({ tag: "x00100010", value: "Tag not found or empty" });
    });

    test("should return 500 if tag extraction fails", async () => {
      req.query = { fileId: "test-file", tag: "x00100010" };
      (DicomService.extractDicomTag as jest.Mock).mockImplementation(() => {
        throw new Error("Extraction error");
      });

      await DicomController.getDicomTag(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to extract DICOM tag" });
    });
  });
});
