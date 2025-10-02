<template>
  <div class="container" style="justify-content: center; align-items: center;">
    <div class="login-box">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">E-mail</label>
          <input type="text" id="email" v-model="email" placeholder="Digite seu email" required/>

          <div><br></div>

          <label for="senha">Senha</label>
          <input type="password" id="senha" v-model="senha" placeholder="Digite sua senha" required />
        </div>
            <button type="submit">Entrar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const senha = ref('')
const router = useRouter()

import api from '../services/api'

// Autenticação com o backend
async function autenticarUsuario(email, senha) {
  try {
    const response = await api.post('/login', {
      email_usuario: email,
      senha_usuario: senha
    })
    
    // Salvar o token de autenticação
    localStorage.setItem('token', response.data.token)
    
    // Configurar o token no header das requisições
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
    
    return true
  } catch (error) {
    console.error('Erro de autenticação:', error.response?.data?.message || error.message)
    return false
  }
}
async function handleLogin() {
  const success = await autenticarUsuario(email.value, senha.value)
  if (success) {
    // Redireciona para a página de agendamento
    router.push('/agendamento')
  } else {
    alert('Email ou senha incorretos!')
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

.login-box {
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