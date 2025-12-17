import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { connectDatabase } from "./config/database";
import authRoutes from "./routes/auth";
import fileRoutes from "./routes/files";

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: false
  })
);
app.use(express.json());

// Static files (optional)
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadDir));

app.get("/api/health", (_req, res) => {
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/20c33166-aba8-40eb-bbfa-5cc347b1fc58", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix",
      hypothesisId: "H4",
      location: "server/src/server.ts:/api/health",
      message: "Health endpoint hit",
      data: {},
      timestamp: Date.now()
    })
  }).catch(() => {});
  // #endregion
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/20c33166-aba8-40eb-bbfa-5cc347b1fc58", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "pre-fix",
          hypothesisId: "H5",
          location: "server/src/server.ts:listen",
          message: "Server started and listening",
          data: { port: PORT },
          timestamp: Date.now()
        })
      }).catch(() => {});
      // #endregion
      // eslint-disable-next-line no-console
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/20c33166-aba8-40eb-bbfa-5cc347b1fc58", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix",
        hypothesisId: "H6",
        location: "server/src/server.ts:dbError",
        message: "Database connection failed",
        data: { errorMessage: (err as Error).message },
        timestamp: Date.now()
      })
    }).catch(() => {});
    // #endregion
    // eslint-disable-next-line no-console
    console.error("Failed to connect database", err);
    process.exit(1);
  });


