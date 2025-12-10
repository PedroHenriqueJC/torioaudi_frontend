<template>
  <div class="container">
    <div class="box">
      <h1>Editar Perfil</h1>
      
      <div v-if="erro" class="mensagem-erro">{{ erro }}</div>
      <div v-if="sucesso" class="mensagem-sucesso">{{ sucesso }}</div>

      <form @submit.prevent="salvarPerfil">
        <div class="form-group">
          <label for="nome">Nome Completo:</label>
          <input 
            type="text" 
            id="nome" 
            v-model="usuario.nome" 
            placeholder="Seu nome completo"
            required
          />
        </div>

        <!-- <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            v-model="usuario.email" 
            placeholder="seu@email.com"
            disabled
          />
          <p class="campo-desabilitado">O email não pode ser alterado</p>
        </div> -->

        <div class="form-divider">
          <h3>Alterar Senha</h3>
          <p class="info-text">Deixe em branco se não deseja alterar a senha</p>
        </div>

        <div class="form-group">
          <label for="senhaAtual">Senha Atual:</label>
          <input 
            type="password" 
            id="senhaAtual" 
            v-model="senha.senhaAtual" 
            placeholder="Digite sua senha atual (obrigatório para alterar)"
          />
        </div>

        <div class="form-group">
          <label for="novaSenha">Nova Senha:</label>
          <input 
            type="password" 
            id="novaSenha" 
            v-model="senha.novaSenha" 
            placeholder="Digite sua nova senha"
          />
        </div>

        <div class="form-group">
          <label for="confirmarSenha">Confirmar Nova Senha:</label>
          <input 
            type="password" 
            id="confirmarSenha" 
            v-model="senha.confirmarSenha" 
            placeholder="Confirme sua nova senha"
          />
        </div>

        <div class="buttons">
          <button type="submit" class="botaoPadrao" :disabled="salvando">
            {{ salvando ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
          <router-link to="/perfil" class="botaoCancelar">Cancelar</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const router = useRouter()
const authStore = useAuthStore()

const usuario = ref({
  nome: '',
  email: ''
})

const senha = ref({
  senhaAtual: '',
  novaSenha: '',
  confirmarSenha: ''
})

const erro = ref('')
const sucesso = ref('')
const salvando = ref(false)

onMounted(() => {
  // Preencher dados do usuário logado
  if (authStore.user) {
    usuario.value.nome = authStore.user.nome_usuario || authStore.user.nome || ''
    usuario.value.email = authStore.user.email_usuario || authStore.user.email || ''
  } else {
    router.push('/login')
  }
})

async function salvarPerfil() {
  // Limpar mensagens anteriores
  erro.value = ''
  sucesso.value = ''

  // Validações
  if (!usuario.value.nome.trim()) {
    erro.value = 'Nome não pode estar vazio'
    return
  }

  // Validar senha se algum campo de senha foi preenchido
  const temAlteracaoSenha = senha.value.novaSenha.trim() || senha.value.confirmarSenha.trim()
  
  if (temAlteracaoSenha) {
    if (!senha.value.senhaAtual.trim()) {
      erro.value = 'Digite a senha atual para alterar a senha'
      return
    }
    if (senha.value.novaSenha !== senha.value.confirmarSenha) {
      erro.value = 'As senhas não conferem'
      return
    }
    if (senha.value.novaSenha.length < 6) {
      erro.value = 'A nova senha deve ter pelo menos 6 caracteres'
      return
    }
  }

  salvando.value = true

  try {
    const payload = {
      nome_usuario: usuario.value.nome
    }

    // Adicionar senha se for alterada
    if (temAlteracaoSenha) {
      payload.password = senha.value.novaSenha
      payload.current_password = senha.value.senhaAtual
    }

    // Obter ID do usuário logado
    const userId = authStore.user?.cod_usuario || authStore.user?.id

    // Fazer PUT para atualizar o perfil
    const response = await api.put(`/user/${userId}`, payload)

    if (response.status === 200) {
      sucesso.value = 'Perfil atualizado com sucesso!'
      
      // Atualizar dados no auth store
      if (authStore.user) {
        authStore.user.nome_usuario = usuario.value.nome
      }

      // Limpar campos de senha
      senha.value.senhaAtual = ''
      senha.value.novaSenha = ''
      senha.value.confirmarSenha = ''

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/perfil')
      }, 2000)
    }
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    
    if (error.response?.status === 422) {
      // Erro de validação
      const erros = error.response.data.errors || {}
      const mensagensErro = Object.values(erros).flat().join(', ')
      erro.value = `Erro de validação: ${mensagensErro}`
    } else if (error.response?.data?.message) {
      erro.value = error.response.data.message
    } else if (error.response?.status === 401) {
      erro.value = 'Senha atual inválida'
    } else {
      erro.value = 'Erro ao atualizar perfil. Tente novamente.'
    }
  } finally {
    salvando.value = false
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #f0f0f0;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.box {
  background-color: #1f1f1f;
  padding: 3rem;
  border-radius: 15px;
  width: 100%;
  max-width: 600px;
  text-align: center;
}

h1 {
  color: #f0f0f0;
  margin-bottom: 2rem;
  font-weight: 500;
  font-size: 2rem;
}

h3 {
  color: #f0f0f0;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.form-divider {
  text-align: left;
  margin: 2rem 0 1rem 0;
  padding-top: 2rem;
  border-top: 1px solid #444;
}

.info-text {
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  text-align: left;
}

.form-group label {
  color: #f0f0f0;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 1.1rem;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
  background-color: #2b2b2b;
  color: #f0f0f0;
  font-size: 1.1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #cacaca;
  background-color: #333;
}

.form-group input:disabled {
  background-color: #1f1f1f;
  cursor: not-allowed;
  opacity: 0.6;
  border-color: #666;
}

.campo-desabilitado {
  color: #999;
  font-size: 0.85rem;
  margin-top: 0.3rem;
}

.buttons {
  margin-top: 2rem;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.botaoPadrao {
  padding: 10px 30px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 200px;
}


.botaoPadrao:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.botaoCancelar {
  padding: 10px 30px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  font-size: 16px;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.botaoCancelar:hover {
  background-color: #c82333;
}

.mensagem-erro {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border: 1px solid #f5c6cb;
}

.mensagem-sucesso {
  background-color: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border: 1px solid #c3e6cb;
}
</style>