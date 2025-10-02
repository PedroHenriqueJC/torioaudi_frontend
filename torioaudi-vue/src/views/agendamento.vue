<template>
  <div class="agendamento">
    <!-- A Navbar já está no App.vue, não precisa repetir aqui -->
    
    <h1>Agendamento</h1>
    <p>Selecione uma data no calendário e preencha os dados abaixo:</p>

    <div class="content">
      <calendario />
    </div>
  </div>
</template>

<script>
import Calendario from "@/components/calendario.vue";

export default {
  name: "Agendamento",
  components: { Calendario },
  data() {
    return {
      form: {
        nome: "",
        email: "",
        hora: "",
        data: "",
      },
    };
  },
  methods: {
    handleDataSelecionada(data) {
      this.form.data = data;
    },
    enviarAgendamento() {
      console.log("Agendamento enviado:", this.form);
      alert(`Agendamento confirmado para ${this.form.data} às ${this.form.hora}`);
      // Aqui você pode integrar com o backend depois
    },
  },
};
</script>

<style scoped>
.agendamento {
  padding: 2rem;
}

h1 {
  margin-bottom: 1rem;
}

.content {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.3s;
}

button:hover {
  background-color: #43a047;
}
</style>
