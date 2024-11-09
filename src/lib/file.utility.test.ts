import fs from "fs";
import path from "path";
import { FileOperations } from "./file.utility";

jest.mock("fs");

describe("FileOperations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create the directory if it does not exist", () => {
    // Mock `fs.existsSync` to return false (directory does not exist)
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    // Mock `fs.mkdirSync` to simulate directory creation
    (fs.mkdirSync as jest.Mock).mockReturnValue(undefined);

    const dirPath = "public/uploads";
    const resolvedPath = path.resolve(dirPath);

    FileOperations.createIfDirectoryNotFound(dirPath);

    // Verify that `fs.existsSync` was called with the correct path
    expect(fs.existsSync).toHaveBeenCalledWith(resolvedPath);
    // Verify that `fs.mkdirSync` was called to create the directory
    expect(fs.mkdirSync).toHaveBeenCalledWith(resolvedPath, { recursive: true });
  });

  test("should not create the directory if it already exists", () => {
    // Mock `fs.existsSync` to return true (directory already exists)
    (fs.existsSync as jest.Mock).mockReturnValue(true);

    const dirPath = "public/uploads";
    const resolvedPath = path.resolve(dirPath);

    FileOperations.createIfDirectoryNotFound(dirPath);

    // Verify that `fs.existsSync` was called with the correct path
    expect(fs.existsSync).toHaveBeenCalledWith(resolvedPath);
    // Verify that `fs.mkdirSync` was not called
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });
});
