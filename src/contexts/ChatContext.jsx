import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import io from 'socket.io-client';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [messages, setMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [notifications, setNotifications] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

  // Track if socket event handlers have been set up
  const handlersSetUp = useRef(false);

  // Unique ID generator to prevent duplicate keys
  const generateUniqueId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Stable event handlers using useCallback
  const handleConnect = useCallback(() => {
    setSocketConnected(true);
    if (socket && user?.username) {
      socket.emit('setUsername', user.username);
      socket.emit('joinRoom', currentRoom);
    }
  }, [socket, user?.username, currentRoom]);

  const handleDisconnect = useCallback(() => {
    setSocketConnected(false);
  }, []);

  const handleRoomMessages = useCallback((roomMessages) => {
    if (!currentRoom) return;
    setMessages(prev => {
      const existing = prev[currentRoom] || [];
      const newMessages = roomMessages.filter(msg => !existing.find(e => e.id === msg.id));
      return { ...prev, [currentRoom]: [...existing, ...newMessages] };
    });
  }, [currentRoom]);

  const handleOnlineUsers = useCallback((users) => {
    setOnlineUsers(users);
  }, []);

  const handleMessage = useCallback((message) => {
    // Prevent handling messages if user is not set or component is unmounting
    if (!user?.username) return;

    setMessages(prev => ({
      ...prev,
      [currentRoom]: [...(prev[currentRoom] || []), message]
    }));
    if (message.user !== user.username) {
      setNotifications(prev => [...prev, { type: 'message', from: message.user, room: currentRoom }]);
      setUnreadCounts(prev => ({
        ...prev,
        [currentRoom]: (prev[currentRoom] || 0) + 1
      }));
      playNotificationSound();
      showBrowserNotification(`New message from ${message.user}`, message.message);
    }
  }, [currentRoom, user?.username]);

  const handleUserTyping = useCallback(({ user: typingUser, typing }) => {
    setTypingUsers(prev => {
      const newSet = new Set(prev);
      if (typing) {
        newSet.add(typingUser);
      } else {
        newSet.delete(typingUser);
      }
      return newSet;
    });
  }, []);

  const handleReadReceipt = useCallback(({ messageId, user: readUser }) => {
    setMessages(prev => ({
      ...prev,
      [currentRoom]: prev[currentRoom]?.map(msg =>
        msg.id === messageId ? { ...msg, readBy: [...msg.readBy, readUser] } : msg
      ) || []
    }));
  }, [currentRoom]);

  const handleReactionUpdate = useCallback(({ messageId, reaction, user: reactionUser }) => {
    setMessages(prev => ({
      ...prev,
      [currentRoom]: prev[currentRoom]?.map(msg =>
        msg.id === messageId ? {
          ...msg,
          reactions: {
            ...msg.reactions,
            [reaction]: [...(msg.reactions?.[reaction] || []), reactionUser]
          }
        } : msg
      ) || []
    }));
  }, [currentRoom]);

  const handleUserJoinedRoom = useCallback(({ username, room }) => {
    if (room === currentRoom && username !== user?.username) {
      setNotifications(prev => [...prev, { type: 'join', from: username, room }]);
    }
  }, [currentRoom, user?.username]);

  const handleUserLeftRoom = useCallback(({ username, room }) => {
    if (room === currentRoom && username !== user?.username) {
      setNotifications(prev => [...prev, { type: 'leave', from: username, room }]);
    }
  }, [currentRoom, user?.username]);

  const connectSocket = useCallback(() => {
    // Prevent creating multiple socket connections
    if (socket || handlersSetUp.current) {
      return;
    }

    const newSocket = io('http://localhost:3001');

    // Set up event handlers only once
    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('roomMessages', handleRoomMessages);
    newSocket.on('onlineUsers', handleOnlineUsers);
    newSocket.on('message', handleMessage);
    newSocket.on('userTyping', handleUserTyping);
    newSocket.on('readReceipt', handleReadReceipt);
    newSocket.on('reactionUpdate', handleReactionUpdate);
    newSocket.on('userJoinedRoom', handleUserJoinedRoom);
    newSocket.on('userLeftRoom', handleUserLeftRoom);
    newSocket.on('messageDeleted', ({ messageId }) => {
      setMessages(prev => ({
        ...prev,
        [currentRoom]: prev[currentRoom]?.filter(msg => msg.id !== messageId) || []
      }));
    });

    handlersSetUp.current = true;
    setSocket(newSocket);
  }, [socket, handleConnect, handleDisconnect, handleRoomMessages, handleOnlineUsers, handleMessage, handleUserTyping, handleReadReceipt, handleReactionUpdate, handleUserJoinedRoom, handleUserLeftRoom]);

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setSocketConnected(false);
      handlersSetUp.current = false;
    }
  };

  const joinRoom = useCallback((room) => {
    if (socketConnected && socket) {
      if (currentRoom) {
        socket.emit('leaveRoom', currentRoom);
      }
      socket.emit('joinRoom', room);
      setCurrentRoom(room);
      if (!messages[room]) {
        setMessages(prev => ({ ...prev, [room]: [] }));
      }
      // Reset unread count for this room
      setUnreadCounts(prev => ({ ...prev, [room]: 0 }));
    }
  }, [socketConnected, socket, currentRoom, messages]);

  const sendMessage = useCallback((message, isPrivate = false, recipient = null) => {
    if (socketConnected && user?.username) {
      const msg = {
        id: generateUniqueId(),
        user: user.username,
        message,
        timestamp: new Date(),
        readBy: [user.username],
        replyTo: replyingTo ? {
          id: replyingTo.id,
          user: replyingTo.user,
          message: replyingTo.message
        } : null
      };
      setMessages(prev => ({ ...prev, [currentRoom]: [...(prev[currentRoom] || []), msg] }));
      socket.emit('sendMessage', { room: currentRoom, message, isPrivate, recipient, replyTo: replyingTo });
      setReplyingTo(null); // Clear reply state after sending
    }
  }, [socketConnected, user?.username, currentRoom, socket, generateUniqueId, replyingTo]);

  const startTyping = useCallback((isPrivate = false, recipient = null) => {
    if (socket) {
      socket.emit('typing', { room: currentRoom, isPrivate, recipient });
    }
  }, [socket, currentRoom]);

  const stopTyping = useCallback((isPrivate = false, recipient = null) => {
    if (socket) {
      socket.emit('stopTyping', { room: currentRoom, isPrivate, recipient });
    }
  }, [socket, currentRoom]);

  const markAsRead = useCallback((messageId, isPrivate = false, recipient = null) => {
    if (socket) {
      socket.emit('markAsRead', { messageId, room: currentRoom, isPrivate, recipient });
    }
  }, [socket, currentRoom]);

  const addReaction = useCallback((messageId, reaction, isPrivate = false, recipient = null) => {
    if (socket) {
      socket.emit('addReaction', { messageId, reaction, room: currentRoom, isPrivate, recipient });
    }
  }, [socket, currentRoom]);

  const login = async (username, password) => {
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      setUser({ username });
      connectSocket(data.token);
      return true;
    }
    return false;
  };

  const register = async (username, password) => {
    const response = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return response.ok;
  };

  const setUsername = useCallback((username) => {
    setUser({ username });
    localStorage.setItem('username', username);
    if (socketConnected && socket) {
      socket.emit('setUsername', username);
      joinRoom(currentRoom);
    }
  }, [socketConnected, socket, currentRoom, joinRoom]);

  const playNotificationSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const showBrowserNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/vite.svg' });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const startReply = useCallback((message) => {
    setReplyingTo(message);
  }, []);

  const cancelReply = useCallback(() => {
    setReplyingTo(null);
  }, []);

  const deleteMessage = useCallback((messageId) => {
    if (user?.username) {
      setMessages(prev => ({
        ...prev,
        [currentRoom]: prev[currentRoom]?.filter(msg => msg.id !== messageId) || []
      }));
      socket.emit('deleteMessage', { messageId, room: currentRoom });
    }
  }, [user?.username, currentRoom, socket]);

  const clearMessages = useCallback(() => {
    setMessages({});
    if (user?.username) {
      localStorage.removeItem(`messages_${user.username}`);
    }
  }, [user?.username]);

  const logout = useCallback(() => {
    disconnectSocket();
    setUser(null);
    localStorage.removeItem('username');
    setOnlineUsers([]);
    setTypingUsers(new Set());
    setNotifications([]);
  }, []);

  useEffect(() => {
    // Request notification permission
    requestNotificationPermission();

    const username = localStorage.getItem('username');
    if (username) {
      setUser({ username });
      // Load messages for this user
      const savedMessages = localStorage.getItem(`messages_${username}`);
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages);
          // Convert timestamp strings back to Date objects
          Object.keys(parsed).forEach(room => {
            parsed[room] = parsed[room].map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }));
          });
          setMessages(parsed);
        } catch (e) {
          console.error('Error loading messages from localStorage', e);
        }
      }
      connectSocket();
    } else {
      connectSocket();
    }
  }, []);

  // Force refresh online users when user changes
  useEffect(() => {
    if (user && socket && socketConnected) {
      // Request current online users from server
      socket.emit('getOnlineUsers');
    }
  }, [user, socketConnected]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (user && Object.keys(messages).length > 0) {
      localStorage.setItem(`messages_${user.username}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
        handlersSetUp.current = false;
      }
    };
  }, [socket]);

  return (
    <ChatContext.Provider value={{
      user,
      onlineUsers,
      currentRoom,
      messages,
      typingUsers,
      notifications,
      replyingTo,
      joinRoom,
      sendMessage,
      startTyping,
      stopTyping,
      markAsRead,
      addReaction,
      startReply,
      cancelReply,
      deleteMessage,
      setUsername,
      login,
      register,
      logout,
      clearMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
};