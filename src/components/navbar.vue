<template>
  <header class="navbar">
    <div class="logo">
      <router-link to="/">TorioAudi</router-link>
    </div>

    <nav class="nav-links" :class="{ open: menuAberto }">
      <div class="links">
        <!-- Usuário NÃO logado -->
        <template v-if="!usuarioLogado">
          <router-link to="/login" @click="fecharMenu">Entrar</router-link>
          <router-link to="/cadastro" @click="fecharMenu">Cadastre-se</router-link>
        </template>

        <!-- Usuário logado -->
        <template v-else>
          <router-link to="/agendamento" @click="fecharMenu">Agendamentos</router-link>
          <router-link to="/eventos" @click="fecharMenu"> Eventos agendados </router-link>
          
          <!-- Apenas para admins -->
          <template v-if="isAdmin">
            <router-link to="/equipamentos" @click="fecharMenu">Meus Equipamentos</router-link>
            <router-link to="/salas" @click="fecharMenu">Minhas Salas</router-link>
            <router-link to="/usuarios" @click="fecharMenu">Usuários</router-link>
          </template>
          
          <router-link to="/carrinho" @click="fecharMenu" class="cart-link">
            🛒 Carrinho
            <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
          </router-link>

          <!-- Perfil com Dropdown -->
          <div class="perfil-container" @click="toggleDropdown">
            <div class="user-info">
              <img src="/src/assets/perfilfrutiger.jpg" alt="Perfil" width="35" height="35" />
            </div>
            <div v-if="dropdownAberto" class="dropdown-menu">
              <router-link to="/perfil" @click="fecharDropdown">Editar Perfil</router-link>
              <button @click="logout">Sair</button>
            </div>
          </div>
        </template>
      </div>
    </nav>

    <button class="menu-btn" @click="menuAberto = !menuAberto">
      ☰
    </button>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import api from '../services/api'

// TUDO ANTES DOS HOOKS - SEM ASYNC
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const menuAberto = ref(false)
const dropdownAberto = ref(false)

// Cart count computed
const cartCount = computed(() => cartStore.cartCount)

// Computed properties
const usuarioLogado = computed(() => {
  console.log('Computed usuarioLogado:', authStore.isAuthenticated)
  return authStore.isAuthenticated
})

const userData = computed(() => authStore.user)

const isAdmin = computed(() => {
  const user = authStore.user
  return user?.role_usuario === 1
})

// Methods
const fecharMenu = () => {
  menuAberto.value = false
}

const toggleDropdown = () => {
  dropdownAberto.value = !dropdownAberto.value
}

const fecharDropdown = () => {
  dropdownAberto.value = false
  fecharMenu()
}

const logout = async () => {
  try {
    await api.post('/logout')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  } finally {
    authStore.logout()
    dropdownAberto.value = false
    router.push("/login")
  }
}

// Event listeners
const handleStorageChange = (event) => {
  console.log('Storage changed:', event.key)
  if (event.key === 'token' || event.key === 'user') {
    authStore.checkAuth()
  }
}

// Lifecycle hooks - SEM ASYNC
onMounted(() => {
  console.log('Navbar montado - estado auth:', authStore.isAuthenticated)
  console.log('User data:', authStore.userData)
  
  authStore.checkAuth()
  window.addEventListener('storage', handleStorageChange)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
})
</script>

<style scoped>
/* Navbar container */
.navbar {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  background-color: #0f7026;
  padding: 1rem 2rem;
  color: white;
  position: fixed;
  top: 0;
  z-index: 1000;
  box-shadow: 0px 0px 8px black;
}

img{
  border-radius: 50%; 
  cursor: pointer;
}

.links{
  display: flex;
  gap: 15px;
  margin-right: 10px;
  align-items: center;
}

/* Logo */
.logo a {
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  text-decoration: none;
}

/* Links */
.nav-links {
  display: flex; /* desktop */
}

/* mobile */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .nav-links.open {
    display: flex;
  }
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a.router-link-active {
  font-weight: bold;
  border-bottom: 2px solid white;
}

.nav-links a:hover {
  color: #e0e0e0;
}

/* Botão hamburguer */
.menu-btn {
  display: none;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

/* Responsividade */
@media (max-width: 768px) {
  .nav-links {
    position: absolute;
    top: 64px;
    right: 0;
    background-color: #353535;
    flex-direction: column;
    align-items: flex-start;
    width: 200px;
    padding: 1rem;
    gap: 1rem;
    display: none;
  }

  .nav-links.open {
    display: flex;
  }

  .menu-btn {
    display: block;
  }
}

.logout-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-weight: 500;
}
.logout-btn:hover {
  color: #e0e0e0;
}

.dropdown-menu {
  position: absolute;
  top: 40px;
  right: 0;
  background: #181818;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
  padding: 10px;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.dropdown-menu a,
.dropdown-menu button {
  text-align: left;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 14px;
  color: white;
}

.dropdown-menu a:hover,
.dropdown-menu button:hover {
  background: #383838;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.username {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.perfil-container {
  position: relative;
}

.cart-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
}

.cart-count {
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  position: absolute;
  top: -8px;
  right: -12px;
  min-width: 18px;
  text-align: center;
}
</style>