<template>
  <div class="player-list-container">
    <h3 class="list-title">
      Players <span class="player-count">{{ players.length }}/{{ maxPlayers }}</span>
    </h3>
    <div class="player-scroll-container">
      <div 
        v-for="player in players" 
        :key="player.id" 
        class="player-item"
        :class="{ 'is-ready': player.isReady, 'is-you': player.id === yourId }"
      >
        <div class="player-avatar">
          <span class="avatar-initial">{{ getInitial(player.name) }}</span>
        </div>
        <span class="player-name">{{ player.name }}</span>
        <span v-if="player.isReady" class="ready-indicator">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <button 
          v-if="!player.isReady && player.id === yourId" 
          @click="toggleReady" 
          class="ready-button"
        >
          Ready Up
        </button>
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
  }
});

const toggleReady = () => {
  props.socket.emit('player_ready');
};

const getInitial = (name) => {
  return name.charAt(0).toUpperCase();
};
</script>

<style scoped>
.player-list-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 280px;
}

.list-title {
  color: #fff;
  font-size: 1.1rem;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
}

.player-count {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
}

.player-scroll-container {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

/* Scrollbar styling */
.player-scroll-container::-webkit-scrollbar {
  width: 4px;
}

.player-scroll-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.player-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.player-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.player-item:last-child {
  margin-bottom: 0;
}

.player-item:hover {
  background-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.player-item.is-ready {
  background-color: rgba(66, 185, 131, 0.15);
}

.player-item.is-you {
  border-left: 5px solid #42b983;
}

.player-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #42b983, #33a06f);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 600;
  color: white;
}

.avatar-initial {
  font-size: 0.9rem;
}

.player-name {
  color: #fff;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
}

.ready-indicator {
  color: #42b983;
  margin-left: auto;
  display: flex;
  align-items: center;
}

.ready-button {
  margin-left: auto;
  padding: 6px 12px;
  background: linear-gradient(135deg, #42b983, #33a06f);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ready-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.ready-button:active {
  transform: translateY(0);
}
</style>