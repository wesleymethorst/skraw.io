<template>
    <div class="toolbar">
      <label>
        🎨
        <input type="color" v-model="selectedColor" />
      </label>
      <button @click="setEraser">🧽</button>
      <button @click="$emit('clear-canvas')">🗑️</button>
      <div class="current-color" :style="{ backgroundColor: selectedColor }"></div>
    </div>
  </template>

  <script>
  export default {
    name: 'ToolBar',
    emits: ['color-changed', 'clear-canvas'],
    data() {
      return {
        selectedColor: '#000000'
      };
    },
    watch: {
      selectedColor(newColor) {
        this.$emit('color-changed', newColor);
      }
    },
    methods: {
      setEraser() {
        this.selectedColor = '#ffffff';
      }
    }
  }
  </script>

  <style scoped>
  .toolbar {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    background-color: #cce0ff;
    padding: 0.5rem 1rem;
    margin-top: 1rem;
    border-radius: 8px;
  }

  input[type="color"] {
    border: none;
    background: none;
    cursor: pointer;
  }

  button {
    border: none;
    background: white;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1.2rem;
  }

  .current-color {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #000;
  }
  </style>