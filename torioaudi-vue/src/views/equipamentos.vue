<template>
    <div class="container">
        <h1>Gerenciar equipamento</h1>
        <p>Adicione, remova ou edite equipamentos registrados!</p>

        <hr />
        <router-link to="/adicionarEquipamento">
            <button class="botaoPadrao">Adicionar equipamento</button>
        </router-link>
        <hr />

        <div>
            <h2>Equipamentos cadastrados:</h2>
            <input type="text" v-model="busca" placeholder="Buscar equipamento..." class="input-busca"/>
            
            <table>
                <thead>
                    <tr>
                    <th class="nome">Nome</th>
                    <th class="descricao">Descrição</th>
                    <th class="acoes">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="equipamento in equipamentosFiltrados" :key="equipamento.id">
                    <td>{{ equipamento.nome_equipamento }}</td>
                    <td>{{ equipamento.descricao_equipamento }}</td>
                    <td class="acoes">
                        <button class="btn-editar" @click="editarEquipamento(equipamento)">📝 Editar</button>
                        <button class="btn-excluir" @click="confirmarExclusao(equipamento)">🗑️ Excluir</button>
                    </td>
                    </tr>
                </tbody>
            </table>
            <div v-if="mostrarConfirmacao" class="modal-overlay">
                <div class="modal">
                    <p>Tem certeza que deseja excluir o equipamento "{{ equipamentoSelecionado?.nome_equipamento }}"?</p>
                    <button class="btn-excluir" @click="excluirEquipamento">Sim, excluir</button>
                    <button class="btn-cancelar" @click="mostrarConfirmacao = false">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useRouter } from 'vue-router'
import api from '../services/api'

// Função debounce para evitar muitas requisições
function debounce(fn, delay) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

const router = useRouter()

const equipamentos = ref([])         // lista vinda do banco
const busca = ref("")                // texto digitado no input
const mostrarConfirmacao = ref(false) // controle do pop-up
const equipamentoSelecionado = ref(null) // qual será apagado

// Buscar equipamentos do backend
async function carregarEquipamentos(searchTerm = '') {
  try {
    const res = await api.get("/equipamento", {
      params: searchTerm ? { search: searchTerm } : {}
    })
    equipamentos.value = res.data.data || res.data
  } catch (error) {
    console.error("Erro ao carregar equipamentos:", error.response?.data?.message || error.message)
  }
}

// Filtrar por nome (input de busca)
const equipamentosFiltrados = computed(() => {
  return equipamentos.value
})

// Watch para busca
watch(busca, debounce(async (novoValor) => {
  await carregarEquipamentos(novoValor)
}, 300))

// Abrir pop-up de exclusão
function confirmarExclusao(equipamento) {
  equipamentoSelecionado.value = equipamento
  mostrarConfirmacao.value = true
}

// Excluir após confirmar
async function excluirEquipamento() {
  if (!equipamentoSelecionado.value) return

  try {
    const response = await api.delete(`/equipamento/${equipamentoSelecionado.value.cod_equipamento}`)
    if (response.status === 200 || response.status === 204) {
      equipamentos.value = equipamentos.value.filter(eq => eq.cod_equipamento !== equipamentoSelecionado.value.cod_equipamento)
      alert('Equipamento excluído com sucesso!')
    } else {
      throw new Error('Falha ao excluir equipamento')
    }
  } catch (error) {
    console.error("Erro ao excluir:", error.response?.data?.message || error.message)
    alert('Erro ao excluir equipamento. Por favor, tente novamente.')
  } finally {
    mostrarConfirmacao.value = false
    equipamentoSelecionado.value = null
  }
}

// Redirecionar para a página de edição
function editarEquipamento(equipamento) {
  router.push(`/editarEquipamento/${equipamento.cod_equipamento}`)
}

onMounted(() => {
  carregarEquipamentos()
})
</script>

<style scoped>
.container {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}

.btn-editar, .btn-excluir {
  padding: 8px 16px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-editar {
  background-color: #007bff;
  color: white;
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

.input-busca {
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
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
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
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

.btn-cancelar:hover {
  background-color: #5a6268;
}

.botaoPadrao {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 0;
}

.botaoPadrao:hover {
  background-color: #218838;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  padding: 2rem;
}

hr{
    margin: 20px 0;
}

.input-busca {
    margin: 15px 0;
    padding: 5px;
    width: 100%;
    padding: 0.8rem;
    border-radius: 8px;
    background-color: #2b2b2b;
    color: #f0f0f0;
    font-size: 1.1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
    background-color: #1f1f1f;
}

.th.nome {
    width: 30%;
}
th.descricao {
    width: 55%;
}

th.acoes {
    width: 15%;
    text-align: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  padding: 20px;
  border-radius: 8px;
}
</style>



