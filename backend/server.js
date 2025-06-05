const { Server } = require('socket.io')
const { createServer } = require('http')
const express = require('express')

const wordsByLanguage = {
  dutch: [
    "appel", "banaan", "hond", "kat", "huis", "auto", "fiets", "boom", 
    "zon", "maan", "ster", "boek", "pen", "school", "leraar", 
    "water", "vuur", "aarde", "lucht", "vogel", "vis", "olifant"
  ],
  english: [
    "apple", "banana", "dog", "cat", "house", "car", "bicycle", "tree",
    "sun", "moon", "star", "book", "pen", "school", "teacher",
    "water", "fire", "earth", "air", "bird", "fish", "elephant"
  ],
  german: [
    "Apfel", "Banane", "Hund", "Katze", "Haus", "Auto", "Fahrrad", "Baum",
    "Sonne", "Mond", "Stern", "Buch", "Stift", "Schule", "Lehrer",
    "Wasser", "Feuer", "Erde", "Luft", "Vogel", "Fisch", "Elefant"
  ],
  french: [
    "pomme", "banane", "chien", "chat", "maison", "voiture", "vélo", "arbre",
    "soleil", "lune", "étoile", "livre", "stylo", "école", "professeur",
    "eau", "feu", "terre", "air", "oiseau", "poisson", "éléphant"
  ]
};

const Language = {
  DUTCH: 'dutch',
  ENGLISH: 'english',
  GERMAN: 'german',
  FRENCH: 'french'
};

class Player {
  constructor (socketId, playerData) {
    this.id = socketId
    this.name = playerData.name || 'Anonymous_' + socketId
    this.character = playerData.character || 'unknown'
    this.score = 0
    this.isReady = false
    this.isDrawing = false
    this.hasGuessed = false
  }
}

class Lobby {
  constructor (id) {
    this.id = id
    this.players = new Map()
    this.messages = []
    this.gameState = 'waiting'
    this.MAX_PLAYERS = 4
    this.currentDrawerIndex = 0
    this.currentWord = null
    this.language = Language.DUTCH; // Default taal
    this.drawingHistory = []
    this.drawingData = []
  }

  addPlayer (socketId, playerData) {
    const player = new Player(socketId, playerData)
    this.players.set(socketId, player)
    return player
  }

  setLanguage(language) {
    if (Object.values(Language).includes(language)) {
      this.language = language;
    }
  }

