import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  databasePath:
    process.env.DATABASE_PATH || "./database/chat.db",
  nodeEnv: process.env.NODE_ENV || "development",
};

