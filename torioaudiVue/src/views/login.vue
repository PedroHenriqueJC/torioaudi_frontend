<template>
  <div class="container" style="justify-content: center; align-items: center;">
    <div class="login-box">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="matricula">Matrícula</label>
          <input
            type="text"
            id="matricula"
            v-model="matricula"
            placeholder="Digite sua matrícula"
            required
          />
        </div>

        <div class="input-group">
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
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const matricula = ref('')
const senha = ref('')
const router = useRouter()

// Simulação de autenticação
function autenticarUsuario(matricula, senha) {
  // Aqui você pode trocar para chamada real de backend (axios/fetch)
  if (matricula === 'admin' && senha === 'admin') {
    return true
  }
  return false
}

function handleLogin() {
  if (autenticarUsuario(matricula.value, senha.value)) {
    // Armazena token ou flag de login se quiser
    localStorage.setItem('logado', 'true')

    // Redireciona para a página de agendamento
    router.push('/agendamento')
  } else {
    alert('Matrícula ou senha incorreta!')
  }
}
</script>

<style scoped>
body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  color: #f0f0f0;
}

nav{
  display: flex;
  padding: 1rem 2rem;
  color: white;
  background-color: black ;
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
  text-align: left;
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

.texto {
  display: flex;
  width: 100%;
  height: 10vh;
  padding: 1rem;
  text-align: left;
  margin-bottom: 20px;
}

.calendar {
  background-color: #1f1f1f;
  padding: 3rem;
  width: 40%;
  margin: auto;
  font-family: Arial, sans-serif;
  border-radius: 15px;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  width: 14.28%;
  height: 50px;
  text-align: center;
  border: 1px solid #ccc;
  cursor: pointer;
}
td.today {
  background: #d1f7c4;
  font-weight: bold;
}
td.selected {
  background: #a3d8f4;
}
td:hover {
  background: #eee;
}
.selected-text {
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
}

.finalizar-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #228b22;
  border-radius: 5px;
  cursor: pointer;
}
</style>