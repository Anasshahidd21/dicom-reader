import fs from "fs";
import path from "path";
import dicomParser from "dicom-parser";
import { createCanvas } from "canvas";
import { FileOperations } from "../lib/file.utility";

/**
 * Service class for DICOM operations.
 * This class provides methods to convert DICOM files to PNG format and extract DICOM tags.
 */
export class DicomService {
  /**
   * Default values for the width of the converted PNG image.
   */
  private static DEFAULT_WIDTH = 512;
  /**
   * Default values for the height of the converted PNG image.
   */
  private static DEFAULT_HEIGHT = 512;
  /**
   * Default output directory for the converted PNG files.
   */
  private static DEFAULT_OUTPUT_DIRECTORY = "public/exports";
  /**
   * Default input directory for the DICOM files.
   */
  private static DEFAULT_INPUT_DIRECTORY = "public/uploads";

  /**
   * Convert a DICOM file to PNG format.
   * @param fileId File ID to the saved DICOM file.
   * @returns Path to the converted PNG file.
   */
  public static convertDicomToPng(fileId: string): string {
    const filePath = this.getFilePath(fileId);
    const absoluteFilePath = path.resolve(filePath);
    const dicomBuffer = fs.readFileSync(absoluteFilePath);
    const dataSet = dicomParser.parseDicom(dicomBuffer);

    const pixelDataElement = dataSet.elements["x7fe00010"];
    const width = dataSet.uint16("x00280011") || this.DEFAULT_WIDTH;
    const height = dataSet.uint16("x00280010") || this.DEFAULT_HEIGHT;

    if (!pixelDataElement) {
      throw new Error("Pixel data not found in the DICOM file");
    }

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    const imageData = context.createImageData(width, height);
    const pixelArray = new Uint8Array(dicomBuffer.buffer, pixelDataElement.dataOffset, pixelDataElement.length);

    for (let i = 0; i < pixelArray.length; i++) {
      const value = pixelArray[i];
      imageData.data[i * 4] = value;
      imageData.data[i * 4 + 1] = value;
      imageData.data[i * 4 + 2] = value;
      imageData.data[i * 4 + 3] = 255;
    }

    context.putImageData(imageData, 0, 0);

    FileOperations.createIfDirectoryNotFound(this.DEFAULT_OUTPUT_DIRECTORY);
    const outputFileName = `dicom-image-${Date.now()}.png`;
    const outputFilePath = path.resolve(this.DEFAULT_OUTPUT_DIRECTORY, outputFileName);

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outputFilePath, buffer);

    return outputFilePath;
  }

  /**
   * Extract a DICOM tag from a DICOM file.
   * @param fileId File ID to the saved DICOM file.
   * @param tag DICOM tag to extract - e.g., "x00100010".
   * @returns Value of the DICOM tag.
   */
  public static extractDicomTag(fileId: string, tag: string): string | undefined {
    const filePath = this.getFilePath(fileId);
    const absoluteFilePath = path.resolve(filePath);
    const dicomBuffer = fs.readFileSync(absoluteFilePath);
    const dataSet = dicomParser.parseDicom(dicomBuffer);

    // Extract the value for the specified tag
    return dataSet.string(tag);
  }

  /**
   * Get the DICOM file content.
   * @param fileId File ID of the DICOM file.
   * @returns DICOM file content.
   */
  private static getFilePath(fileId: string): string {
    return path.resolve(this.DEFAULT_INPUT_DIRECTORY, fileId);
  }
}
