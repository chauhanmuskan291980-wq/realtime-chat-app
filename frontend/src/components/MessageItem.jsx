import { formatMessageTime } from "../utils/formatTime";

function MessageItem({ message, currentUsername }) {
  const isOwnMessage =
    message.username === currentUsername;

  return (
    <article
      className={
        isOwnMessage
          ? "message-row own-message-row"
          : "message-row"
      }
    >
      <div
        className={
          isOwnMessage
            ? "message-bubble own-message"
            : "message-bubble"
        }
      >
        <div className="message-meta">
          <strong>
            {isOwnMessage ? "You" : message.username}
          </strong>

          <time dateTime={message.createdAt}>
            {formatMessageTime(message.createdAt)}
          </time>
        </div>

        <p>{message.content}</p>
      </div>
    </article>
  );
}

export default MessageItem;