<template>
    <div class="container">
        <h1>Editar Ambiente</h1>
        <form @submit.prevent="atualizarSala">
            <div class="form-group">
                <label for="nome">Nome do Ambiente:</label>
                <input 
                    type="text" 
                    id="nome" 
                    v-model="sala.nome_sala" 
                    required 
                />
            </div>

            <div class="form-group">
                <label for="descricao">Descrição:</label>
                <textarea 
                    id="descricao" 
                    v-model="sala.descricao_sala" 
                    required
                ></textarea>
            </div>

            <div class="form-group">
                <label for="localizacao">Localização:</label>
                <input 
                    type="text" 
                    id="localizacao" 
                    v-model="sala.localizacao_sala" 
                    required 
                />
            </div>

            <div class="form-group">
                <label for="capacidade">Capacidade:</label>
                <input 
                    type="number" 
                    id="capacidade" 
                    v-model="sala.capacidade_sala" 
                    required
                    min="1" 
                />
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
                                            <div v-if="equipamentosSelecionados[equipamento.cod_equipamento].selecionado" class="equipamento-quantidade">
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

            <div class="buttons">
                <button type="submit" class="botaoPadrao">Salvar Alterações</button>
                <router-link to="/salas" class="botaoCancelar">Cancelar</router-link>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const router = useRouter()
const sala = ref({
    nome_sala: '',
    descricao_sala: '',
    localizacao_sala: '',
    capacidade_sala: ''
})

const equipamentos = ref([])
const equipamentosSelecionados = ref({})
const equipamentosOriginais = ref([])

async function carregarEquipamentos() {
    try {
        const res = await api.get('/equipamento')
        equipamentos.value = Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : []

        // Inicializar objeto de seleção caso não exista
        equipamentos.value.forEach(eq => {
            if (!equipamentosSelecionados.value[eq.cod_equipamento]) {
                equipamentosSelecionados.value[eq.cod_equipamento] = { selecionado: false, quantidade: 1 }
            }
        })
    } catch (error) {
        console.error('Erro ao carregar equipamentos:', error)
    }
}

async function carregarEquipamentosDaSala() {
    try {
        const res = await api.get(`/sala-equipamento/sala/${route.params.id}`)
        const dados = Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
        equipamentosOriginais.value = dados

        // Marcar selecionados conforme retornado
        dados.forEach(item => {
            const equipId = item.equipamento_cod_equipamento || item.cod_equipamento || item.equipamento_cod_equipamento || (item.equipamento && item.equipamento.cod_equipamento)
            const quantidade = item.quantidade_equipamento || item.quantidade || 1
            if (equipId !== undefined) {
                // garantir que exista a entrada
                if (!equipamentosSelecionados.value[equipId]) {
                    equipamentosSelecionados.value[equipId] = { selecionado: true, quantidade }
                } else {
                    equipamentosSelecionados.value[equipId].selecionado = true
                    equipamentosSelecionados.value[equipId].quantidade = quantidade
                }
            }
        })
    } catch (error) {
        console.error('Erro ao carregar vínculos de equipamentos da sala:', error)
    }
}

onMounted(async () => {
    try {
        await carregarEquipamentos()
        console.log('ID da sala:', route.params.id); // Debug
        const response = await api.get(`/salas/${route.params.id}`)
        sala.value = response.data.data || response.data

        // depois de carregar a sala, carregar os equipamentos vinculados
        await carregarEquipamentosDaSala()
    } catch (error) {
        console.error('Erro ao carregar sala:', error)
        alert('Erro ao carregar dados da sala')
        router.push('/salas')
    }
})

async function atualizarSala() {
    try {
        const response = await api.put(`/salas/${route.params.id}`, {
            nome_sala: sala.value.nome_sala,
            descricao_sala: sala.value.descricao_sala,
            localizacao_sala: sala.value.localizacao_sala,
            capacidade_sala: Number(sala.value.capacidade_sala)
        })

        if (response.status === 200) {
            // Remover todos os vínculos antigos (se houver)
            for (const item of equipamentosOriginais.value) {
                const equipId = item.equipamento_cod_equipamento || item.cod_equipamento || (item.equipamento && item.equipamento.cod_equipamento)
                if (equipId !== undefined) {
                    try {
                        await api.delete(`/sala-equipamento/${route.params.id}/${equipId}`)
                    } catch (err) {
                        // continuar mesmo se algum delete falhar
                        console.warn('Falha ao deletar vínculo', equipId, err)
                    }
                }
            }

            // Adicionar os equipamentos selecionados novamente
            for (const [codEquipamento, dados] of Object.entries(equipamentosSelecionados.value)) {
                if (dados.selecionado && Number(dados.quantidade) > 0) {
                    try {
                        await api.post('/sala-equipamento', {
                            sala_cod_sala: route.params.id,
                            equipamento_cod_equipamento: codEquipamento,
                            quantidade_equipamento: Number(dados.quantidade)
                        })
                    } catch (err) {
                        console.warn('Falha ao adicionar vínculo', codEquipamento, err)
                    }
                }
            }

            alert('Sala atualizada com sucesso!')
            router.push('/salas')
        } else {
            throw new Error('Falha ao atualizar sala')
        }
    } catch (error) {
        console.error('Erro ao atualizar:', error)
        alert('Erro ao atualizar sala. Por favor, tente novamente.')
    }
}
</script>

<style scoped>
.container {
    max-width: 600px;
    margin: 0 auto;
    color: #f0f0f0;
    padding: 20px;
}

.form-group {
    margin-bottom: 20px;
    color: #f0f0f0;
}

label {
    display: block;
    margin-bottom: 5px;
    color: #333;
    font-weight: 500;
    color: #f0f0f0;
}

input, textarea {
   width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
  background-color: #2b2b2b;
  color: #f0f0f0;
  font-size: 1.1rem;
}

textarea {
    height: 100px;
    resize: vertical;
}

.buttons {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    
}

.botaoPadrao {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s;
}

.botaoPadrao:hover {
    background-color: #218838;
}

.botaoCancelar {
    padding: 10px 20px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    font-size: 16px;
    transition: background-color 0.2s;
}

.botaoCancelar:hover {
    background-color: #c82333;
}

.equipamentos-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
    background-color: #2B2B2B;
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
    width: 80px;}
</style>