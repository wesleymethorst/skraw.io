<template>
  <div class="flex flex-col w-full h-full">
    <!-- Canvas neemt de volledige beschikbare ruimte -->
    <div class="flex-1 flex items-center justify-center p-4">
      <canvas 
        ref="canvasRef"
        width="800"
        height="600"
        @mousedown="handleMouseDown"
        class="border border-gray-300 bg-white shadow-md touch-none max-w-full max-h-full"
      ></canvas>
    </div>

    <!-- Toolbar onderaan - gecombineerd met kleur palette -->
    <div class="flex flex-col gap-2 p-4 bg-gray-100 border-t-2 border-gray-200 shadow-lg" :class="{ 'invisible pointer-events-none': !props.isCurrentDrawer }">
      
      <!-- Eerste rij: Tools en instellingen -->
      <div class="flex items-center justify-center gap-2 flex-wrap">
        <input 
          type="color" 
          v-model="currentColor" 
          class="w-12 h-8 border-2 border-gray-300 rounded-md cursor-pointer p-0 transition-all duration-100 hover:scale-105 hover:border-gray-600"
          @change="updateCanvasColor"
        />
        
        <button 
          @click="setMode('draw')"
          :class="[
            'px-3 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed',
            mode === 'draw' && !shapeType ? 'bg-blue-600 text-white border-blue-600' : ''
          ]"
        >
          Draw
        </button>
        
        <button 
          @click="setMode('fill')"
          :class="[
            'px-3 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed',
            mode === 'fill' ? 'bg-blue-600 text-white border-blue-600' : ''
          ]"
        >
          Fill
        </button>
        
        <button 
          @click="setShape('rectangle')"
          :class="[
            'px-3 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed',
            shapeType === 'rectangle' ? 'bg-blue-600 text-white border-blue-600' : ''
          ]"
        >
          Rectangle
        </button>
        
        <button 
          @click="setShape('circle')"
          :class="[
            'px-3 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed',
            shapeType === 'circle' ? 'bg-blue-600 text-white border-blue-600' : ''
          ]"
        >
          Circle
        </button>
        
        <button 
          @click="setShape('line')"
          :class="[
            'px-3 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed',
            shapeType === 'line' ? 'bg-blue-600 text-white border-blue-600' : ''
          ]"
        >
          Line
        </button>
        
        <button 
          @click="setShape('triangle')"
          :class="[
            'px-3 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed',
            shapeType === 'triangle' ? 'bg-blue-600 text-white border-blue-600' : ''
          ]"
        >
          Triangle
        </button>
        
        <div class="flex items-center gap-2 px-2">
          <label class="text-sm text-gray-600 whitespace-nowrap">Brush:</label>
          <input 
            type="range" 
            v-model="brushSize"
            min="1" 
            max="50" 
            class="w-20 cursor-pointer"
            @input="updateBrushSize"
          />
        </div>
        
        <button 
          class="px-3 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" 
          @click="undo"
          :disabled="undoStack.length === 0"
        >
          Undo
        </button>
        <button 
          class="px-3 py-2 border border-gray-300 bg-white rounded cursor-pointer text-sm transition-all duration-200 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed" 
          @click="redo"
          :disabled="redoStack.length === 0"
        >
          Redo
        </button>
        <button class="px-3 py-2 bg-red-600 text-white border border-red-600 rounded cursor-pointer text-sm transition-all duration-200 hover:bg-red-700" @click="clearCanvas">
          Clear
        </button>
      </div>

      <!-- Tweede rij: Kleur palette -->
      <div class="flex justify-center">
        <div class="grid grid-cols-8 gap-1 p-2 bg-white rounded-lg shadow-sm">
          <button 
            v-for="(color, index) in colors" 
            :key="index"
            class="w-6 h-6 rounded border border-gray-300 cursor-pointer transition-all duration-100 relative hover:scale-110 hover:border-gray-600 hover:z-10"
            :style="{ backgroundColor: color }"
            :class="{ 'scale-110 border-2 border-gray-800 z-10': color === currentColor }"
            @click="selectColor(color)"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  isCurrentDrawer: Boolean,
  socket: Object
});

const emit = defineEmits(['color-change']);

