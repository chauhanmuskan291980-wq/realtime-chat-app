# Real-Time Chat Application

A full-stack real-time chat application built with **React**, **Node.js**, **Express**, **Socket.io**, and **SQLite**.

The application allows multiple users to join a public chat room, send and receive messages instantly, view previous messages after refreshing the page, see message timestamps, view online users, and see typing indicators.

---

## Demo

- **GitHub Repository:** https://github.com/chauhanmuskan291980-wq/realtime-chat-app
- **Live Application:** http://31.97.230.36:8081
- **Screen Recording:** https://drive.google.com/file/d/181Pxt-ba5NRtgMzqByCWNh8DP43ZwqOf/view?usp=sharing

> The live application is currently served over HTTP using the VPS public IP and port `8081`.

---

## Features

### Mandatory Features

- Username-based chat access
- Send messages through a REST API
- Fetch previous chat messages through a REST API
- Receive new messages instantly using Socket.io
- Broadcast new messages to all connected users
- Persistent message history using SQLite
- Message timestamps
- Socket connection and disconnection handling
- Responsive and user-friendly chat interface
- API and Socket.io error handling

### Bonus Features

- Dummy username login
- Typing indicator
- Online-user count
- Online-user names
- Automatic online/offline status updates
- Socket reconnection support
- Character limit and validation
- Automatic scrolling to the latest message

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- Axios
- Socket.io Client
- CSS
- Local Storage

### Backend

- Node.js
- Express.js
- Socket.io
- SQLite
- sqlite3
- dotenv
- CORS

### Development Tools

- Git and GitHub
- VS Code
- Nodemon
- PowerShell
- Browser Developer Tools

---

## Application Architecture

```text
React Frontend
     |
     | REST API
     | GET /api/messages
     | POST /api/messages
     v
Node.js + Express Backend
     |
     | SQLite queries
     v
SQLite Database

Node.js + Socket.io Backend
     |
     | message:new
     | typing:start
     | typing:stop
     | users:online
     v
All Connected React Clients
```

### Communication Design

- REST APIs are used to create and retrieve messages.
- Socket.io is used to deliver new messages instantly.
- SQLite stores the message history.
- The backend broadcasts presence and typing events to connected clients.

---

## Project Structure

```text
realtime-chat-app/
│
├── backend/
│   ├── database/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── env.js
│   │   ├── controllers/
│   │   │   └── message.controller.js
│   │   ├── middleware/
│   │   │   ├── error.middleware.js
│   │   │   └── notFound.middleware.js
│   │   ├── routes/
│   │   │   └── message.routes.js
│   │   ├── services/
│   │   │   └── message.service.js
│   │   ├── sockets/
│   │   │   └── chat.socket.js
│   │   ├── utils/
│   │   │   └── apiError.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── ChatRoom.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── MessageItem.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── TypingIndicator.jsx
│   │   │   └── UsernameForm.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── utils/
│   │   │   └── formatTime.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── docs/
├── .gitignore
└── README.md
```

---

## Prerequisites

Install the following before running the project:

- Node.js 18 or later
- npm
- Git
- A modern web browser

Check the installed versions:

```bash
node --version
npm --version
git --version
```

---

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/chauhanmuskan291980-wq/realtime-chat-app.git
cd realtime-chat-app
```

---

## Backend Setup

### 1. Open the backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Create a file named `.env` inside the `backend` folder.

```env
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_PATH=./database/chat.db
NODE_ENV=development
```

### 4. Start the backend

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The backend should run at:

```text
http://localhost:5000
```

The SQLite database and `messages` table are created automatically when the backend starts.

---

## Frontend Setup

Open another terminal.

### 1. Open the frontend folder

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Create a file named `.env` inside the `frontend` folder.

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Start the frontend

```bash
npm run dev
```

The frontend should run at:

```text
http://localhost:5173
```

---


---

## Production Deployment

The application is deployed on an Ubuntu VPS using **Nginx** and **PM2**.

### Live URL

```text
http://31.97.230.36:8081
```

### Deployment Architecture

```text
Browser
   |
   v
