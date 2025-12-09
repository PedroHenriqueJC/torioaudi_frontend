// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: '/api/api' // Endereço do backend Laravel
})

// Adiciona o token de autenticação em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepta erros de autenticação
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// async function excluirEquipamento() {
//   if (!equipamentoSelecionado.value) return

//   try {
//     const response = await api.delete(`/equipamento/${equipamentoSelecionado.value.cod_equipamento}`)
//     if (response.status === 200 || response.status === 204) {
//       equipamentos.value = equipamentos.value.filter(eq => eq.cod_equipamento !== equipamentoSelecionado.value.cod_equipamento)
//       alert('Equipamento excluído com sucesso!')
//     } else {
//       throw new Error('Falha ao excluir equipamento')
//     }
//   } catch (error) {
//     console.error("Erro ao excluir:", error.response?.data?.message || error.message)
//     alert('Erro ao excluir equipamento. Por favor, tente novamente.')
//   } finally {
//     mostrarConfirmacao.value = false
//     equipamentoSelecionado.value = null
//   }
// }

// // Redirecionar para a página de edição
// function editarEquipamento(equipamento) {
//   router.push(`/editarEquipamento/${equipamento.cod_equipamento}`)
// }