// Canvas referenties
const canvasRef = ref(null);
let ctx = null;

// Drawing state
const currentColor = ref('#000000');
const brushSize = ref(5);
const mode = ref('draw');
const shapeType = ref(null);
const drawing = ref(false);
const isDrawingShape = ref(false);
const startX = ref(0);
const startY = ref(0);
const lastX = ref(0);
const lastY = ref(0);
const previewImage = ref(null);
const undoStack = ref([]);
const redoStack = ref([]);

// Uitgebreide color palette
const colors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
];

// Utility functions
const saveState = () => {
  undoStack.value.push(ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height));
  if (undoStack.value.length > 50) undoStack.value.shift();
  redoStack.value.length = 0;
};

const undo = () => {
  if (!undoStack.value.length) return;
  redoStack.value.push(ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height));
  ctx.putImageData(undoStack.value.pop(), 0, 0);
  
  if (props.socket && props.isCurrentDrawer) {
    props.socket.emit('canvas-action', {
      type: 'undo'
    });
  }
};

const redo = () => {
  if (!redoStack.value.length) return;
  undoStack.value.push(ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height));
  ctx.putImageData(redoStack.value.pop(), 0, 0);
  
  if (props.socket) {
    props.socket.emit('canvas-action', {
      type: 'redo',
      imageData: ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
    });
  }
};

const clearCanvas = () => {
  saveState();
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  
  if (props.socket) {
    props.socket.emit('canvas-action', {
      type: 'clear'
    });
  }
};

const updateCanvasColor = () => {
  ctx.fillStyle = ctx.strokeStyle = currentColor.value;
  emit('color-change', currentColor.value);
};

const updateBrushSize = () => {
  ctx.lineWidth = brushSize.value;
};

const setMode = (newMode) => {
  mode.value = newMode;
  shapeType.value = null;
};

const setShape = (shape) => {
  mode.value = 'draw';
  shapeType.value = shape;
};

const selectColor = (color) => {
  currentColor.value = color;
  updateCanvasColor();
};

const handleMouseDown = (e) => {
  if (!props.isCurrentDrawer) return;
  
  const rect = canvasRef.value.getBoundingClientRect();
  startX.value = e.clientX - rect.left;
  startY.value = e.clientY - rect.top;
  lastX.value = startX.value;
  lastY.value = startY.value;
  
  saveState();
  drawing.value = true;
  
  if (shapeType.value) {
    isDrawingShape.value = true;
    previewImage.value = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height);
  } else if (mode.value === 'draw') {
    ctx.beginPath();
    ctx.moveTo(startX.value, startY.value);
  } else if (mode.value === 'fill') {
    floodFill(startX.value, startY.value, currentColor.value);
  }
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

const handleMouseMove = (e) => {
  if (!drawing.value || !props.isCurrentDrawer) return;
  
  const rect = canvasRef.value.getBoundingClientRect();
  const currentX = e.clientX - rect.left;
  const currentY = e.clientY - rect.top;
  
  if (isDrawingShape.value) {
    ctx.putImageData(previewImage.value, 0, 0);
    drawShape(startX.value, startY.value, currentX, currentY);
  } else if (mode.value === 'draw') {
    ctx.lineWidth = brushSize.value;
    ctx.strokeStyle = currentColor.value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
  }
  
  lastX.value = currentX;
  lastY.value = currentY;
};

const handleMouseUp = () => {
  if (!drawing.value) return;
  
  drawing.value = false;
  isDrawingShape.value = false;
  
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
};

const drawShape = (x1, y1, x2, y2) => {
  ctx.strokeStyle = currentColor.value;
  ctx.lineWidth = brushSize.value;
  ctx.lineCap = 'round';
  
  ctx.beginPath();
  
  switch (shapeType.value) {
    case 'rectangle':
      ctx.rect(x1, y1, x2 - x1, y2 - y1);
      break;
    case 'circle':
      const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
      break;
    case 'line':
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      break;
    case 'triangle':
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x1 - (x2 - x1), y2);
      ctx.closePath();
      break;
  }
  
  ctx.stroke();
};

