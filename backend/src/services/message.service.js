import { getDatabase } from "../config/database.js";

export const fetchMessages = async (limit = 100) => {
  const database = getDatabase();

  const messages = await database.all(
    `
      SELECT id, username, content, createdAt
      FROM (
        SELECT
          id,
          username,
          content,
          created_at AS createdAt
        FROM messages
        ORDER BY id DESC
        LIMIT ?
      )
      ORDER BY id ASC
    `,
    [limit]
  );

  return messages;
};

export const createMessage = async (username, content) => {
  const database = getDatabase();
  const createdAt = new Date().toISOString();

  const result = await database.run(
    `
      INSERT INTO messages (
        username,
        content,
        created_at
      )
      VALUES (?, ?, ?)
    `,
    [username, content, createdAt]
  );

  const message = await database.get(
    `
      SELECT
        id,
        username,
        content,
        created_at AS createdAt
      FROM messages
      WHERE id = ?
    `,
    [result.lastID]
  );

  return message;
};