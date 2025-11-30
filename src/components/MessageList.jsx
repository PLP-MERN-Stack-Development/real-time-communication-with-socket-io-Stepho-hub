import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../contexts/ChatContext';

const MessageList = ({ searchTerm = '', filters = {} }) => {
  const { messages, currentRoom, user, typingUsers, markAsRead, addReaction, startReply, deleteMessage } = useChat();
  const [showOptionsFor, setShowOptionsFor] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const messageContainer = messagesEndRef.current?.parentElement;
    if (messageContainer) {
      const { scrollTop, scrollHeight, clientHeight } = messageContainer;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px threshold
      if (isNearBottom) {
        scrollToBottom();
      }
    }
  }, [messages[currentRoom]]);

  useEffect(() => {
    // Mark messages as read when they come into view
    const messageElements = document.querySelectorAll('.message-item');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const messageId = entry.target.dataset.messageId;
          const message = messages[currentRoom]?.find(m => m.id == messageId);
          if (message && !message.readBy.includes(user?.username)) {
            markAsRead(messageId);
          }
        }
      });
    });

    messageElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [messages[currentRoom], currentRoom, user, markAsRead]);

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.message-item')) {
        setShowOptionsFor(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const roomMessages = (messages[currentRoom] || []).filter(message => {
    // Basic text search
    const matchesSearch = searchTerm === '' ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.user.toLowerCase().includes(searchTerm.toLowerCase());

    // User filter
    const matchesUser = !filters.userFilter ||
      message.user.toLowerCase().includes(filters.userFilter.toLowerCase());

    // Date filter
    let matchesDate = true;
    if (filters.dateFilter) {
      const messageDate = new Date(message.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      switch (filters.dateFilter) {
        case 'today':
          matchesDate = messageDate.toDateString() === today.toDateString();
          break;
        case 'yesterday':
          matchesDate = messageDate.toDateString() === yesterday.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          matchesDate = messageDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          matchesDate = messageDate >= monthAgo;
          break;
      }
    }

    // Reaction filter
    let matchesReaction = true;
    if (filters.reactionFilter) {
      if (filters.reactionFilter === 'reacted') {
        matchesReaction = message.reactions && Object.keys(message.reactions).length > 0;
      } else {
        matchesReaction = message.reactions && message.reactions[filters.reactionFilter] &&
          message.reactions[filters.reactionFilter].length > 0;
      }
    }

    return matchesSearch && matchesUser && matchesDate && matchesReaction;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {roomMessages.map((message) => (
        message.isSystem ? (
          <div key={message.id} className="flex justify-center my-2">
            <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
              {message.message}
            </div>
          </div>
        ) : (
          <div
            key={message.id}
            data-message-id={message.id}
            className={`message-item flex ${message.user === user?.username ? 'justify-end' : 'justify-start'}`}
          >
            <div className="relative group">
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${message.user === user?.username
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800'
                  }`}
                onClick={() => setShowOptionsFor(showOptionsFor === message.id ? null : message.id)}
              >
                {/* Reply context */}
                {message.replyTo && (
                  <div className={`mb-2 p-2 rounded text-sm ${message.user === user?.username ? 'bg-blue-600' : 'bg-gray-100'}`}>
                    <div className="text-xs opacity-75 mb-1">
                      Replying to <span className="font-semibold">{message.replyTo.user}</span>
                    </div>
                    <div className="truncate">{message.replyTo.message}</div>
                  </div>
                )}

                <div className="font-semibold text-sm">{message.user}</div>
                <div>{message.message}</div>
                <div className="text-xs opacity-75 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                  {message.readBy.length > 1 && (
                    <span className="ml-2">✓✓</span>
                  )}
                </div>
                {/* Reactions */}
                {message.reactions && Object.keys(message.reactions).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.entries(message.reactions).map(([reaction, users]) => (
                      <span
                        key={reaction}
                        className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full"
                      >
                        {reaction} {users.length}
                      </span>
                    ))}
                  </div>
                )}
                {/* Reaction buttons */}
                <div className="flex gap-1 mt-2">
                  {['👍', '❤️', '😂', '😮', '😢', '😡'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={(e) => {
                        e.stopPropagation();
                        addReaction(message.id, emoji);
                      }}
                      className="text-xs hover:bg-gray-200 px-1 py-0.5 rounded"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message options menu */}
              {showOptionsFor === message.id && (
                <div className={`absolute z-10 mt-1 ${message.user === user?.username ? 'right-0' : 'left-0'} bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-24`}>
                  <button
                    onClick={() => {
                      startReply(message);
                      setShowOptionsFor(null);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    ↩️ Reply
                  </button>
                  {message.user === user?.username && (
                    <button
                      onClick={() => {
                        deleteMessage(message.id);
                        setShowOptionsFor(null);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      ))}
      {typingUsers.size > 0 && (
        <div className="text-gray-500 italic">
          {Array.from(typingUsers).join(', ')} is typing...
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;