<template>
  <div class="canvas-wrapper">
    <canvas 
      ref="canvasRef"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart="startDrawing"
      @touchmove="draw"
      @touchend="stopDrawing"
      class="drawing-canvas"
    ></canvas>
    
    <div class="color-palette">
      <button 
        v-for="(color, index) in colors" 
        :key="index"
        class="color-button"
        :style="{ backgroundColor: color }"
        :class="{ active: color === currentColor }"
        @click="selectColor(color)"
      ></button>
      <button class="clear-button" @click="clearCanvas">Clear</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const emit = defineEmits(['color-change']);
const canvasRef = ref(null);
const ctx = ref(null);
const isDrawing = ref(false);
const lastX = ref(0);
const lastY = ref(0);
const currentColor = ref('#000000');
const lineWidth = ref(5);

const colors = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#A52A2A', // Brown
  '#808080', // Gray
];

onMounted(() => {
  const canvas = canvasRef.value;
  ctx.value = canvas.getContext('2d');
  
  // Set canvas size to fill the container while maintaining aspect ratio
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Fill with white background
  ctx.value.fillStyle = '#FFFFFF';
  ctx.value.fillRect(0, 0, canvas.width, canvas.height);
});

function resizeCanvas() {
  const canvas = canvasRef.value;
  const container = canvas.parentElement;
  
  // Get the dimensions of the container
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  
  // Determine the size to fit within the container while maintaining aspect ratio
  const size = Math.min(containerWidth - 40, containerHeight - 40);
  
  canvas.width = size;
  canvas.height = size;
  
  // Refill with white after resize
  if (ctx.value) {
    ctx.value.fillStyle = '#FFFFFF';
    ctx.value.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function startDrawing(e) {
  isDrawing.value = true;
  const { offsetX, offsetY } = getCoordinates(e);
  lastX.value = offsetX;
  lastY.value = offsetY;
}

function draw(e) {
  if (!isDrawing.value) return;
  
  const { offsetX, offsetY } = getCoordinates(e);
  
  ctx.value.beginPath();
  ctx.value.moveTo(lastX.value, lastY.value);
  ctx.value.lineTo(offsetX, offsetY);
  ctx.value.strokeStyle = currentColor.value;
  ctx.value.lineWidth = lineWidth.value;
  ctx.value.lineCap = 'round';
  ctx.value.stroke();
  
  lastX.value = offsetX;
  lastY.value = offsetY;
}

function stopDrawing() {
  isDrawing.value = false;
}

function getCoordinates(e) {
  // Handle both mouse and touch events
  if (e.type.includes('touch')) {
    const rect = e.target.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    return {
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top
    };
  } else {
    return {
      offsetX: e.offsetX,
      offsetY: e.offsetY
    };
  }
}

function selectColor(color) {
  currentColor.value = color;
  emit('color-change', color);
}

function clearCanvas() {
  ctx.value.fillStyle = '#FFFFFF';
  ctx.value.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
}
</script>

<style scoped>
.canvas-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  gap: 10px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.drawing-canvas {
  border: 1px solid #ccc;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  touch-action: none;
}

.color-palette {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
}

.color-button {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: transform 0.1s;
}

.color-button.active {
  transform: scale(1.2);
  border: 2px solid #333;
}

.color-button:hover {
  transform: scale(1.1);
}

.clear-button {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  cursor: pointer;
  margin-left: 6px;
}

.clear-button:hover {
  background-color: #e0e0e0;
}
</style>