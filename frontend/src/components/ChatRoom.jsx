import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

function ChatRoom({
  username,
  messages,
  loading,
  isSending,
  isConnected,
  error,
  onSendMessage,
  onLogout,
}) {
  return (
    <main className="chat-page">
      <section className="chat-container">
        <ChatHeader
          username={username}
          isConnected={isConnected}
          onLogout={onLogout}
        />

        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        <MessageList
          messages={messages}
          currentUsername={username}
          loading={loading}
        />

        <MessageInput
          onSendMessage={onSendMessage}
          isSending={isSending}
          isConnected={isConnected}
        />
      </section>
    </main>
  );
}

export default ChatRoom;