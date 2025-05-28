// vercel.js - Helper file for Vercel deployments
import { createServer } from 'http';
import { parse } from 'url';
import { Server as SocketServer } from 'socket.io';
import express from 'express';

// Create Express app and HTTP server
const app = express();
const server = createServer(app);

// Set up Socket.IO
const io = new SocketServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Import the socket.io logic from server.js
const MAX_PLAYERS_PER_LOBBY = 4;
const lobbies = new Map(); // Map<lobbyId, {players: Set<socketId>, messages: Array}>

function findAvailableLobby() {
  for (const [lobbyId, lobby] of lobbies.entries()) {
    if (lobby.players.size < MAX_PLAYERS_PER_LOBBY) {
      return lobbyId;
    }
  }
  // No lobby found, create new one
  const newLobbyId = `lobby_${Date.now()}`;
  lobbies.set(newLobbyId, {
    players: new Set(),
    messages: []
  });
  return newLobbyId;
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Find or create a lobby
  const lobbyId = findAvailableLobby();
  const lobby = lobbies.get(lobbyId);
  lobby.players.add(socket.id);
  
  socket.join(lobbyId);
  socket.emit('lobby_assigned', { 
    lobbyId,
    players: Array.from(lobby.players).length,
    maxPlayers: MAX_PLAYERS_PER_LOBBY,
    messages: lobby.messages
  });

  // Inform other players about new player
  socket.to(lobbyId).emit('player_joined', {
    playerId: socket.id,
    players: Array.from(lobby.players).length
  });

  // Handle chat messages
  socket.on('send_message', (message) => {
    const msg = {
      id: Date.now(),
      playerId: socket.id,
      text: message,
      timestamp: new Date().toISOString()
    };
    
    lobby.messages.push(msg);
    io.to(lobbyId).emit('new_message', msg);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (lobby) {
      lobby.players.delete(socket.id);
      socket.to(lobbyId).emit('player_left', {
        playerId: socket.id,
        players: Array.from(lobby.players).length
      });

      // Remove empty lobby
      if (lobby.players.size === 0) {
        lobbies.delete(lobbyId);
      }
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', lobbies: lobbies.size });
});

// Default route
app.get('/', (req, res) => {
  res.send('Skraw.io Server is running');
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default function handler(req, res) {
  const parsedUrl = parse(req.url, true);
  
  // Socket.io handling
  if (parsedUrl.pathname.startsWith('/socket.io/')) {
    return server;
  }
  
  // API routes
  if (parsedUrl.pathname.startsWith('/api/')) {
    return app(req, res);
  }
  
  // Default handling
  return app(req, res);
} 