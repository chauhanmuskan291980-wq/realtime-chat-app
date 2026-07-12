export const registerChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("user:join", ({ username } = {}) => {
      const cleanedUsername =
        typeof username === "string"
          ? username.trim()
          : "";

      if (!cleanedUsername) {
        return;
      }

      socket.data.username = cleanedUsername;

      console.log(
        `${cleanedUsername} joined with socket ${socket.id}`
      );
    });

    socket.on("typing:start", () => {
      const username = socket.data.username;

      if (!username) {
        return;
      }

      /*
       * socket.broadcast sends the event to every
       * connected user except the sender.
       */
      socket.broadcast.emit("typing:start", {
        username,
      });
    });

    socket.on("typing:stop", () => {
      const username = socket.data.username;

      if (!username) {
        return;
      }

      socket.broadcast.emit("typing:stop", {
        username,
      });
    });

    socket.on("disconnect", (reason) => {
      const username = socket.data.username;

      if (username) {
        socket.broadcast.emit("typing:stop", {
          username,
        });
      }

      console.log(
        `User disconnected: ${socket.id}. Reason: ${reason}`
      );
    });

    socket.on("error", (error) => {
      console.error(
        `Socket error for ${socket.id}:`,
        error
      );
    });
  });
};