Nginx :8081
   |
   |-- /              -> React production build
   |-- /api/          -> Node.js backend on 127.0.0.1:5001
   |-- /socket.io/    -> Socket.io backend on 127.0.0.1:5001
                           |
                           v
                     SQLite Database
```

### Production Services

| Service | Purpose |
|---|---|
| Nginx | Serves the React build and proxies API/Socket.io traffic |
| PM2 | Keeps the Node.js backend running |
| Node.js backend | Runs Express and Socket.io on port `5001` |
| SQLite | Stores message history |
| UFW | Allows public access to port `8081` |

### Backend Production Environment

```env
PORT=5001
CLIENT_URL=http://31.97.230.36:8081
DATABASE_PATH=./database/chat.db
NODE_ENV=production
```

### Frontend Production Environment

```env
VITE_API_URL=/api
VITE_SOCKET_URL=
```

Leaving `VITE_SOCKET_URL` empty makes the Socket.io client connect to the same host and port that serves the frontend.

### PM2 Process

The backend is managed with this PM2 process name:

```text
realtime-chat-api
```

Useful commands:

```bash
pm2 status
pm2 logs realtime-chat-api
pm2 restart realtime-chat-api
pm2 save
```

### Nginx Routes

```text
/             React frontend
/api/         Express REST API
/socket.io/   Socket.io and WebSocket traffic
```

### Deployment Notes

- The frontend is served from `frontend/dist`.
- The backend is not exposed directly to the public internet.
- Nginx forwards REST API and Socket.io traffic to port `5001`.
- Existing VPS applications remain isolated because this project uses a separate PM2 process and public port `8081`.
- HTTPS can be added later by assigning a domain or subdomain and configuring an SSL certificate.

---

## Environment Variables

### Backend

| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend server port | `5000` |
| `CLIENT_URL` | Allowed frontend origin | `http://localhost:5173` |
| `DATABASE_PATH` | SQLite database location | `./database/chat.db` |
| `NODE_ENV` | Application environment | `development` |

### Frontend

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Express API base URL | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Socket.io server URL | `http://localhost:5000` |

---

## REST API Documentation

### Health Check

```http
GET /health
```

Example response:

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-07-12T10:30:00.000Z"
}
```

---

### Fetch Chat History

```http
GET /api/messages
```

Example response:

```json
{
  "success": true,
  "count": 2,
  "messages": [
    {
      "id": 1,
      "username": "Muskan Chauhan",
      "content": "Hello!",
      "createdAt": "2026-07-12T10:30:00.000Z"
    },
    {
      "id": 2,
      "username": "Rahul",
      "content": "Hi Muskan!",
      "createdAt": "2026-07-12T10:31:00.000Z"
    }
  ]
}
```

---

### Send a Message

```http
POST /api/messages
Content-Type: application/json
```

Request body:

```json
{
  "username": "Muskan Chauhan",
  "content": "Hello from the real-time chat application!"
}
```

Example response:

```json
{
  "success": true,
  "message": {
    "id": 3,
    "username": "Muskan Chauhan",
    "content": "Hello from the real-time chat application!",
    "createdAt": "2026-07-12T10:32:00.000Z"
  }
}
```

### Validation Rules

- Username is required.
- Username cannot exceed 30 characters.
- Message content is required.
- Message content cannot contain only spaces.
- Message content cannot exceed 500 characters.

---

## Socket.io Events

### Client to Server

| Event | Purpose | Payload |
|---|---|---|
| `user:join` | Register a username with the socket | `{ username }` |
| `typing:start` | Notify other users that typing started | None |
| `typing:stop` | Notify other users that typing stopped | None |

### Server to Client

| Event | Purpose | Payload |
|---|---|---|
| `message:new` | Deliver a newly saved message | Message object |
| `typing:start` | Show a typing indicator | `{ username }` |
| `typing:stop` | Remove a typing indicator | `{ username }` |
| `users:online` | Update the online-user list | `{ count, users }` |
| `socket:error` | Display a Socket.io error | `{ message }` |

---

## Database Design

The application uses a SQLite `messages` table.

```sql
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Columns

