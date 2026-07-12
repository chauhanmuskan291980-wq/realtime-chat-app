import { useEffect, useState } from "react";

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
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleConnectError = (socketError) => {
      console.error("Socket connection error:", socketError);
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

    loadChatHistory();

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("message:new", handleNewMessage);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("message:new", handleNewMessage);
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

      /*
       * Do not manually add the POST response here.
       * The backend broadcasts "message:new", and the
       * Socket.io listener adds it for every user,
       * including the sender.
       */
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

  const handleLogout = () => {
    localStorage.removeItem("chatUsername");
    socket.disconnect();

    setUsername("");
    setMessages([]);
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
      loading={loading}
      isSending={isSending}
      isConnected={isConnected}
      error={error}
      onSendMessage={handleSendMessage}
      onLogout={handleLogout}
    />
  );
}

export default App;