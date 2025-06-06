<template>
  <div class="home-page">
    <!-- Main content wrapper -->
    <div class="flex-1 flex flex-col items-center px-[4%] py-[2vh]">
      <img 
        src="../assets/skrawio_logo_transparant3.png" 
        alt="Skraw.io Logo" 
        class="w-[70%] max-w-[35vw] sm:max-w-[25vw] h-auto block mt-[1.5vh] mb-[2vh] mx-auto" 
      />
      
      <!-- Game interface blok -->
      <div class="bg-[#f5ecc8bf] rounded-sm p-[3%] w-[90%] max-w-[42vw] min-h-[30vh] shadow-[0_4px_20px_rgba(0,0,0,0.3)] mb-[2vh] flex flex-col gap-[1vh]">
        <!-- Name input and language selector row -->
        <div class="flex flex-col sm:flex-row gap-[1vh]">
          <input 
            type="text" 
            class="flex-1 sm:flex-[2] py-[1.5vh] px-[3%] border-2 border-[#d4c19c] rounded-md text-[clamp(0.75rem,1.5vw,0.875rem)] bg-white/90 text-[#654321] placeholder-gray-400" 
            placeholder="Enter your name" 
            v-model="playerName" 
            @keyup.enter="playGame"
          />
          <select 
            class="flex-1 py-[1.5vh] px-[3%] border-2 border-[#d4c19c] rounded-md text-[clamp(0.75rem,1.5vw,0.875rem)] bg-white/90 text-[#654321] cursor-pointer"
            v-model="selectedLanguage"
          >
            <option value="dutch">Dutch</option>
            <option value="english">English</option>
            <option value="german">German</option>
            <option value="french">French</option>
          </select>
        </div>
        
        <!-- Avatar selector -->
        <div class="bg-[#f5ecc8d9] shadow-[0_2px_10px_rgba(0,0,0,0.2)] my-[1vh] p-[2%] rounded-sm">
          <h4 class="text-[#8B4513] text-[clamp(0.75rem,1.4vw,0.875rem)] font-bold text-center mb-[1vh]">Choose your character</h4>
          
          <!-- Character customization options -->
          <div class="space-y-[1vh] mb-[1.5vh]">
            <!-- Color selection -->
            <div>
              <label class="text-[#654321] text-[clamp(0.7rem,1.2vw,0.75rem)] font-bold block mb-[0.5vh]">Color:</label>
              <div class="flex gap-[1%] justify-center flex-wrap">
                <button 
                  v-for="color in availableColors" 
                  :key="color"
                  @click="selectedColor = color"
                  :class="[
                    'w-[clamp(1rem,2.5vw,1.25rem)] h-[clamp(1rem,2.5vw,1.25rem)] rounded-full border-2 transition-all duration-200 hover:scale-110',
                    selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                  ]"
                  :style="{ backgroundColor: getColorHex(color) }"
                ></button>
              </div>
            </div>
            
            <!-- Mood selection -->
            <div>
              <label class="text-[#654321] text-[clamp(0.7rem,1.2vw,0.75rem)] font-bold block mb-[0.5vh]">Mood:</label>
              <div class="flex gap-[1%] justify-center flex-wrap">
                <button 
                  v-for="mouth in availableMouths" 
                  :key="mouth"
                  @click="selectedMouth = mouth"
                  :class="[
                    'px-[1.5%] py-[0.5vh] text-[clamp(0.7rem,1.2vw,0.75rem)] rounded border-2 transition-all duration-200 hover:scale-105',
                    selectedMouth === mouth 
                      ? 'border-[#8B4513] bg-[#8B4513] text-white' 
                      : 'border-[#d4c19c] bg-white text-[#654321]'
                  ]"
                >
                  {{ mouth }}
                </button>
              </div>
            </div>
            
            <!-- Eyes selection -->
            <div>
              <label class="text-[#654321] text-[clamp(0.7rem,1.2vw,0.75rem)] font-bold block mb-[0.5vh]">Expression:</label>
              <div class="flex gap-[1%] justify-center flex-wrap">
                <button 
                  v-for="eyes in availableEyes" 
                  :key="eyes"
                  @click="selectedEyes = eyes"
                  :class="[
                    'px-[1.5%] py-[0.5vh] text-[clamp(0.7rem,1.2vw,0.75rem)] rounded border-2 transition-all duration-200 hover:scale-105',
                    selectedEyes === eyes 
                      ? 'border-[#8B4513] bg-[#8B4513] text-white' 
                      : 'border-[#d4c19c] bg-white text-[#654321]'
                  ]"
                >
                  {{ eyes }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Character preview -->
          <div class="flex justify-center">
            <div class="w-[clamp(2.5rem,6vw,3rem)] h-[clamp(2.5rem,6vw,3rem)] bg-white rounded-lg border-2 border-[#d4c19c] flex items-center justify-center shadow-inner">
              <img 
                :src="characterImagePath"
                :alt="`Character ${selectedColor} ${selectedMouth} ${selectedEyes}`"
                class="w-[clamp(1.75rem,4.5vw,2.25rem)] h-[clamp(1.75rem,4.5vw,2.25rem)] object-contain"
                @error="handleImageError"
              />
            </div>
          </div>
        </div>
        
        <!-- Play buttons -->
        <a 
          :href="`/game?name=${encodeURIComponent(playerName)}&lang=${selectedLanguage}`" 
          class="bg-green-600 text-white border-none rounded-md py-[2vh] px-[4%] text-[clamp(0.875rem,1.8vw,1rem)] font-bold cursor-pointer transition-colors duration-300 no-underline inline-block text-center self-center w-full hover:bg-green-700 hover:no-underline"
          @click.prevent="playGame"
        > 
          Play!
        </a>
        <button class="bg-blue-600 text-white border-none rounded-md py-[2vh] px-[4%] text-[clamp(0.875rem,1.8vw,1rem)] font-bold cursor-pointer transition-colors duration-300 w-full hover:bg-blue-700">
          Create Private Room
        </button>
      </div>
    </div>
    
    <!-- Footer secties -->
    <div class="w-screen bg-[#f5ecc8bf] pt-[2vh] pb-[1.5vh] flex justify-center">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-[2%] max-w-6xl w-full px-[3%]">
        <div class="bg-[#f5ecc8d9] rounded-sm p-[3%] shadow-[0_2px_10px_rgba(0,0,0,0.2)] min-h-[12vh]">
          <h3 class="text-[#8B4513] text-[clamp(0.75rem,1.4vw,0.875rem)] mb-[1vh] font-black text-center">About</h3>
          <p class="text-[#654321] leading-[1.4] mb-[0.5vh] text-[clamp(0.7rem,1.2vw,0.75rem)]">
            <strong>skraw.io</strong> is a school project by 5 ICT students and a fun online drawing and guessing game. One player draws a word while others try to guess it. Earn points by guessing correctly or drawing well!
          </p>
        </div>
        
        <div class="bg-[#f5ecc8d9] rounded-sm p-[3%] shadow-[0_2px_10px_rgba(0,0,0,0.2)] min-h-[12vh] flex flex-col">
          <h3 class="text-[#8B4513] text-[clamp(0.75rem,1.4vw,0.875rem)] mb-[1vh] font-black text-center flex-shrink-0">News</h3>
          <div class="overflow-y-auto flex-1 max-h-[90px] pr-1">
            <div class="space-y-2">
              <div>
                <h4 class="text-[#A0522D] text-xs mb-1 font-bold flex items-center justify-between">
                  Fresh paint
                  <span class="text-[#8B4513] text-xs font-normal">9th Nov 2022</span>
                </h4>
                <p class="text-[#654321] leading-4 mb-1 text-xs">Hello! Welcome to the new skraw.io!</p>
                <ul class="text-[#654321] text-xs leading-4 ml-3 space-y-0.5">
                  <li>• Redesign of the page</li>
                  <li>• Mobile support</li>
                  <li>• Reworked toolbar</li>
                  <li class="ml-2">○ Undo button</li>
                  <li class="ml-2">○ More colors</li>
                  <li class="ml-2">○ Left- and rightclick to select colors</li>
                  <li class="ml-2">○ Experimental pressure touch input</li>
                  <li class="ml-2">○ Configurable hotkeys</li>
                  <li>• Better player interactions/moderation</li>
                  <li class="ml-2">○ Ability to kick and ban players</li>
                  <li class="ml-2">○ Votekick, Mute and Report players</li>
                  <li>• Invite friends to public rooms</li>
                  <li>• More room settings</li>
                  <li class="ml-2">○ Increased player count to 20</li>
                  <li class="ml-2">○ Set amount of words to choose (1-5)</li>
                </ul>
              </div>
              
              <div class="border-t border-[#d4c19c] pt-2">
                <h4 class="text-[#A0522D] text-xs mb-1 font-bold flex items-center justify-between">
                  Bug fixes
                  <span class="text-[#8B4513] text-xs font-normal">1st Nov 2022</span>
                </h4>
                <ul class="text-[#654321] text-xs leading-4 ml-3 space-y-0.5">
                  <li>• Fixed drawing lag issues</li>
                  <li>• Improved chat filtering</li>
                  <li>• Better connection stability</li>
                </ul>
              </div>
              
              <div class="border-t border-[#d4c19c] pt-2">
                <h4 class="text-[#A0522D] text-xs mb-1 font-bold flex items-center justify-between">
                  Halloween Update
                  <span class="text-[#8B4513] text-xs font-normal">31st Oct 2022</span>
                </h4>
                <ul class="text-[#654321] text-xs leading-4 ml-3 space-y-0.5">
                  <li>• Special Halloween themed words</li>
                  <li>• Spooky avatar accessories</li>
                  <li>• Limited time backgrounds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-[#f5ecc8d9] rounded-sm p-[3%] shadow-[0_2px_10px_rgba(0,0,0,0.2)] min-h-[12vh] relative">
          <h3 class="text-[#8B4513] text-[clamp(0.75rem,1.4vw,0.875rem)] mb-[1vh] font-black text-center">How to play</h3>
          
          <!-- Carousel container -->
          <div 
            class="overflow-hidden relative"
            @mouseenter="stopAutoAdvance"
            @mouseleave="startAutoAdvance"
          >
            <div 
              class="flex transition-transform duration-300 ease-in-out"
              :style="{ transform: `translateX(-${currentStep * 100}%)` }"
            >
              <!-- Step 1 -->
              <div class="w-full flex-shrink-0 px-1">
                <div class="text-center">
                  <div class="text-sm mb-1">✏️</div>
                  <h4 class="text-[#A0522D] text-xs mb-1 font-bold">Step 1: Draw</h4>
                  <p class="text-[#654321] leading-4 text-xs">When it's your turn, choose a word and draw it!</p>
                </div>
              </div>
              
              <!-- Step 2 -->
              <div class="w-full flex-shrink-0 px-1">
                <div class="text-center">
                  <div class="text-sm mb-1">🤔</div>
                  <h4 class="text-[#A0522D] text-xs mb-1 font-bold">Step 2: Guess</h4>
                  <p class="text-[#654321] leading-4 text-xs">When others draw, type your guesses in the chat!</p>
                </div>
              </div>
              
              <!-- Step 3 -->
              <div class="w-full flex-shrink-0 px-1">
                <div class="text-center">
                  <div class="text-sm mb-1">🏆</div>
                  <h4 class="text-[#A0522D] text-xs mb-1 font-bold">Step 3: Score</h4>
                  <p class="text-[#654321] leading-4 text-xs">Earn points for correct guesses and good drawings!</p>
                </div>
              </div>
              
              <!-- Step 4 -->
              <div class="w-full flex-shrink-0 px-1">
                <div class="text-center">
                  <div class="text-sm mb-1">🎉</div>
                  <h4 class="text-[#A0522D] text-xs mb-1 font-bold">Step 4: Win</h4>
                  <p class="text-[#654321] leading-4 text-xs">The player with the most points wins the game!</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Navigation dots -->
          <div class="flex justify-center gap-1 mt-2">
            <button
              v-for="(step, index) in totalSteps"
              :key="index"
              @click="currentStep = index"
              :class="[
                'w-1.5 h-1.5 rounded-full transition-all duration-200',
                currentStep === index 
                  ? 'bg-[#8B4513] scale-110' 
                  : 'bg-[#d4c19c] hover:bg-[#A0522D]'
              ]"
            ></button>
          </div>
          
          <!-- Previous/Next arrows -->
          <button
            @click="previousStep"
            class="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#8B4513]/20 hover:bg-[#8B4513]/40 rounded-full flex items-center justify-center transition-colors duration-200"
            :disabled="currentStep === 0"
            :class="{ 'opacity-50 cursor-not-allowed': currentStep === 0 }"
          >
            <span class="text-[#8B4513] text-xs">‹</span>
          </button>
          
          <button
            @click="nextStep"
            class="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#8B4513]/20 hover:bg-[#8B4513]/40 rounded-full flex items-center justify-center transition-colors duration-200"
            :disabled="currentStep === totalSteps - 1"
            :class="{ 'opacity-50 cursor-not-allowed': currentStep === totalSteps - 1 }"
          >
            <span class="text-[#8B4513] text-xs">›</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Footer links -->
    <div class="w-screen bg-[#f5ecc8bf] pt-[1.5vh] pb-[1.5vh] flex justify-center">
      <div class="flex flex-col sm:flex-row justify-center gap-[1vh] sm:gap-[2%] text-center px-[3%]">
        <router-link to="/contact" class="text-[#654321] no-underline text-[clamp(0.7rem,1.2vw,0.75rem)] font-bold transition-colors duration-300 hover:text-[#8B4513] hover:underline">Contact</router-link>
        <router-link to="/terms" class="text-[#654321] no-underline text-[clamp(0.7rem,1.2vw,0.75rem)] font-bold transition-colors duration-300 hover:text-[#8B4513] hover:underline">Terms of Service</router-link>
        <router-link to="/credits" class="text-[#654321] no-underline text-[clamp(0.7rem,1.2vw,0.75rem)] font-bold transition-colors duration-300 hover:text-[#8B4513] hover:underline">Credits</router-link>
        <router-link to="/privacy" class="text-[#654321] no-underline text-[clamp(0.7rem,1.2vw,0.75rem)] font-bold transition-colors duration-300 hover:text-[#8B4513] hover:underline">Privacy Settings</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const playerName = ref('')
const selectedLanguage = ref('dutch')

const selectedColor = ref('blue')
const selectedMouth = ref('smug')
const selectedEyes = ref('wide')

// Carousel state
const currentStep = ref(0)
const totalSteps = 4

const availableColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
const availableMouths = ['awkward', 'sad', 'smug']
const availableEyes = ['sneaky', 'wide', 'worried']

const characterImagePath = computed(() => {
  return new URL(`../assets/characters/character_${selectedColor.value}_${selectedMouth.value}_${selectedEyes.value}.png`, import.meta.url).href
})

const getColorHex = (colorName) => {
  const colorMap = {
    red: '#ef4444',
    orange: '#f97316', 
    yellow: '#eab308',
    green: '#22c55e',
    blue: '#3b82f6',
    purple: '#a855f7'
  }
  return colorMap[colorName] || '#6b7280'
}

const handleImageError = (event) => {
  console.warn('Failed to load character image:', event.target.src)
}

const playGame = () => {
  if (playerName.value.trim()) {
    router.push({
      path: '/game',
      query: {
        name: encodeURIComponent(playerName.value),
        lang: selectedLanguage.value,
        character: `${selectedColor.value}_${selectedMouth.value}_${selectedEyes.value}`
      }
    })
  } else {
    alert('Please enter your name before playing!')
  }
}

// Carousel navigation methods
const nextStep = () => {
  if (currentStep.value < totalSteps - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// Auto-advance carousel every 4 seconds
let autoAdvanceInterval
const startAutoAdvance = () => {
  autoAdvanceInterval = setInterval(() => {
    if (currentStep.value < totalSteps - 1) {
      currentStep.value++
    } else {
      currentStep.value = 0
    }
  }, 4000)
}

const stopAutoAdvance = () => {
  if (autoAdvanceInterval) {
    clearInterval(autoAdvanceInterval)
    autoAdvanceInterval = null
  }
}

onMounted(() => {
  startAutoAdvance()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');

.home-page {
  width: 100vw;
  min-height: 100vh;
  background-image: url('../assets/skraw_background_1920x1080.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  font-family: 'Comic Neue', sans-serif;
}
</style>