| Column | Type | Description |
|---|---|---|
| `id` | Integer | Unique message ID |
| `username` | Text | Message sender |
| `content` | Text | Message content |
| `created_at` | DateTime | Message timestamp |

---

## How Real-Time Messaging Works

1. A user submits a message from the React frontend.
2. React sends the message to `POST /api/messages`.
3. Express validates the input.
4. The backend stores the message in SQLite.
5. The backend broadcasts the saved message using:

```javascript
io.emit("message:new", savedMessage);
```

6. Every connected client receives the message immediately.
7. The frontend updates the message list without refreshing the page.

---

## Error Handling

### Frontend

The frontend handles:

- API request failures
- Socket connection failures
- Automatic reconnection
- Empty input validation
- Message length validation
- Loading states
- Disabled input while sending

### Backend

The backend handles:

- Invalid request bodies
- Missing username
- Missing message content
- Message length validation
- Unknown routes
- SQLite errors
- Socket errors
- Connection and disconnection events

---

## Testing the Application

### Real-Time Test

1. Start the backend and frontend.
2. Open the application in a normal browser window.
3. Join as `Muskan Chauhan`.
4. Open the application in an incognito window.
5. Join as `Rahul`.
6. Send a message from one browser.
7. Confirm that the other browser receives it instantly.
8. Confirm that the online-user count becomes `2`.
9. Start typing and verify the typing indicator.
10. Refresh both windows and verify that old messages remain.
11. Close one browser and verify that the online-user count decreases.

### API Test with PowerShell

Fetch messages:

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:5000/api/messages" `
  -Method Get
```

Send a message:

```powershell
$body = @{
  username = "Muskan Chauhan"
  content = "API testing message"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:5000/api/messages" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

---

## Design Decisions

### React Web Instead of React Native

The assignment allows React Native or React. React web was selected because it allowed the complete application to be developed, tested, and demonstrated within the given 24-hour deadline.

### REST API and Socket.io Separation

REST APIs handle permanent data operations, while Socket.io handles real-time events. This keeps message storage separate from real-time delivery.

### SQLite Database

SQLite was selected because it is lightweight, simple to configure, and suitable for an assignment-scale public chat application.

### Single Public Chat Room

The application uses one public chat room to keep the implementation focused on real-time messaging, history, typing indicators, and presence.

### Dummy Authentication

A username-based login is used without passwords or JWT authentication because full authentication was optional.

---

## Assumptions

- The application contains one public chat room.
- Users enter a username before joining.
- Usernames do not need to be unique.
- Messages are text-only.
- The maximum username length is 30 characters.
- The maximum message length is 500 characters.
- SQLite is sufficient for the assignment.
- Read receipts are outside the main project scope.
- The application is deployed on an Ubuntu VPS using Nginx and PM2.
- The application is demonstrated using a screen recording instead of an APK because React web was used.

---

## Known Limitations

- No password-based authentication
- No private chat rooms
- No file or image sharing
- No message editing or deletion
- No read receipts
- Online-user data is stored in server memory
- Presence data resets when the backend restarts

---

## Future Improvements

- JWT authentication
- Private and group chat rooms
- MongoDB or PostgreSQL support
- Message editing and deletion
- Read and delivered receipts
- File and image uploads
- Emoji picker
- Search messages
- Pagination
- User avatars
- Rate limiting
- Automated tests
- Docker support
- HTTPS with a custom domain
- CI/CD-based automatic deployment

---

## Submission

- **Candidate Name:** Muskan Chauhan
- **Project:** Real-Time Chat Application
- **GitHub Repository:** https://github.com/chauhanmuskan291980-wq/realtime-chat-app
- **Live Application:** http://31.97.230.36:8081
- **Screen Recording:** https://drive.google.com/file/d/181Pxt-ba5NRtgMzqByCWNh8DP43ZwqOf/view?usp=sharing
- **APK:** Not applicable because the frontend was built with React web

---

## Author

**Muskan Chauhan**

Backend-focused Software Engineer and Applied AI learner.