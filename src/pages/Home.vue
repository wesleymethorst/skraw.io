<template>
  <div class="home">
    <img src="../assets/skrawio_logo_transparant3.png" alt="Skraw.io Logo" class="logo" />
    
    <!-- Game interface blok -->
    <div class="game-interface">
      <!-- Name input and language selector row -->
      <div class="input-row">
             <input 
          type="text" 
          class="name-input" 
          placeholder="Enter your name" 
          v-model="playerName" 
          @keyup.enter="playGame"
        />
        <select class="language-select">
          <option value="dutch">Dutch</option>
          <option value="english">English</option>
          <option value="german">German</option>
          <option value="french">French</option>
        </select>
      </div>
      
      <!-- Avatar selector -->
      <div class="avatar-selector">
        
      </div>
      
      <!-- Play buttons -->
      <a 
        :href="`/game?name=${encodeURIComponent(playerName)}&lang=${selectedLanguage}`" 
        class="play-button"
        @click.prevent="playGame"
      > 
        Play!
      </a>
      <button class="private-room-button">Create Private Room</button>
    </div>
    
    <!-- Footer secties -->
    <div class="footer-sections">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About</h3>
          <p><strong>skraw.io</strong> is a free online multiplayer drawing and guessing game.</p>
          <p>Have fun!</p>
        </div>
        
        <div class="footer-section">
          <h3>News</h3>
          <h4>Fresh paint</h4>
          <p>Hello! Welcome to the new skraw.io!</p>
        </div>
        
        <div class="footer-section">
          <h3>How to play</h3>
          <p>Draw your word and let others guess it!</p>
        </div>
        
        <!-- Footer links -->
        <div class="footer-links">
          <a href="#" class="footer-link">Contact</a>
          <a href="#" class="footer-link">Terms of Service</a>
          <a href="#" class="footer-link">Credits</a>
          <a href="#" class="footer-link">Privacy Settings</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const playerName = ref('')
const selectedLanguage = ref('english')

const playGame = () => {
  if (playerName.value.trim()) {
    router.push({
      path: '/game',
      query: {
        name: encodeURIComponent(playerName.value),
        lang: selectedLanguage.value
      }
    })
  } else {
    alert('Please enter your name before playing!')
  }
}

onMounted(() => {
  document.title = 'Skraw - Free multiplayer sketching, drawing & guessing game'
})
</script>

<style scoped>
.home {
  width: 100vw;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  max-width: 400px;
  height: auto;
  display: block;
  margin: 40px auto 40px auto;
}

.game-interface {
  background-color: #f5ecc8bf;
  border-radius: 3px;
  padding: 30px;
  width: 500px;
  min-height: 320px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-row {
  display: flex;
  gap: 10px;
}

.name-input {
  flex: 2;
  padding: 12px 16px;
  border: 2px solid #d4c19c;
  border-radius: 6px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #654321;
  font-family: inherit;
}

.name-input::placeholder {
  color: #999;
}

.language-select {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #d4c19c;
  border-radius: 6px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  color: #654321;
  font-family: inherit;
  cursor: pointer;
}

.avatar-selector {
  background-color: #f5ecc8d9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 30px 0;
  padding: 20px;
  border-radius: 3px;
  height: 150px;
}

.play-button {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 16px 32px;
  font-size: 24px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: inherit;
}

.play-button:hover {
  background-color: #218838;
}

.private-room-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 12px 24px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-family: inherit;
}

.private-room-button:hover {
  background-color: #0056b3;
}

.footer-sections {
  width: 100vw;
  background-color: #f5ecc8bf;
  padding: 30px 0 15px 0;
  margin-top: auto;
  display: flex;
  justify-content: center;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 30px;
  max-width: 1200px;
  width: 100%;
  padding: 0 30px;
}

.footer-section {
  background-color: #f5ecc8d9;
  border-radius: 3px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  min-height: 120px;
}

.footer-section h3 {
  color: #8B4513;
  font-size: 20px;
  margin-bottom: 12px;
  font-weight: 900;
  text-align: center;
}

.footer-section h4 {
  color: #A0522D;
  font-size: 15px;
  margin-bottom: 8px;
}

.footer-section p {
  color: #654321;
  line-height: 1.5;
  margin-bottom: 8px;
  font-size: 13px;
}

.footer-links {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  gap: 40px;
}

.footer-link {
  color: #654321;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #8B4513;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .footer-sections {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>