const floodFill = (x, y, fillColor) => {
  const imgData = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height);
  const data = imgData.data;
  const w = imgData.width;
  const h = imgData.height;

  const getPos = (x, y) => (y * w + x) * 4;
  const startPos = getPos(x, y);
  const startColor = data.slice(startPos, startPos + 4);
  const fillColorArr = [fillColor.r, fillColor.g, fillColor.b, 255];

  const colorsMatch = (a, b) => a.every((val, i) => val === b[i]);
  if (colorsMatch(startColor, fillColorArr)) return;

  const stack = [[x, y]];
  while (stack.length) {
    const [cx, cy] = stack.pop();
    if (cx < 0 || cx >= w || cy < 0 || cy >= h) continue;
    const pos = getPos(cx, cy);
    const currColor = data.slice(pos, pos + 4);
    if (colorsMatch(currColor, startColor)) {
      data.set(fillColorArr, pos);
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
  }
  ctx.putImageData(imgData, 0, 0);
};

onMounted(() => {
  ctx = canvasRef.value.getContext('2d');
  ctx.lineWidth = brushSize.value;
  ctx.strokeStyle = ctx.fillStyle = currentColor.value;
  
  // Fill with white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  ctx.fillStyle = currentColor.value;
  
  // Add event listeners
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
  // Socket event listeners
  if (props.socket) {
    props.socket.on('draw', (data) => {
      if (data.playerId !== props.socket.id) {
        handleRemoteDrawing(data);
      }
    });
    
    props.socket.on('canvas-action', (data) => {
      if (data.playerId !== props.socket.id) {
        handleRemoteCanvasAction(data);
      }
    });

    props.socket.on('initial_drawing_data', (drawingHistory) => {
      // Herstel de canvas met alle bestaande drawing data
      drawingHistory.forEach(data => {
        handleRemoteDrawing(data);
      });
    });
  }
});

// Handle remote drawing van andere clients
const handleRemoteDrawing = (data) => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  switch (data.type) {
    case 'start':
      if (data.mode === 'draw') {
        // Begin remote drawing
        ctx.fillStyle = ctx.strokeStyle = data.color;
      }
      break;
    case 'draw':
      if (data.mode === 'draw') {
        // Continue remote drawing - gebruik de smooth line functie
        drawLineSmooth(data.lastX || data.x, data.lastY || data.y, data.x, data.y, data.brushSize / 2, data.color);
      }
      break;
    case 'fill':
      floodFill(data.x, data.y, hexToRgb(data.color));
      break;
    case 'shape':
      ctx.fillStyle = ctx.strokeStyle = data.color;
      ctx.lineWidth = data.brushSize;
      
      switch (data.shapeType) {
        case 'rectangle':
          ctx.fillRect(data.startX, data.startY, data.endX - data.startX, data.endY - data.startY);
          break;
        case 'circle':
          ctx.beginPath();
          ctx.ellipse(
            data.startX + (data.endX - data.startX) / 2,
            data.startY + (data.endY - data.startY) / 2,
            Math.abs((data.endX - data.startX) / 2),
            Math.abs((data.endY - data.startY) / 2),
            0, 0, 2 * Math.PI
          );
          ctx.fill();
          break;
        case 'line':
          ctx.beginPath();
          ctx.moveTo(data.startX, data.startY);
          ctx.lineTo(data.endX, data.endY);
          ctx.stroke();
          break;
        case 'triangle':
          const tipX = data.startX;
          const tipY = data.startY;
          const dx = data.endX - tipX;
          const dy = data.endY - tipY;
          const height = Math.hypot(dx, dy);
          if (height > 0) {
            const baseCenterX = tipX + dx * 0.6;
            const baseCenterY = tipY + dy * 0.6;
            const baseLength = height / 2 + data.brushSize * 3;
            drawRotatedTriangle(tipX, tipY, baseCenterX, baseCenterY, baseLength);
          }
          break;
      }
      break;
  }
};

const handleRemoteCanvasAction = (data) => {
  switch (data.type) {
    case 'clear':
      ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
      break;
    case 'undo':
    case 'redo':
      if (data.imageData) {
        ctx.putImageData(data.imageData, 0, 0);
      }
      break;
  }
};

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});
</script>

<style scoped>
/* Alleen custom styling die niet met Tailwind kan worden gedaan - nu leeg! */
</style>