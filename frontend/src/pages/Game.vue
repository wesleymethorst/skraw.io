<template>
  <div class="game-page">
    <div class="grid grid-cols-[280px_1fr_320px] grid-rows-[60px_auto_120px] h-screen w-screen box-border overflow-hidden font-comic" style="grid-template-areas: 'sidebar topbar rightbar' 'sidebar canvas rightbar' 'sidebar bottombar rightbar';">
      <!-- Sidebar -->
      <aside class="bg-[#f5ecc8d9] shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col p-4 text-sm gap-3 overflow-y-auto border-r-2 border-[#d4c19c]" style="grid-area: sidebar;">
        <div class="text-center mb-2">
          <h2 class="text-[#8B4513] text-lg font-black">Players</h2>
        </div>
        <PlayerList 
          :maxPlayers="maxPlayers" 
          :players="players" 
          :character="character"
          :yourId="socket?.id" 
          :socket="socket"
          :gameState="gameState"
        />
      </aside>

      <div class="contents">
        <!-- Top bar -->
        <header class="bg-[#f5ecc8bf] shadow-[0_2px_10px_rgba(0,0,0,0.2)] flex justify-between items-center px-6 text-sm border-b-2 border-[#d4c19c]" style="grid-area: topbar;">
          <div class="flex items-center gap-4">
            <img 
              src="../assets/skrawio_logo_transparant3.png" 
              alt="Skraw.io Logo" 
              class="h-10 w-auto" 
            />
            <h1 class="text-[#8B4513] text-xl font-black">Game Room</h1>
          </div>
          <div class="flex gap-6 text-sm">
            <div class="bg-[#f5ecc8d9] px-3 py-1.5 rounded-md border border-[#d4c19c] shadow-sm">
              <span v-if="currentWord" class="text-[#654321] font-bold">Your word: <span class="text-[#8B4513]">{{ currentWord }}</span></span>
              <span v-else class="text-[#654321] font-bold">Current word: _ _ _ _ _</span>
            </div>
            <div class="bg-[#f5ecc8d9] px-3 py-1.5 rounded-md border border-[#d4c19c] shadow-sm">
              <span class="text-[#654321] font-bold">Timer: <span class="text-[#8B4513]">{{ timer }}s</span></span>
            </div>
          </div>
        </header>

        <!-- Canvas area -->
        <section class="flex flex-col justify-start items-center flex-grow min-h-0 overflow-hidden relative" style="grid-area: canvas;">
          <div class="w-full h-full relative">
            <CanvasBoard 
              :socket="socket" 
              @color-change="currentColor = $event" 
              :isCurrentDrawer="isCurrentDrawer"
              class="w-full h-full"
              ref="canvasBoardRef"
            />
          </div>
        </section>

        <!-- Bottom bar - Toolbar -->
        <footer style="grid-area: bottombar;">
          <Toolbar 
            :isCurrentDrawer="isCurrentDrawer"
            :socket="socket"
            @color-change="handleColorChange"
            @mode-change="handleModeChange"
            @shape-change="handleShapeChange"
            @brush-size-change="handleBrushSizeChange"
            @undo="handleUndo"
            @redo="handleRedo"
            @clear-canvas="handleClearCanvas"
            ref="toolbarRef"
          />
        </footer>
      </div>

      <!-- Right sidebar (Chat) -->
      <aside class="bg-[#f5ecc8d9] shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex flex-col p-4 gap-3 overflow-hidden border-l-2 border-[#d4c19c]" style="grid-area: rightbar;">
        <div class="text-center mb-2">
          <h2 class="text-[#8B4513] text-lg font-black">Chat & Guesses</h2>
        </div>
        <div class="flex-1 min-h-0">
          <ChatLobby 
            :socket="socket" 
            :lobbyData="{ lobbyId, playerCount: players.length, maxPlayers, messages: [] }" 
            :isCurrentDrawer="isCurrentDrawer"
          />
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import ChatLobby from '../components/ChatLobby.vue';
import { ref, onMounted, computed, onUnmounted } from 'vue';
import PlayerList from '../components/PlayerList.vue';
import CanvasBoard from '../components/CanvasBoard.vue';
import Toolbar from '../components/Toolbar.vue';
import { useRoute } from 'vue-router';
import socket from '../config/socket.js';

