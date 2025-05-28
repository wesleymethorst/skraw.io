<template>
  <h2>Lobby: {{ lobbyId }} ({{ players }}/{{ maxPlayers }} players)</h2>
  <div class="chat-lobby">

    
    <div class="chat-messages">
      <div v-for="message in messages" :key="message.id" class="message">
        <strong>Player {{ message.playerId.slice(0, 4) }}:</strong>
        {{ message.text }}
        <small>{{ formatTime(message.timestamp) }}</small>
      </div>
    </div>
    
    <div class="chat-input">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message...">
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');
const lobbyId = ref('');
const players = ref(0);
const maxPlayers = ref(4);
const messages = ref([]);
const newMessage = ref('');

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString();
};

const sendMessage = () => {
  if (newMessage.value.trim()) {
    socket.emit('send_message', newMessage.value.trim());
    newMessage.value = '';
  }
};

onMounted(() => {
  socket.on('lobby_assigned', (data) => {
    lobbyId.value = data.lobbyId;
    players.value = data.players;
    maxPlayers.value = data.maxPlayers;
    messages.value = data.messages;
  });

  socket.on('player_joined', (data) => {
    players.value = data.players;
    messages.value.push({
      id: Date.now(),
      playerId: 'system',
      text: `New player joined (${data.players}/${maxPlayers.value})`,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('player_left', (data) => {
    players.value = data.players;
    messages.value.push({
      id: Date.now(),
      playerId: 'system',
      text: `Player left (${data.players}/${maxPlayers.value})`,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('new_message', (message) => {
    messages.value.push(message);
  });
});

onBeforeUnmount(() => {
  socket.disconnect();
});
</script>

<style scoped>
.chat-lobby {
  max-width: 600px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.chat-messages {
  height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  display: flex;
  flex-direction: column-reverse;
}

.message {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  padding: 5px;
  border-bottom: 1px solid #f0f0f0;
}

.message small {
  color: #666;
  margin-left: 10px;
}

.chat-input {
  display: flex;
  gap: 10px;
}

.chat-input input {
  flex-grow: 1;
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
</style>