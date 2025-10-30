<script setup>
import { ref } from "vue"
import api from "@/services/api"
import '../assets/componentes.css'

const nome = ref("")
const descricao = ref("")
const capacidade = ref("")
const localizacao = ref("")
const mensagem = ref("")
const teste = ref("obobobobo")

async function salvarSala() {
  if (!nome.value || !descricao.value || !capacidade.value || !localizacao.value) {
    mensagem.value = "Preencha todos os campos!"
    return
  }

  try {
    await api.post("/salas", {
      nome_sala: nome.value,
      descricao_sala: descricao.value,
      capacidade_sala: capacidade.value,
      localizacao_sala: localizacao.value
    })
    mensagem.value = "Sala cadastrada com sucesso!"
    
    // limpar formulário
    nome.value = ""
    descricao.value = ""
    capacidade.value = ""
    localizacao.value = ""
  } catch (error) {
    console.error("Erro ao salvar", error)
    mensagem.value = "Erro ao cadastrar sala."
  }
}
</script>

<template>
  <div class="container">
    <div class="box">
      <h1>Adicionar Sala</h1>
      <form @submit.prevent="salvarSala">
        <div class="form-group">
          <label for="nome">Nome da sala:</label>
          <input id="nome" v-model="nome" type="text" placeholder="Ex: Laboratório de informática 01" />
        </div>

        <div class="form-group">
          <label for="descricao">Descrição:</label>
          <textarea id="descricao" v-model="descricao" placeholder="Ex: Laboratório para uso de computadores" rows="10"></textarea>
        </div>
        <div class="form-group">
          <label for="capacidade">Capacidade:</label>
          <input id="capacidade" v-model="capacidade" type="number" placeholder="Ex: 20" />
        </div>
        <div class="form-group">
            <label for="localizacao">Localização:</label>
            <textarea id="localizacao" v-model="localizacao" placeholder="Ex: Prédio A, 2º andar"></textarea>
        </div>


        <button class="botaoPadrao" type="submit">Adicionar</button>
      </form>

      <p v-if="mensagem" class="mensagem">{{ mensagem }}</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  color: #f0f0f0;
  justify-content: center;
  align-items: center ;
}

.box {
  background-color: #1f1f1f; /* grafite escuro */
  padding: 3rem;
  border-radius: 15px;
  width: 50%;
  text-align: center;
}

/*tituko*/
.box h1 {
  color: #f0f0f0; /* branco gelo */
  margin-bottom: 2rem;
  font-weight: 500;
  font-size: 2rem;
}

/*grupo*/
.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
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
  border-color: #cacaca;
}

.mensagem {
  margin-top: 15px;
  color: white;
}
</style>
