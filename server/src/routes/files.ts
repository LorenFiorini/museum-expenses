import express, { Response } from "express";
import fs from "fs/promises";
import path from "path";
import { FileUpload, FileType } from "../models/FileUpload";
import { parseWorkbook } from "../utils/parser";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { upload } from "../middleware/multer";

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// List all files for the authenticated user
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const files = await FileUpload.find({ userId })
      .sort({ uploadedAt: -1 })
      .select("-parsedData"); // Exclude large parsed data from list

    res.json({ files });
  } catch (error) {
    console.error("Error listing files:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Upload files
router.post(
  "/upload",
  upload.array("files", 10), // Allow up to 10 files
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const uploadedFiles = [];
      const errors: string[] = [];

      for (const file of req.files) {
        try {
          // Read file buffer
          const buffer = await fs.readFile(file.path);

          // Parse the workbook
          const parseResult = parseWorkbook(buffer, file.originalname);

          if (!parseResult.ok) {
            errors.push(`${file.originalname}: ${parseResult.error}`);
            // Clean up file
            await fs.unlink(file.path).catch(() => {});
            continue;
          }

          // Determine file type
          let fileType: FileType;
          if (parseResult.fileType === "expenses") {
            fileType = "expenses";
          } else {
            fileType = "gifts";
          }

          // Save to database
          const fileUpload = new FileUpload({
            userId,
            filename: file.filename,
            originalName: file.originalname,
            fileType,
            filePath: file.path,
            parsedData: parseResult.data
          });

          await fileUpload.save();

          uploadedFiles.push({
            id: fileUpload._id,
            filename: file.originalname,
            fileType,
            uploadedAt: fileUpload.uploadedAt
          });
        } catch (error) {
          errors.push(`${file.originalname}: ${(error as Error).message}`);
          // Clean up file
          await fs.unlink(file.path).catch(() => {});
        }
      }

      if (uploadedFiles.length === 0 && errors.length > 0) {
        return res.status(400).json({ error: "All uploads failed", errors });
      }

      res.status(201).json({
        files: uploadedFiles,
        warnings: errors.length > 0 ? errors : undefined
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Get file by ID with parsed data
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const fileId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const fileUpload = await FileUpload.findOne({ _id: fileId, userId });

    if (!fileUpload) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({
      id: fileUpload._id,
      filename: fileUpload.originalName,
      fileType: fileUpload.fileType,
      uploadedAt: fileUpload.uploadedAt,
      parsedData: fileUpload.parsedData
    });
  } catch (error) {
    console.error("Error getting file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete file
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const fileId = req.params.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const fileUpload = await FileUpload.findOne({ _id: fileId, userId });

    if (!fileUpload) {
      return res.status(404).json({ error: "File not found" });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(fileUpload.filePath);
    } catch (error) {
      console.error("Error deleting file from filesystem:", error);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await FileUpload.deleteOne({ _id: fileId, userId });

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

