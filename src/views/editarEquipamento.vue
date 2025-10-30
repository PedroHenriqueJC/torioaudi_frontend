<template>
    <div class="container">
        <div class="box">
            <h1>Editar Equipamento</h1>
            <form @submit.prevent="atualizarEquipamento">
                <div class="form-group">
                    <label for="nome">Nome do Equipamento:</label>
                    <input type="text" id="nome" v-model="equipamento.nome_equipamento" required />
                </div>
                <div class="form-group">
                    <label for="descricao">Descrição:</label>
                    <textarea rows="10" id="descricao" v-model="equipamento.descricao_equipamento" required></textarea>
                </div>
                <div class="form-group">
                    <label for="quantidade">Quantidade:</label>
                    <input type="number" id="quantidade" v-model="equipamento.quantidade_equipamento" required />
                </div>
                <div class="buttons">
                    <button type="submit" class="botaoPadrao">Salvar Alterações</button>
                    <router-link to="/equipamentos" class="botaoCancelar">Cancelar</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const router = useRouter()

const equipamento = ref({
  nome_equipamento: '',
  descricao_equipamento: '',
  quantidade_equipamento: 0
})

onMounted(async () => {
  try {
    const response = await api.get(`/equipamento/${route.params.id}`)
    equipamento.value = response.data
  } catch (error) {
    console.error('Erro ao carregar equipamento:', error)
    alert('Erro ao carregar dados do equipamento')
  }
})

async function atualizarEquipamento() {
  try {
    await api.put(`/equipamento/${route.params.id}`, {
      nome_equipamento: equipamento.value.nome_equipamento,
      descricao_equipamento: equipamento.value.descricao_equipamento,
      quantidade_equipamento: equipamento.value.quantidade_equipamento
    })
    alert('Equipamento atualizado com sucesso!')
    router.push('/equipamentos')
  } catch (error) {
    console.error('Erro ao atualizar:', error)
    alert('Erro ao atualizar equipamento. Por favor, tente novamente.')
  }
}

</script>

<style scoped>
.container {
    padding-top: 10rem;
  display: flex;
  width: 100%;
  color: #f0f0f0;
  justify-content: center;
  align-items: center ;
}

/*grupo*/
.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/*labels*/
.form-group label {
  align-self: flex-start;
  color: #f0f0f0;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 1.1rem;
}

/*campos*/
.form-group input, textarea {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
  background-color: #2b2b2b;
  color: #f0f0f0;
  font-size: 1.1rem;
}

.form-group input:focus, textarea:focus {
  outline: none;
  border-color: #f0f0f0;
  box-shadow: 0 0 8px  #f0f0f0;
}


.buttons {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    justify-content: center;
}

.botaoCancelar {
  padding: 1rem;
  background-color: #dc3545;
  border: none;
  border-radius: 8px;
  font-weight: 200;
  cursor: pointer;
  transition: 0.3s;
  color: #f0f0f0;
  font-size: 1.2rem;
  text-decoration: none;
}

.botaoCancelar:hover {
    background-color: #c82333;
}

.box {
  background-color: #1f1f1f; /* grafite escuro */
  padding: 3rem;
  border-radius: 15px;
  width: 40%;
  text-align: center;
}

/*tituko*/
.box h1 {
  color: #f0f0f0; /* branco gelo */
  margin-bottom: 2rem;
  font-weight: 500;
  font-size: 2rem;
}
</style>