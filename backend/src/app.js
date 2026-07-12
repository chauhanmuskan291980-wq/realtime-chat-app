import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import messageRouter from "./routes/message.routes.js";
import {
  notFoundHandler,
} from "./middleware/notFound.middleware.js";
import {
  errorHandler,
} from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    methods: ["GET", "POST"],
  })
);

app.use(
  express.json({
    limit: "10kb",
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Real-time chat backend is running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/messages", messageRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;