  getRandomWord() {
    const words = wordsByLanguage[this.language];
    if (!words || words.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }


  removePlayer (socketId) {
    return this.players.delete(socketId)
  }

  getPlayerCount () {
    return this.players.size
  }

  isFull () {
    return this.players.size >= this.MAX_PLAYERS
  }

  addMessage (playerId, text) {
    const message = {
      id: Date.now(),
      playerId,
      text,
      timestamp: new Date().toISOString()
    }
    this.messages.push(message)
    return message
  }

  getPlayersData () {
    return Array.from(this.players.values()).map(player => ({
      id: player.id,
      name: player.name,
      character: player.character,
      score: player.score,
      isReady: player.isReady,
      isDrawing: player.isDrawing
    }))
  }

  getNextDrawer () {
    if (this.players.size === 0) return null

    const playersArray = Array.from(this.players.values())
    this.currentDrawerIndex =
      (this.currentDrawerIndex + 1) % playersArray.length
    const nextDrawer = playersArray[this.currentDrawerIndex]

    // Reset tekening status voor alle spelers
    this.players.forEach(player => {
      player.isDrawing = false
    })

    nextDrawer.isDrawing = true
    return nextDrawer
  }
}

class GameServer {
  constructor () {
    const app = express()
    const httpServer = createServer(app)
    const path = require('path')

    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      },
      transports: ['websocket', 'polling'],
      allowEIO3: true
    })
    this.lobbies = new Map()
    this.MAX_PLAYERS_PER_LOBBY = 4

    // Health check endpoint
    app.get('/', (req, res) => {
      res.json({ status: 'OK', message: 'Skraw.io Backend is running' })
    })

    this.setupSocketHandlers()

    const PORT = process.env.PORT || 3000
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`)
    })
  }
  endTurn (lobby) {
    lobby.players.forEach(player => {
      player.hasGuessed = false
      player.isDrawing = false
    })

    const drawer = lobby.getNextDrawer()
    const word = lobby.getRandomWord()
    lobby.currentWord = word

    this.io.to(lobby.id).emit('new_round', {
      drawer: drawer.id,
      players: lobby.getPlayersData()
    })

    this.io.to(drawer.id).emit('your_word', {
      word
    })
  }

  findAvailableLobby () {
    for (const lobby of this.lobbies.values()) {
      if (!lobby.isFull()) {
        return lobby
      }
    }

    const newLobbyId = `lobby_${Date.now()}`
    const newLobby = new Lobby(newLobbyId)
    this.lobbies.set(newLobbyId, newLobby)
    return newLobby
  }

  setupSocketHandlers () {
    this.io.on('connection', socket => {

      let currentLobby = null

      // In setupSocketHandlers
      socket.on('draw', data => {
        if (!currentLobby) return

        const player = currentLobby.players.get(socket.id)
        if (player && player.isDrawing) {
          currentLobby.drawingHistory.push(data) // Bewaar de tekening
          socket.to(currentLobby.id).emit('draw', data)
        }
      })

      socket.on('join_lobby', playerData => {
        
        if (currentLobby) {
          socket.emit('error', { message: 'You are already in a lobby' })
          return
        }

        const lobby = this.findAvailableLobby()
        currentLobby = lobby

        const player = lobby.addPlayer(socket.id, playerData)
        
        socket.join(lobby.id)

        const playersData = lobby.getPlayersData();

        socket.emit('lobby_assigned', {
          lobbyId: lobby.id,
          players: playersData,
          yourPlayer: player,
          playerCount: lobby.getPlayerCount(),
          maxPlayers: lobby.MAX_PLAYERS,
          messages: lobby.messages,
          drawingData: lobby.drawingData
        })
        socket.emit('initial_drawing_data', currentLobby.drawingHistory)
        socket.to(lobby.id).emit('player_joined', {
          player: player,
          playerCount: lobby.getPlayerCount(),
          players: lobby.getPlayersData()
        })
      })

      socket.on('send_message', message => {
        if (!currentLobby) {
          socket.emit('error', { message: 'You are not in a lobby' })
          return
        }

        const player = currentLobby.players.get(socket.id)
        if (!player) {
          socket.emit('error', { message: 'Player not found in lobby' })
          return
        }

        const msg = {
          id: Date.now(),
          playerId: socket.id,
          playerName: player.name,
          text: message.text,
          timestamp: new Date().toISOString()
        }

        currentLobby.messages.push(msg)

        // Check of het geraden woord overeenkomt met het geheime woord
        if (
          !player.hasGuessed &&
          !player.isDrawing &&
          currentLobby.currentWord &&
          message.text.trim().toLowerCase() ===
            currentLobby.currentWord.toLowerCase()
        ) {
          player.hasGuessed = true
          player.score += 10 // of een andere scorewaarde

          // Stuur notificatie naar iedereen
          this.io.to(currentLobby.id).emit('correct_guess', {
            playerId: socket.id,
            playerName: player.name,
            text: 'heeft het woord geraden!',
            score: player.score,
            players: currentLobby.getPlayersData()
          })

          // Eventueel: check of alle spelers het woord geraden hebben en eindig ronde
          const allGuessed = Array.from(currentLobby.players.values()).every(
            p => p.hasGuessed || p.isDrawing
          )

          if (allGuessed) {
            setTimeout(() => {
              this.endTurn(currentLobby)
            }, 2000) // wacht 2 seconden
          }
        } else {
          // Normaal bericht
          this.io.to(currentLobby.id).emit('new_message', msg)
        }
      })

      socket.on('draw', data => {
        if (!currentLobby) return

        const player = currentLobby.players.get(socket.id)
        if (player && player.isDrawing) {
          currentLobby.drawingData.push(data) // Bewaar de tekening
          socket.to(currentLobby.id).emit('draw', data)
        }
      })

      socket.on('player_ready', () => {
        if (!currentLobby) return

        const player = currentLobby.players.get(socket.id)
        if (player) {
          player.isReady = !player.isReady // Toggle ready status

          // Stuur update naar alle clients
          this.io.to(currentLobby.id).emit('player_ready_update', {
            playerId: socket.id,
            isReady: player.isReady,
            players: currentLobby.getPlayersData()
          })

          this.checkAllPlayersReady(currentLobby)
        }
      })

      socket.on('disconnect', () => {

        if (currentLobby) {
          // Verwijder speler eerst uit de lobby
          currentLobby.removePlayer(socket.id)

          // Stuur update naar alle clients in de lobby
          this.io.to(currentLobby.id).emit('player_left', {
            playerId: socket.id,
            players: currentLobby.getPlayersData(),
            playerCount: currentLobby.getPlayerCount()
          })

          // Verwijder lobby als deze leeg is
          if (currentLobby.getPlayerCount() === 0) {
            this.lobbies.delete(currentLobby.id)
          }
        }
      })
    })
  }

  checkAllPlayersReady (lobby) {
    const allReady = Array.from(lobby.players.values()).every(p => p.isReady)
    if (allReady && lobby.players.size > 1) {
      this.startGame(lobby)
    }
  }

  startGame (lobby) {
    lobby.gameState = 'playing'
    const drawer = lobby.getNextDrawer()

    if (drawer) {
      drawer.isDrawing = true
      const word = lobby.getRandomWord(); // Gebruik de nieuwe getRandomWord functie
      lobby.currentWord = word

      this.io.to(lobby.id).emit('game_started', {
        drawer: drawer.id,
        players: lobby.getPlayersData()
      })

      this.io.to(drawer.id).emit('your_word', {
        word
      })
    }
  }
}

new GameServer()
