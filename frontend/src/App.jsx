import { useCallback, useEffect, useState } from "react";

import ChatRoom from "./components/ChatRoom";
import UsernameForm from "./components/UsernameForm";
import { fetchMessages, sendMessage } from "./services/api";
import { socket } from "./services/socket";

import "./App.css";

function App() {
  const [username, setUsername] = useState(
    () => localStorage.getItem("chatUsername") || "",
  );

  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [error, setError] = useState("");
   

  useEffect(() => {
    if (!username) {
      return undefined;
    }

    const loadChatHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const previousMessages = await fetchMessages();
        setMessages(previousMessages);
      } catch (requestError) {
        console.error(requestError);
        setError("Unable to load previous messages.");
      } finally {
        setLoading(false);
      }
    };

  const handleOnlineUsers = ({ users } = {}) => {
  console.log("Online users received:", users);

  if (!Array.isArray(users)) {
    console.error("Invalid online users value:", users);
    return;
  }

  setOnlineUsers(users);

  setTypingUsers((currentTypingUsers) =>
    currentTypingUsers.filter((typingUsername) =>
      users.includes(typingUsername),
    ),
  );
};

    const handleConnect = () => {
  setIsConnected(true);
  setError("");

  socket.emit(
    "user:join",
    { username },
    (response) => {
      console.log(
        "Join response received:",
        response
      );

      if (!response?.success) {
        setError(
          response?.message ||
            "Unable to join the chat."
        );
        return;
      }

      if (Array.isArray(response.users)) {
        setOnlineUsers(response.users);
      }
    }
  );
};
    const handleDisconnect = () => {
      setIsConnected(false);
      setTypingUsers([]);
      setOnlineUsers([])
    };

    const handleConnectError = (socketError) => {
      console.error("Socket connection error:", socketError);

      setIsConnected(false);
      setError("Unable to connect to the chat server. Retrying...");
    };

    const handleNewMessage = (newMessage) => {
      setMessages((currentMessages) => {
        const alreadyExists = currentMessages.some(
          (message) => message.id === newMessage.id,
        );

        if (alreadyExists) {
          return currentMessages;
        }

        return [...currentMessages, newMessage];
      });
    };

    const handleTypingStart = ({ username: typingUsername }) => {
      if (!typingUsername || typingUsername === username) {
        return;
      }

      setTypingUsers((currentUsers) => {
        if (currentUsers.includes(typingUsername)) {
          return currentUsers;
        }

        return [...currentUsers, typingUsername];
      });
    };

    const handleTypingStop = ({ username: typingUsername }) => {
      setTypingUsers((currentUsers) =>
        currentUsers.filter(
          (currentUsername) => currentUsername !== typingUsername,
        ),
      );
    };

    loadChatHistory();

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("users:online", handleOnlineUsers);
    socket.on("connect_error", handleConnectError);
    socket.on("message:new", handleNewMessage);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    if (!socket.connected) {
  socket.connect();
} else {
  socket.emit(
    "user:join",
    { username },
    (response) => {
      console.log(
        "Existing connection join response:",
        response
      );

      if (
        response?.success &&
        Array.isArray(response.users)
      ) {
        setOnlineUsers(response.users);
      }
    }
  );
}

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("users:online", handleOnlineUsers);
      socket.off("connect_error", handleConnectError);
      socket.off("message:new", handleNewMessage);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);

      socket.disconnect();
    };
  }, [username]);

  const handleJoin = (joinedUsername) => {
    setUsername(joinedUsername);
  };

  const handleSendMessage = async (content) => {
    try {
      setIsSending(true);
      setError("");

      await sendMessage({
        username,
        content,
      });
    } catch (requestError) {
      console.error(requestError);

      const message =
        requestError.response?.data?.message || "Unable to send your message.";

      setError(message);

      throw requestError;
    } finally {
      setIsSending(false);
    }
  };

  const handleTypingStart = useCallback(() => {
    if (socket.connected) {
      socket.emit("typing:start");
    }
  }, []);

  const handleTypingStop = useCallback(() => {
    if (socket.connected) {
      socket.emit("typing:stop");
    }
  }, []);

  const handleLogout = () => {
  if (socket.connected) {
    socket.emit("typing:stop");
  }

  localStorage.removeItem("chatUsername");
  socket.disconnect();

  setUsername("");
  setMessages([]);
  setTypingUsers([]);
  setOnlineUsers([]);
  setError("");
  setIsConnected(false);
};


  if (!username) {
    return <UsernameForm onJoin={handleJoin} />;
  }

  return (
    <ChatRoom
      username={username}
      messages={messages}
      typingUsers={typingUsers}
      onlineUsers={onlineUsers}
      loading={loading}
      isSending={isSending}
      isConnected={isConnected}
      error={error}
      onSendMessage={handleSendMessage}
      onTypingStart={handleTypingStart}
      onTypingStop={handleTypingStop}
      onLogout={handleLogout}
    />
  );
}

export default App;
