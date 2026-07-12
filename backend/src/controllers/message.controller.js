import {
  createMessage,
  fetchMessages,
} from "../services/message.service.js";

import { ApiError } from "../utils/apiError.js";

export const getMessages = async (req, res, next) => {
  try {
    const messages = await fetchMessages();

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const username =
      typeof req.body.username === "string"
        ? req.body.username.trim()
        : "";

    const content =
      typeof req.body.content === "string"
        ? req.body.content.trim()
        : "";

    if (!username) {
      throw new ApiError(400, "Username is required");
    }

    if (!content) {
      throw new ApiError(400, "Message content is required");
    }

    if (username.length > 30) {
      throw new ApiError(
        400,
        "Username cannot exceed 30 characters"
      );
    }

    if (content.length > 500) {
      throw new ApiError(
        400,
        "Message cannot exceed 500 characters"
      );
    }

    const savedMessage = await createMessage(
      username,
      content
    );

    const io = req.app.get("io");

    if (io) {
      io.emit("message:new", savedMessage);
    }

    res.status(201).json({
      success: true,
      message: savedMessage,
    });
  } catch (error) {
    next(error);
  }
};