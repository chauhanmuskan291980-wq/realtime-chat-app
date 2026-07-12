import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import TypingIndicator from "./TypingIndicator";

function ChatRoom({
  username,
  messages,
  typingUsers,
  loading,
  isSending,
  isConnected,
  error,
  onSendMessage,
  onTypingStart,
  onTypingStop,
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

        <TypingIndicator typingUsers={typingUsers} />

        <MessageInput
          onSendMessage={onSendMessage}
          onTypingStart={onTypingStart}
          onTypingStop={onTypingStop}
          isSending={isSending}
          isConnected={isConnected}
        />
      </section>
    </main>
  );
}

export default ChatRoom;