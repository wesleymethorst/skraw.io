<script setup>
// App component - root component for the application
</script>

<template>
  <div class="app">
    <router-view />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
}

.app {
  width: 100vw;
  min-height: 100vh;
  background-image: url('./assets/skraw_background_1920x1080.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}
</style>
