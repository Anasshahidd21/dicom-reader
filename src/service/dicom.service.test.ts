import fs from "fs";
import path from "path";
import dicomParser from "dicom-parser";
import { DicomService } from "./dicom.service";

jest.mock("fs");
jest.mock("dicom-parser");

describe("DicomService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should extract DICOM tag value", () => {
    const mockBuffer = Buffer.from([]);
    (fs.readFileSync as jest.Mock).mockReturnValue(mockBuffer);

    const mockDataSet = { string: jest.fn().mockReturnValue("John Doe") };
    (dicomParser.parseDicom as jest.Mock).mockReturnValue(mockDataSet);

    const value = DicomService.extractDicomTag("test-file", "x00100010");
    expect(value).toBe("John Doe");
  });

  test("should throw error if pixel data is missing during PNG conversion", () => {
    const mockBuffer = Buffer.from([]);
    (fs.readFileSync as jest.Mock).mockReturnValue(mockBuffer);

    const mockDataSet = {
      elements: {},
      uint16: jest.fn().mockReturnValue(undefined),
    };
    (dicomParser.parseDicom as jest.Mock).mockReturnValue(mockDataSet);

    expect(() => DicomService.convertDicomToPng("test-file")).toThrow("Pixel data not found in the DICOM file");
  });

  test("should use default width and height if not specified", () => {
    // Create a larger buffer to accommodate pixel data
    const mockBuffer = Buffer.from(new Array(2048).fill(0));
    (fs.readFileSync as jest.Mock).mockReturnValue(mockBuffer);

    const mockDataSet = {
      elements: { x7fe00010: { dataOffset: 0, length: 2048 } },
      uint16: jest.fn().mockReturnValue(undefined),
    };
    (dicomParser.parseDicom as jest.Mock).mockReturnValue(mockDataSet);

    (fs.writeFileSync as jest.Mock).mockReturnValue(undefined);

    const outputFilePath = DicomService.convertDicomToPng("test-file");
    expect(outputFilePath).toContain("dicom-image-");
  });

  test("should create output directory if it does not exist", () => {
    const mockBuffer = Buffer.from(new Array(2048).fill(0));
    (fs.readFileSync as jest.Mock).mockReturnValue(mockBuffer);

    const mockDataSet = {
      elements: { x7fe00010: { dataOffset: 0, length: 2048 } },
      uint16: jest.fn().mockReturnValue(512),
    };
    (dicomParser.parseDicom as jest.Mock).mockReturnValue(mockDataSet);

    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.mkdirSync as jest.Mock).mockReturnValue(undefined);
    (fs.writeFileSync as jest.Mock).mockReturnValue(undefined);

    const outputFilePath = DicomService.convertDicomToPng("test-file");
    const expectedPath = path.resolve("public/exports");

    expect(fs.mkdirSync).toHaveBeenCalledWith(expectedPath, { recursive: true });
    expect(outputFilePath).toContain("dicom-image-");
  });

  test("should resolve file path correctly", () => {
    const fileId = "test-file";
    const expectedPath = path.resolve("public/uploads", fileId);
    const filePath = DicomService["getFilePath"](fileId);
    expect(filePath).toBe(expectedPath);
  });
});
