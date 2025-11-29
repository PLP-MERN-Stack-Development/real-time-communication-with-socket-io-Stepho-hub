# Real-Time Chat Application

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-19-blue)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-orange)
![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey)
![License](https://img.shields.io/badge/License-MIT-yellow)

A full-stack real-time chat application built with React, Socket.io, and Express. This application allows users to engage in real-time messaging, join chat rooms, send private messages, and see online users with typing indicators and read receipts.

## Features

- **Real-Time Messaging**: Instant message delivery using WebSockets
- **Chat Rooms**: Join and participate in different chat rooms
- **Private Messaging**: Send direct messages to other users
- **User Authentication**: Register and login with JWT tokens
- **Online Users List**: See who is currently online
- **Typing Indicators**: Know when someone is typing
- **Read Receipts**: Mark messages as read
- **Theme Support**: Dark/light theme toggle
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 19
- Vite (build tool)
- Socket.io Client
- Tailwind CSS
- React Router DOM

### Backend
- Node.js
- Express
- Socket.io
- JWT (JSON Web Tokens)
- bcryptjs (password hashing)
- CORS

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd @latest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   PORT=3001
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. In a separate terminal, start the backend server:
   ```bash
   npm run server
   ```

6. Open your browser and navigate to `http://localhost:5173` (Vite default port)

## Usage

1. **Set Username**: Enter a username to join the chat
2. **Join Rooms**: Use the room selector to join different chat rooms
3. **Send Messages**: Type your message and press Enter
4. **Private Messages**: Click on a user in the online list to start a private conversation
5. **Theme Toggle**: Use the theme switcher in the UI to change between light and dark modes

## API Endpoints

### Authentication
- `POST /register` - Register a new user
  - Body: `{ "username": "string", "password": "string" }`
- `POST /login` - Login user
  - Body: `{ "username": "string", "password": "string" }`
  - Response: `{ "token": "jwt_token" }`

### Socket Events

#### Client to Server
- `setUsername` - Set user username
- `joinRoom` - Join a chat room
- `leaveRoom` - Leave a chat room
- `joinPrivate` - Join private chat with another user
- `sendMessage` - Send a message
- `typing` - Indicate typing status
- `stopTyping` - Stop typing indicator
- `markAsRead` - Mark message as read

#### Server to Client
- `onlineUsers` - List of online users
- `roomMessages` - Messages in a room
- `privateMessages` - Private messages
- `message` - New message received
- `userTyping` - User typing status
- `readReceipt` - Read receipt for message

## Scripts

- `npm run dev` - Start the Vite development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run server` - Start the backend server

## Project Structure

```
@latest/
├── public/
├── src/
│   ├── components/
│   │   ├── ChatRoom.jsx
│   │   ├── UsernameSetter.jsx
│   │   ├── UserList.jsx
│   │   └── ...
│   ├── contexts/
│   │   ├── ChatContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   └── useTheme.js
│   ├── App.jsx
│   └── main.jsx
├── server.js
├── package.json
└── vite.config.js
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Socket.io](https://socket.io/) for real-time communication
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling