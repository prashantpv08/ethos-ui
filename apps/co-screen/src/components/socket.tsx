import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.VITE_APP_SOCKET_URL || '';

interface SocketContextProps {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const userId = localStorage.getItem('id');

  useEffect(() => {
    const socketInstance = io(SOCKET_SERVER_URL);

    setSocket(socketInstance);
    console.log(userId, 'socket user id');

    socketInstance.on('connect', () => {
      if (userId) {
        socketInstance.emit('join', JSON.stringify({ orgId: userId }));
      }
    });

    socketInstance.on('message', (message) => {
      console.log('Received message:', message);
    });

    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
