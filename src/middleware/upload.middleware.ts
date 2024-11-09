import multer from "multer";
import { FileOperations } from "../lib/file.utility";

/**
 * Middleware for handling file uploads.
 */
export class UploadMiddleware {
  /**
   * Get the multer upload middleware.
   */
  public static get upload() {
    FileOperations.createIfDirectoryNotFound("public/uploads");
    return multer({ dest: "public/uploads/" }).single("file");
  }
}
