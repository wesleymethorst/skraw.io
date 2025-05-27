<template>
    <header class="game-header">
      <h2>Skraw.io</h2>
      <div class="info">
        <span>Guess the word: {{ hiddenWord }}</span>
        <span>Timer: {{ timer }}s</span>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'GameHeader',
    props: {
      hiddenWord: {
        type: String,
        required: true
      },
      timer: {
        type: Number,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .game-header {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #ccc;
  }
  .info {
    display: flex;
    gap: 2rem;
  }
  </style>
  