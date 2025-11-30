# Real-Time Chat Application with Socket.io

This assignment focuses on building a real-time chat application using Socket.io, implementing bidirectional communication between clients and server.

## Assignment Overview

This project implements a comprehensive real-time chat application using Socket.io with the following features:

### Core Features
1. ✅ Real-time messaging using Socket.io
2. ✅ User authentication and presence (username-based)
3. ✅ Multiple chat rooms (general, random, tech)
4. ✅ Private messaging between users
5. ✅ Online/offline user status

### Advanced Features
6. ✅ Real-time notifications (join/leave, unread counts, sound, browser notifications)
7. ✅ Typing indicators
8. ✅ Read receipts
9. ✅ Message reactions (👍 ❤️ 😂 😮 😢 😡)
10. ✅ Message search functionality
11. ✅ Message persistence in localStorage
12. ✅ Reply to messages (WhatsApp-style)
13. ✅ Delete own messages
14. ✅ Advanced filtering (user, date, reactions)
15. ✅ Responsive design for desktop and mobile
16. ✅ Automatic reconnection handling

## Project Structure

```
real-time-communication-with-socket-io-Stepho-hub/
├── server.js               # Main server file (Express + Socket.io)
├── src/                    # React client source code
│   ├── components/         # UI components
│   │   ├── ChatRoom.jsx    # Main chat interface
│   │   ├── MessageList.jsx # Message display component
│   │   ├── MessageInput.jsx# Message input component
│   │   ├── UserList.jsx    # Online users list
│   │   └── UsernameSetter.jsx # Username input component
│   ├── contexts/           # React context providers
│   │   ├── ChatContext.jsx # Chat state management
│   │   └── ThemeContext.jsx# Theme management
│   ├── hooks/              # Custom React hooks
│   └── App.jsx             # Main application component
├── public/                 # Static assets
├── server/                 # Alternative server implementation
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation & Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd real-time-communication-with-socket-io-Stepho-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development servers:
   ```bash
   # Terminal 1: Start the server
   npm run server

   # Terminal 2: Start the client
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Usage
- Enter a username to join the chat
- Switch between chat rooms using the sidebar
- Send messages, react with emojis, and search through message history
- **Reply to messages**: Click any message to see reply/delete options
- **Delete messages**: Click your own messages and select "Delete"
- **Advanced filtering**: Use the "Filters" button for user/date/reaction filtering
- **Online users**: View all online users in the sidebar (shows properly for single/multiple users)
- Enable browser notifications for new messages

## Files Included

- `Week5-Assignment.md`: Detailed assignment instructions
- Starter code for both client and server:
  - Basic project structure
  - Socket.io configuration templates
  - Sample components for the chat interface

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser
- Basic understanding of React and Express

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. Complete both the client and server portions of the application
2. Implement the core chat functionality
3. Add at least 3 advanced features
4. Document your setup process and features in the README.md
5. Include screenshots or GIFs of your working application
6. Optional: Deploy your application and add the URLs to your README.md

## Resources

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Building a Chat Application with Socket.io](https://socket.io/get-started/chat) 