# DICOM Microservice

A Node.js microservice for handling DICOM file operations, including file uploads, DICOM header extraction, and conversion to PNG format. This project is built using TypeScript and follows a structured MVC architecture.

## Features

- **File Upload**: Upload DICOM files via a REST API using `multer`.
- **DICOM Header Extraction**: Extracts specific DICOM header attributes based on user-provided tags using `dicom-parser`.
- **DICOM to PNG Conversion**: Converts DICOM files to PNG images for easy viewing using `canvas`.
- **Comprehensive Unit Testing**: Includes tests for all components using **Jest** and **Supertest**, achieving high code coverage.

## Tech Stack

- **Node.js** with **TypeScript**
- **Express** for building the REST API
- **multer** for handling file uploads
- **dicom-parser** for parsing DICOM files
- **canvas** for image rendering and conversion
- **Jest** for unit testing

## Project Structure

```
src/
├── controller/       # API Controllers
├── service/          # Business Logic
├── middleware/       # Middleware for File Upload
├── utils/             # Utility Classes (File Operations)
├── routes/            # API Routes
├── public/            # Uploaded and Exported Files
│   ├── uploads/
│   └── exports/
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TypeScript

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Anasshahidd21/dicom-reader.git
   cd dicom-reader
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Compile TypeScript:

   ```bash
   npm run build
   ```

4. Start the server:

   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`.

## API Endpoints

### 1. **Upload DICOM File**

- **Endpoint**: `POST /api/v1/dicom`
- **Description**: Uploads a DICOM file to the server.
- **Request**:
  - Form Data: `file` (DICOM file)
- **Response**:

  ```json
  {
    "message": "File uploaded successfully",
    "filePath": "public/uploads/<fileId>",
    "fileId": "<fileId>"
  }
  ```

- **Example**:

  ```bash
  curl -X POST "http://localhost:3000/api/v1/dicom" -F "file=@example/IM000002"
  ```

### 2. **Convert DICOM to PNG**

- **Endpoint**: `GET /api/v1/dicom`
- **Description**: Converts a DICOM file to PNG format.
- **Query Parameters**:
  - `fileId` (string) - The ID of the uploaded DICOM file.
- **Response**:

  ```json
  {
    "message": "DICOM file successfully converted to PNG",
    "outputFilePath": "public/exports/dicom-image-<timestamp>.png"
  }
  ```

- **Example**:

  ```bash
  curl "http://localhost:3000/api/v1/dicom?fileId=<fileId>"
  ```

### 3. **Extract DICOM Tag**

- **Endpoint**: `GET /api/v1/dicom/extract`
- **Description**: Extracts a specific DICOM header attribute based on the provided tag.
- **Query Parameters**:
  - `fileId` (string) - The ID of the uploaded DICOM file.
  - `tag` (string) - The DICOM tag to extract (e.g., `x00100010` for Patient Name).
- **Response**:

  ```json
  {
    "tag": "x00100010",
    "value": "John^Doe"
  }
  ```

- **Example**:

  ```bash
  curl "http://localhost:3000/api/v1/dicom/extract?fileId=<fileId>&tag=x00100010"
  ```

## Testing

This project uses **Jest** for unit testing.

To run tests:

```bash
npm test
```

To view the coverage report:

```bash
npm test -- --coverage
```

### Expected Coverage

```
File                   | % Stmts | % Branch | % Funcs | % Lines
-----------------------|---------|----------|---------|---------
All files              |   100   |   100    |   100   |   100
```

## Error Handling

- Returns `400 Bad Request` for missing or invalid parameters.
- Returns `500 Internal Server Error` for unexpected errors during file processing.

## Improvements and Future Work

- **Database Integration**: Store metadata and file information in a database (PostgreSQL).
- **Compression Support**: Add support for compressed DICOM files.
- **Advanced Image Processing**: Enhance the DICOM to PNG conversion to support different pixel formats and color spaces.
- **Authentication and Authorization**: Secure the API using JWT or OAuth.
