import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/museum-expenses";

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(MONGODB_URI);
}

import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/museum-expenses";
  
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

