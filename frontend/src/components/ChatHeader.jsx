function ChatHeader({
  username,
  isConnected,
  onLogout,
}) {
  return (
    <header className="chat-header">
      <div>
        <h1>Public Chat Room</h1>

        <p>
          Signed in as <strong>{username}</strong>
        </p>
      </div>

      <div className="header-actions">
        <span
          className={
            isConnected
              ? "connection-status connected"
              : "connection-status disconnected"
          }
        >
          <span className="status-dot" />

          {isConnected ? "Online" : "Reconnecting"}
        </span>

        <button
          type="button"
          className="logout-button"
          onClick={onLogout}
        >
          Leave
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;