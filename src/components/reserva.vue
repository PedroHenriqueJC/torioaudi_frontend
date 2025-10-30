<style>
.card {
  height: 70%;
  display: flex;
  flex-direction: column;
  background-color: #1f1f1f;
  padding: 1rem;
  border-radius: 8px;
  color: #f0f0f0;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  align-self: flex-start;
  color: #f0f0f0;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 1.1rem;
}

.form-group input, textarea, select {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
  background-color: #2b2b2b;
  color: #f0f0f0;
  font-size: 1.1rem;
}

.form-group input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #cacaca;
}

.mensagem {
  margin-top: 15px;
  color: white;
}

</style>

<template>
  <div class="card">
    <h2>Fazer Reserva</h2>
    <form @submit.prevent="fazerReserva">
      <div class="form-group">
        <label for="nome">Adicionar título:</label>
        <input type="text" v-model="tituloReserva" />
      </div>

      <div class="form-group">
        <label for="sala">Sala</label>
        <select id="sala" v-model="salaSelecionadaLocal" @change="emitSalaSelecionada">
          <option value=""></option>
          <option value="" disabled v-if="!salas || salas.length === 0">Nenhuma sala disponível</option>
          <option v-for="s in salas" :key="s.cod_sala" :value="s.cod_sala">{{ s.nome_sala }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="data">Data da Reserva</label>
        <input type="date" id="data" v-model="dataReservaLocal" required />
      </div>

      <div class="form-group">
        <label for="horaInicio">Hora de Início</label>
        <input type="time" id="horaInicio" v-model="horaInicioReserva" required />
      </div>

      <div class="form-group">
        <label for="horaFim">Hora de Fim</label>
        <input type="time" id="horaFim" v-model="horaFimReserva" required />
      </div>

      <div class="form-group">
        <label for="descricao">Descrição do evento:</label>
        <textarea id="descricao" rows="3" v-model="descricaoReserva"></textarea>
      </div>
      <div class="form-group">
        <button class="botaoPadrao">Fazer Reserva</button>
      </div>
    </form>
  </div>
</template>

<script>
import '@/assets/componentes.css';
import { useCartStore } from '@/stores/cart';

export default {
  name: 'Reserva',
  props: {
    dataReserva: {
      type: String,
      default: ''
    },
    salas: {
      type: Array,
      default: () => []
    },
    salaSelecionada: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cartStore: null,
      tituloReserva: '',
      descricaoReserva: '',
      horaInicioReserva: '',
      horaFimReserva: '',
      dataReservaLocal: this.dataReserva || '',
      salaSelecionadaLocal: this.salaSelecionada || ''
    };
  },
  watch: {
    dataReserva: {
      immediate: true,
      handler(novaData) {
        this.dataReservaLocal = novaData;
      }
    },
    salas: {
      immediate: true,
      handler(novasSalas) {
        if (Array.isArray(novasSalas) && novasSalas.length && !this.salaSelecionadaLocal) {
          this.salaSelecionadaLocal = novasSalas[0].cod_sala || '';
          // notify parent about default selection
          this.$emit('update:salaSelecionada', this.salaSelecionadaLocal);
        }
      }
    },
    salaSelecionada: {
      immediate: true,
      handler(novaSala) {
        // keep local copy in sync when parent changes
        this.salaSelecionadaLocal = novaSala || this.salaSelecionadaLocal;
      }
    }
  },
  created() {
    this.cartStore = useCartStore()
  },
  methods: {
    emitSalaSelecionada() {
      this.$emit('update:salaSelecionada', this.salaSelecionadaLocal);
    },
    fazerReserva() {
      if (!this.dataReservaLocal || !this.horaInicioReserva || !this.horaFimReserva || !this.salaSelecionadaLocal) {
        alert('Preencha todos os campos de data/hora e selecione uma sala!');
        return;
      }

      // Formata a data e hora para o formato ISO 8601 que o Laravel espera
      const formatDateTime = (date, time) => {
        const dateTime = new Date(`${date}T${time}`);
        return dateTime.toISOString(); // Retorna no formato "YYYY-MM-DDThh:mm:ss.sssZ"
      };

      const inicioISO = formatDateTime(this.dataReservaLocal, this.horaInicioReserva);
      const fimISO = formatDateTime(this.dataReservaLocal, this.horaFimReserva);

      console.log('Data início formatada:', inicioISO);
      console.log('Data fim formatada:', fimISO);

      // Get the selected sala object
      const sala = this.salas.find(s => s.cod_sala === this.salaSelecionadaLocal);

      // Add to cart instead of creating directly
      this.cartStore.addToCart({
        nome_evento: this.tituloReserva,
        descricao_evento: this.descricaoReserva,
        evento_inicio: inicioISO,
        evento_fim: fimISO,
        usuario_cod_usuario: 1, // We'll need to get this from the auth store
        sala_cod_sala: sala.cod_sala,
        // These are just for display in the cart
        data: this.dataReservaLocal,
        horaInicio: this.horaInicioReserva,
        horaFim: this.horaFimReserva,
        sala: sala
      });

      // Show success message
      alert('Reserva adicionada ao carrinho!');

      // Limpar campos (mantendo data e sala selecionadas)
      this.tituloReserva = '';
      this.descricaoReserva = '';
      this.horaInicioReserva = '';
      this.horaFimReserva = '';
    }
  }
};
</script>