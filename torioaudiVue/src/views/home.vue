<template>
  <div class="home">
    <div>
      <h1>Sistema de Agendamento</h1>
      <p>Reserve auditórios, laboratórios e salas de forma prática e rápida.</p>
    </div>


    <section class="ambientes">
      <h2>Ambientes disponíveis</h2>
      <div class="cards">
        <CardAmbiente titulo="Auditório" descricao="Ideal para palestras e grandes eventos." />
        <CardAmbiente titulo="Laboratório de Informática" descricao="Espaço equipado com computadores." />
        <CardAmbiente titulo="Sala de Reuniões" descricao="Perfeita para encontros menores e workshops." />
      </div>
    </section>


    <section class="cta">
      <router-link to="/agendamento" class="btn">Agende seu espaço agora</router-link>
    </section>
  </div>
</template>

<script>
import CardAmbiente from "@/components/cardAmbiente.vue";

export default {
  name: "Home",
  components: { CardAmbiente },
};
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem; 
}

/* Seção de ambientes */
.ambientes {
  padding: 3rem 2rem;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 2rem;
}

.cta {
  padding: 2rem;
}

.btn {
  background: #4caf50;
  color: white;
  padding: 1rem 2rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 1.2rem;
  transition: background 0.3s;
}

.btn:hover {
  background: #43a047;
}
</style>
