<template>
  <div class="bg-[#f5ecc8bf] shadow-[0_-2px_10px_rgba(0,0,0,0.2)] border-t-2 border-[#d4c19c] p-4">
    <!-- Main toolbar section -->
    <div class="flex flex-wrap items-center justify-center gap-3 mb-3" :class="{ 'opacity-50 pointer-events-none': !isCurrentDrawer }">
      <!-- Color picker -->
      <div class="flex items-center gap-2">
        <span class="text-[#654321] font-bold text-sm">Color:</span>
        <input 
          type="color" 
          v-model="currentColor" 
          class="w-10 h-8 border-2 border-[#d4c19c] rounded-md cursor-pointer p-0 transition-all duration-100 hover:scale-105 hover:border-[#8B4513]"
          @change="updateColor"
        />
      </div>
      
      <!-- Drawing tools -->
      <div class="flex items-center gap-2">
        <button 
          @click="setMode('draw')"
          :class="[
            'px-4 py-2 border-2 border-[#d4c19c] bg-[#f5ecc8d9] rounded cursor-pointer text-sm font-bold text-[#654321] transition-all duration-200 hover:bg-[#f5ecc8] hover:border-[#8B4513]',
            mode === 'draw' && !shapeType ? 'bg-[#8B4513] text-white border-[#8B4513]' : ''
          ]"
        >
          Draw
        </button>
        
        <button 
          @click="setMode('fill')"
          :class="[
            'px-4 py-2 border-2 border-[#d4c19c] bg-[#f5ecc8d9] rounded cursor-pointer text-sm font-bold text-[#654321] transition-all duration-200 hover:bg-[#f5ecc8] hover:border-[#8B4513]',
            mode === 'fill' ? 'bg-[#8B4513] text-white border-[#8B4513]' : ''
          ]"
        >
          Fill
        </button>
      </div>
      
      <!-- Shape tools -->
      <div class="flex items-center gap-2">
        <button 
          @click="setShape('rectangle')"
          :class="[
            'px-3 py-2 border-2 border-[#d4c19c] bg-[#f5ecc8d9] rounded cursor-pointer text-sm font-bold text-[#654321] transition-all duration-200 hover:bg-[#f5ecc8] hover:border-[#8B4513]',
            shapeType === 'rectangle' ? 'bg-[#8B4513] text-white border-[#8B4513]' : ''
          ]"
        >
          □
        </button>
        
        <button 
          @click="setShape('circle')"
          :class="[
            'px-3 py-2 border-2 border-[#d4c19c] bg-[#f5ecc8d9] rounded cursor-pointer text-sm font-bold text-[#654321] transition-all duration-200 hover:bg-[#f5ecc8] hover:border-[#8B4513]',
            shapeType === 'circle' ? 'bg-[#8B4513] text-white border-[#8B4513]' : ''
          ]"
        >
          ○
        </button>
        
        <button 
          @click="setShape('line')"
          :class="[
            'px-3 py-2 border-2 border-[#d4c19c] bg-[#f5ecc8d9] rounded cursor-pointer text-sm font-bold text-[#654321] transition-all duration-200 hover:bg-[#f5ecc8] hover:border-[#8B4513]',
            shapeType === 'line' ? 'bg-[#8B4513] text-white border-[#8B4513]' : ''
          ]"
        >
          /
        </button>
        
        <button 
          @click="setShape('triangle')"
          :class="[
            'px-3 py-2 border-2 border-[#d4c19c] bg-[#f5ecc8d9] rounded cursor-pointer text-sm font-bold text-[#654321] transition-all duration-200 hover:bg-[#f5ecc8] hover:border-[#8B4513]',
            shapeType === 'triangle' ? 'bg-[#8B4513] text-white border-[#8B4513]' : ''
          ]"
        >
          △
        </button>
      </div>
      
      <!-- Brush size -->
      <div class="flex items-center gap-2">
        <label class="text-sm text-[#654321] font-bold whitespace-nowrap">Size:</label>
        <input 
          type="range" 
          v-model="brushSize"
          min="1" 
          max="50" 
          class="w-20 cursor-pointer accent-[#8B4513]"
          @input="updateBrushSize"
        />
        <span class="text-sm text-[#654321] font-bold w-6">{{ brushSize }}</span>
      </div>
      
      <!-- Action buttons -->
      <div class="flex items-center gap-2">
        <button 
          @click="undo"
          :disabled="undoStack.length === 0"
          :class="[
            'px-4 py-2 border-2 border-[#d4c19c] bg-[#f5ecc8d9] rounded cursor-pointer text-sm font-bold text-[#654321] transition-all duration-200 hover:bg-[#f5ecc8] hover:border-[#8B4513]',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#f5ecc8d9] disabled:hover:border-[#d4c19c]'
          ]"
        >
          Undo
        </button>
        
        <button 
          @click="redo"
          :disabled="redoStack.length === 0"
          :class="[
            'px-4 py-2 border-2 border-[#d4c19c] bg-[#f5ecc8d9] rounded cursor-pointer text-sm font-bold text-[#654321] transition-all duration-200 hover:bg-[#f5ecc8] hover:border-[#8B4513]',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#f5ecc8d9] disabled:hover:border-[#d4c19c]'
          ]"
        >
          Redo
        </button>
        
        <button 
          @click="clearCanvas"
          class="px-4 py-2 border-2 border-red-500 bg-red-500 text-white rounded cursor-pointer text-sm font-bold transition-all duration-200 hover:bg-red-600 hover:border-red-600"
        >
          Clear
        </button>
      </div>
    </div>
    
    <!-- Color palette -->
    <div class="flex justify-center" :class="{ 'opacity-50 pointer-events-none': !isCurrentDrawer }">
      <div class="grid grid-cols-8 gap-2 p-3 bg-white bg-opacity-90 rounded-lg shadow-md max-w-80">
        <button 
          v-for="(color, index) in colors" 
          :key="index"
          class="w-8 h-8 rounded border-2 border-[#d4c19c] cursor-pointer transition-all duration-100 relative hover:scale-110 hover:border-[#8B4513] hover:z-10"
          :style="{ backgroundColor: color }"
          :class="{ 'scale-115 border-2 border-[#8B4513] z-10 shadow-lg': color === currentColor }"
          @click="selectColor(color)"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isCurrentDrawer: Boolean,
  socket: Object
});

