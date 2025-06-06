<template>
    <div class="home-page">
        <!-- Main content wrapper -->
        <div class="flex-1 flex flex-col items-center px-4 py-4">
            <router-link to="/">
            <img src="../assets/skrawio_logo_transparant3.png" alt="Skraw.io Logo"
                class="max-w-[280px] sm:max-w-[200px] h-auto block mt-3 mb-4 mx-auto" />
            </router-link>

            <!-- 404 Error interface blok -->
            <div
                class="bg-[#f5ecc8bf] rounded-sm p-4 sm:p-6 w-full max-w-[420px] min-h-[300px] shadow-[0_4px_20px_rgba(0,0,0,0.3)] mb-4 flex flex-col gap-4 items-center text-center">
                
                <!-- 404 Error Message -->
                <h2 class="text-[#8B4513] text-lg sm:text-xl font-bold mb-2">Page Not Found</h2>
                <p class="text-[#654321] text-sm sm:text-base mb-4 px-2">
                    Oops! The page you're looking for seems to have vanished into thin air, just like a drawing that got erased!
                </p>

                <!-- 404 character -->
                <div class="bg-[#f5ecc8d9] shadow-[0_2px_10px_rgba(0,0,0,0.2)] p-3 sm:p-4 rounded-sm mb-4">
                    <div class="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-lg border-2 border-[#d4c19c] flex items-center justify-center shadow-inner">
                        <img src="../assets/extracharacters/character_404.png" alt="404 Character" class="w-16 h-16 sm:w-24 sm:h-24 object-contain" />
                    </div>
                </div>

                <p class="text-[#654321] text-xs sm:text-sm mb-4 px-2">
                    Don't worry though! You can always go back to the home page and start a new drawing adventure.
                </p>

                <!-- Back to home button -->
                <router-link to="/" 
                    class="bg-green-600 text-white border-none rounded-md py-2.5 px-4 sm:px-6 text-sm sm:text-base font-bold cursor-pointer transition-colors duration-300 hover:bg-green-700 no-underline w-full sm:w-auto text-center">
                    Back to Home
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
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