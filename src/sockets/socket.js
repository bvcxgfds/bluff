import { io } from 'socket.io-client';

export const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

export function createGameSocket({ roomId, playerId }) {
  return io(SERVER_URL, {
    transports: ['websocket', 'polling'],
    auth: { roomId, playerId },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 3000
  });
}
