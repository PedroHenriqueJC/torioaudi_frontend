<template>
  <div class="container" style="justify-content: center; align-items: center;">
    <div class="cadastro-box">
      <h1>Cadastro</h1>
      <form @submit.prevent="handleCadastro">
        <div class="input-group">
            <label for="nome">Nome</label>
            <input type="text" id="nome" v-model="nome" placeholder="Digite seu nome" required/>

            <div><br></div>

            <label for="email">E-mail</label>
            <input type="email" id="email" v-model="email" placeholder="Digite seu email" required/>

            <div><br></div>

            <label for="senha">Senha</label>
            <input type="password" id="senha" v-model="senha" placeholder="Digite sua senha" required />
        </div>
            <button type="submit">Cadastrar</button>
      </form>
      <div v-if="mensagem">{{ mensagem }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const nome = ref('')
const email = ref('')
const senha = ref('')
const mensagem = ref('')
const router = useRouter()

async function handleCadastro() {
  try {
    const response = await api.post('/register', {
      nome_usuario: nome.value,
      email_usuario: email.value,
      senha_usuario: senha.value
    })

    // Salvar o token de autenticação retornado pelo backend
    localStorage.setItem('token', response.data.token)
    
    // Configurar o token no header das requisições
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

    // Redirecionar para a página de agendamento após o cadastro bem-sucedido
    router.push('/agendamento')
  } catch (error) {
    mensagem.value = error.response?.data?.message || 'Erro ao realizar cadastro. Tente novamente.'
  }
}
</script>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  color: #f0f0f0;
}

.mensagem-erro {
  color: #ff6b6b;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.cadastro-box {
  background-color: #1f1f1f; /* grafite escuro */
  padding: 3rem;
  border-radius: 15px;
  width: 450px;
  text-align: center;
}

/*tituko*/
.login-box h1 {
  color: #f0f0f0; /* branco gelo */
  margin-bottom: 2rem;
  font-weight: 500;
  font-size: 2rem;
}

/*grupo*/
.input-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/*labels*/
.input-group label {
  align-self: flex-start;
  color: #f0f0f0;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 1.1rem;
}

/*campos*/
.input-group input {
  width: 90%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
  background-color: #2b2b2b;
  color: #f0f0f0;
  font-size: 1.1rem;
}

.input-group input:focus {
  outline: none;
  border-color: #f0f0f0;
  box-shadow: 0 0 8px  #f0f0f0;
}

/*botao*/
button {
  width: 90%;
  padding: 1rem;
  background-color: #228b22;
  border: none;
  border-radius: 8px;
  font-weight: 200;
  cursor: pointer;
  transition: 0.3s;
  color: #f0f0f0;
  font-size: 1.2rem;
  margin-top: 1rem;
}

button:hover {
  background-color: #1e7a1e;
}

</style>