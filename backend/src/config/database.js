import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

import { env } from "./env.js";

let database = null;

export const connectDatabase = async () => {
  if (database) {
    return database;
  }

  const databasePath = path.resolve(
    process.cwd(),
    env.databasePath
  );

  database = await open({
    filename: databasePath,
    driver: sqlite3.Database,
  });

  await database.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log(`Database connected: ${databasePath}`);

  return database;
};

export const getDatabase = () => {
  if (!database) {
    throw new Error("Database has not been connected");
  }

  return database;
};