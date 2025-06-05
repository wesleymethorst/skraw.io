<template>
  <div class="m-0 flex flex-col h-screen">
    <div class="flex-1 relative">
      <canvas 
        ref="canvasRef"
        width="800" 
        height="600" 
        class="border-2 border-gray-700 block mx-auto my-2.5 bg-white"
        @mousedown="handleMouseDown"
      />
    </div>

    <div class="p-2.5 bg-blue-300 flex flex-wrap gap-2.5 items-center justify-content">
      <input 
        type="color" 
        v-model="currentColor" 
        class="cursor-pointer"
        @change="updateCanvasColor"
      />
      
      <button 
        @click="setMode('draw')"
        :class="[
          'toolbar-btn px-3.5 py-1.5 text-sm border-none rounded cursor-pointer transition-colors duration-200',
          mode === 'draw' && !shapeType ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-800'
        ]"
      >
        Draw
      </button>
      
      <button 
        @click="setMode('fill')"
        :class="[
          'toolbar-btn px-3.5 py-1.5 text-sm border-none rounded cursor-pointer transition-colors duration-200',
          mode === 'fill' ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-800'
        ]"
      >
        Fill
      </button>
      
      <button 
        @click="setShape('rectangle')"
        :class="[
          'toolbar-btn px-3.5 py-1.5 text-sm border-none rounded cursor-pointer transition-colors duration-200',
          shapeType === 'rectangle' ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-800'
        ]"
      >
        Rectangle
      </button>
      
      <button 
        @click="setShape('circle')"
        :class="[
          'toolbar-btn px-3.5 py-1.5 text-sm border-none rounded cursor-pointer transition-colors duration-200',
          shapeType === 'circle' ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-800'
        ]"
      >
        Circle
      </button>
      
      <button 
        @click="setShape('line')"
        :class="[
          'toolbar-btn px-3.5 py-1.5 text-sm border-none rounded cursor-pointer transition-colors duration-200',
          shapeType === 'line' ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-800'
        ]"
      >
        Line
      </button>
      
      <button 
        @click="setShape('triangle')"
        :class="[
          'toolbar-btn px-3.5 py-1.5 text-sm border-none rounded cursor-pointer transition-colors duration-200',
          shapeType === 'triangle' ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-800'
        ]"
      >
        Triangle
      </button>
      
      <label class="text-sm flex items-center gap-1.25">
        Brush Size:
        <input 
          type="range" 
          v-model="brushSize"
          min="1" 
          max="50" 
          class="cursor-pointer"
          @input="updateBrushSize"
        />
      </label>
      
      <button 
        @click="undo"
        :disabled="undoStack.length === 0"
        class="toolbar-btn px-3.5 py-1.5 text-sm border-none rounded bg-gray-300 text-gray-800 cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-default"
      >
        Undo
      </button>
      
      <button 
        @click="redo"
        :disabled="redoStack.length === 0"
        class="toolbar-btn px-3.5 py-1.5 text-sm border-none rounded bg-gray-300 text-gray-800 cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-default"
      >
        Redo
      </button>
      
      <button 
        @click="clearCanvas"
        class="toolbar-btn px-3.5 py-1.5 text-sm border-none rounded bg-gray-300 text-gray-800 cursor-pointer transition-colors duration-200"
      >
        Clear
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Reactive data
const canvasRef = ref(null)
const currentColor = ref('#000000')
const brushSize = ref(5)
const mode = ref('draw')
const shapeType = ref(null)
const drawing = ref(false)
const isDrawingShape = ref(false)
const startX = ref(0)
const startY = ref(0)
const lastX = ref(0)
const lastY = ref(0)
const previewImage = ref(null)
const undoStack = ref([])
const redoStack = ref([])

// Canvas context
let ctx = null

// Methods
const saveState = () => {
  undoStack.value.push(ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height))
  if (undoStack.value.length > 50) undoStack.value.shift()
  redoStack.value.length = 0
}

const undo = () => {
  if (!undoStack.value.length) return
  redoStack.value.push(ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height))
  ctx.putImageData(undoStack.value.pop(), 0, 0)
}

const redo = () => {
  if (!redoStack.value.length) return
  undoStack.value.push(ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height))
  ctx.putImageData(redoStack.value.pop(), 0, 0)
}

const clearCanvas = () => {
  saveState()
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}

const setMode = (newMode) => {
  mode.value = newMode
  shapeType.value = null
}

const setShape = (shape) => {
  shapeType.value = shape
  mode.value = 'shape'
}

const updateCanvasColor = () => {
  ctx.fillStyle = ctx.strokeStyle = currentColor.value
}

const updateBrushSize = () => {
  ctx.lineWidth = brushSize.value
}

const hexToRgb = (hex) => {
  hex = hex.replace('#', '')
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16)
  }
}

