<template>
  <div class="toolbar" :class="{ hidden: !isCurrentDrawer }">
    <input 
      type="color" 
      :value="currentColor" 
      class="color-picker"
      @change="$emit('colorChange', $event.target.value)"
    />
    
    <button 
      @click="$emit('modeChange', 'draw')"
      :class="[
        'tool-button',
        mode === 'draw' && !shapeType ? 'active' : ''
      ]"
    >
      Draw
    </button>
    
    <button 
      @click="$emit('modeChange', 'fill')"
      :class="[
        'tool-button',
        mode === 'fill' ? 'active' : ''
      ]"
    >
      Fill
    </button>
    
    <button 
      @click="$emit('shapeChange', 'rectangle')"
      :class="[
        'tool-button',
        shapeType === 'rectangle' ? 'active' : ''
      ]"
    >
      Rectangle
    </button>
    
    <button 
      @click="$emit('shapeChange', 'circle')"
      :class="[
        'tool-button',
        shapeType === 'circle' ? 'active' : ''
      ]"
    >
      Circle
    </button>
    
    <button 
      @click="$emit('shapeChange', 'line')"
      :class="[
        'tool-button',
        shapeType === 'line' ? 'active' : ''
      ]"
    >
      Line
    </button>
    
    <button 
      @click="$emit('shapeChange', 'triangle')"
      :class="[
        'tool-button',
        shapeType === 'triangle' ? 'active' : ''
      ]"
    >
      Triangle
    </button>
    
    <div class="brush-size-container">
      <label>Brush Size:</label>
      <input 
        type="range" 
        :value="brushSize"
        min="1" 
        max="50" 
        class="brush-slider"
        @input="$emit('brushSizeChange', $event.target.value)"
      />
    </div>
    
    <button 
      class="tool-button" 
      @click="$emit('undo')"
      :disabled="!canUndo"
    >
      Undo
    </button>
    <button 
      class="tool-button" 
      @click="$emit('redo')"
      :disabled="!canRedo"
    >
      Redo
    </button>
    <button class="tool-button clear-btn" @click="$emit('clear')">
      Clear
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isCurrentDrawer: {
    type: Boolean,
    default: false
  },
  currentColor: {
    type: String,
    default: '#000000'
  },
  mode: {
    type: String,
    default: 'draw'
  },
  shapeType: {
    type: String,
    default: null
  },
  brushSize: {
    type: Number,
    default: 5
  },
  canUndo: {
    type: Boolean,
    default: false
  },
  canRedo: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'colorChange',
  'modeChange', 
  'shapeChange',
  'brushSizeChange',
  'undo',
  'redo',
  'clear'
]);
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.toolbar.hidden {
  visibility: hidden;
  pointer-events: none;
}

.tool-button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.tool-button:hover {
  background-color: #f0f0f0;
}

.tool-button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.tool-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-btn {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}

.clear-btn:hover {
  background-color: #c82333;
}

.color-picker {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.brush-size-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brush-size-container label {
  font-size: 14px;
  font-weight: bold;
}

.brush-slider {
  width: 100px;
}
</style>
