import React, { useEffect, useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';

const ChatRoom = () => {
  const { user, currentRoom, joinRoom, logout, unreadCounts, clearMessages } = useChat();
  const [selectedRoom, setSelectedRoom] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    showFilters: false,
    userFilter: '',
    dateFilter: '',
    reactionFilter: ''
  });

  useEffect(() => {
    joinRoom(selectedRoom);
  }, [selectedRoom, joinRoom]);

  const rooms = ['general', 'random', 'tech'];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Chat Rooms</h2>
          <p className="text-sm text-gray-600">Welcome, {user?.username}</p>
          <button
            onClick={logout}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <div className="p-4">
          {rooms.map(room => (
            <button
              key={room}
              onClick={() => setSelectedRoom(room)}
              className={`w-full text-left p-2 rounded mb-1 flex justify-between items-center ${selectedRoom === room ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
            >
              <span>#{room}</span>
              {(unreadCounts?.[room] || 0) > 0 && selectedRoom !== room && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCounts?.[room] || 0}
                </span>
              )}
            </button>
          ))}
        </div>
        <UserList />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow p-4 border-b">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold">#{currentRoom}</h1>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setSearchFilters(prev => ({ ...prev, showFilters: !prev.showFilters }))}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                Filters
              </button>
              <button
                onClick={clearMessages}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Clear Chat
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {searchFilters.showFilters && (
            <div className="mt-3 p-3 bg-gray-50 rounded border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Filter by user..."
                  value={searchFilters.userFilter}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, userFilter: e.target.value }))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <select
                  value={searchFilters.dateFilter}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, dateFilter: e.target.value }))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All dates</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                </select>
                <select
                  value={searchFilters.reactionFilter}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, reactionFilter: e.target.value }))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All messages</option>
                  <option value="reacted">With reactions</option>
                  <option value="👍">👍 Liked</option>
                  <option value="❤️">❤️ Loved</option>
                  <option value="😂">😂 Funny</option>
                  <option value="😮">😮 Surprised</option>
                  <option value="😢">😢 Sad</option>
                  <option value="😡">😡 Angry</option>
                </select>
              </div>
            </div>
          )}
        </div>
        <MessageList searchTerm={searchTerm} filters={searchFilters} />
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatRoom;