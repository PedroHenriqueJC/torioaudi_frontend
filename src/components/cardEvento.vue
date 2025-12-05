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
      return this.formatarDataHora(this.dadosEvento.dataInicio);
    },
    dataFim() {
      return this.formatarDataHora(this.dadosEvento.dataFim);
    },
    local() {
      return this.dadosEvento.local;
    },
    descricao() {
      return this.dadosEvento.descricao;
    }
  },
  methods: {
    formatarDataHora(dateStr) {
      if (!dateStr) return '';
      try {
        // Criar data a partir da string UTC
        const data = new Date(dateStr);
        if (isNaN(data.getTime())) {
          console.error('Data inválida:', dateStr);
          return 'Data inválida';
        }
        // Subtrair 3 horas para converter de GMT 0 para GMT -3
        data.setHours(data.getHours() - 3);
        // Formatar a data já convertida
        return new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(data);
      } catch (error) {
        console.error('Erro ao formatar data:', error);
        return 'Data inválida';
      }
    },
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
  background-color: red;
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
