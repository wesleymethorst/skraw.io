import { io } from 'socket.io-client'

// Backend URL configuratie
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

// Socket.IO instance
export const socket = io(BACKEND_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: true
})

export default socket 