<template>
  <header class="navbar">
    <div class="logo">
      <router-link to="/">TorioAudi</router-link>
    </div>

    <nav class="nav-links" :class="{ open: menuAberto }">
      <!-- Usuário NÃO logado -->
      <template v-if="!usuarioLogado">
        <router-link to="/login" @click="fecharMenu">Entrar</router-link>
        <router-link to="/cadastro" @click="fecharMenu">Cadastre-se</router-link>
      </template>

      <!-- Usuário logado -->
      <template v-else>
        <router-link to="/equipamentos" @click="fecharMenu">
          Meus Equipamentos
        </router-link>
        <router-link to="/agendamento" @click="fecharMenu">
          Agendamentos
        </router-link>

        <!-- Perfil com Dropdown -->
        <div class="perfil-container" @click="toggleDropdown">
          <img src="@/assets/perfilfrutiger.jpg" alt="Perfil" width="35" height="35" style="border-radius: 50%; cursor: pointer;"/>
          <div v-if="dropdownAberto" class="dropdown-menu">
            <router-link to="/perfil" @click="fecharDropdown">Editar Perfil</router-link>
            <button @click="logout">Sair</button>
          </div>
        </div>
      </template>
    </nav>

    <button class="menu-btn" @click="menuAberto = !menuAberto">
      ☰
    </button>
  </header>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      menuAberto: false,
      usuarioLogado: true, // controle de login
      dropdownAberto: false, // controla o menu do perfil
    };
  },
  methods: {
    fecharMenu() {
      this.menuAberto = false;
    },
    toggleDropdown() {
      this.dropdownAberto = !this.dropdownAberto;
    },
    fecharDropdown() {
      this.dropdownAberto = false;
    },
    logout() {
      this.usuarioLogado = false;
      this.dropdownAberto = false;
      localStorage.removeItem("token"); // limpa sessão
      this.$router.push("/");
    },
  },
  mounted() {
    const token = localStorage.getItem("token");
    if (token) {
      this.usuarioLogado = true;
    }
  },
};
</script>

<style scoped>
/* Navbar container */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #353535;
  padding: 1rem 2rem;
  color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0px 0px 8px black;
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
  display: flex;
  gap: 1.5rem;
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

</style>