const playerName = ref('');
const players = ref([]);
const currentColor = ref('#000000');
const lobbyId = ref('');
const maxPlayers = ref(4);
const character = ref('');
const currentWord = ref('');
const isCurrentDrawer = ref(false);
const gameState = ref('waiting'); // 'waiting' or 'playing'
const timer = ref(120); // Timer starts at 120 seconds
let timerInterval = null; // To store the interval ID
const route = useRoute();
const toolbarRef = ref(null);
const canvasBoardRef = ref(null);

playerName.value = route.query.name || '';
character.value = route.query.character || 'unknown';

// Toolbar event handlers
const handleColorChange = (color) => {
  currentColor.value = color;
  if (canvasBoardRef.value) {
    canvasBoardRef.value.setColor(color);
  }
};

const handleModeChange = (modeData) => {
  if (canvasBoardRef.value) {
    canvasBoardRef.value.setMode(modeData.mode, modeData.shapeType);
  }
};

const handleShapeChange = (shape) => {
  if (canvasBoardRef.value) {
    canvasBoardRef.value.setShape(shape);
  }
};

const handleBrushSizeChange = (size) => {
  if (canvasBoardRef.value) {
    canvasBoardRef.value.setBrushSize(size);
  }
};

const handleUndo = () => {
  if (canvasBoardRef.value) {
    canvasBoardRef.value.undo();
    // Update toolbar undo/redo stacks
    updateToolbarStacks();
  }
};

const handleRedo = () => {
  if (canvasBoardRef.value) {
    canvasBoardRef.value.redo();
    // Update toolbar undo/redo stacks  
    updateToolbarStacks();
  }
};

const handleClearCanvas = () => {
  if (canvasBoardRef.value) {
    canvasBoardRef.value.clearCanvas();
    // Update toolbar undo/redo stacks
    updateToolbarStacks();
  }
};

const updateToolbarStacks = () => {
  if (toolbarRef.value && canvasBoardRef.value) {
    const undoStackLength = canvasBoardRef.value.getUndoStackLength();
    const redoStackLength = canvasBoardRef.value.getRedoStackLength();
    toolbarRef.value.updateUndoStack(new Array(undoStackLength));
    toolbarRef.value.updateRedoStack(new Array(redoStackLength));
  }
};

const undo = () => {
  if (!undoStack.value.length) return;
  redoStack.value.push(ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height));
  const undoImageData = undoStack.value.pop();
  ctx.putImageData(undoImageData, 0, 0);

  // Emit event to update toolbar stacks
  emit('update-toolbar-stacks', {
    undoStackLength: undoStack.value.length,
    redoStackLength: redoStack.value.length,
  });
};

const redo = () => {
  if (!redoStack.value.length) return;
  undoStack.value.push(ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height));
  const redoImageData = redoStack.value.pop();
  ctx.putImageData(redoImageData, 0, 0);

  // Emit event to update toolbar stacks
  emit('update-toolbar-stacks', {
    undoStackLength: undoStack.value.length,
    redoStackLength: redoStack.value.length,
  });
};

const clearCanvas = () => {
  saveState();
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

  // Emit event to update toolbar stacks
  emit('update-toolbar-stacks', {
    undoStackLength: undoStack.value.length,
    redoStackLength: redoStack.value.length,
  });
};

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval); // Clear any existing interval
  timer.value = 120; // Reset the timer to 120 seconds

  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value -= 1; // Decrease the timer by 1 second
    } else {
      clearInterval(timerInterval); // Stop the timer when it reaches 0
      timerInterval = null;
      console.log('Timer ended'); // Debugging

      // Emit an event to the server to indicate the timer has ended
      socket.emit('timer_ended', { lobbyId: lobbyId.value });
    }
  }, 1000); // Update every second
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

