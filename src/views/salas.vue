<template>
  <div class="container">
    <h1>Gerenciar ambientes</h1>
    <p>Adicione, remova ou edite os ambientes disponíveis!</p>
    <hr>

    <div class="actions-bar">
      <router-link to="/adicionarSala">
        <button class="botaoPadrao">Adicionar Ambiente</button>
      </router-link>

      <h2>Salas cadastradas:</h2>
      
      <div class="search-bar">
        <input
          class="input-busca"
          v-model="busca"
          type="text"
          placeholder="Pesquisar sala..."
        />
      </div>
    </div>

    <div v-if="loading" class="detalhes">
      Carregando salas...
    </div>

      <table v-else>
        <thead>
          <tr>
            <th class="nome">Nome</th>
            <th class="descricao">Descrição</th>
            <th class="localizacao">Localização</th>
            <th class="capacidade">Capacidade</th>
            <th class="acoes">Ações</th>
          </tr>
        </thead>
        <tbody>
        <tr v-if="salasFiltradas.length === 0">
          <td colspan="5" class="detalhes">
            {{ busca.trim() ? 'Nenhuma sala encontrada para esta busca.' : 'Nenhuma sala cadastrada.' }}
          </td>
        </tr>
          <tr v-else v-for="sala in salasFiltradas" :key="sala.cod_sala">
            <td>{{ sala.nome_sala }}</td>
            <td>{{ sala.descricao_sala }}</td>
            <td>{{ sala.localizacao_sala }}</td>
            <td>{{ sala.capacidade_sala }}</td>
            <td class="acoes">
              <button class="btn-editar" @click="editarSala(sala)">📝 Editar</button>
              <button class="btn-excluir" @click="confirmarExclusao(sala)">🗑️ Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal de confirmação de exclusão -->
      <div v-if="mostrarConfirmacao" class="modal-overlay">
        <div class="modal">
          <p>Tem certeza que deseja excluir a sala "{{ salaSelecionada?.nome_sala }}"?</p>
          <div class="modal-actions">
            <button class="btn-excluir" @click="excluirSala">Sim, excluir</button>
            <button class="btn-cancelar" @click="mostrarConfirmacao = false">Cancelar</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import api from "@/services/api.js";
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
import CardAmbiente from "@/components/cardAmbiente.vue";
import '../assets/componentes.css'

const router = useRouter();
const salas = ref([]);
const busca = ref("");
const mostrarConfirmacao = ref(false);
const salaSelecionada = ref(null);
const loading = ref(false);

// Carregar salas do backend
async function carregarSalas() {
  if (loading.value) return;

  loading.value = true;
  try {
    const res = await api.get("/salas")
    console.log('Resposta da API:', res.data) // Para debug
    salas.value = res.data.data || res.data
  } catch (error) {
    console.error("Erro ao carregar salas:", error.response?.data?.message || error.message)
  }
  finally {
    loading.value = false;
  }
}

// Computed para filtrar as salas
const salasFiltradas = computed(() => {
  const termo = busca.value.trim().toLowerCase();
  if (!busca.value) return salas.value;
  
  return salas.value.filter((sala) => {
    const nome = sala?.nome_sala?.toLowerCase() ?? '';
    const descricao = sala?.descricao_sala?.toLowerCase() ?? '';
    const localizacao = sala?.localizacao_sala?.toLowerCase() ?? '';
    const capacidade = String(sala?.capacidade_sala ?? '');

    return (
      nome.includes(termo) ||
      descricao.includes(termo) ||
      localizacao.includes(termo) ||
      capacidade.includes(termo)

    );
  });
});

// Funções de CRUD
function editarSala(sala) {
  router.push(`/editarSala/${sala.cod_sala}`);
  console.log('Redirecionando para edição da sala:', sala); // Debug
}

function confirmarExclusao(sala) {
  salaSelecionada.value = sala;
  mostrarConfirmacao.value = true;
}

async function excluirSala() {
  if (!salaSelecionada.value) return;

  try {
    const response = await api.delete(`/salas/${salaSelecionada.value.cod_sala}`);
    if (response.status === 200 || response.status === 204) {
      salas.value = salas.value.filter(s => s.cod_sala !== salaSelecionada.value.cod_sala);
      console.log('Sala excluída com sucesso!');
    }
  } catch (error) {
    console.error("Erro ao excluir sala:", error);
    alert('Erro ao excluir sala. Por favor, tente novamente.');
  } finally {
    mostrarConfirmacao.value = false;
    salaSelecionada.value = null;
  }
}

// Carregar salas quando o componente for montado
onMounted(() => {
  carregarSalas();
});
</script>

<style scoped>
.home {
  text-align: left;
}
/* Seção de ambientes */  

.detalhes {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
}

.cards {
  display: flex;
  flex-wrap: column;
  gap: 1.5rem;
  justify-content: center;

}

.card-ambiente {
  position: relative;
  margin-bottom: 1rem;
}
.card-ambiente button {
  margin: 0.2rem 0.5rem;
  padding: 0.3rem 1rem;
  border: none;
  border-radius: 4px;
  background: #f44336;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}
.card-ambiente button:first-of-type {
  background: #ff9800;
}
.card-ambiente button:hover {
  background: #b71c1c;
}
.card-ambiente button:first-of-type:hover {
  background: #f57c00;
}

hr{
    margin: 20px 0;
}

h2{
    margin-top: 20px;
}

.search-bar {
  margin: 0;
  display: flex;
  justify-content: center;
}

table button {
  padding: 8px 16px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-editar {
  background-color: #007bff;
  color: white;
  margin-bottom: 5px;
}

.btn-excluir {
  background-color: #dc3545;
  color: white;
}

.btn-editar:hover {
  background-color: #0056b3;
}

.btn-excluir:hover {
  background-color: #c82333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
    background-color: #1f1f1f;
}

th.nome {
    width: 10%;
}
th.descricao {
    width: 35%;
}
th.capacidade {
    width: 5%;
    text-align: center;
}
th.localizacao {
    width: 35%;
    text-align: center;
}

th.acoes {
    width: 15%;
    text-align: center;
}

.modal {
  background-color: black;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
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
  backdrop-filter: blur(10px);
}

.modal button {
  margin: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancelar {
  background-color: #6c757d;
  color: white;
}


</style>