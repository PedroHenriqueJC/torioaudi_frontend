<template>
  <header class="navbar">
    <div class="logo">
      <router-link to="/">TorioAudi</router-link>
    </div>

    <nav class="nav-links" :class="{ open: menuAberto }">
      <div class="links">
        <!-- Usuário NÃO logado -->
        <template v-if="!usuarioLogado">
          <router-link to="/login" class="link-btn" @click="fecharMenu">Entrar</router-link>
          <router-link to="/cadastro" class="link-btn" @click="fecharMenu">Cadastre-se</router-link>
        </template>

        <!-- Usuário logado -->
        <template v-else>
          <router-link to="/agendamento" class="link-btn" @click="fecharMenu">Agendamentos</router-link>
          <router-link to="/eventos" class="link-btn" @click="fecharMenu"> Eventos agendados </router-link>
          
          <!-- Apenas para admins -->
          <template v-if="isAdmin">
            <router-link to="/equipamentos" class="link-btn" @click="fecharMenu">Meus Equipamentos</router-link>
            <router-link to="/salas" class="link-btn" @click="fecharMenu">Minhas Salas</router-link>
            <router-link to="/usuarios" class="link-btn" @click="fecharMenu">Usuários</router-link>
          </template>
          
          <router-link to="/carrinho" @click="fecharMenu" class="cart-link">
            🛒 Carrinho
            <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
          </router-link>
        </template>
      </div>
    </nav>

    <div class="user-menu-container">
      <div v-if="usuarioLogado" class="perfil-container">
        <button class="perfil-btn" @click.stop="toggleDropdown">
          <img src="/src/assets/white-user-member-guest-icon-png-image-701751695037005zdurfaim0y-removebg-preview.png" alt="Perfil" width="35" height="35" />
          <span class="user-name">{{ usuarioNome }}</span>
        </button>
        <div v-if="dropdownAberto" class="dropdown-menu" @click.stop>
          <div class="dropdown-divider"></div>
          <router-link to="/perfil" class="dropdown-item" @click="fecharDropdown">
            Editar Perfil
          </router-link>
          <button @click="logout" class="dropdown-item logout-item">
            Sair da Conta
          </button>
        </div>
      </div>
      <button class="menu-btn" @click.stop="menuAberto = !menuAberto">
        ☰
      </button>
    </div>
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

const usuarioNome = computed(() => {
  const nome = authStore.user?.nome_usuario || authStore.user?.nome || 'Usuário'
  return nome.split(' ')[0] // Exibir apenas o primeiro nome
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
  document.addEventListener('click', handleClickFora)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
  document.removeEventListener('click', handleClickFora)
})

// Fechar dropdown ao clicar fora
const handleClickFora = (event) => {
  const perfil = document.querySelector('.perfil-container')
  if (perfil && !perfil.contains(event.target)) {
    dropdownAberto.value = false
  }
}
</script>

