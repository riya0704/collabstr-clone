import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendTyping: (conversationId: string, userName: string) => void;
  stopTyping: (conversationId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user && token) {
      const newSocket = io(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000', {
        auth: {
          token
        }
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        newSocket.emit('join_user_room', user.id);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, token]);

  const joinConversation = (conversationId: string) => {
    if (socket) {
      socket.emit('join_conversation', conversationId);
    }
  };

  const leaveConversation = (conversationId: string) => {
    if (socket) {
      socket.emit('leave_conversation', conversationId);
    }
  };

  const sendTyping = (conversationId: string, userName: string) => {
    if (socket && user) {
      socket.emit('typing_start', {
        conversationId,
        userId: user.id,
        userName
      });
    }
  };

  const stopTyping = (conversationId: string) => {
    if (socket && user) {
      socket.emit('typing_stop', {
        conversationId,
        userId: user.id
      });
    }
  };

  const value = {
    socket,
    isConnected,
    joinConversation,
    leaveConversation,
    sendTyping,
    stopTyping
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};