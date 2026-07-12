import { useState } from "react";

function UsernameForm({ onJoin }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanedUsername = username.trim();

    if (!cleanedUsername) {
      setError("Please enter your username.");
      return;
    }

    if (cleanedUsername.length > 30) {
      setError("Username cannot exceed 30 characters.");
      return;
    }

    localStorage.setItem("chatUsername", cleanedUsername);
    onJoin(cleanedUsername);
  };

  return (
    <main className="join-page">
      <section className="join-card">
        <div className="join-icon">💬</div>

        <h1>Real-Time Chat</h1>

        <p>
          Enter your username to join the public chat room.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>

          <input
            id="username"
            type="text"
            value={username}
            placeholder="Enter your name"
            maxLength={30}
            autoComplete="name"
            autoFocus
            onChange={(event) => {
              setUsername(event.target.value);
              setError("");
            }}
          />

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit">Join Chat</button>
        </form>
      </section>
    </main>
  );
}

export default UsernameForm;