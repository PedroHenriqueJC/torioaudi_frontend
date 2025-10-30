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
          selecionado: dia && dia === diaSelecionado
        }"
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
      diaSelecionado: null,
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
}

.dias span:hover {
  background: #eee;
  color: black;
}

.dias span.vazio {
  cursor: default;
  background: none;
}

.dias span.selecionado {
  background: #007bff;
  color: white;
  font-weight: bold;
}
</style>
