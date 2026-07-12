function ChatHeader({
  username,
  onlineUsers = [],
  isConnected,
  onLogout,
}) {
 const onlineUserNames = onlineUsers.map((onlineUsername) =>
  onlineUsername === username
    ? `${onlineUsername} (You)`
    : onlineUsername
);

  return (
    <header className="chat-header">
      <div className="chat-header-info">
        <h1>Public Chat Room</h1>

        <p>
          Signed in as <strong>{username}</strong>
        </p>

        <div className="online-users-summary">
          <span className="online-users-dot" />

          <span>
            {onlineUsers.length}{" "}
            {onlineUsers.length === 1 ? "user" : "users"} online
          </span>
        </div>

        {onlineUserNames.length > 0 && (
          <p className="online-user-names">
            {onlineUserNames.join(", ")}
          </p>
        )}
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

          {isConnected ? "Connected" : "Reconnecting"}
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