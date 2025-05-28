<template>
  <div class="player-list">
    <h3>Players</h3>
    <div 
      v-for="player in players" 
      :key="player.id" 
      class="player-item"
      :class="{ 'current-user': player.isCurrentUser }"
    >
      <div class="player-name">{{ player.name }}</div>
      <div class="player-score">{{ player.score }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const players = ref([
  { id: 1, name: 'Player 1', score: 120 },
  { id: 2, name: 'Player 2', score: 85 },
  { id: 3, name: 'Player 3', score: 65 },
  { id: 4, name: 'You', score: 50, isCurrentUser: true }
]);
</script>

<style scoped>
.player-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  text-align: center;
}

.player-item {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 6px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
}

.current-user {
  background-color: rgba(255, 255, 255, 0.4);
  font-weight: bold;
}

.player-score {
  font-size: 11px;
  margin-top: 2px;
}
</style>