onMounted(() => {
  socket.emit('join_lobby', { name: playerName.value, character: character.value });

  socket.on('game_started', () => {
    startTimer();
  });

  socket.on('new_round', () => {
    startTimer();
  });

  socket.on('game_ended', () => {
    stopTimer();
  });

  socket.on('correct_guess', (data) => {
    // Alleen de huidige tekenaar status resetten als IK degene ben die het woord geraden heeft
    // Of als ALLE spelers het woord geraden hebben (dan is de ronde voorbij)
    if (data.playerId === socket?.id) {
      // Ik heb het woord geraden, dus ik ben geen tekenaar meer (als ik dat al was)
      isCurrentDrawer.value = false;
      currentWord.value = '';
    }
    // Update de spelers data om te laten zien wie het geraden heeft
    if (data.players) {
      players.value = data.players;
    }
  });
  socket.on('your_word', (data) => {
    currentWord.value = data.word;
    isCurrentDrawer.value = true
  });

  socket.on('game_started', (data) => {
    gameState.value = 'playing';
    startTimer(); // Start the timer
    // Clear undo and redo stacks
    if (canvasBoardRef.value) {
      canvasBoardRef.value.clearHistory();
    }
    // Update players data with drawing status
    if (data.players) {
      players.value = data.players;
      // Check if current player is the drawer
      const currentPlayer = data.players.find(p => p.id === socket?.id);
      isCurrentDrawer.value = currentPlayer ? currentPlayer.isDrawing : false;
    }
  });

  socket.on('new_round', (data) => {
    gameState.value = 'playing';
    startTimer(); // Restart the timer
    // Reset current word for everyone
    currentWord.value = '';
    // Clear undo and redo stacks
    if (canvasBoardRef.value) {
      canvasBoardRef.value.clearHistory();
    }
    // Update players data with new drawing status
    if (data.players) {
      players.value = data.players;
      // Check if current player is the new drawer
      const currentPlayer = data.players.find(p => p.id === socket?.id);
      isCurrentDrawer.value = currentPlayer ? currentPlayer.isDrawing : false;
    }
  });

  socket.on('player_ready_update', (data) => {
    const playerIndex = players.value.findIndex(p => p.id === data.playerId);
    if (playerIndex !== -1) {
      players.value[playerIndex].isReady = data.isReady;
      players.value = [...players.value];
    }
  });

  socket.on('lobby_assigned', (data) => {
    
    lobbyId.value = data.lobbyId;
    players.value = data.players;
    maxPlayers.value = data.maxPlayers;
    
    // Check if game is already in progress based on players status
    const anyPlayerDrawing = data.players.some(p => p.isDrawing);
    if (anyPlayerDrawing) {
      gameState.value = 'playing';
      // Check if current player is the drawer
      const currentPlayer = data.players.find(p => p.id === socket?.id);
      isCurrentDrawer.value = currentPlayer ? currentPlayer.isDrawing : false;
    } else {
      gameState.value = 'waiting';
      isCurrentDrawer.value = false;
    }
    
    // Het canvas wordt opnieuw opgebouwd in de CanvasBoard-component
  });

  socket.on('player_joined', (data) => {
    players.value = data.players;
  });

  socket.on('player_joined', (data) => {
    players.value = data.players;
  });

  socket.on('player_left', (data) => {
    players.value = data.players;
    
    // Update game state if server provides it
    if (data.gameState) {
      gameState.value = data.gameState;
    }
    
    // If only one player left, go back to waiting state
    if (data.players.length <= 1) {
      gameState.value = 'waiting';
      isCurrentDrawer.value = false;
      currentWord.value = '';
    }
  });

  // Handle game ended events (e.g. due to insufficient players after disconnect)
  socket.on('game_ended', (data) => {
    gameState.value = 'waiting';
    stopTimer(); // Stop the timer
    // Other game end logic...
  });
});

onUnmounted(() => {
  stopTimer();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');

.game-page {
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  background-image: url('../assets/skraw_background_1920x1080.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  font-family: 'Comic Neue', sans-serif;
}

.font-comic {
  font-family: 'Comic Neue', sans-serif;
}

/* Custom heights for specific areas */
.h-12\.5 {
  height: 50px;
}

/* Reset styles for full screen layout */
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

/* Textarea styling in rightbar - updated for new theme */
:deep(.rightbar textarea) {
  flex: 1;
  resize: none;
  font-size: 13px;
  padding: 8px;
  min-height: 0;
  max-height: 100%;
  box-sizing: border-box;
  background-color: rgba(245, 236, 200, 0.9);
  border: 2px solid #d4c19c;
  border-radius: 6px;
  color: #654321;
  font-family: 'Comic Neue', sans-serif;
}

:deep(.rightbar textarea::placeholder) {
  color: #A0522D;
}

:deep(.rightbar textarea:focus) {
  outline: none;
  border-color: #8B4513;
  box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.2);
}

.ai-box {
  background-color: rgba(245, 236, 200, 0.9);
  border: 2px solid #d4c19c;
  border-radius: 6px;
  text-align: center;
  font-size: 13px;
  padding: 8px;
  height: 40px;
  color: #654321;
  font-weight: bold;
}
</style>