<template>
  <div id="app">
    <Navbar />   <!-- Chamando a navbar -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import Navbar from './components/navbar.vue';   
import './assets/base.css';

export default {
  name: "App",
  components: { Navbar },
};
</script>