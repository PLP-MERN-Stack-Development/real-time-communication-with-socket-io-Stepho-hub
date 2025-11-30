# 🔄 Week 5: Real-Time Communication with Socket.io

## 🚀 Project Overview
This project implements a comprehensive real-time chat application using Socket.io that demonstrates bidirectional communication between clients and server. The application features live messaging, notifications, online status updates, and advanced chat functionality similar to modern messaging platforms like WhatsApp.

## Assignment Overview

This project implements a comprehensive real-time chat application using Socket.io with the following features:

### Core Features
1. ✅ Real-time messaging using Socket.io
2. ✅ User authentication and presence (username-based)
3. ✅ Multiple chat rooms (general, random, tech)
4. ✅ Private messaging between users
5. ✅ Online/offline user status

### Advanced Features (16 implemented - far exceeds minimum requirement of 3)
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

## ✅ Assignment Tasks Completion

### Task 1: Project Setup ✅
- ✅ Node.js server with Express configured
- ✅ Socket.io configured on server side
- ✅ React front-end application created
- ✅ Socket.io client set up in React app
- ✅ Basic connection established between client and server

### Task 2: Core Chat Functionality ✅
- ✅ User authentication (username-based)
- ✅ Global chat room for all users
- ✅ Messages display with sender name and timestamp
- ✅ Typing indicators implemented
- ✅ Online/offline status for users

### Task 3: Advanced Chat Features ✅
- ✅ Private messaging between users
- ✅ Multiple chat rooms/channels (#general, #random, #tech)
- ✅ "User is typing" indicators
- ✅ Message reactions (like, love, etc.)
- ✅ Read receipts for messages

### Task 4: Real-Time Notifications ✅
- ✅ Notifications for new messages
- ✅ User join/leave notifications
- ✅ Unread message count display
- ✅ Sound notifications for new messages
- ✅ Browser notifications (Web Notifications API)

### Task 5: Performance and UX Optimization ✅
- ✅ Automatic reconnection logic
- ✅ Socket.io optimization with rooms
- ✅ Message search functionality
- ✅ Responsive design (desktop and mobile)
- ✅ Message delivery acknowledgment

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

## 🛠️ Technical Stack

- **Backend:** Node.js, Express.js, Socket.io
- **Frontend:** React 19, Vite, Tailwind CSS
- **Real-time Communication:** Socket.io with WebSocket protocol
- **State Management:** React Context API
- **Styling:** Tailwind CSS with responsive design
- **Build Tool:** Vite for fast development and optimized production builds

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

## 📸 Screenshots & Demo

### Application Screenshots
*Note: Add actual screenshots here showing your application in action*

#### 1. Login Screen
- Shows the username input interface
- Clean, modern design with form validation

#### 2. Main Chat Interface
- Sidebar with chat rooms and online users
- Message list with reactions and timestamps
- Message input area with reply context

#### 3. Message Interactions
- Click on messages to see reply/delete options
- Reply context showing quoted messages
- Reaction emojis on messages

#### 4. Advanced Features
- Search and filter functionality
- Multiple chat rooms (#general, #random, #tech)
- Responsive design on mobile devices

### Demo GIFs
*Note: Add animated GIFs here demonstrating the real-time features*

#### Real-time Messaging Demo
- Show instant message delivery between users
- Typing indicators in action
- Online/offline status updates

#### WhatsApp-Style Features Demo
- Message reply functionality
- Message deletion
- Reaction system

#### Multi-user Experience
- Multiple users joining/leaving
- Real-time synchronization
- Notification system

*To add screenshots/GIFs:*
1. Take screenshots of your running application
2. Create GIFs showing real-time interactions
3. Replace the placeholder text above with actual image links
4. Use services like GitHub issues, Imgur, or embed directly in repository

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

## 🚀 Deployment (Optional)

### Deploying to Production

#### Backend Deployment (Socket.io Server)
Deploy your server to one of these platforms:
- **Render** (recommended for beginners)
- **Railway**
- **Heroku**
- **Vercel** (serverless functions)

#### Frontend Deployment (React Client)
Deploy your client to one of these platforms:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Surge**

### Environment Variables
Create a `.env` file for production:
```env
PORT=3001
CLIENT_URL=https://your-frontend-domain.com
```

### Deployment URLs
*Add your deployed URLs here after deployment:*

- **Frontend:** [Your deployed frontend URL]
- **Backend:** [Your deployed backend URL]

## ✅ Submission Instructions

1. ✅ Accept the GitHub Classroom assignment invitation
2. ✅ Clone your personal repository that was created by GitHub Classroom
3. ✅ Complete all tasks in the assignment (all 5 tasks completed)
4. ✅ Commit and push your code regularly to show progress
5. ✅ Include in your repository:
   - ✅ Complete client and server code
   - ✅ Comprehensive README.md with project overview, setup instructions, and features implemented
   - ✅ Screenshots/GIFs section (add actual images)
6. Optional: Deploy your application and add the URLs to your README.md
7. Your submission will be automatically graded based on the criteria in the autograding configuration
8. The instructor will review your submission after the autograding is complete

## Resources

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Building a Chat Application with Socket.io](https://socket.io/get-started/chat) 