const emit = defineEmits([
  'color-change',
  'mode-change', 
  'shape-change',
  'brush-size-change',
  'undo',
  'redo', 
  'clear-canvas'
]);

// Drawing state
const currentColor = ref('#000000');
const brushSize = ref(5);
const mode = ref('draw');
const shapeType = ref(null);
const undoStack = ref([]);
const redoStack = ref([]);

// Color palette
const colors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#800000', '#808080', '#FF8000', '#80FF00', '#0080FF', '#8000FF', '#FF0080', '#008080',
  '#400000', '#404040', '#804000', '#408000', '#004080', '#400080', '#800040', '#004040',
  '#200000', '#202020', '#402000', '#204000', '#002040', '#200040', '#400020', '#002020'
];

// Methods
const updateColor = () => {
  emit('color-change', currentColor.value);
};

const setMode = (newMode) => {
  mode.value = newMode;
  shapeType.value = null;
  emit('mode-change', { mode: newMode, shapeType: null });
};

const setShape = (shape) => {
  shapeType.value = shape;
  mode.value = 'shape';
  emit('shape-change', shape);
  emit('mode-change', { mode: 'shape', shapeType: shape });
};

const updateBrushSize = () => {
  emit('brush-size-change', brushSize.value);
};

const selectColor = (color) => {
  currentColor.value = color;
  emit('color-change', color);
};

const undo = () => {
  emit('undo');
};

const redo = () => {
  emit('redo');
};

const clearCanvas = () => {
  emit('clear-canvas');
};

// Watch for external undo/redo stack updates
const updateUndoStack = (stack) => {
  undoStack.value = stack;
};

const updateRedoStack = (stack) => {
  redoStack.value = stack;
};

// Expose methods for parent component
defineExpose({
  updateUndoStack,
  updateRedoStack,
  currentColor,
  brushSize,
  mode,
  shapeType
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');

.font-comic {
  font-family: 'Comic Neue', sans-serif;
}
</style>