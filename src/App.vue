<template>
  <div id="app">
    <Navbar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/navbar.vue'
import './assets/base.css'
</script>

<style>
main {
  margin-top: 70px; /* Ajuste conforme a altura da Navbar */
}
</style>