<template>
  <div class="card">
    <div class="card-header">
      <h3>{{ nomeEvento }}</h3>
      <button @click="confirmarExclusao" class="btn-excluir" title="Excluir reserva">
        🗑️
      </button>
    </div>
    <p><strong>Descrição: </strong>{{ descricao }}</p>
    <p><strong>Início: </strong> {{ dataInicio }}</p>
    <p><strong>Fim: </strong> {{ dataFim }}</p>
    <p><strong>Local: </strong> {{ local }}</p>
  </div>
</template>

<script>
export default {
  name: "CardEvento",
  props: {
    dadosEvento: {
      type: Object,
      required: true,
      default: () => ({
        nomeEvento: '',
        dataInicio: '',
        dataFim: '',
        local: '',
        descricao: ''
      })
    },
    eventoId: {
      type: [Number, String],
      required: true
    }
  },
  computed: {
    nomeEvento() {
      return this.dadosEvento.nomeEvento;
    },
    dataInicio() {
      return this.dadosEvento.dataInicio;
    },
    dataFim() {
      return this.dadosEvento.dataFim;
    },
    local() {
      return this.dadosEvento.local;
    },
    descricao() {
      return this.dadosEvento.descricao;
    }
  },
  methods: {
    confirmarExclusao() {
      if (confirm(`Tem certeza que deseja excluir a reserva "${this.nomeEvento}"?`)) {
        this.$emit('excluir', this.eventoId);
      }
    }
  },
};
</script>

<style scoped>
.card {
  background-color: #222222;
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  text-align: start;
}
h3 {
  margin-bottom: 0.5rem;
}
.btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background: #4caf50;
  color: white;
  border-radius: 6px;
  text-decoration: none;
}
.btn:hover {
  background: #43a047;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.btn-excluir {
  background: none;
  border: none;
  background-color: dc3545;
  color: #dc3545;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.btn-excluir:hover {
  background-color: rgba(220, 53, 69, 0.1);
}
</style>
