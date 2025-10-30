r<template>
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

onMounted(async () => {
    try {
        console.log('ID da sala:', route.params.id); // Debug
        const response = await api.get(`/salas/${route.params.id}`)
        console.log('Resposta da API:', response.data); // Debug
        sala.value = response.data.data || response.data
    } catch (error) {
        console.error('Erro ao carregar sala:', error)
        alert('Erro ao carregar dados da sala')
        router.push('/salas')
    }
})

async function atualizarSala() {
    try {
        console.log('Enviando atualização para sala:', route.params.id); // Debug
        const response = await api.put(`/salas/${route.params.id}`, {
            nome_sala: sala.value.nome_sala,
            descricao_sala: sala.value.descricao_sala,
            localizacao_sala: sala.value.localizacao_sala,
            capacidade_sala: Number(sala.value.capacidade_sala)
        })

        if (response.status === 200) {
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
</style>