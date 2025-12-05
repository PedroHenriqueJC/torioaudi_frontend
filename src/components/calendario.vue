<template>
  <div class="calendario">
    <!-- Cabeçalho com mês/ano -->
    <div class="calendario-header">
      <button class="botaoPadrao" @click="mesAnterior">‹</button>
      <h2>{{ nomeMesAtual }} {{ anoAtual }}</h2>
      <button class="botaoPadrao" @click="proximoMes">›</button>
    </div>

    <!-- Dias da semana -->
    <div class="semana">
      <span v-for="dia in diasSemana" :key="dia">{{ dia }}</span>
    </div>

    <!-- Dias do mês -->
    <div class="dias">
      <span
        v-for="(dia, index) in diasDoMes"
        :key="index"
        :class="{
          vazio: !dia,
          selecionado: dia && dia === diaSelecionado,
          'com-eventos': dia && obterEventosDoDia(dia).length > 0
        }"
        @click="dia && selecionarDia(dia)"
      >
        <div class="dia-content">
          {{ dia }}
          <div v-if="dia" class="reservas-indicators">
            <div
              v-for="evento in obterEventosDoDia(dia)"
              :key="evento.cod_evento"
              class="evento-indicator"
              :style="{ backgroundColor: gerarCor(evento.nome_evento) }"
              :title="evento.nome_evento"
            ></div>
          </div>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Calendario",
  props: {
    eventos: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const hoje = new Date();
    return {
      mesAtual: hoje.getMonth(),
      anoAtual: hoje.getFullYear(),
      diaSelecionado: null,
      diasSemana: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      coresCache: {} // Cache para armazenar cores geradas
    };
  },
  watch: {
    eventos: {
      handler(newEventos) {
        console.log('Eventos atualizados no calendário:', newEventos);
        this.$forceUpdate();
      },
      deep: true
    }
  },
  computed: {
    nomeMesAtual() {
      const nomesMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril",
        "Maio", "Junho", "Julho", "Agosto",
        "Setembro", "Outubro", "Novembro", "Dezembro"
      ];
      return nomesMeses[this.mesAtual];
    },
    diasDoMes() {
      const primeiroDia = new Date(this.anoAtual, this.mesAtual, 1).getDay();
      const ultimoDia = new Date(this.anoAtual, this.mesAtual + 1, 0).getDate();

      const dias = [];

      // Espaços vazios antes do dia 1
      for (let i = 0; i < primeiroDia; i++) {
        dias.push(null);
      }

      // Dias do mês
      for (let d = 1; d <= ultimoDia; d++) {
        dias.push(d);
      }

      return dias;
    },
  },
  methods: {
    mesAnterior() {
      if (this.mesAtual === 0) {
        this.mesAtual = 11;
        this.anoAtual--;
      } else {
        this.mesAtual--;
      }
      this.diaSelecionado = null;
    },
    proximoMes() {
      if (this.mesAtual === 11) {
        this.mesAtual = 0;
        this.anoAtual++;
      } else {
        this.mesAtual++;
      }
      this.diaSelecionado = null;
    },
    selecionarDia(dia) {
      this.diaSelecionado = dia;
      const dataSelecionada = `${this.anoAtual}-${String(this.mesAtual + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      console.log("Dia selecionado:", dataSelecionada);
      // Emite o evento com nome consistente com o que o agendamento.vue espera
      this.$emit("dataSelecionada", dataSelecionada);
    },
    obterEventosDoDia(dia) {
      const data = `${this.anoAtual}-${String(this.mesAtual + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      const eventosDodia = this.eventos.filter(evento => {
        if (!evento.evento_inicio) return false;
        // Extrair apenas a data (YYYY-MM-DD) do evento_inicio
        const dataEvento = evento.evento_inicio.split('T')[0];
        return dataEvento === data;
      });
      if (eventosDodia.length > 0) {
        console.log(`Dia ${data}: ${eventosDodia.length} evento(s)`, eventosDodia);
      }
      return eventosDodia;
    },
    gerarCor(texto) {
      // Se já tem cor em cache, retorna
      if (this.coresCache[texto]) {
        return this.coresCache[texto];
      }

      // Gera hash do texto para garantir mesma cor sempre
      let hash = 0;
      for (let i = 0; i < texto.length; i++) {
        const char = texto.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }

      // Cores vibrantes
      const cores = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
        '#F8B88B', '#52C4A1', '#FF8C42', '#9B59B6'
      ];

      const cor = cores[Math.abs(hash) % cores.length];
      this.coresCache[texto] = cor;
      return cor;
    }
  },
};
</script>

<style scoped>
.calendario {
  text-align: center;
  width: 100%;
  height: 550px;
  padding: 1rem;
  border-radius: 8px;
  background-color: #222222;
}

.calendario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.semana, .dias {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.3rem;
}

.dias span {
  padding: 10px;
  padding-bottom: 2rem;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
  position: relative;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
}

.dia-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 100%;
}

.reservas-indicators {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.evento-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
}

.evento-indicator:hover {
  transform: scale(1.5);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
}

.dias span:hover {
  background: #eee;
  color: black;
}

.dias span.vazio {
  cursor: default;
  background: none;
}

.dias span.com-eventos {
  border-color: #FF6B6B !important;
  border-width: 2px !important;
}

.dias span.selecionado {
  background: #007bff;
  color: white;
  font-weight: bold;
}
</style>
