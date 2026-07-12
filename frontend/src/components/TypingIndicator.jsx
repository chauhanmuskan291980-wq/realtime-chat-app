function TypingIndicator({ typingUsers }) {
  if (typingUsers.length === 0) {
    return null;
  }

  let message = "";

  if (typingUsers.length === 1) {
    message = `${typingUsers[0]} is typing...`;
  } else if (typingUsers.length === 2) {
    message = `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
  } else {
    message = `${typingUsers.length} people are typing...`;
  }

  return (
    <div
      className="typing-indicator"
      aria-live="polite"
    >
      <div className="typing-dots">
        <span />
        <span />
        <span />
      </div>

      <p>{message}</p>
    </div>
  );
}

export default TypingIndicator;