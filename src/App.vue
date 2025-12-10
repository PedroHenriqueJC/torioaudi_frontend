<template>
  <div id="app">
    <Navbar />
    <main class="conteudo">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/navbar.vue'
import Footer from './components/footer.vue'
import './assets/base.css'
</script>

<style>
/* Layout: make app full height with footer at bottom when content is short */
#app {
  display: flex;
  flex-direction: column;
}

.conteudo{
  flex: 1;
}

main {
  margin-top: 70px; /* Ajuste conforme a altura da Navbar */
  flex: 1; /* make main grow so footer sits at bottom when content is short */
}
</style>
