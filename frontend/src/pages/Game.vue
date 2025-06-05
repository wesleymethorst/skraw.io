<template>
  <div class="game-page">
    <div class="grid grid-cols-[280px_1fr_320px] grid-rows-[60px_auto_50px] h-screen w-screen box-border overflow-hidden font-comic" style="grid-template-areas: 'sidebar topbar rightbar' 'sidebar canvas rightbar' 'sidebar bottombar rightbar';">
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
              <span class="text-[#654321] font-bold">Guess: <span class="text-[#A0522D]">_ _ _</span></span>
            </div>
            <div class="bg-[#f5ecc8d9] px-3 py-1.5 rounded-md border border-[#d4c19c] shadow-sm">
              <span class="text-[#654321] font-bold">Timer: <span class="text-[#8B4513]">60s</span></span>
            </div>
          </div>
        </header>

        <!-- Canvas area -->
        <section class="bg-white shadow-inner flex flex-col justify-start items-center flex-grow min-h-0 overflow-hidden border-4 border-[#d4c19c] m-2 rounded-lg relative" style="grid-area: canvas;">
          <!-- Canvas overlay for non-drawers - moved to top -->
          <div v-if="!isCurrentDrawer" class="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <div class="bg-[#f5ecc8bf] px-6 py-3 rounded-lg shadow-lg border-2 border-[#d4c19c]">
              <p class="text-[#8B4513] font-bold text-lg">Guess what's being drawn!</p>
            </div>
          </div>
          
          <div class="w-full h-full relative">
            <CanvasBoard 
              :socket="socket" 
              @color-change="currentColor = $event" 
              :isCurrentDrawer="isCurrentDrawer"
              class="w-full h-full"
            />
          </div>
        </section>

        <!-- Bottom bar -->
        <footer class="bg-[#f5ecc8bf] shadow-[0_-2px_10px_rgba(0,0,0,0.2)] flex items-center justify-between px-6 gap-4 text-sm border-t-2 border-[#d4c19c]" style="grid-area: bottombar;">
          <div class="flex items-center gap-3">
            <span class="text-[#654321] font-bold">Current Color:</span>
            <div class="w-6 h-6 rounded-full border-2 border-[#8B4513] shadow-sm" :style="{ backgroundColor: currentColor }"></div>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="bg-[#f5ecc8d9] px-3 py-1.5 rounded-md border border-[#d4c19c] shadow-sm">
              <span class="text-[#654321] font-bold">Round: <span class="text-[#8B4513]">1/3</span></span>
            </div>
            <div class="bg-[#f5ecc8d9] px-3 py-1.5 rounded-md border border-[#d4c19c] shadow-sm">
              <span class="text-[#654321] font-bold">Score: <span class="text-[#A0522D]">0</span></span>
            </div>
          </div>
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
          />
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import ChatLobby from '../components/ChatLobby.vue';
import { ref, onMounted, computed } from 'vue';
import PlayerList from '../components/PlayerList.vue';
import CanvasBoard from '../components/CanvasBoard.vue';
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
const route = useRoute();
playerName.value = route.query.name || '';
character.value = route.query.character || 'blue_smug_wide';

function redrawCanvas(dataArray) {
  if (!ctx.value || !canvasRef.value) return;

  // Maak het canvas eerst schoon
  ctx.value.fillStyle = '#FFFFFF';
  ctx.value.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);

  // Herteken alle lijnen
  dataArray.forEach(data => {
    if (data.type === 'start') {
      // Begin een nieuw pad
      ctx.value.beginPath();
      ctx.value.moveTo(data.x, data.y);
      ctx.value.lineTo(data.x, data.y);
      ctx.value.strokeStyle = data.color;
      ctx.value.lineWidth = data.lineWidth;
      ctx.value.lineCap = 'round';
      ctx.value.stroke();
    } 
    else if (data.type === 'draw') {
      // Voeg een lijn toe
      ctx.value.lineTo(data.x, data.y);
      ctx.value.strokeStyle = data.color;
      ctx.value.lineWidth = data.lineWidth;
      ctx.value.stroke();
    }
  });
}

onMounted(() => {
  socket.emit('join_lobby', { name: playerName.value, character: character.value });

socket.on('correct_guess', (data) => {
  isCurrentDrawer.value = false;
});
socket.on('your_word', (data) => {
  currentWord.value = data.word;
  isCurrentDrawer.value = true
});

socket.on('game_started', (data) => {
  isCurrentDrawer.value = false
})

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
    
    if (data.drawingData) {
      redrawCanvas(data.drawingData);
    }
  });

  socket.on('player_joined', (data) => {
    players.value = data.players;
  });

  socket.on('player_left', (data) => {
    players.value = data.players;
  });
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