import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Game from '../pages/Game.vue'
import Login from '../pages/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Skraw.io - Free multiplayer sketching, drawing & guessing game'
    }
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
    meta: {
      title: 'Skraw.io - Game Room'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Skraw.io - Login'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Skraw.io - Register a new account'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: {
      title: 'Skraw.io - Contact'
    }
  },
  {
    path: '/terms',
    name: 'Terms',
    component: NotFound,
    meta: {
      title: 'Skraw.io - Terms of Service'
    }
  },
  {
    path: '/credits',
    name: 'Credits',
    component: NotFound,
    meta: {
      title: 'Skraw.io - Credits'
    }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: NotFound,
    meta: {
      title: 'Skraw.io - Privacy Settings'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Skraw.io - Page Not Found'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Skraw.io - Free multiplayer sketching, drawing & guessing game'
  next()
})

export default router 