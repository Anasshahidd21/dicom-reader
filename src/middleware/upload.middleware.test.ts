import multer from "multer";
import { FileOperations } from "../lib/file.utility";
import { UploadMiddleware } from "./upload.middleware";

jest.mock("multer");
jest.mock("../lib/file.utility");

describe("UploadMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock multer's return value to include the `single` method
    (multer as unknown as jest.Mock).mockReturnValue({
      single: jest.fn().mockReturnValue("mocked-multer-single"),
    });
  });

  test("should create uploads directory if not present", () => {
    // Access `UploadMiddleware.upload` to trigger directory creation
    UploadMiddleware.upload;
    expect(FileOperations.createIfDirectoryNotFound).toHaveBeenCalledWith("public/uploads");
  });

  test("should configure multer with the correct destination", () => {
    const multerMock = multer as unknown as jest.Mock;

    // Access `UploadMiddleware.upload` to trigger the multer setup
    const upload = UploadMiddleware.upload;

    // Verify multer configuration and method call
    expect(multerMock).toHaveBeenCalledWith({ dest: "public/uploads/" });
    expect(upload).toBe("mocked-multer-single");
  });
});
