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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
