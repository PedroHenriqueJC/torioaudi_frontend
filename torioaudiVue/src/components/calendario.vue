<template>
  <div class="calendario">
    <!-- Cabeçalho com mês/ano -->
    <div class="calendario-header">
      <button @click="mesAnterior">‹</button>
      <h2>{{ nomeMesAtual }} {{ anoAtual }}</h2>
      <button @click="proximoMes">›</button>
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
        :class="{ vazio: !dia }"
        @click="dia && selecionarDia(dia)"
      >
        {{ dia }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Calendario",
  data() {
    const hoje = new Date();
    return {
      mesAtual: hoje.getMonth(),
      anoAtual: hoje.getFullYear(),
      diasSemana: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    };
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
    },
    proximoMes() {
      if (this.mesAtual === 11) {
        this.mesAtual = 0;
        this.anoAtual++;
      } else {
        this.mesAtual++;
      }
    },
    selecionarDia(dia) {
      const dataSelecionada = `${this.anoAtual}-${String(this.mesAtual + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
      // Redireciona para outra página com a data
      this.$router.push(`/agendamento/${dataSelecionada}`);
    },
  },
};
</script>

<style scoped>
.calendario {
  width: 60%;
  margin: auto;
  padding: 1rem;
  border-radius: 8px;
  background: #1f1f1f;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.calendario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendario-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.semana, .dias {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  gap: 0.3rem;
}

.semana span {
  font-weight: bold;
}

.dias span {
  padding: 0.6rem;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.3s;
}

.dias span:hover {
  background: #4caf50;
  color: white;
}

.dias span.vazio {
  cursor: default;
  background: transparent;
}
</style>
