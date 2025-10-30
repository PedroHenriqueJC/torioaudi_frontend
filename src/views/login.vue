<template>
  <div class="container">
    <div class="login-box">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">E-mail</label>
          <input
            type="text"
            id="email"
            v-model="email"
            placeholder="Digite seu email"
            required
          />

          <label for="senha">Senha</label>
          <input
            type="password"
            id="senha"
            v-model="senha"
            placeholder="Digite sua senha"
            required
          />
        </div>

        <button type="submit">Entrar</button>
        <p v-if="mensagem" class="mensagem">{{ mensagem }}</p>
      </form>

      <p>
        Não tem uma conta?
        <router-link to="/cadastro">Cadastre-se</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '../services/api'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const senha = ref('')
const mensagem = ref('')

const handleLogin = async () => {
  if (!email.value || !senha.value) {
    mensagem.value = 'Por favor, preencha todos os campos!'
    return
  }

  try {
    // Requisição de login para o backend
    const response = await api.post('/login', {
      email_usuario: email.value, // ou "email" se o backend usar outro nome
      senha_usuario: senha.value  // ou "password"
    })

    console.log('Resposta do login:', response.data)

    if (response.data.token) {
      authStore.login(response.data.usuario, response.data.token)
      router.push('/')
    } else {
      mensagem.value = 'Email ou senha incorretos!'
    }
  } catch (error) {
    console.error('Erro no login:', error)
    mensagem.value =
      error.response?.data?.message || 'Erro ao fazer login. Tente novamente.'
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #121212;
  color: #f0f0f0;
}

.login-box {
  background-color: #1f1f1f;
  padding: 3rem;
  border-radius: 15px;
  width: 400px;
  text-align: center;
}

.login-box h1 {
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group label {
  font-weight: 500;
  text-align: left;
}

.input-group input {
  padding: 0.8rem;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
  background-color: #2b2b2b;
  color: #f0f0f0;
}

button {
  margin-top: 1.5rem;
  padding: 1rem;
  width: 100%;
  border: none;
  border-radius: 8px;
  background-color: #228b22;
  color: #f0f0f0;
  cursor: pointer;
  font-size: 1.1rem;
}

button:hover {
  background-color: #1e7a1e;
}

.mensagem {
  margin-top: 1rem;
  color: #ff4c4c;
}
</style>
