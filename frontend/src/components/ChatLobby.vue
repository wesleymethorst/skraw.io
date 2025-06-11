<template>
  <div class="flex flex-col h-full bg-white/90 border-2 border-[#d4c19c] rounded-lg p-3 shadow-[0_2px_10px_rgba(0,0,0,0.2)] font-comic">
    <h2 class="text-[#8B4513] text-sm font-black mb-3 text-center">
      Lobby: {{ lobbyId }} ({{ playerCount }}/{{ maxPlayers }} players)
    </h2>
    
    <div 
      ref="chatContainer"
      class="flex-1 overflow-y-auto my-2 p-3 border-2 border-[#d4c19c] rounded-md bg-[#f5ecc8bf] shadow-inner"
    >
      <div v-for="message in messages" :key="message.id" class="mb-2 p-2 border-b border-[#d4c19c]/50 last:border-b-0" 
           :class="{
             'text-[#A0522D] italic bg-[#f5ecc8d9]/50 rounded px-2': message.playerId === 'system',
             'bg-blue-50 border-l-4 border-blue-400 pl-3': message.type === 'ai_feedback'
           }">
        <strong v-if="message.playerId !== 'system'" class="text-[#8B4513]">{{ message.playerName || 'Player '+message.playerId.slice(0, 4) }}:</strong>
        
        <!-- AI Feedback bericht -->
        <div v-if="message.type === 'ai_feedback'" class="text-blue-800">
          <div class="font-semibold text-blue-700">
            Skraw.ai: {{ message.feedback }}
          </div>
        </div>
        
        <!-- Normale berichten -->
        <span v-else class="text-[#654321] ml-1">{{ message.text }}</span>
        
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
          :disabled="isCurrentDrawer"
          class="w-full p-2.5 border-2 border-[#d4c19c] rounded-md bg-white/90 text-[#654321] placeholder-[#A0522D] font-comic text-sm focus:outline-none focus:border-[#8B4513] focus:shadow-[0_0_0_2px_rgba(139,69,19,0.2)] transition-all duration-200"
        >
        <div class="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#A0522D]">{{ newMessage.length }}/100</div>
      </div>
      <button 
        @click="sendMessage" 
        class="px-4 py-2.5 bg-gradient-to-br from-green-600 to-green-700 text-white border-none rounded-md cursor-pointer font-bold text-sm transition-all duration-200 hover:from-green-700 hover:to-green-800 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isCurrentDrawer || !newMessage.trim()"
      >
        Send Message
      </button>
    </div>
    
    <button 
      @click="toggleAiHelper"
      class="border-2 rounded-md text-center text-sm p-2 mt-2 font-bold shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
      :class="aiHelperEnabled ? 
        'bg-green-100 border-green-400 text-green-800 hover:bg-green-200' : 
        'bg-red-100 border-red-400 text-red-800 hover:bg-red-200'"
    >
      AI Helper: {{ aiHelperEnabled ? 'AAN' : 'UIT' }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';

const props = defineProps({
  socket: Object,
  lobbyData: Object,
  isCurrentDrawer: Boolean // Nieuwe prop toegevoegd
});

const lobbyId = ref(props.lobbyData?.lobbyId || '');
const playerCount = ref(props.lobbyData?.playerCount || 0);
const maxPlayers = ref(props.lobbyData?.maxPlayers || 4);
const messages = ref(props.lobbyData?.messages || []);
const newMessage = ref('');
const chatContainer = ref(null);

const aiHelperEnabled = ref(true);

// Functie om naar beneden te scrollen
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

// Watch voor nieuwe berichten om automatisch te scrollen
watch(messages, () => {
  scrollToBottom();
}, { deep: true });

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString();
};

const sendMessage = () => {
  if (newMessage.value.trim() && newMessage.value.length <= 100) {
    props.socket.emit('send_message', {
      text: newMessage.value.trim(),
      lobbyId: lobbyId.value,
      aiHelperEnabled: aiHelperEnabled.value
    });
    newMessage.value = '';
    // Scroll naar beneden na het versturen van een bericht
    scrollToBottom();
  }
};

const toggleAiHelper = () => {
  aiHelperEnabled.value = !aiHelperEnabled.value;
  
  props.socket.emit('toggle_ai_helper', {
    enabled: aiHelperEnabled.value
  });
  
  messages.value.push({
    id: Date.now(),
    playerId: 'system',
    text: `AI Helper ${aiHelperEnabled.value ? 'ingeschakeld' : 'uitgeschakeld'}`,
    timestamp: new Date().toISOString()
  });
};

onMounted(() => {
  if (!props.socket) return;

  props.socket.on('lobby_assigned', (data) => {
    lobbyId.value = data.lobbyId;
    playerCount.value = data.playerCount;
    maxPlayers.value = data.maxPlayers;
    messages.value = data.messages || [];
    // Scroll naar beneden na het laden van berichten
    scrollToBottom();
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
    messages.value.push(message);
  });

  props.socket.on('ai_feedback', (feedbackData) => {
    console.log('🤖 AI Feedback ontvangen:', feedbackData);
    
    messages.value.push({
      id: Date.now(),
      type: 'ai_feedback',
      playerId: feedbackData.playerId,
      playerName: feedbackData.playerName,
      guess: feedbackData.guess,
      feedback: feedbackData.feedback,
      timestamp: feedbackData.timestamp
    });
  });
});

onBeforeUnmount(() => {
  if (!props.socket) return;
  
  props.socket.off('lobby_assigned');
  props.socket.off('player_joined');
  props.socket.off('player_left');
  props.socket.off('new_message');
  props.socket.off('ai_feedback');
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');

.font-comic {
  font-family: 'Comic Neue', sans-serif;
}
</style>