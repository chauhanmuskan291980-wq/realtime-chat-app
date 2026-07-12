import { useState } from "react";

function MessageInput({
  onSendMessage,
  isSending,
  isConnected,
}) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

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
      await onSendMessage(cleanedContent);
      setContent("");
      setError("");
    } catch {
      // The parent component displays the API error.
    }
  };

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
            disabled={isSending}
            onChange={(event) => {
              setContent(event.target.value);
              setError("");
            }}
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