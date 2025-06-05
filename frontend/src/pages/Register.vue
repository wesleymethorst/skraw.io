<template>
    <div class="register-page">
        <!-- Main content wrapper -->
        <div class="flex-1 flex flex-col items-center">
            <router-link to="/">
            <img src="../assets/skrawio_logo_transparant3.png" alt="Skraw.io Logo"
                class="max-w-[280px] h-auto block mt-3 mb-4 mx-auto" />
            </router-link>

            <!-- Game interface blok -->
            <div
                class="bg-[#f5ecc8bf] rounded-sm p-4 w-[420px] min-h-[240px] shadow-[0_4px_20px_rgba(0,0,0,0.3)] mb-4 flex flex-col gap-2">
                <!-- Name input and language selector row -->
                <h1 class="text-[#8B4513] text-xl font-bold text-center mb-0">Register</h1>

                <!-- Registration form - in 2 kolommen -->
                <div
                    class="bg-[#f5ecc8d9] shadow-[0_2px_10px_rgba(0,0,0,0.2)] my-2 p-3 rounded-sm flex flex-row items-center">

                    <!-- Form inputs -->
                    <div class="flex flex-col flex-grow gap-2">
                        <div>
                            <h4 class="text-[#8B4513] text-s font-bold text-left mb-0">Username</h4>
                            <input type="text"
                                class="w-full py-2 px-3 border-2 border-[#d4c19c] rounded-md text-sm bg-white/90 text-[#654321] placeholder-gray-400"
                                placeholder="Choose a username" v-model="playerName" />
                        </div>
                        <div>
                            <h4 class="text-[#8B4513] text-s font-bold text-left mb-0">Email</h4>
                            <input type="email"
                                class="w-full py-2 px-3 border-2 border-[#d4c19c] rounded-md text-sm bg-white/90 text-[#654321] placeholder-gray-400"
                                placeholder="Enter your email" v-model="playerEmail" />
                        </div>
                        <div>
                            <h4 class="text-[#8B4513] text-s font-bold text-left mb-0">Password</h4>
                            <input type="password"
                                class="w-full py-2 px-3 border-2 border-[#d4c19c] rounded-md text-sm bg-white/90 text-[#654321] placeholder-gray-400"
                                placeholder="Choose a password" v-model="playerPassword" />
                        </div>
                        <div>
                            <h4 class="text-[#8B4513] text-s font-bold text-left mb-0">Confirm Password</h4>
                            <input type="password"
                                class="w-full py-2 px-3 border-2 border-[#d4c19c] rounded-md text-sm bg-white/90 text-[#654321] placeholder-gray-400"
                                placeholder="Confirm your password" v-model="confirmPassword" />
                        </div>
                    </div>

                    <!-- Vertical divider -->
                    <div class="w-px h-[80%] bg-[#d4c19c] mx-4 rounded"></div>

                    <!-- Character preview -->
                    <div
                        class="w-32 h-32 bg-white rounded-lg border-2 border-[#d4c19c] flex items-center justify-center shadow-inner">
                        <img :src="characterUnknownImagePath" class="w-24 h-24 object-contain"
                            @error="handleImageError" />
                    </div>
                </div>
                <div>
                    <router-link 
                    to="/login" 
                    class="text-blue-600 hover:underline"
                    >
                    Already have an account? Login
                    </router-link>
                </div>        

                <!-- Register button -->
                <button
                    @click="register"
                    class="bg-blue-600 text-white border-none rounded-md py-2.5 px-4 text-base font-bold cursor-pointer transition-colors duration-300 w-full hover:bg-blue-700">
                    Register
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const playerName = ref('')
const playerEmail = ref('')
const playerPassword = ref('')
const confirmPassword = ref('')
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
const characterUnknownImagePath = computed(() => {
    return new URL(`../assets/characters/character_unknown.png`, import.meta.url).href
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

const register = () => {
    if (!playerName.value.trim()) {
        alert('Please enter a username!')
        return
    }
    if (!playerEmail.value.trim()) {
        alert('Please enter your email!')
        return
    }
    if (!playerPassword.value) {
        alert('Please enter a password!')
        return
    }
    if (playerPassword.value !== confirmPassword.value) {
        alert('Passwords do not match!')
        return
    }
    
    // Here you would typically make an API call to register the user
    // For now, we'll just redirect to the game page
    router.push({
        path: '/game',
        query: {
            name: encodeURIComponent(playerName.value),
            lang: selectedLanguage.value,
            character: `${selectedColor.value}_${selectedMouth.value}_${selectedEyes.value}`
        }
    })
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

.register-page {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    background-image: url('../assets/skraw_background_1920x1080.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    font-family: 'Comic Neue', sans-serif;
}
</style>