import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { ChatProvider, useChat } from './contexts/ChatContext.jsx';
import UsernameSetter from './components/UsernameSetter';
import ChatRoom from './components/ChatRoom';
import './App.css';

const AppContent = () => {
  const { user } = useChat();
  return user ? <ChatRoom /> : <UsernameSetter />;
};

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <div className="App">
          <AppContent />
        </div>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;
