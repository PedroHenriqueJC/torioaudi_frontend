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
        <router-link to="/perfil" @click="fecharMenu">
            <img src="@/assets/perfil.jpeg" alt="" width="30px" height="30px" style="border-radius: 50%;">
        </router-link>
        <button class="logout-btn" @click="logout">Sair</button>
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
      usuarioLogado: true, // aqui você controlaria o estado
    };
  },
  methods: {
    fecharMenu() {
      this.menuAberto = false;
    },
    logout() {
      this.usuarioLogado = false;
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


.logo a {
  color: white;
  font-size: 1.3rem;
  font-weight: bold;
  text-decoration: none;
}

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

.menu-btn {
  display: none;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

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
</style>

