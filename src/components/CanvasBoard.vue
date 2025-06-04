<template>
  <div class="canvas-wrapper">
    <canvas 
      ref="canvasRef"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
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
import { ref, onMounted } from 'vue';

const props = defineProps({
  isCurrentDrawer: Boolean,
  socket: Object // Voeg deze prop toe
});

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
  
  // Fill with white background
  ctx.value.fillStyle = '#FFFFFF';
  ctx.value.fillRect(0, 0, canvas.width, canvas.height);
   if (props.socket) {
    props.socket.on('draw', (data) => {
      if (data.playerId !== props.socket.id) { // Pas dit ook aan
        const ctx = canvasRef.value?.getContext('2d');
        if (!ctx) return;

        if (data.type === 'start') {
          ctx.beginPath();
          ctx.moveTo(data.x, data.y);
          ctx.lineTo(data.x, data.y);
          ctx.strokeStyle = data.color;
          ctx.lineWidth = data.lineWidth;
          ctx.lineCap = 'round';
          ctx.stroke();
        } 
        else if (data.type === 'draw') {
          ctx.lineTo(data.x, data.y);
          ctx.strokeStyle = data.color;
          ctx.lineWidth = data.lineWidth;
          ctx.stroke();
        }
      }
    });
  }
});

function getCanvasCoordinates(e) {
  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();
  
  // Calculate scale factors
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  // Get client coordinates
  let clientX, clientY;
  if (e.type.includes('touch')) {
    const touch = e.touches[0] || e.changedTouches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  
  // Return scaled coordinates
  return {
    offsetX: (clientX - rect.left) * scaleX,
    offsetY: (clientY - rect.top) * scaleY
  };
}

function startDrawing(e) {
  if (!props.isCurrentDrawer) return;
  
  isDrawing.value = true;
  const { offsetX, offsetY } = getCanvasCoordinates(e);
  lastX.value = offsetX;
  lastY.value = offsetY;

  // Start new path
  ctx.value.beginPath();
  ctx.value.moveTo(offsetX, offsetY);
  ctx.value.lineTo(offsetX, offsetY);
  ctx.value.strokeStyle = currentColor.value;
  ctx.value.lineWidth = lineWidth.value;
  ctx.value.lineCap = 'round';
  ctx.value.stroke();

  // Stuur startpunt naar server
  if (props.socket) {
    props.socket.emit('draw', {
      type: 'start',
      x: offsetX,
      y: offsetY,
      color: currentColor.value,
      lineWidth: lineWidth.value
    });
  }
}

function draw(e) {
  if (!isDrawing.value || !props.isCurrentDrawer) return;
  
  const { offsetX, offsetY } = getCanvasCoordinates(e);
  
  ctx.value.lineTo(offsetX, offsetY);
  ctx.value.strokeStyle = currentColor.value;
  ctx.value.lineWidth = lineWidth.value;
  ctx.value.stroke();
  
  // Stuur lijn naar server
  if (props.socket) {
    props.socket.emit('draw', {
      type: 'draw',
      x: offsetX,
      y: offsetY,
      color: currentColor.value,
      lineWidth: lineWidth.value
    });
  }
  
  lastX.value = offsetX;
  lastY.value = offsetY;
}

function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent('mousedown', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  startDrawing(mouseEvent);
}

function handleTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  draw(mouseEvent);
}

function stopDrawing() {
  isDrawing.value = false;
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
  width: 100%;
  height: 100%;
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