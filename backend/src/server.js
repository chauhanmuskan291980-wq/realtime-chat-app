import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { registerChatSocket } from "./sockets/chat.socket.js";

const startServer = async () => {
  try {
    await connectDatabase();

    const httpServer = http.createServer(app);

    const io = new Server(httpServer, {
      cors: {
        origin: env.clientUrl,
        methods: ["GET", "POST"],
      },
    });

    app.set("io", io);

    registerChatSocket(io);

    httpServer.listen(env.port, () => {
      console.log(
        `Server running at http://localhost:${env.port}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();