const floodFill = (x, y, fillColor) => {
  const imgData = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
  const data = imgData.data
  const w = imgData.width
  const h = imgData.height

  const getPos = (x, y) => (y * w + x) * 4

  const startPos = getPos(x, y)
  const startColor = data.slice(startPos, startPos + 4)
  const fillColorArr = [fillColor.r, fillColor.g, fillColor.b, 255]

  const colorsMatch = (a, b) => a.every((val, i) => val === b[i])

  if (colorsMatch(startColor, fillColorArr)) return

  const stack = [[x, y]]
  while (stack.length) {
    const [cx, cy] = stack.pop()
    if (cx < 0 || cx >= w || cy < 0 || cy >= h) continue
    const pos = getPos(cx, cy)
    const currColor = data.slice(pos, pos + 4)
    if (colorsMatch(currColor, startColor)) {
      data.set(fillColorArr, pos)
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1])
    }
  }
  ctx.putImageData(imgData, 0, 0)
}

const drawLineSmooth = (x1, y1, x2, y2, radius, color) => {
  const dx = x2 - x1
  const dy = y2 - y1
  const distance = Math.hypot(dx, dy)
  const steps = Math.ceil(distance / (radius / 2))
  ctx.fillStyle = color
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const cx = x1 + dx * t
    const cy = y1 + dy * t
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

const drawRotatedTriangle = (tipX, tipY, baseCenterX, baseCenterY, baseLength) => {
  const vx = baseCenterX - tipX
  const vy = baseCenterY - tipY
  const height = Math.hypot(vx, vy)
  if (height === 0) return

  const ux = vx / height
  const uy = vy / height

  const perpX = -uy
  const perpY = ux

  const halfBase = baseLength / 2

  const baseLeftX = baseCenterX + perpX * halfBase
  const baseLeftY = baseCenterY + perpY * halfBase

  const baseRightX = baseCenterX - perpX * halfBase
  const baseRightY = baseCenterY - perpY * halfBase

  ctx.beginPath()
  ctx.moveTo(tipX, tipY)
  ctx.lineTo(baseLeftX, baseLeftY)
  ctx.lineTo(baseRightX, baseRightY)
  ctx.closePath()
  ctx.fill()
}

const handleMouseDown = (e) => {
  const rect = canvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  if (mode.value === 'fill') {
    saveState()
    floodFill(Math.floor(x), Math.floor(y), hexToRgb(currentColor.value))
  } else if (mode.value === 'draw') {
    saveState()
    drawing.value = true
    startX.value = lastX.value = x
    startY.value = lastY.value = y
    ctx.fillStyle = ctx.strokeStyle = currentColor.value
  } else if (mode.value === 'shape') {
    saveState()
    drawing.value = true
    isDrawingShape.value = true
    startX.value = x
    startY.value = y
    previewImage.value = ctx.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height)
  }
}

const handleMouseMove = (e) => {
  if (!drawing.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  if (mode.value === 'draw') {
    drawLineSmooth(lastX.value, lastY.value, x, y, brushSize.value / 2, currentColor.value)
    lastX.value = x
    lastY.value = y
  } else if (mode.value === 'shape' && isDrawingShape.value) {
    ctx.putImageData(previewImage.value, 0, 0)
    ctx.fillStyle = ctx.strokeStyle = currentColor.value
    ctx.lineWidth = brushSize.value

    switch (shapeType.value) {
      case 'rectangle':
        ctx.fillRect(startX.value, startY.value, x - startX.value, y - startY.value)
        break
      case 'circle':
        ctx.beginPath()
        ctx.ellipse(
          startX.value + (x - startX.value) / 2,
          startY.value + (y - startY.value) / 2,
          Math.abs((x - startX.value) / 2),
          Math.abs((y - startY.value) / 2),
          0, 0, 2 * Math.PI
        )
        ctx.fill()
        break
      case 'line':
        ctx.beginPath()
        ctx.moveTo(startX.value, startY.value)
        ctx.lineTo(x, y)
        ctx.stroke()
        break
      case 'triangle':
        const tipX = startX.value
        const tipY = startY.value
        const dx = x - tipX
        const dy = y - tipY
        const height = Math.hypot(dx, dy)
        if (height === 0) break
        const baseCenterX = tipX + dx * 0.6
        const baseCenterY = tipY + dy * 0.6
        const length = height
        const baseLength = length / 2 + brushSize.value * 3
        drawRotatedTriangle(tipX, tipY, baseCenterX, baseCenterY, baseLength)
        break
    }
  }
}

const handleMouseUp = () => {
  drawing.value = false
  isDrawingShape.value = false
}

// Lifecycle
onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  ctx.lineWidth = brushSize.value
  ctx.strokeStyle = ctx.fillStyle = currentColor.value
  
  // Add event listeners
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  // Clean up event listeners
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
.toolbar-btn:hover:not(:disabled) {
  @apply bg-gray-400;
}

input[type="color"],
input[type="range"] {
  @apply cursor-pointer;
}
</style>