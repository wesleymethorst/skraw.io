<template>
  <div class="flex flex-col h-full bg-white/90 border-2 border-[#d4c19c] rounded-lg p-3 shadow-[0_2px_10px_rgba(0,0,0,0.2)] font-comic">
    <h2 class="text-[#8B4513] text-sm font-black mb-3 text-center">
      Lobby: {{ lobbyId }} ({{ playerCount }}/{{ maxPlayers }} players)
    </h2>
    
    <div class="flex-1 overflow-y-auto my-2 p-3 border-2 border-[#d4c19c] rounded-md bg-[#f5ecc8bf] shadow-inner">
      <div v-for="message in messages" :key="message.id" class="mb-2 p-2 border-b border-[#d4c19c]/50 last:border-b-0" :class="{'text-[#A0522D] italic bg-[#f5ecc8d9]/50 rounded px-2': message.playerId === 'system'}">
        <strong v-if="message.playerId !== 'system'" class="text-[#8B4513]">{{ message.playerName || 'Player '+message.playerId.slice(0, 4) }}:</strong>
        <span class="text-[#654321] ml-1">{{ message.text }}</span>
        <small class="text-[#A0522D] ml-2 text-xs">{{ formatTime(message.timestamp) }}</small>
      </div>
      <div v-if="messages.length === 0" class="text-center text-[#A0522D] italic text-sm mt-4">
        Chat will appear here...
      </div>
    </div>
    
    <div class="flex flex-col gap-2">
      <div class="relative">
        <input 
          v-model="newMessage" 
          @keyup.enter="sendMessage" 
          placeholder="Type your guess or message..."
          maxlength="100"
          class="w-full p-2.5 border-2 border-[#d4c19c] rounded-md bg-white/90 text-[#654321] placeholder-[#A0522D] font-comic text-sm focus:outline-none focus:border-[#8B4513] focus:shadow-[0_0_0_2px_rgba(139,69,19,0.2)] transition-all duration-200"
        >
        <div class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#A0522D]">{{ newMessage.length }}/100</div>
      </div>
      <button 
        @click="sendMessage" 
        class="px-4 py-2.5 bg-gradient-to-br from-green-600 to-green-700 text-white border-none rounded-md cursor-pointer font-bold text-sm transition-all duration-200 hover:from-green-700 hover:to-green-800 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!newMessage.trim()"
      >
        Send Message
      </button>
    </div>
    
    <div class="bg-[#f5ecc8d9] border-2 border-[#d4c19c] rounded-md text-center text-sm p-2 mt-2 text-[#8B4513] font-bold shadow-sm">
      AI Helper
    </div>
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
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');

.font-comic {
  font-family: 'Comic Neue', sans-serif;
}
</style>