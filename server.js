import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Express route voor de indexpagina
app.get('/', (req, res) => {
  res.send('Hallo test');
});

const MAX_PLAYERS_PER_LOBBY = 4;
const lobbies = new Map(); // Map<lobbyId, {players: Set<socketId>, messages: Array}>

function findAvailableLobby() {
  for (const [lobbyId, lobby] of lobbies.entries()) {
    if (lobby.players.size < MAX_PLAYERS_PER_LOBBY) {
      return lobbyId;
    }
  }
  // Geen lobby gevonden, maak nieuwe
  const newLobbyId = `lobby_${Date.now()}`;
  lobbies.set(newLobbyId, {
    players: new Set(),
    messages: []
  });
  return newLobbyId;
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Zoek of maak een lobby
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

  // Informeer andere spelers over nieuwe speler
  socket.to(lobbyId).emit('player_joined', {
    playerId: socket.id,
    players: Array.from(lobby.players).length
  });

  // Chat berichten afhandelen
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

  // Disconnect afhandelen
  socket.on('disconnect', () => {
    if (lobby) {
      lobby.players.delete(socket.id);
      socket.to(lobbyId).emit('player_left', {
        playerId: socket.id,
        players: Array.from(lobby.players).length
      });

      // Verwijder lege lobby
      if (lobby.players.size === 0) {
        lobbies.delete(lobbyId);
      }
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(3000, () => {
  console.log('Server running on port 3000');
});