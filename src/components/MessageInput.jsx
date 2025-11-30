import React, { useState, useEffect, useCallback } from 'react';
import { useChat } from '../contexts/ChatContext';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, startTyping, stopTyping, replyingTo, cancelReply } = useChat();

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
      {/* Reply context */}
      {replyingTo && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">
                Replying to <span className="font-semibold">{replyingTo.user}</span>
              </div>
              <div className="text-sm text-gray-800 truncate">
                {replyingTo.message}
              </div>
            </div>
            <button
              onClick={cancelReply}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={replyingTo ? "Type your reply..." : "Type a message..."}
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