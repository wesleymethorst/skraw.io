import { io } from 'socket.io-client'

// Backend URL configuratie
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

// Socket.IO instance
export const socket = io(BACKEND_URL, {
  transports: ['polling', 'websocket'],
  autoConnect: true,
  forceNew: true,
  reconnection: true,
  timeout: 20000,
  withCredentials: true
})

export default socket 