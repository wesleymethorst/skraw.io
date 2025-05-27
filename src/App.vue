<template>
  <div class="app-container">
    <GameHeader :hiddenWord="'_______'" :timer="60" />
    <div class="content">
      <div class="sidebar">
        <PlayerList :players="players" />
        <div class="emote-menu">Emote Menu</div>
      </div>
      <div class="main-area">
        <CanvasBoard :color="brushColor" ref="canvasBoard" />
        <ToolBar
          @color-changed="updateColor"
          @clear-canvas="clearCanvas"
        />
      </div>
      <div class="right-panel">
        <div class="chat-box">Text Box</div>
        <div class="ai-box">AI guess</div>
      </div>
    </div>
  </div>
</template>

<script>
import GameHeader from './components/GameHeader.vue'
import PlayerList from './components/PlayerList.vue'
import CanvasBoard from './components/CanvasBoard.vue'
import ToolBar from './components/ToolBar.vue'

export default {
  name: 'App',
  components: {
    GameHeader,
    PlayerList,
    CanvasBoard,
    ToolBar
  },
  data() {
    return {
      players: ['Player 1', 'Player 2', 'Player 3', 'Player 4'],
      brushColor: '#000000'
    }
  },
  methods: {
    updateColor(newColor) {
      this.brushColor = newColor;
    },
    clearCanvas() {
      this.$refs.canvasBoard.clear();
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100vh;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #e6f0ff;
  font-family: Arial, sans-serif;
}

.content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  display: flex;
  flex-direction: column;
  background-color: #3399ff;
  color: white;
  width: 150px;
  padding: 1rem;
}

.emote-menu {
  margin-top: auto;
  background-color: #cce0ff;
  padding: 0.5rem;
  text-align: center;
  font-weight: bold;
  border-radius: 8px;
  color: black;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow: hidden;
}

.right-panel {
  display: flex;
  flex-direction: column;
  width: 200px;
  background-color: #f2f2f2;
  padding: 1rem;
}

.chat-box, .ai-box {
  flex: 1;
  margin-bottom: 1rem;
  background-color: white;
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 4px;
}
</style>