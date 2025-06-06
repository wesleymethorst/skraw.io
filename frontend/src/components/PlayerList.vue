<template>
  <div class="bg-white/90 rounded-lg p-4 border-2 border-[#d4c19c] shadow-[0_2px_10px_rgba(0,0,0,0.2)] max-w-[280px] font-comic">
    <h3 class="text-[#8B4513] text-lg m-0 mb-4 flex items-center justify-between font-black">
      Players 
      <span class="bg-[#f5ecc8d9] px-2 py-1 rounded-lg text-sm border border-[#d4c19c] shadow-sm">{{ players.length }}/{{ maxPlayers }}</span>
    </h3>
    
    <div class="max-h-[320px] overflow-y-auto pr-2 space-y-2">
      <div 
        v-for="player in players" 
        :key="player.id" 
        class="flex items-center gap-3 p-3 bg-[#f5ecc8bf] border-2 border-[#d4c19c] rounded-lg transition-all duration-200 relative"
        :class="{ 
          'bg-green-50 border-green-400': player.isReady && gameState === 'waiting',
          'bg-green-100 border-green-500': player.hasGuessed && gameState === 'playing',
          'bg-blue-50 border-blue-400': player.isDrawing && gameState === 'playing'
        }"
      >
        <!-- Character Avatar -->
        <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden">
          <img 
            :src="getCharacterImagePath(player.character)"
            :alt="`Character for ${player.name}`"
            class="w-8 h-8 object-contain"
          />
        </div>
        
        <!-- Player Info -->
        <div class="flex-grow min-w-0">
          <div class="font-bold text-[#654321] text-sm whitespace-nowrap overflow-hidden text-ellipsis">
            {{ player.name }}
            <span v-if="player.id === yourId" class="text-[#8B4513] text-xs">(You)</span>
          </div>
          <div class="text-xs">
            <!-- During game: show drawing status -->
            <span v-if="gameState === 'playing' && player.isDrawing" class="text-blue-700 font-bold">Drawing</span>
            <span v-else-if="gameState === 'playing' && player.hasGuessed" class="text-green-700 font-bold">Guessed it!</span>
            <span v-else-if="gameState === 'playing'" class="text-purple-700 font-bold">Guessing</span>
            <!-- Waiting for game: show ready status -->
            <span v-else-if="player.isReady" class="text-green-700 font-bold">Ready</span>
            <span v-else class="text-amber-600 font-bold">Waiting</span>
          </div>
        </div>

        <!-- Ready Button/Status -->
        <div class="ml-auto flex items-center">
          <!-- During game: show game status indicator -->
          <div v-if="gameState === 'playing' && player.isDrawing" class="w-3 h-3 bg-blue-500 rounded-full border-2 border-blue-600 shadow-sm animate-pulse"></div>
          <div v-else-if="gameState === 'playing' && player.hasGuessed" class="w-3 h-3 bg-green-500 rounded-full border-2 border-green-600 shadow-sm"></div>
          <div v-else-if="gameState === 'playing'" class="w-3 h-3 bg-purple-500 rounded-full border-2 border-purple-600 shadow-sm"></div>
          <!-- Waiting for game: show ready controls -->
          <button 
            v-else-if="!player.isReady && player.id === yourId" 
            @click="toggleReady" 
            class="px-3 py-1.5 bg-gradient-to-br from-green-600 to-green-700 text-white border-none rounded-md cursor-pointer text-xs font-bold transition-colors duration-200 hover:from-green-700 hover:to-green-800"
          >
            Ready Up!
          </button>
          <div v-else-if="player.isReady" class="w-3 h-3 bg-green-500 rounded-full border-2 border-green-600 shadow-sm"></div>
          <div v-else class="w-3 h-3 bg-amber-400 rounded-full border-2 border-amber-500 shadow-sm animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  players: {
    type: Array,
    default: () => []
  },
  maxPlayers: {
    type: Number,
    default: 4
  },
  yourId: {
    type: String,
    default: ''
  },
  socket: {
    type: Object,
    required: true
  },
  gameState: {
    type: String,
    default: 'waiting' // 'waiting' or 'playing'
  }
});

const toggleReady = () => {
  props.socket.emit('player_ready');
};

const getInitial = (name) => {
  return name.charAt(0).toUpperCase();
};

const getCharacterImagePath = (character) => {
  
  try {
    const characterToUse = character || 'unknown';
    const path = new URL(`../assets/characters/character_${characterToUse}.png`, import.meta.url).href;
    return path;
  } catch (error) {
    console.error('❌ Failed to generate character image path:', character, error);
    return new URL(`../assets/characters/character_unknown.png`, import.meta.url).href;
  }
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');

.font-comic {
  font-family: 'Comic Neue', sans-serif;
}

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(245, 236, 200, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #d4c19c;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #8B4513;
}
</style>