import { io } from 'socket.io-client'

// Backend URL configuratie
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

// Socket.IO instance
export const socket = io(VITE_BACKEND_URL, {
  transports: ['polling', 'websocket'],
  autoConnect: true,
  forceNew: true,
  reconnection: true,
  timeout: 20000,
  withCredentials: true
})

export default socket 