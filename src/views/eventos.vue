<template>
  <div class="container">
    <h1>Eventos Cadastrados</h1>
    <div class="filtros">
      <input v-model="busca" type="text" placeholder="Buscar por título ou descrição..." class="input-busca" />
      <select v-model="salaSelecionada" class="select-busca">
        <option value="">Todas as salas</option>
        <option v-for="sala in salas" :key="sala.cod_sala" :value="sala.cod_sala">{{ sala.nome_sala }}</option>
      </select>
    </div>
    <div v-if="carregando" class="loading">Carregando eventos...</div>
    <div v-else>
      <div v-if="eventosFiltrados.length === 0" class="no-results">Nenhum evento encontrado.</div>
      <div class="eventos-list">
        <card-evento
          v-for="evento in eventosFiltrados"
          :key="evento.cod_evento"
          :dados-evento="mapEvento(evento)"
          :evento-id="evento.cod_evento"
          @excluir="excluirEvento"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CardEvento from '@/components/cardEvento.vue';
import api from '@/services/api';
import '../assets/componentes.css'

export default {
  name: 'Eventos',
  components: { CardEvento },
  data() {
    return {
      eventos: [],
      salas: [],
      busca: '',
      salaSelecionada: '',
      carregando: false
    };
  },
  computed: {
    eventosFiltrados() {
      let lista = this.eventos;
      if (this.salaSelecionada) {
        lista = lista.filter(e => e.sala_cod_sala === this.salaSelecionada);
      }
      if (this.busca.trim()) {
        const termo = this.busca.toLowerCase();
        lista = lista.filter(e =>
          (e.nome_evento && e.nome_evento.toLowerCase().includes(termo)) ||
          (e.descricao_evento && e.descricao_evento.toLowerCase().includes(termo))
        );
      }
      return lista;
    }
  },
  methods: {
    async carregarEventos() {
      this.carregando = true;
      try {
        const res = await api.get('/eventos');
        this.eventos = Array.isArray(res.data.data) ? res.data.data : res.data;
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
        this.eventos = [];
      } finally {
        this.carregando = false;
      }
    },
    async carregarSalas() {
      try {
        const res = await api.get('/salas');
        this.salas = Array.isArray(res.data.data) ? res.data.data : res.data;
      } catch (error) {
        console.error('Erro ao carregar salas:', error);
        this.salas = [];
      }
    },
    async excluirEvento(id) {
      if (confirm('Tem certeza que deseja excluir este evento?')) {
        try {
          await api.delete(`/eventos/${id}`);
          await this.carregarEventos();
          alert('Evento excluído com sucesso!');
        } catch (error) {
          alert('Erro ao excluir evento.');
        }
      }
    },
    mapEvento(evento) {
      return {
        nomeEvento: evento.nome_evento,
        dataInicio: evento.evento_inicio,
        dataFim: evento.evento_fim,
        local: evento.sala_nome || evento.sala_cod_sala,
        descricao: evento.descricao_evento
      };
    }
  },
  mounted() {
    this.carregarEventos();
    this.carregarSalas();
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #f0f0f0;
  margin-bottom: 2rem;
}

.filtros {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-bar {
  flex: 1;
  padding: 0.8rem;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
  background-color: #2b2b2b;
  color: #f0f0f0;
  font-size: 1.1rem;
}

.select-busca {
    margin: 0;
    padding: 100px;
    width: 100%;
    padding: 0.8rem;
    border-radius: 8px;
    background-color: #2b2b2b;
    color: #f0f0f0;
    font-size: 1.1rem;
}

/* Hover e Focus iguais ao input */
.select-busca:hover,
.select-busca:focus {
    transform: brightness(1.5);
    outline: none;
    transition: 100ms;
}


.loading {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 2rem;
}

.no-results {
  text-align: center;
  color: #999;
  padding: 2rem;
}

.eventos-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
