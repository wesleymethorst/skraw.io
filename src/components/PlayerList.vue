<template>
    <aside class="player-list">
      <ul>
        <li v-for="(player, index) in players" :key="index">
          {{ player }}
        </li>
      </ul>
    </aside>
  </template>
  
  <script>
  export default {
    name: 'PlayerList',
    props: {
      players: {
        type: Array,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .player-list {
    padding: 1rem;
    border-right: 1px solid #ccc;
    width: 150px;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    margin: 0.5rem 0;
  }
  </style>
  