import {
  useCallback,
  useEffect,
  useState,
} from "react";

import ChatRoom from "./components/ChatRoom";
import UsernameForm from "./components/UsernameForm";
import {
  fetchMessages,
  sendMessage,
} from "./services/api";
import { socket } from "./services/socket";

import "./App.css";

function App() {
  const [username, setUsername] = useState(
    () => localStorage.getItem("chatUsername") || ""
  );

  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(
    socket.connected
  );
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

    const handleConnect = () => {
      setIsConnected(true);
      setError("");

      socket.emit("user:join", {
        username,
      });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setTypingUsers([]);
    };

    const handleConnectError = (socketError) => {
      console.error(
        "Socket connection error:",
        socketError
      );

      setIsConnected(false);
      setError(
        "Unable to connect to the chat server. Retrying..."
      );
    };

    const handleNewMessage = (newMessage) => {
      setMessages((currentMessages) => {
        const alreadyExists = currentMessages.some(
          (message) => message.id === newMessage.id
        );

        if (alreadyExists) {
          return currentMessages;
        }

        return [...currentMessages, newMessage];
      });
    };

    const handleTypingStart = ({
      username: typingUsername,
    }) => {
      if (
        !typingUsername ||
        typingUsername === username
      ) {
        return;
      }

      setTypingUsers((currentUsers) => {
        if (currentUsers.includes(typingUsername)) {
          return currentUsers;
        }

        return [...currentUsers, typingUsername];
      });
    };

    const handleTypingStop = ({
      username: typingUsername,
    }) => {
      setTypingUsers((currentUsers) =>
        currentUsers.filter(
          (currentUsername) =>
            currentUsername !== typingUsername
        )
      );
    };

    loadChatHistory();

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("message:new", handleNewMessage);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    if (!socket.connected) {
      socket.connect();
    } else {
      /*
       * If the socket was already connected before this
       * effect ran, identify the current user immediately.
       */
      socket.emit("user:join", {
        username,
      });
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
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
        requestError.response?.data?.message ||
        "Unable to send your message.";

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