<style scoped>
/* Navbar container */
/* NAVBAR PRINCIPAL */
.navbar {
  height: 64px;
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

/* Imagem do avatar */
img {
  border-radius: 50%;
  cursor: pointer;
}

/* BOTÃO PERFIL */
.perfil-btn {
  height: 100%;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-weight: 500;
  padding: 5px 10px;
  transition: background-color 0.2s;
}

.perfil-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Nome do usuário */
.user-name {
  font-size: 0.95rem;
  white-space: nowrap;
  display: none;
}

@media (min-width: 600px) {
  .user-name {
    display: inline;
  }
}

/* Esconde o perfil mobile em desktop */
@media (min-width: 1069px) {
  .mobile-only {
    display: none;
  }
}

/* Esconde o perfil desktop em mobile */
@media (max-width: 1068px) {
  .desktop-only {
    display: none;
  }
}

/* CONTAINER DE LINKS */
.links {
  display: flex;
}

/* LOGO */
.logo a {
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  text-decoration: none;
}

/* LINKS NORMAIS */
.nav-links {
  height: 64px;
  display: flex; /* desktop */
  margin-left: auto;  
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  padding: 5px 10px;
}

.nav-links a.router-link-active {
  font-weight: bold;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* BOTÃO HAMBURGUER */
.menu-btn {
  display: none;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

/* --- ESTILOS MOBILE --- */
@media (max-width: 1068px) {
  /* Menu fechado no mobile */
  .nav-links {
    position: absolute;
    top: 64px;
    right: 0;
    background-color: #353535;
    height: 400px;
    flex-direction: column;
    align-items: flex-end; /* Alinha o conteúdo à direita */
    width: auto;
    min-width: 250px;
    padding: 1rem;
    gap: 0.5rem;
    display: none; /* Esconde por padrão */
    box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.2);
    border-radius: 0 0 0 8px;
  }

  /* Menu aberto */
  .nav-links.open {
    display: flex;
  }

  /* Mostrar botão hamburguer e perfil lado a lado */
  .menu-btn {
    display: block;
    order: 2; /* Coloca o botão hambúrguer à direita */
  }

  /* Posiciona o perfil ao lado do menu hambúrguer */
  .perfil-container {
    order: 1;
    margin-right: 1rem;
  }

  /* Container para agrupar perfil e menu */
  .user-menu-container {
    display: flex;
    align-items: center;
    margin-left: auto;
  }
}

/* DROPDOWN */
.dropdown-menu {
  position: absolute;
  top: 57px;
  right: 0;
  background: #353535; /* Cor de fundo cinza mais clara */
  border: 1px solid #444;
  border-radius: 8px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
  padding: 8px 0; /* Aumentei o padding para melhor espaçamento */
  min-width: 220px; /* Largura um pouco maior */
  display: flex;
  flex-direction: column;
  z-index: 1001;
  animation: slideDown 0.2s ease-out;
  overflow: hidden; /* Garante que o border-radius seja respeitado */
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-header {
  padding: 12px 16px;
  border-bottom: 1px solid #444;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-user-name {
  color: #f0f0f0;
  font-weight: 600;
  font-size: 0.95rem;
}

.dropdown-divider {
  height: 1px;
  background-color: #444;
  margin: 4px 0;
}

/* ITEM GENÉRICO - usado para link e botão */
.dropdown-item {
  text-align: left;
  background: transparent; /* Fundo transparente para mostrar o cinza do container */
  border: none;
  padding: 12px 20px; /* Aumentei o padding para melhor toque */
  cursor: pointer;
  font-size: 0.95rem;
  color: #f0f0f0;
  transition: background-color 0.2s;
  text-decoration: none;
  display: block;
  width: 100%;
  box-sizing: border-box; /* Garante que o padding não afete a largura */
}

.dropdown-item:hover {
  background-color: #2a2a2a;
  color: #fff;
}

/* ITEM DE LOGOUT (modificador) */
.logout-item {
  color: #ff6b6b;
  border-top: 1px solid #444;
  margin-top: 4px;
  padding: 12px 20px; /* Ajuste para manter consistência */
  background: transparent; /* Garante que o fundo seja transparente */
}

.logout-item:hover {
  background-color: rgba(255, 107, 107, 0.1);
  color: #ff8787;
}

.perfil-container {
  height: 64px;
  position: relative;
  display: flex;
  align-items: center;
}

/* CARRINHO */
.cart-link {
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
}

.link-btn{
    height: 100%;
  position: relative;
  display: flex;
  align-items: center;
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

/* Mobile: make links stack vertically and occupy full width for easier tapping */
@media (max-width: 1068px) {
  .nav-links .links {
    display: flex;
    flex-direction: column;
    align-items: flex-end; /* Alinha itens à direita */
    width: 100%;
    gap: 0.5rem;
  }

  .nav-links .links > * {
    display: block;
    width: 100%;
    text-align: right; /* Alinha texto à direita */
  }

  .nav-links .links a,
  .nav-links .links .cart-link,
  .nav-links .links .link-btn {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    margin: 0;
    text-align: left;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .nav-links .links a:hover,
  .nav-links .links .cart-link:hover,
  .nav-links .links .link-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  /* Remover divisor no mobile */
  .perfil-container {
    border-left: none;
    padding-left: 0;
  }
}
</style>