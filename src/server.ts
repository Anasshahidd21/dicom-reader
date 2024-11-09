import express from "express";
import { DicomRoutes } from "./routes/dicom.routes";

const app = express();
app.use(express.json());
app.use("/api/v1/dicom", DicomRoutes.getRoutes());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
