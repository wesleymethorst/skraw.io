<template>
  <div class="canvas-wrapper">
    <!-- Toolbar bovenaan - verborgen maar neemt nog steeds ruimte in -->
    <div class="toolbar" :class="{ hidden: !props.isCurrentDrawer }">
      <input 
        type="color" 
        v-model="currentColor" 
        class="color-picker"
        @change="updateCanvasColor"
      />
      
      <button 
        @click="setMode('draw')"
        :class="[
          'tool-button',
          mode === 'draw' && !shapeType ? 'active' : ''
        ]"
      >
        Draw
      </button>
      
      <button 
        @click="setMode('fill')"
        :class="[
          'tool-button',
          mode === 'fill' ? 'active' : ''
        ]"
      >
        Fill
      </button>
      
      <button 
        @click="setShape('rectangle')"
        :class="[
          'tool-button',
          shapeType === 'rectangle' ? 'active' : ''
        ]"
      >
        Rectangle
      </button>
      
      <button 
        @click="setShape('circle')"
        :class="[
          'tool-button',
          shapeType === 'circle' ? 'active' : ''
        ]"
      >
        Circle
      </button>
      
      <button 
        @click="setShape('line')"
        :class="[
          'tool-button',
          shapeType === 'line' ? 'active' : ''
        ]"
      >
        Line
      </button>
      
      <button 
        @click="setShape('triangle')"
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
          v-model="brushSize"
          min="1" 
          max="50" 
          class="brush-slider"
          @input="updateBrushSize"
        />
      </div>
      
      <button 
        class="tool-button" 
        @click="undo"
        :disabled="undoStack.length === 0"
      >
        Undo
      </button>
      <button 
        class="tool-button" 
        @click="redo"
        :disabled="redoStack.length === 0"
      >
        Redo
      </button>
      <button class="tool-button clear-btn" @click="clearCanvas">
        Clear
      </button>
    </div>

    <canvas 
      ref="canvasRef"
      width="800"
      height="600"
      @mousedown="handleMouseDown"
      class="drawing-canvas"
    ></canvas>

    <div class="color-palette" :class="{ hidden: !props.isCurrentDrawer }">
      <button 
        v-for="(color, index) in colors" 
        :key="index"
        class="color-button"
        :style="{ backgroundColor: color }"
        :class="{ active: color === currentColor }"
        @click="selectColor(color)"
      ></button>
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

// Drawing state - geïmporteerd van CanvasNieuw
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
  // Basis kleuren (eerste rij)
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
];

// Utility functions van CanvasNieuw
const saveState = () => {
  undoStack.value.push(ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height));
  if (undoStack.value.length > 50) undoStack.value.shift();
  redoStack.value.length = 0;
};

const undo = () => {
  if (!undoStack.value.length) return;
  redoStack.value.push(ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height));
  ctx.putImageData(undoStack.value.pop(), 0, 0);
  
  // Socket - stuur undo commando naar andere clients (alleen als je de tekenaar bent)
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
  
  // Socket - stuur redo naar andere clients
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
  
  // Socket - stuur clear naar andere clients
  if (props.socket) {
    props.socket.emit('canvas-action', {
      type: 'clear'
    });
  }
};

const setMode = (newMode) => {
  mode.value = newMode;
  shapeType.value = null;
};

const setShape = (shape) => {
  shapeType.value = shape;
  mode.value = 'shape';
};

const updateCanvasColor = () => {
  ctx.fillStyle = ctx.strokeStyle = currentColor.value;
};

const updateBrushSize = () => {
  ctx.lineWidth = brushSize.value;
};

const selectColor = (color) => {
  currentColor.value = color;
  updateCanvasColor();
  emit('color-change', color);
};

// Advanced drawing functions van CanvasNieuw
const hexToRgb = (hex) => {
  hex = hex.replace('#', '');
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16)
  };
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

const drawLineSmooth = (x1, y1, x2, y2, radius, color) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.hypot(dx, dy);
  const steps = Math.ceil(distance / (radius / 2));
  ctx.fillStyle = color;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const cx = x1 + dx * t;
    const cy = y1 + dy * t;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }
};

const drawRotatedTriangle = (tipX, tipY, baseCenterX, baseCenterY, baseLength) => {
  const vx = baseCenterX - tipX;
  const vy = baseCenterY - tipY;
  const height = Math.hypot(vx, vy);
  if (height === 0) return;

  const ux = vx / height;
  const uy = vy / height;
  const perpX = -uy;
  const perpY = ux;
  const halfBase = baseLength / 2;

  const baseLeftX = baseCenterX + perpX * halfBase;
  const baseLeftY = baseCenterY + perpY * halfBase;
  const baseRightX = baseCenterX - perpX * halfBase;
  const baseRightY = baseCenterY - perpY * halfBase;

  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(baseLeftX, baseLeftY);
  ctx.lineTo(baseRightX, baseRightY);
  ctx.closePath();
  ctx.fill();
};

