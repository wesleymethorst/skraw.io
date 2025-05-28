<template>
  <div class="layout">
    <aside class="sidebar">
      <PlayerList />
    </aside>

    <div class="main-content">
      <header class="topbar">
        <h1>Skraw.io</h1>
        <div class="top-info">
          <span>Guess:   _</span>
          <span>Timer: 60s</span>
        </div>
      </header>

      <section class="canvas-container">
        <CanvasBoard @color-change="currentColor = $event" />
      </section>

      <footer class="bottombar">
        <span>Current Color:</span>
        <div class="color-indicator" :style="{ backgroundColor: currentColor }"></div>
      </footer>
    </div>

    <aside class="rightbar">
      <ChatLobby></ChatLobby>
      <div class="ai-box">AI Guess</div>
    </aside>
  </div>
</template>

<script setup>
import ChatLobby from '../components/ChatLobby.vue';
import { ref, onMounted } from 'vue';
import PlayerList from '../components/PlayerList.vue';
import CanvasBoard from '../components/CanvasBoard.vue';

const currentColor = ref('#000000');

onMounted(() => {
  document.title = 'Skraw - Game Room';
});
</script>

<style scoped>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  font-family: sans-serif;
}

.layout {
  display: grid;
  grid-template-columns: 100px 1fr 300px;
  grid-template-rows: 50px auto 40px;
  grid-template-areas:
    "sidebar topbar rightbar"
    "sidebar canvas rightbar"
    "sidebar bottombar rightbar";
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  overflow: hidden;
}

.sidebar {
  grid-area: sidebar;
  background-color: #007bff;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 8px;
  font-size: 13px;
  gap: 6px;
  overflow-y: auto;
}

.topbar {
  grid-area: topbar;
  background-color: #bbd6ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  font-size: 14px;
  height: 50px;
}

.top-info {
  display: flex;
  gap: 20px;
  font-size: 14px;
}

.canvas-container {
  grid-area: canvas;
  background-color: #eef4ff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  min-height: 0;
  overflow: hidden;
}

.bottombar {
  grid-area: bottombar;
  background-color: #bbd6ff;
  display: flex;
  align-items: center;
  padding-left: 12px;
  gap: 8px;
  font-size: 13px;
  height: 40px;
}

.color-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #000;
}

.rightbar {
  grid-area: rightbar;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 6px;
  overflow: hidden;
}

.rightbar textarea {
  flex: 1;
  resize: none;
  font-size: 13px;
  padding: 6px;
  min-height: 0;
  max-height: 100%;
  box-sizing: border-box;
}

.ai-box {
  background-color: white;
  text-align: center;
  font-size: 13px;
  padding: 8px;
  height: 40px;
}
</style> 