<template>
  <div class="home">
    <div class="header">
      <h1>Sistema de Agendamento</h1>
      <p>Reserve auditórios, laboratórios e salas de forma prática e rápida.</p>
    </div>

    <section class="ambientes" v-if="!loading">
      <h2>Nossos Ambientes</h2>
      <div class="cards">
        <CardAmbiente 
          v-for="sala in salas" 
          :key="sala.cod_sala"
          :titulo="sala.nome_sala"
          :descricao="sala.descricao || 'Sem descrição disponível'"
        />
      </div>
    </section>

    <div v-else class="loading">
      <p>Carregando salas disponíveis...</p>
    </div>

    <section class="cta">
      <router-link to="/agendamento" class="botaoVerde">Agende seu espaço agora</router-link>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from "@/services/api.js"
import CardAmbiente from "@/components/cardAmbiente.vue"
import '../assets/componentes.css'

const salas = ref([])
const loading = ref(true)
const error = ref(null)

const fetchSalas = async () => {
  try {
    loading.value = true
    const response = await api.get('/salas')
    salas.value = response.data
  } catch (err) {
    console.error('Erro ao carregar salas:', err)
    error.value = 'Não foi possível carregar as salas disponíveis.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSalas()
})
</script>

<style scoped>
.home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.ambientes {
  margin: 2rem 0;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #f0f0f0;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #f0f0f0;
}

.cta {
  margin-top: 3rem;
  text-align: center;
}

/* Seção de ambientes */
.ambientes {
  padding: 3rem 2rem;
}

.botaoVerde:hover {
  filter: brightness(1.3);
  transition: 0.3s;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 2rem;
}

.cta {
  padding: 2rem;
}

</style>
