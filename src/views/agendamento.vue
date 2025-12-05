<style scoped>
.content {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  padding: 20px;
}

select{
  width: 30%;
  min-width: 300px;
  margin: 15px 0;
  padding: 100px;
  padding: 0.8rem;
  border-radius: 8px;
  background-color: #2b2b2b;
  color: #f0f0f0;
  font-size: 1.1rem;
}

.content-direita {
  width: 50%;
  padding: 20px;
}

.content-esquerda {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.eventos-lista {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 20px 0;
}

.loading, .no-events {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

.botaoPadrao {
  width: 100%;
  margin-top: 20px;
}

h2 {
  margin-bottom: 20px;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>

<template>
  <div class="container">
    <h1>Agendamento</h1>
    <p>Selecione uma data no calendário e preencha os dados abaixos:</p>
    <select name="" id="">
      <option value=""></option>
      <option v-for="sala in salas" :key="sala.cod_sala" :value="sala.cod_sala">{{ sala.nome_sala }}</option>
    </select>

    

    <div class="content">
      <div class="content-esquerda">
        <Calendario :eventos="todosOsEventos" @dataSelecionada="handleDataSelecionada" />
      </div>

      <div class="content-direita">
        <h2>Eventos do dia: {{ dataSelecionadaFormatada || '—' }}</h2>

        <div v-if="loading" class="loading">
          Carregando eventos...
        </div>
        <div v-else-if="eventosDoDia.length === 0" class="no-events">
          Nenhum evento agendado para este dia.
        </div>
        <div v-else class="eventos-lista">
          <CardEvento
            v-for="evento in eventosDoDia"
            :key="evento.cod_evento"
            :evento="evento"
            :eventoId="evento.cod_evento"
            @excluir="excluirEvento"
            :dadosEvento="{
              nomeEvento: evento.nome_evento,
              dataInicio: ajustarHorario(evento.evento_inicio),
              dataFim: ajustarHorario(evento.evento_fim),
              local: evento.sala?.nome_sala || 'Sala não especificada',
              descricao: evento.descricao_evento
            }"
          />
        </div>

        <button class="botaoPadrao" @click="handleAbrirModal">
          Criar Reserva
        </button>
      </div>
  <Reserva 
    v-if="abrirModalAgendamento" 
    :dataReserva="dataSelecionada" 
    :salas="salas"
    @fechar="abrirModalAgendamento = false"
  />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Calendario from "@/components/calendario.vue";
import CardEvento from "@/components/cardEvento.vue";
import Reserva from "@/components/reserva.vue";
import api from "@/services/api.js";
import "@/assets/componentes.css";

// Função para ajustar e formatar horários do GMT 0 para GMT -3 (São Paulo)
function ajustarHorario(dateStr) {
  if (!dateStr) return '';
  try {
    // Criar data a partir da string UTC
    const data = new Date(dateStr);
    if (isNaN(data.getTime())) {
      console.error('Data inválida:', dateStr);
      return 'Data inválida';
    }

    // Extrair as horas e minutos
    let horas = data.getUTCHours(); // Pega a hora em UTC (GMT 0)
    const minutos = data.getUTCMinutes();
    
    // Subtrair 3 horas
    horas = horas - 3;
    
    // Ajustar caso a hora fique negativa
    if (horas < 0) {
      horas = horas + 24;
    }
    
    // Formatar a data
    const dia = data.getUTCDate().toString().padStart(2, '0');
    const mes = (data.getUTCMonth() + 1).toString().padStart(2, '0');
    const ano = data.getUTCFullYear();
    
    // Formatar horas e minutos
    const horaFormatada = horas.toString().padStart(2, '0');
    const minutosFormatados = minutos.toString().padStart(2, '0');

    return `${dia}/${mes}/${ano} ${horaFormatada}:${minutosFormatados}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
}

const salas = ref([]);
const dataSelecionada = ref('');
const loading = ref(false);
const eventosDoDia = ref([]);
const salaSelecionada = ref('');
const abrirModalAgendamento = ref(false);

// Carregar salas disponíveis
async function carregarSalas() {
  try {
    const res = await api.get("/salas");
    salas.value = res.data.data || res.data;
  } catch (error) {
    console.error("Erro ao carregar salas:", error);
  }
}

// Carregar eventos quando uma data é selecionada
async function carregarEventos(data) {
  loading.value = true;
  try {
    const dataRequest = data.replaceAll('-', '/');
    const res = await api.get(`/eventos/${dataRequest}`);
    const eventos = res.data.data || res.data || [];
    console.log('Dados brutos dos eventos:', eventos);
    
    // Log para debug dos horários
    if (eventos.length > 0) {
      console.log('Exemplo de horário original:', eventos[0].evento_inicio);
      console.log('Horário ajustado:', ajustarHorario(eventos[0].evento_inicio));
    }
    
    eventosDoDia.value = eventos;
    console.log('Eventos processados:', eventosDoDia.value);
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
    eventosDoDia.value = [];
  } finally {
    loading.value = false;
  }
}

// Quando uma data é selecionada no calendário
function handleDataSelecionada(data) {
  dataSelecionada.value = data;
  console.log('Data selecionada:', dataSelecionada.value);
  
  // Formatar a data para o formato que a API espera (YYYY-MM-DD)
  const dataFormatada = new Date(data).toISOString().split('T')[0];
  console.log('Data formatada para API:', dataFormatada);
  
  carregarEventos(dataFormatada);
}

// Formata a data no formato por extenso em português: 25 de novembro de 2025
function formatarDataExtenso(dateStr) {
  if (!dateStr) return '';
  // dateStr esperado no formato YYYY-MM-DD
  const parts = String(dateStr).split('-');
  if (parts.length < 3) return dateStr;
  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const meses = [
    'janeiro','fevereiro','março','abril','maio','junho',
    'julho','agosto','setembro','outubro','novembro','dezembro'
  ];
  const nomeMes = meses[monthIndex] || '';
  return `${day} de ${nomeMes} de ${year}`;
}

const dataSelecionadaFormatada = computed(() => {
  return dataSelecionada.value ? formatarDataExtenso(dataSelecionada.value) : '';
});

// Função para abrir o modal de agendamento
function handleAbrirModal() {
  if (!dataSelecionada.value) {
    alert('Por favor, selecione uma data primeiro');
    return;
  }
  abrirModalAgendamento.value = true;
}

// Função para excluir evento
async function excluirEvento(eventoId) {
  try {
    loading.value = true;
    await api.delete(`/eventos/${eventoId}`);
    // Recarregar eventos após excluir
    await carregarEventos(dataSelecionada.value);
    alert('Reserva excluída com sucesso!');
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
    alert('Erro ao excluir a reserva. Por favor, tente novamente.');
  } finally {
    loading.value = false;
  }
}

// Carregar dados iniciais
onMounted(() => {
  carregarSalas();
});
</script>