<template>
  <div class="home-page">
      <!-- Main content wrapper -->
      <div class="flex-1 flex flex-col items-center">
          <router-link to="/">
          <img src="../assets/skrawio_logo_transparant3.png" alt="Skraw.io Logo"
              class="max-w-[280px] h-auto block mt-3 mb-4 mx-auto" />
          </router-link>

          <!-- Contact interface blok -->
          <div
              class="bg-[#f5ecc8bf] rounded-sm p-6 w-[600px] min-h-[400px] shadow-[0_4px_20px_rgba(0,0,0,0.3)] mb-4 flex flex-col gap-4">
              
              <h1 class="text-[#8B4513] text-2xl font-bold text-center mb-2">Contact Our Team</h1>
              <p class="text-[#8B4513] text-center mb-4">Meet the amazing team behind Skraw.io!</p>

              <!-- Team members grid -->
              <div class="grid grid-cols-1 gap-4">
                  <!-- Team Member 1 -->
                  <div class="bg-[#f5ecc8d9] shadow-[0_2px_10px_rgba(0,0,0,0.2)] p-4 rounded-sm">
                      <div class="flex items-center justify-between">
                          <div class="flex-grow">
                              <h3 class="text-[#8B4513] text-lg font-bold mb-1">Adil Yahia</h3>
                              <p class="text-[#654321] text-sm mb-2">Software Development & Socket Implementation</p>
                          </div>
                          <div class="flex gap-2">
                              <a href="https://github.com/570992" target="_blank" 
                                 class="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2">
                                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                  </svg>
                                  GitHub
                              </a>
                              <a href="mailto:info@fontys.nl" 
                                 class="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                  </svg>
                                  Email
                              </a>
                          </div>
                      </div>
                  </div>

                  <!-- Team Member 2 -->
                  <div class="bg-[#f5ecc8d9] shadow-[0_2px_10px_rgba(0,0,0,0.2)] p-4 rounded-sm">
                      <div class="flex items-center justify-between">
                          <div class="flex-grow">
                              <h3 class="text-[#8B4513] text-lg font-bold mb-1">Daniel Mulkens</h3>
                              <p class="text-[#654321] text-sm mb-2">Game Development & Canvas Tools Integration</p>
                          </div>
                          <div class="flex gap-2">
                              <a href="https://github.com/danielmulkens" target="_blank" 
                                 class="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2">
                                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                  </svg>
                                  GitHub
                              </a>
                              <a href="mailto:info@fontys.nl" 
                                 class="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                  </svg>
                                  Email
                              </a>
                          </div>
                      </div>
                  </div>

                  <!-- Team Member 3 -->
                  <div class="bg-[#f5ecc8d9] shadow-[0_2px_10px_rgba(0,0,0,0.2)] p-4 rounded-sm">
                      <div class="flex items-center justify-between">
                          <div class="flex-grow">
                              <h3 class="text-[#8B4513] text-lg font-bold mb-1">Kamiel Lankveld</h3>
                              <p class="text-[#654321] text-sm mb-2">Software Development & Frontend Support</p>
                          </div>
                          <div class="flex gap-2">
                              <a href="https://github.com/kamiel024" target="_blank" 
                                 class="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2">
                                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                  </svg>
                                  GitHub
                              </a>
                              <a href="mailto:info@fontys.nl" 
                                 class="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                  </svg>
                                  Email
                              </a>
                          </div>
                      </div>
                  </div>

                  <!-- Team Member 4 -->
                  <div class="bg-[#f5ecc8d9] shadow-[0_2px_10px_rgba(0,0,0,0.2)] p-4 rounded-sm">
                      <div class="flex items-center justify-between">
                          <div class="flex-grow">
                              <h3 class="text-[#8B4513] text-lg font-bold mb-1">Rayan Fikri</h3>
                              <p class="text-[#654321] text-sm mb-2">Media & UI/UX Research and Design</p>
                          </div>
                          <div class="flex gap-2">
                              <a href="https://github.com/rayankib" target="_blank" 
                                 class="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2">
                                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                  </svg>
                                  GitHub
                              </a>
                              <a href="mailto:info@fontys.nl" 
                                 class="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                  </svg>
                                  Email
                              </a>
                          </div>
                      </div>
                  </div>

                  <!-- Team Member 5 -->
                  <div class="bg-[#f5ecc8d9] shadow-[0_2px_10px_rgba(0,0,0,0.2)] p-4 rounded-sm">
                      <div class="flex items-center justify-between">
                          <div class="flex-grow">
                              <h3 class="text-[#8B4513] text-lg font-bold mb-1">Wesley Methorst</h3>
                              <p class="text-[#654321] text-sm mb-2">Media & Frontend Development</p>
                          </div>
                          <div class="flex gap-2">
                              <a href="https://github.com/wesleymethorst" target="_blank" 
                                 class="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2">
                                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                  </svg>
                                  GitHub
                              </a>
                              <a href="mailto:wesley.methorst@gmail.com" 
                                 class="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                  </svg>
                                  Email
                              </a>
                          </div>
                      </div>
                  </div>
              </div>

              <!-- Back to home button -->
              <div class="mt-4">
                  <router-link to="/" 
                      class="bg-green-600 text-white border-none rounded-md py-2.5 px-4 text-base font-bold cursor-pointer transition-colors duration-300 w-full block text-center hover:bg-green-700">
                      Back to Home
                  </router-link>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');

.home-page {
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