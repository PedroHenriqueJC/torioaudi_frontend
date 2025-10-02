<script setup>
import { ref } from "vue"
import axios from "axios"
import api from "@/services/api"

const nome = ref("")
const descricao = ref("")
const mensagem = ref("")

async function salvarEquipamento() {
  if (!nome.value || !descricao.value) {
    mensagem.value = "Preencha todos os campos!"
    return
  }

  try {
    await api.post("/equipamento", {
      nome_equipamento: nome.value,
      descricao_equipamento: descricao.value,
      quantidade_equipamento: 1
    })
    mensagem.value = "Equipamento cadastrado com sucesso!"
    
    // limpar formulário
    nome.value = ""
    descricao.value = ""
  } catch (error) {
    console.error("Erro ao salvar", error)
    mensagem.value = "Erro ao cadastrar equipamento."
  }
}
</script>

<template>
  <div class="container">
    <div class="box">
      <h1>Adicionar Equipamento</h1>
      <form @submit.prevent="salvarEquipamento">
        <div class="form-group">
          <label for="nome">Nome do equipamento:</label>
          <input id="nome" v-model="nome" type="text" placeholder="Ex: Projetor" />
        </div>

        <div class="form-group">
          <label for="descricao">Descrição:</label>
          <textarea id="descricao" v-model="descricao" placeholder="Ex: Projetor Epson X200" rows="20"></textarea>
        </div>

        <button class="botaoPadrao" type="submit">Salvar</button>
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
  width: 90%;
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

.mensagem {
  margin-top: 15px;
  color: red;
}
</style>
