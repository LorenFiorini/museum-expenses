import mongoose, { Schema, Document, Types } from "mongoose";

export type FileType = "expenses" | "gifts";

export interface IFileUpload extends Document {
  userId: Types.ObjectId;
  filename: string;
  originalName: string;
  fileType: FileType;
  filePath: string;
  uploadedAt: Date;
  parsedData?: {
    expenses?: unknown[];
    gifts?: unknown[];
  };
}

const fileUploadSchema = new Schema<IFileUpload>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      enum: ["expenses", "gifts"],
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    parsedData: {
      type: Schema.Types.Mixed,
      required: false
    }
  },
  {
    timestamps: true
  }
);

export const FileUpload = mongoose.model<IFileUpload>("FileUpload", fileUploadSchema);

