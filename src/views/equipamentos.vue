<template>
    <div class="container">
        <h1>Gerenciar equipamento</h1>
        <p>Adicione, remova ou edite equipamentos registrados!</p>

        <hr />
        <router-link to="/adicionarEquipamento">
          <button class="botaoPadrao">Adicionar equipamento</button>
        </router-link>
        
            <h2>Equipamentos cadastrados:</h2>
            <input type="text" v-model="busca" placeholder="Buscar equipamento..." class="input-busca"/>
            
            <div v-if="loading" class="detalhes">
                Carregando equipamentos...
            </div>
            
            <table v-else>
                <thead>
                    <tr>
                    <th class="nome">Nome</th>
                    <th class="descricao">Descrição</th>
                    <th class="quantidade">Quantidade</th>
                    <th class="acoes"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="equipamentosFiltrados.length === 0">
                        <td colspan="4" class="detalhes">
                            {{ busca.trim() ? 'Nenhum equipamento encontrado para esta busca.' : 'Nenhum equipamento cadastrado.' }}
                        </td>
                    </tr>
                    <tr v-else v-for="equipamento in equipamentosFiltrados" :key="equipamento.cod_equipamento"> 
                    <td>{{ equipamento.nome_equipamento }}</td>
                    <td>{{ equipamento.descricao_equipamento }}</td>
                    <td>{{ equipamento.quantidade_equipamento }}</td>
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
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from 'vue-router';
import api from '../services/api';
import '../assets/componentes.css'; 

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
const loading = ref(false)          // controle de carregamento

// Buscar equipamentos do backend
async function carregarEquipamentos() {
  if (loading.value) return;
  
  loading.value = true;
  try {
    const res = await api.get("/equipamento")
    console.log('Resposta da API:', res.data) // Para debug
    equipamentos.value = Array.isArray(res.data.data) ? res.data.data : 
                        Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Erro ao carregar equipamentos:", error)
    equipamentos.value = []
  } finally {
    loading.value = false
  }
}

// Computed property para filtrar equipamentos
const equipamentosFiltrados = computed(() => {
  const termo = busca.value.trim().toLowerCase();
  if (!termo) return equipamentos.value;
  
  return equipamentos.value.filter(equipamento => {
    if (!equipamento) return false;
    
    // Converte todos os valores para string e remove acentos
    const nome = (equipamento.nome_equipamento || '').toLowerCase();
    const descricao = (equipamento.descricao_equipamento || '').toLowerCase();
    const quantidade = String(equipamento.quantidade_equipamento || '');
    
    // Verifica se o termo de busca está contido em algum dos campos
    return nome.includes(termo) || 
           descricao.includes(termo) || 
           quantidade.includes(termo);
  });
});

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
      console.log('Sala excluída com sucesso!');

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
h2 {
    margin-top: 20px;
}
hr{
    margin: 20px 0;
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

.detalhes {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
}

th {
    background-color: #1f1f1f;
}

th.nome {
    width: 30%;
}
th.descricao {
    width: 55%;
}

th.acoes {
    width: 15%;
    text-align: center;
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