// Event handlers met socket integratie
const handleMouseDown = (e) => {
  if (!props.isCurrentDrawer) return;
  
  const rect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (mode.value === 'fill') {
    saveState();
    floodFill(Math.floor(x), Math.floor(y), hexToRgb(currentColor.value));
    
    // Socket - stuur fill actie
    if (props.socket) {
      props.socket.emit('draw', {
        type: 'fill',
        x: Math.floor(x),
        y: Math.floor(y),
        color: currentColor.value
      });
    }
  } else if (mode.value === 'draw') {
    saveState();
    drawing.value = true;
    startX.value = lastX.value = x;
    startY.value = lastY.value = y;
    ctx.fillStyle = ctx.strokeStyle = currentColor.value;
    
    // Socket - stuur start draw
    if (props.socket) {
      props.socket.emit('draw', {
        type: 'start',
        x: x,
        y: y,
        color: currentColor.value,
        brushSize: brushSize.value,
        mode: 'draw'
      });
    }
  } else if (mode.value === 'shape') {
    saveState();
    drawing.value = true;
    isDrawingShape.value = true;
    startX.value = x;
    startY.value = y;
    previewImage.value = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height);
  }
};

const handleMouseMove = (e) => {
  if (!drawing.value || !props.isCurrentDrawer) return;
  
  const rect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (mode.value === 'draw') {
    drawLineSmooth(lastX.value, lastY.value, x, y, brushSize.value / 2, currentColor.value);
    
    // Socket - stuur draw movement met lastX en lastY voor vloeiende lijnen
    if (props.socket) {
      props.socket.emit('draw', {
        type: 'draw',
        x: x,
        y: y,
        lastX: lastX.value,
        lastY: lastY.value,
        color: currentColor.value,
        brushSize: brushSize.value,
        mode: 'draw'
      });
    }
    
    lastX.value = x;
    lastY.value = y;
  } else if (mode.value === 'shape' && isDrawingShape.value) {
    ctx.putImageData(previewImage.value, 0, 0);
    ctx.fillStyle = ctx.strokeStyle = currentColor.value;
    ctx.lineWidth = brushSize.value;

    switch (shapeType.value) {
      case 'rectangle':
        ctx.fillRect(startX.value, startY.value, x - startX.value, y - startY.value);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.ellipse(
          startX.value + (x - startX.value) / 2,
          startY.value + (y - startY.value) / 2,
          Math.abs((x - startX.value) / 2),
          Math.abs((y - startY.value) / 2),
          0, 0, 2 * Math.PI
        );
        ctx.fill();
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(startX.value, startY.value);
        ctx.lineTo(x, y);
        ctx.stroke();
        break;
      case 'triangle':
        const tipX = startX.value;
        const tipY = startY.value;
        const dx = x - tipX;
        const dy = y - tipY;
        const height = Math.hypot(dx, dy);
        if (height === 0) break;
        const baseCenterX = tipX + dx * 0.6;
        const baseCenterY = tipY + dy * 0.6;
        const length = height;
        const baseLength = length / 2 + brushSize.value * 3;
        drawRotatedTriangle(tipX, tipY, baseCenterX, baseCenterY, baseLength);
        break;
    }
  }
};

const handleMouseUp = (e) => {
  if (!props.isCurrentDrawer) return;
  
  // Als we een shape aan het tekenen waren, stuur final shape naar socket
  if (mode.value === 'shape' && isDrawingShape.value && props.socket) {
    const rect = canvasRef.value.getBoundingClientRect();
    const endX = e ? e.clientX - rect.left : lastX.value;
    const endY = e ? e.clientY - rect.top : lastY.value;
    
    props.socket.emit('draw', {
      type: 'shape',
      shapeType: shapeType.value,
      startX: startX.value,
      startY: startY.value,
      endX: endX,
      endY: endY,
      color: currentColor.value,
      brushSize: brushSize.value
    });
  }
  
  drawing.value = false;
  isDrawingShape.value = false;
};

// Socket event listeners
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

.tool-button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.tool-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tool-button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.tool-button.clear-btn {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}

.tool-button.clear-btn:hover {
  background-color: #c82333;
}

.color-picker {
  grid-column: span 2;
  width: 60px;
  height: 32px;
  border: 2px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
  margin-top: 8px;
  transition: all 0.1s;
  justify-self: center;
}

.color-picker:hover {
  transform: scale(1.05);
  border-color: #999;
}

.brush-size-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
}

.brush-size-container label {
  font-size: 14px;
  color: #555;
  white-space: nowrap;
}

.brush-slider {
  width: 100px;
  cursor: pointer;
}

.drawing-canvas {
  border: 1px solid #ccc;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  touch-action: none;
}

.color-palette {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  justify-content: center;
  align-items: center;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  flex-shrink: 0;
  max-width: 320px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-palette.hidden {
  visibility: hidden;
  pointer-events: none;
}

.color-button {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: all 0.1s;
  position: relative;
}

.color-button.active {
  transform: scale(1.15);
  border: 2px solid #333;
  z-index: 1;
}

.color-button:hover {
  transform: scale(1.1);
  border-color: #999;
  z-index: 1;
}

/* Responsive adjustments voor uitgebreide palette */
@media (max-width: 768px) {
  .color-palette {
    grid-template-columns: repeat(6, 1fr);
    max-width: 240px;
    gap: 3px;
    padding: 8px;
  }
  
  .color-button {
    width: 24px;
    height: 24px;
  }
  
  .color-picker {
    width: 50px;
    height: 28px;
  }
}

@media (max-width: 480px) {
  .color-palette {
    grid-template-columns: repeat(4, 1fr);
    max-width: 160px;
  }
  
  .color-button {
    width: 20px;
    height: 20px;
  }
  
  .color-picker {
    width: 44px;
    height: 24px;
  }
}
</style>