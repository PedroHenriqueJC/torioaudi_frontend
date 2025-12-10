<template>
  <div class="container" style="justify-content: center; align-items: center;">
    <div class="cadastro-box">
      <h1>Cadastro</h1>
      <form @submit.prevent="handleCadastro">
        <div class="input-group">
            <label for="nome">Nome:</label>
            <input class="input-busca" type="text" id="nome" v-model="nome" placeholder="Digite seu nome" required/>

            <div><br></div>

            <label for="email">E-mail:</label>
            <input class="input-busca" type="email" id="email" v-model="email" placeholder="Digite seu email" required/>

            <div><br></div>

            <label for="senha">Senha:</label>
            <input class="input-busca" type="password" id="senha" v-model="senha" placeholder="Digite sua senha" required />
        </div>
            <button type="submit" class="botaoVerde">Cadastrar</button>
      </form>
      <div v-if="mensagem" class="mensagem-erro">{{ mensagem }}</div>
      <p><br>Já possui uma conta? <router-link to="/login">Entre</router-link></p>
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
    // Validações básicas
    if (nome.value.trim() === '') {
      mensagem.value = 'O nome é obrigatório';
      return;
    }
    if (email.value.trim() === '') {
      mensagem.value = 'O email é obrigatório';
      return;
    }
    if (senha.value.trim() === '') {
      mensagem.value = 'A senha é obrigatória';
      return;
    }
    if (senha.value.length < 6) {
      mensagem.value = 'A senha deve ter pelo menos 6 caracteres';
      return;
    }

    // Limpa mensagem anterior
    mensagem.value = '';

    console.log('Enviando dados:', {
      nome: nome.value,
      email: email.value,
      senha: senha.value
    });

    const response = await api.post('/register', {
      nome_usuario: nome.value,
      email_usuario: email.value,
      senha_usuario: senha.value,
    })

    console.log('Resposta do servidor:', response.data);

    if (response.data.token) {
      // Salvar o token de autenticação retornado pelo backend
      localStorage.setItem('token', response.data.token)
      
      // Configurar o token no header das requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

      // Redirecionar para a página de agendamento após o cadastro bem-sucedido
      router.push('/agendamento')
    } else {
      throw new Error('Token não recebido do servidor')
    }
  } catch (error) {
    console.error('Erro detalhado:', error);
    
    if (error.response) {
      // O servidor respondeu com um status de erro
      mensagem.value = error.response.data.message || 
                      'Erro do servidor. Por favor, tente novamente.';
      console.error('Erro do servidor:', error.response.data);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      mensagem.value = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
      console.error('Erro de conexão:', error.request);
    } else {
      // Erro na configuração da requisição
      mensagem.value = 'Erro ao processar a requisição. Tente novamente.';
      console.error('Erro de configuração:', error.message);
    }
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
  font-weight: 500;
  font-size: 1.1rem;
}

/*campos*/

.input-group input:focus {
  outline: none;
  border-color: #f0f0f0;
  box-shadow: 0 0 8px  #f0f0f0;
}

/*botao*/
button {
  width: 100%;
  padding: 1rem;
}

button:hover {
  background-color: #1e7a1e;
}

</style>