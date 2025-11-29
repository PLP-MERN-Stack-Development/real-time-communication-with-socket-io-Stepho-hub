import React, { useState } from 'react';
import { useChat } from '../contexts/ChatContext';

const UserList = () => {
  const { onlineUsers, user } = useChat();
  const [userSearchTerm, setUserSearchTerm] = useState('');


  // Filter users based on search term
  const filteredUsers = onlineUsers.filter(username =>
    userSearchTerm === '' || username.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  return (
    <div className="p-4 border-t">
      <h3 className="text-sm font-semibold text-gray-600 mb-2">Online Users ({onlineUsers.length})</h3>

      {/* User search input */}
      <input
        type="text"
        placeholder="Search users..."
        value={userSearchTerm}
        onChange={(e) => setUserSearchTerm(e.target.value)}
        className="w-full px-2 py-1 mb-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      />

      <div className="space-y-1 max-h-48 overflow-y-auto">
        {filteredUsers.map((onlineUser) => (
          <div
            key={onlineUser}
            className={`flex items-center space-x-2 p-2 rounded ${onlineUser === user?.username ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">{onlineUser}</span>
            {onlineUser === user?.username && <span className="text-xs text-gray-500">(you)</span>}
          </div>
        ))}
        {filteredUsers.length === 0 && userSearchTerm && (
          <div className="text-sm text-gray-500 text-center py-2">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;