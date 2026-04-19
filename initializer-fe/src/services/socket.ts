import { io } from 'socket.io-client';

const isProd = import.meta.env.PROD;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (isProd ? window.location.origin : 'http://localhost:3001');

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
