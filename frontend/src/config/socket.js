import { io } from 'socket.io-client'

// Backend URL configuratie
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

console.log(BACKEND_URL)

// Socket.IO instance
export const socket = io(BACKEND_URL, {
  transports: ['polling', 'websocket'],
  withCredentials: true
})

export default socket 