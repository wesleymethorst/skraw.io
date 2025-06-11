const { Server } = require('socket.io')
const { createServer } = require('http')
const express = require('express')
const axios = require('axios')

const wordsByLanguage = {
  dutch: [
    "appel", "banaan", "hond", "kat", "huis", "auto", "fiets", "boom", 
    "zon", "maan", "ster", "boek", "pen", "school", "leraar", 
    "water", "vuur", "aarde", "lucht", "vogel", "vis", "olifant",
    "stoel", "tafel", "plant", "bloem", "strand", "kasteel", "brug", "toren",
    "kamer", "keuken", "bed", "bank", "lamp", "deur", "raam", "muur",
    "fiets", "boot", "trein", "bus", "metro", "vliegtuig", "taxi", "motor",
    "appel", "peer", "kers", "druif", "meloen", "citroen", "perzik", "pruim",
    "hond", "kat", "paard", "koe", "varken", "geit", "schaap", "kip",
    "mes", "vork", "lepel", "bord", "glas", "kopje", "pan", "oven",
    "bal", "pop", "auto", "trein", "vliegtuig", "boot", "fiets", "robot",
    "regen", "sneeuw", "zon", "maan", "ster", "wind", "mist", "storm",
    "boom", "gras", "bloem", "plant", "bos", "veld", "berg", "heuvel",
    "stoel", "tafel", "bank", "bed", "kast", "lamp", "deur", "raam",
    "boek", "pen", "papier", "schrift", "map", "computer", "telefoon", "tablet",
    "water", "vuur", "aarde", "lucht", "ijs", "steen", "zand", "modder",
    "vogel", "vis", "hond", "kat", "paard", "koe", "geit", "schaap",
    "fiets", "auto", "bus", "trein", "boot", "vliegtuig", "taxi", "motor",
    "appel", "peer", "kers", "druif", "meloen", "citroen", "perzik", "pruim"
  ],
  english: [
    "apple", "banana", "dog", "cat", "house", "car", "bicycle", "tree",
    "sun", "moon", "star", "book", "pen", "school", "teacher",
    "water", "fire", "earth", "air", "bird", "fish", "elephant",
    "chair", "table", "plant", "flower", "beach", "castle", "bridge", "tower",
    "room", "kitchen", "bed", "sofa", "lamp", "door", "window", "wall",
    "bike", "boat", "train", "bus", "metro", "plane", "taxi", "motor",
    "peach", "grape", "melon", "lemon", "plum", "cherry", "pear", "apple",
    "knife", "fork", "spoon", "plate", "glass", "cup", "pan", "oven",
    "ball", "doll", "car", "train", "plane", "boat", "bike", "robot",
    "rain", "snow", "sun", "moon", "star", "wind", "fog", "storm",
    "tree", "grass", "flower", "plant", "forest", "field", "mountain", "hill",
    "chair", "table", "sofa", "bed", "closet", "lamp", "door", "window",
    "book", "pen", "paper", "notebook", "folder", "computer", "phone", "tablet",
    "water", "fire", "earth", "air", "ice", "stone", "sand", "mud",
    "bird", "fish", "dog", "cat", "horse", "cow", "goat", "sheep",
    "bike", "car", "bus", "train", "boat", "plane", "taxi", "motor",
    "peach", "grape", "melon", "lemon", "plum", "cherry", "pear", "apple"
  ],
  german: [
    "Apfel", "Banane", "Hund", "Katze", "Haus", "Auto", "Fahrrad", "Baum",
    "Sonne", "Mond", "Stern", "Buch", "Stift", "Schule", "Lehrer",
    "Wasser", "Feuer", "Erde", "Luft", "Vogel", "Fisch", "Elefant",
    "Stuhl", "Tisch", "Pflanze", "Blume", "Strand", "Schloss", "Brücke", "Turm",
    "Zimmer", "Küche", "Bett", "Sofa", "Lampe", "Tür", "Fenster", "Wand",
    "Rad", "Boot", "Zug", "Bus", "U-Bahn", "Flugzeug", "Taxi", "Motor",
    "Pfirsich", "Traube", "Melone", "Zitrone", "Pflaume", "Kirsche", "Birne", "Apfel",
    "Messer", "Gabel", "Löffel", "Teller", "Glas", "Tasse", "Pfanne", "Ofen",
    "Ball", "Puppe", "Auto", "Zug", "Flugzeug", "Boot", "Rad", "Roboter",
    "Regen", "Schnee", "Sonne", "Mond", "Stern", "Wind", "Nebel", "Sturm",
    "Baum", "Gras", "Blume", "Pflanze", "Wald", "Feld", "Berg", "Hügel",
    "Stuhl", "Tisch", "Sofa", "Bett", "Schrank", "Lampe", "Tür", "Fenster",
    "Buch", "Stift", "Papier", "Notizbuch", "Ordner", "Computer", "Telefon", "Tablet",
    "Wasser", "Feuer", "Erde", "Luft", "Eis", "Stein", "Sand", "Schlamm",
    "Vogel", "Fisch", "Hund", "Katze", "Pferd", "Kuh", "Ziege", "Schaf",
    "Rad", "Auto", "Bus", "Zug", "Boot", "Flugzeug", "Taxi", "Motor",
    "Pfirsich", "Traube", "Melone", "Zitrone", "Pflaume", "Kirsche", "Birne", "Apfel"
  ],
  french: [
    "pomme", "banane", "chien", "chat", "maison", "voiture", "vélo", "arbre",
    "soleil", "lune", "étoile", "livre", "stylo", "école", "professeur",
    "eau", "feu", "terre", "air", "oiseau", "poisson", "éléphant",
    "chaise", "table", "plante", "fleur", "plage", "château", "pont", "tour",
    "chambre", "cuisine", "lit", "canapé", "lampe", "porte", "fenêtre", "mur",
    "vélo", "bateau", "train", "bus", "métro", "avion", "taxi", "moteur",
    "pêche", "raisin", "melon", "citron", "prune", "cerise", "poire", "pomme",
    "couteau", "fourchette", "cuillère", "assiette", "verre", "tasse", "poêle", "four",
    "balle", "poupée", "voiture", "train", "avion", "bateau", "vélo", "robot",
    "pluie", "neige", "soleil", "lune", "étoile", "vent", "brouillard", "tempête",
    "arbre", "herbe", "fleur", "plante", "forêt", "champ", "montagne", "colline",
    "chaise", "table", "canapé", "lit", "placard", "lampe", "porte", "fenêtre",
    "livre", "stylo", "papier", "cahier", "dossier", "ordinateur", "téléphone", "tablette",
    "eau", "feu", "terre", "air", "glace", "pierre", "sable", "boue",
    "oiseau", "poisson", "chien", "chat", "cheval", "vache", "chèvre", "mouton",
    "vélo", "voiture", "bus", "train", "bateau", "avion", "taxi", "moteur",
    "pêche", "raisin", "melon", "citron", "prune", "cerise", "poire", "pomme"
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
      isDrawing: player.isDrawing,
      hasGuessed: player.hasGuessed
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

    // AI Service URL
    this.AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001'

    console.log(this.AI_SERVICE_URL)

    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST']
      }
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

    // Wis alle tekening data op de server
    lobby.drawingHistory = []
    lobby.drawingData = []
            
    // Stuur clear commando naar ALLE clients in de lobby
    this.io.to(lobby.id).emit('canvas-action', { 
      type: 'clear', 
      playerId: 'system'
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
    // Zoek naar een lobby die niet vol is en in de 'waiting' staat
    for (const lobby of this.lobbies.values()) {
      if (!lobby.isFull() && lobby.gameState === 'waiting') {
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

      socket.on('send_message', async message => {
        if (!currentLobby) return

        const player = currentLobby.players.get(socket.id)
        if (!player) return

        const msg = currentLobby.addMessage(socket.id, message.text)
        msg.playerName = player.name

        // STAP 1: Check eerst of het woord EXACT klopt
        if (
          !player.hasGuessed &&
          !player.isDrawing &&
          currentLobby.currentWord &&
          message.text.trim().toLowerCase() === currentLobby.currentWord.toLowerCase()
        ) {
          console.log(`EXACT MATCH: "${message.text}" === "${currentLobby.currentWord}" - NO AI NEEDED`)
          
          player.hasGuessed = true
          player.score += 10

          this.io.to(currentLobby.id).emit('correct_guess', {
            playerId: socket.id,
            playerName: player.name,
            text: 'heeft het woord geraden!',
            word: currentLobby.currentWord,
            score: player.score,
            players: currentLobby.getPlayersData()
          })

          const allGuessed = Array.from(currentLobby.players.values()).every(
            p => p.hasGuessed || p.isDrawing
          )

          if (allGuessed) {
            setTimeout(() => {
              this.endTurn(currentLobby)
            }, 2000)
          }
        } 
        //  STAP 2: Alleen als het NIET exact klopt EN tijdens het spel EN AI INGESCHAKELD → AI gebruiken
        else if (
          !player.hasGuessed &&
          !player.isDrawing &&
          currentLobby.currentWord &&
          currentLobby.gameState === 'playing' &&
          message.aiHelperEnabled === true
        ) {
          console.log(`🔍 NO EXACT MATCH: "${message.text}" !== "${currentLobby.currentWord}" - CALLING AI (AI ENABLED: ${message.aiHelperEnabled})`)
          
          try {
            const aiResponse = await axios.post(`${this.AI_SERVICE_URL}/evaluate-guess`, {
              target_word: currentLobby.currentWord,
              user_guess: message.text.trim()
            })

            const feedback = aiResponse.data.feedback
            
            // Stuur het normale bericht naar alle spelers
            this.io.to(currentLobby.id).emit('new_message', msg)
            
            // Stuur AI feedback als normaal chatbericht alleen naar de gokker
            const aiFeedbackMessage = {
              id: Date.now() + 1,
              playerId: 'ai-helper',
              playerName: 'AI Helper',
              text: feedback,
              timestamp: new Date().toISOString()
            }
            
            this.io.to(socket.id).emit('new_message', aiFeedbackMessage)
            
          } catch (error) {
            this.io.to(currentLobby.id).emit('new_message', msg)
          }
        } 
        // STAP 3: Alle andere gevallen → gewoon normaal chatbericht
        else {
          console.log(`💬 NORMAL MESSAGE: Not during game or from drawer or AI disabled (AI: ${message.aiHelperEnabled})`)
          this.io.to(currentLobby.id).emit('new_message', msg)
        }
      })

      socket.on('canvas-action', data => {
        if (!currentLobby) return

        const player = currentLobby.players.get(socket.id)
        if (!player) return

        if (data.type === 'clear') {
          // Wis alle tekening data op de server
          currentLobby.drawingHistory = []
          currentLobby.drawingData = []
          
          // Stuur clear commando naar ALLE clients in de lobby (inclusief degene die clear heeft gedrukt)
          this.io.to(currentLobby.id).emit('canvas-action', { 
            type: 'clear', 
            playerId: socket.id 
          })
        } else if (data.type === 'undo' || data.type === 'redo') {
          // Alleen toestaan als de speler aan het tekenen is
          if (player.isDrawing) {
            // Stuur undo/redo commando naar andere clients met canvas data
            socket.to(currentLobby.id).emit('canvas-action', { 
              type: data.type,
              canvasData: data.canvasData,
              playerId: socket.id 
            })
          }
        } else {
          // Alleen toestaan als de speler aan het tekenen is
          if (player.isDrawing) {
            currentLobby.drawingHistory.push(data)
            currentLobby.drawingData.push(data)
            
            // Stuur tekening data door naar andere clients
            socket.to(currentLobby.id).emit('canvas-action', { 
              ...data, 
              playerId: socket.id 
            })
          }
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
          const disconnectedPlayer = currentLobby.players.get(socket.id)
          
          // Verwijder speler uit de lobby
          currentLobby.removePlayer(socket.id)

          // Als het spel bezig was en er zijn nu te weinig spelers (minder dan 2)
          if (currentLobby.gameState === 'playing' && currentLobby.getPlayerCount() < 2) {
            // Reset de lobby naar waiting state
            currentLobby.gameState = 'waiting'
            currentLobby.currentWord = null
            currentLobby.drawingHistory = []
            currentLobby.drawingData = []
            
            // Reset alle speler states
            currentLobby.players.forEach(player => {
              player.isReady = false
              player.isDrawing = false
              player.hasGuessed = false
            })

            // Inform remaining players that game was ended due to insufficient players
            this.io.to(currentLobby.id).emit('game_ended', {
              reason: 'insufficient_players',
              message: 'Game ended due to insufficient players',
              gameState: 'waiting'
            })
          }

          // Stuur update naar alle clients in de lobby
          this.io.to(currentLobby.id).emit('player_left', {
            playerId: socket.id,
            playerName: disconnectedPlayer?.name || 'Unknown Player',
            players: currentLobby.getPlayersData(),
            playerCount: currentLobby.getPlayerCount(),
            gameState: currentLobby.gameState
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
      const word = lobby.getRandomWord();
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
