<template>
  <div class="game">
    <h1>Game Page</h1>
    <div class="game-content">
      <p>This is the main game area where the game components will be displayed.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'Skraw - Game Room'
})
</script>

<style scoped>
.game {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
}

.game-content {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}
</style> 