import { useEffect, useRef } from "react";

import MessageItem from "./MessageItem";

function MessageList({
  messages,
  currentUsername,
  loading,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (loading) {
    return (
      <section className="message-list center-content">
        <p>Loading previous messages...</p>
      </section>
    );
  }

  if (messages.length === 0) {
    return (
      <section className="message-list center-content">
        <div className="empty-state">
          <span>👋</span>
          <h2>No messages yet</h2>
          <p>Start the conversation by sending a message.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="message-list">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          currentUsername={currentUsername}
        />
      ))}

      <div ref={bottomRef} />
    </section>
  );
}

export default MessageList;