import React, { useState, useEffect, useCallback } from 'react';
import { useChat } from '../contexts/ChatContext';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, startTyping, stopTyping } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
      stopTyping();
    }
  };

  useEffect(() => {
    let typingTimer;
    if (message) {
      startTyping();
      typingTimer = setTimeout(() => {
        stopTyping();
      }, 1000);
    } else {
      stopTyping();
    }
    return () => clearTimeout(typingTimer);
  }, [message, startTyping, stopTyping]);

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;