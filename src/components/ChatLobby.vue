<template>
  <div class="chat-lobby">
    <h2>Lobby: {{ lobbyId }} ({{ playerCount }}/{{ maxPlayers }} players)</h2>
    
    <div class="chat-messages">
      <div v-for="message in messages" :key="message.id" class="message" :class="{'system-message': message.playerId === 'system'}">
        <strong v-if="message.playerId !== 'system'">{{ message.playerName || 'Player '+message.playerId.slice(0, 4) }}:</strong>
        {{ message.text }}
        <small>{{ formatTime(message.timestamp) }}</small>
      </div>
    </div>
    
    <div class="chat-input">
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage" 
        placeholder="Type your message..."
        maxlength="100"
      >
      <button @click="sendMessage">Send</button>
      <div class="char-counter">{{ newMessage.length }}/100</div>
    </div>
    <div class="ai-box">AI Guess</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  socket: Object,
  lobbyData: Object
});

const lobbyId = ref(props.lobbyData?.lobbyId || '');
const playerCount = ref(props.lobbyData?.playerCount || 0);
const maxPlayers = ref(props.lobbyData?.maxPlayers || 4);
const messages = ref(props.lobbyData?.messages || []);
const newMessage = ref('');

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString();
};

const sendMessage = () => {
  if (newMessage.value.trim() && newMessage.value.length <= 100) {
    props.socket.emit('send_message', {
      text: newMessage.value.trim(),
      lobbyId: lobbyId.value
    });
    newMessage.value = '';
  }
};

onMounted(() => {
  if (!props.socket) return;

  props.socket.on('lobby_assigned', (data) => {
    lobbyId.value = data.lobbyId;
    playerCount.value = data.playerCount;
    maxPlayers.value = data.maxPlayers;
    messages.value = data.messages || [];
  });

  props.socket.on('player_joined', (data) => {
    playerCount.value = data.playerCount;
    messages.value.push({
      id: Date.now(),
      playerId: 'system',
      text: `Player ${data.player.name} joined (${data.playerCount}/${maxPlayers.value})`,
      timestamp: new Date().toISOString()
    });
  });

  props.socket.on('player_left', (data) => {
    playerCount.value = data.playerCount;
    messages.value.push({
      id: Date.now(),
      playerId: 'system',
      text: `Player left (${data.playerCount}/${maxPlayers.value})`,
      timestamp: new Date().toISOString()
    });
  });

  props.socket.on('new_message', (message) => {
    console.log(message)
    messages.value.push(message);
  });
});

onBeforeUnmount(() => {
  if (!props.socket) return;
  
  props.socket.off('lobby_assigned');
  props.socket.off('player_joined');
  props.socket.off('player_left');
  props.socket.off('new_message');
});
</script>

<style scoped>
/* Behoud dezelfde styles als voorheen */
.chat-lobby {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  background: #f9f9f9;
}

.message {
  margin-bottom: 10px;
  padding: 5px;
  border-bottom: 1px solid #f0f0f0;
}

.message.system-message {
  color: #666;
  font-style: italic;
}

.message small {
  color: #999;
  margin-left: 8px;
  font-size: 0.8em;
}

.chat-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.chat-input input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.chat-input button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.char-counter {
  font-size: 0.8em;
  color: #666;
  text-align: right;
}
</style>