<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  z-index: 1000;
}

.card {
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  background-color: #1f1f1f;
  padding: 1.5rem;
  border-radius: 8px;
  color: #f0f0f0;
  position: relative;
  margin: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-fechar {
  background: none;
  border: none;
  color: #f0f0f0;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.btn-fechar:hover {
  color: #ff4444;
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

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancelar {
  padding: 0.8rem 1.5rem;
  border: 2px solid #ff4444;
  background: none;
  color: #ff4444;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn-cancelar:hover {
  background-color: #ff4444;
  color: white;
}

.equipamentos-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background-color: #2b2b2b;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
}

.sem-equipamentos {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 1rem;
}

.equipamento-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #1f1f1f;
  border-radius: 6px;
  border-left: 3px solid #0f7026;
}

.equipamento-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.equipamento-checkbox input[type="checkbox"] {
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  accent-color: #0f7026;
}

.equipamento-checkbox label {
  cursor: pointer;
  color: #f0f0f0;
  font-weight: 500;
  margin: 0;
  flex: 1;
}

.equipamento-quantidade {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: 2rem;
  padding: 0.5rem;
  background-color: #2b2b2b;
  border-radius: 4px;
}

.equipamento-quantidade label {
  color: #f0f0f0;
  font-weight: 500;
  white-space: nowrap;
  font-size: 0.95rem;
}

.equipamento-quantidade input {
  width: 80px;
  padding: 0.5rem;
  border-radius: 4px;
  border: 2px solid #f0f0f0;
  background-color: #1f1f1f;
  color: #f0f0f0;
  font-size: 1rem;
  text-align: center;
}

.equipamento-quantidade input:focus {
  outline: none;
  border-color: #0f7026;
}

</style>

<template>
  <div class="modal-overlay" @click.self="$emit('fechar')">
    <div class="card">
      <div class="card-header">
        <h2>Fazer Reserva</h2>
        <button class="btn-fechar" @click="$emit('fechar')">&#x2715;</button>
      </div>
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
        <label>Equipamentos:</label>
        <div class="equipamentos-container">
          <div v-if="equipamentos.length === 0" class="sem-equipamentos">
            Nenhum equipamento disponível
          </div>
          <div v-for="equipamento in equipamentos" :key="equipamento.cod_equipamento" class="equipamento-item">
            <div class="equipamento-checkbox">
              <input 
                type="checkbox" 
                :id="`eq-${equipamento.cod_equipamento}`"
                v-model="equipamentosSelecionados[equipamento.cod_equipamento].selecionado"
              />
              <label :for="`eq-${equipamento.cod_equipamento}`">
                {{ equipamento.nome_equipamento }}
              </label>
            </div>
            <div v-if="equipamentosSelecionados[equipamento.cod_equipamento] && equipamentosSelecionados[equipamento.cod_equipamento].selecionado" class="equipamento-quantidade">
              <label :for="`qty-${equipamento.cod_equipamento}`">Quantidade:</label>
              <input 
                type="number" 
                :id="`qty-${equipamento.cod_equipamento}`"
                v-model.number="equipamentosSelecionados[equipamento.cod_equipamento].quantidade"
                min="1"
                placeholder="Quantidade"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <button type="submit" class="botaoPadrao">Adicionar ao Carrinho</button>
      </div>
    </form>
  </div>
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
      salaSelecionadaLocal: this.salaSelecionada || '',
      equipamentos: [],
      equipamentosSelecionados: {}
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
  async mounted() {
    await this.carregarEquipamentos();
  },
  methods: {
    async carregarEquipamentos() {
      try {
        const api = await import('@/services/api').then(m => m.default);
        const res = await api.get("/equipamento");
        this.equipamentos = Array.isArray(res.data.data) ? res.data.data : 
                           Array.isArray(res.data) ? res.data : [];
        
        // Inicializar objeto de equipamentos selecionados ANTES de renderizar
        const novoEquipamentosSelecionados = {};
        this.equipamentos.forEach(eq => {
          novoEquipamentosSelecionados[eq.cod_equipamento] = {
            selecionado: false,
            quantidade: 1
          };
        });
        this.equipamentosSelecionados = novoEquipamentosSelecionados;
      } catch (error) {
        console.error("Erro ao carregar equipamentos:", error);
      }
    },
    emitSalaSelecionada() {
      this.$emit('update:salaSelecionada', this.salaSelecionadaLocal);
    },
    fazerReserva() {
      if (!this.dataReservaLocal || !this.horaInicioReserva || !this.horaFimReserva || !this.salaSelecionadaLocal) {
        alert('Preencha todos os campos de data/hora e selecione uma sala!');
        return;
      }

      // Formata a data e hora para o fuso horário de São Paulo
      const formatDateTime = (date, time) => {
        // Cria a data em UTC
        const [year, month, day] = date.split('-').map(Number);
        const [hours, minutes] = time.split(':').map(Number);
        
        // Criar a data em UTC
        const dateUTC = new Date(Date.UTC(year, month - 1, day, hours, minutes));
        
        // Ajusta para o fuso de São Paulo (UTC-3)
        dateUTC.setHours(dateUTC.getHours() - 3);
        
        return dateUTC.toISOString();
      };

      const inicioISO = formatDateTime(this.dataReservaLocal, this.horaInicioReserva);
      const fimISO = formatDateTime(this.dataReservaLocal, this.horaFimReserva);

      console.log('Data início formatada:', inicioISO);
      console.log('Data fim formatada:', fimISO);

      // Get the selected sala object
      const sala = this.salas.find(s => s.cod_sala === this.salaSelecionadaLocal);

      // Obter equipamentos selecionados
      const equipamentosParaAdicionar = Object.entries(this.equipamentosSelecionados)
        .filter(([_, eq]) => eq.selecionado && eq.quantidade > 0)
        .map(([codEq, eq]) => ({
          cod_equipamento: codEq,
          quantidade: eq.quantidade
        }));

      // Add to cart instead of creating directly
      this.cartStore.addToCart({
        nome_evento: this.tituloReserva,
        descricao_evento: this.descricaoReserva,
        evento_inicio: inicioISO,
        evento_fim: fimISO,
        usuario_cod_usuario: 1, // We'll need to get this from the auth store
        sala_cod_sala: sala.cod_sala,
        equipamentos: equipamentosParaAdicionar,
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
      Object.keys(this.equipamentosSelecionados).forEach(key => {
        this.equipamentosSelecionados[key] = { selecionado: false, quantidade: 1 };
      });

      // Fechar o modal
      this.$emit('fechar');
    }
  }
};
</script>