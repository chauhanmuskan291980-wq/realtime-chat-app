const connectedUsers = new Map();

const createOnlineUsersPayload = () => {
  const users = [
    ...new Set(connectedUsers.values()),
  ].sort((firstUser, secondUser) =>
    firstUser.localeCompare(secondUser)
  );

  return {
    count: users.length,
    users,
  };
};

const broadcastOnlineUsers = (io) => {
  const payload = createOnlineUsersPayload();

  console.log("Broadcasting online users:", payload);

  io.emit("users:online", payload);
};

export const registerChatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on(
      "user:join",
      ({ username } = {}, callback) => {
        const cleanedUsername =
          typeof username === "string"
            ? username.trim()
            : "";

        if (!cleanedUsername) {
          const response = {
            success: false,
            message: "Username is required.",
          };

          callback?.(response);
          return;
        }

        socket.data.username = cleanedUsername;

        connectedUsers.set(
          socket.id,
          cleanedUsername
        );

        console.log(
          `${cleanedUsername} joined with socket ${socket.id}`
        );

        const payload = createOnlineUsersPayload();

        // Send to every connected browser.
        io.emit("users:online", payload);

        // Also return directly to the browser that joined.
        callback?.({
          success: true,
          ...payload,
        });
      }
    );

    socket.on("typing:start", () => {
      const username = socket.data.username;

      if (!username) {
        return;
      }

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
      const username = connectedUsers.get(socket.id);

      connectedUsers.delete(socket.id);

      if (username) {
        socket.broadcast.emit("typing:stop", {
          username,
        });
      }

      broadcastOnlineUsers(io);

      console.log(
        `Socket disconnected: ${socket.id}. Reason: ${reason}`
      );
    });
  });
};