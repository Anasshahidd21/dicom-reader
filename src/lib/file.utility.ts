import fs from "fs";
import path from "path";

/**
 * File operations utility class.
 */
export class FileOperations {
  /**
   *  Create a directory if it does not exist.
   * @param dirPath Path to the directory.
   */
  public static createIfDirectoryNotFound(dirPath: string): void {
    const resolvedPath = path.resolve(dirPath);
    if (!fs.existsSync(resolvedPath)) {
      fs.mkdirSync(resolvedPath, { recursive: true });
    }
  }
}
