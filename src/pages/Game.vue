<template>
  <div class="layout">
    <aside class="sidebar">
           <PlayerList 
        :maxPlayers="maxPlayers" 
        :players="players" 
        :yourId="socket?.id" 
        :socket="socket" 
      />
    </aside>

    <div class="main-content">
      <header class="topbar">
        <h1>Skraw.io</h1>
        <div class="top-info">
          <span v-if="currentWord">Your word: {{ currentWord }}</span>
          <span>Guess:   _</span>
          <span>Timer: 60s</span>
        </div>
      </header>

      <section class="canvas-container">
        <CanvasBoard 
        :socket="socket" 
  @color-change="currentColor = $event" 
  :isCurrentDrawer="isCurrentDrawer"
/>
      </section>

      <footer class="bottombar">
        <span>Current Color:</span>
        <div class="color-indicator" :style="{ backgroundColor: currentColor }"></div>
      </footer>
    </div>

    <aside class="rightbar">
           <ChatLobby :socket="socket" :lobbyData="{ lobbyId, playerCount: players.length, maxPlayers, messages: [] }" />
      
    </aside>
  </div>
</template>

<script setup>
import ChatLobby from '../components/ChatLobby.vue';
import { ref, onMounted, computed } from 'vue';
import PlayerList from '../components/PlayerList.vue';
import CanvasBoard from '../components/CanvasBoard.vue';
import { io } from 'socket.io-client';
import { useRoute } from 'vue-router';

const playerName = ref('');
const players = ref([]);
const currentColor = ref('#000000');
const lobbyId = ref('');
const maxPlayers = ref(4);
const socket = ref(io('http://localhost:3000'));
const currentWord = ref('');
const isCurrentDrawer = ref(false);
const route = useRoute();
playerName.value = route.query.name || '';

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
  document.title = 'Skraw - Game Room';
  socket.value.emit('join_lobby', { name: playerName.value, avatar: '' });

socket.value.on('correct_guess', (data) => {
  isCurrentDrawer.value = false
});
socket.value.on('your_word', (data) => {
  currentWord.value = data.word;
  isCurrentDrawer.value = true
});

socket.value.on('game_started', (data) => {
  isCurrentDrawer.value = false
})

socket.value.on('player_ready_update', (data) => {
    const playerIndex = players.value.findIndex(p => p.id === data.playerId);
    if (playerIndex !== -1) {
      players.value[playerIndex].isReady = data.isReady;
      players.value = [...players.value]; // Forceer reactiviteit
    }
  });

  socket.value.on('lobby_assigned', (data) => {
    lobbyId.value = data.lobbyId;
    players.value = data.players;
    maxPlayers.value = data.maxPlayers;
      if (data.drawingData) {
    redrawCanvas(data.drawingData);
  }
    console.log(data)
  });

  socket.value.on('player_joined', (data) => {
    players.value = data.players;
  });

  socket.value.on('player_left', (data) => {
    players.value = data.players;
  });
});
</script>

<style scoped>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  font-family: sans-serif;
}

.layout {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  grid-template-rows: 50px auto 40px;
  grid-template-areas:
    "sidebar topbar rightbar"
    "sidebar canvas rightbar"
    "sidebar bottombar rightbar";
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  overflow: hidden;
}

.sidebar {
  grid-area: sidebar;
  background-color: #007bff;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 8px;
  font-size: 13px;
  gap: 6px;
  overflow-y: auto;
}

.topbar {
  grid-area: topbar;
  background-color: #bbd6ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  font-size: 14px;
  height: 50px;
}

.top-info {
  display: flex;
  gap: 20px;
  font-size: 14px;
}

.canvas-container {
  grid-area: canvas;
  background-color: #eef4ff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;
}

.bottombar {
  grid-area: bottombar;
  background-color: #bbd6ff;
  display: flex;
  align-items: center;
  padding-left: 12px;
  gap: 8px;
  font-size: 13px;
  height: 40px;
}

.color-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #000;
}

.rightbar {
  grid-area: rightbar;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 6px;
  overflow: hidden;
}

.rightbar textarea {
  flex: 1;
  resize: none;
  font-size: 13px;
  padding: 6px;
  min-height: 0;
  max-height: 100%;
  box-sizing: border-box;
}

.ai-box {
  background-color: white;
  text-align: center;
  font-size: 13px;
  padding: 8px;
  height: 40px;
}
</style> 