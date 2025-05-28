<template>
  <div class="home">
    <h1>Home Page</h1>
    <p>Welcome to the skraw.io application!</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'Skraw - Free multiplayer sketching, drawing & guessing game'
})
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style> 