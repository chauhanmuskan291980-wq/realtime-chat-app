import { useEffect, useRef, useState } from "react";

function MessageInput({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  isSending,
  isConnected,
}) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  const stopTyping = () => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    if (isTypingRef.current) {
      onTypingStop();
      isTypingRef.current = false;
    }
  };

  const handleContentChange = (event) => {
    const newContent = event.target.value;

    setContent(newContent);
    setError("");

    if (!newContent.trim()) {
      stopTyping();
      return;
    }

    if (!isTypingRef.current) {
      onTypingStart();
      isTypingRef.current = true;
    }

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    /*
     * Stop showing the typing indicator when the user
     * has not typed anything for 1.2 seconds.
     */
    typingTimerRef.current = setTimeout(() => {
      stopTyping();
    }, 1200);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cleanedContent = content.trim();

    if (!cleanedContent) {
      setError("Please enter a message.");
      return;
    }

    if (cleanedContent.length > 500) {
      setError("Message cannot exceed 500 characters.");
      return;
    }

    try {
      stopTyping();

      await onSendMessage(cleanedContent);

      setContent("");
      setError("");
    } catch {
      // API error is displayed by the parent component.
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }

      if (isTypingRef.current) {
        onTypingStop();
      }
    };
  }, [onTypingStop]);

  return (
    <footer className="message-input-area">
      <form
        className="message-form"
        onSubmit={handleSubmit}
      >
        <div className="input-wrapper">
          <textarea
            value={content}
            placeholder={
              isConnected
                ? "Type your message..."
                : "Waiting for connection..."
            }
            rows={1}
            maxLength={500}
            disabled={isSending || !isConnected}
            onChange={handleContentChange}
            onBlur={stopTyping}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
          />

          <span className="character-count">
            {content.length}/500
          </span>
        </div>

        <button
          type="submit"
          disabled={
            isSending ||
            !isConnected ||
            !content.trim()
          }
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </form>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </footer>
  );
}

export default MessageInput;