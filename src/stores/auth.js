import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null, 
    isAuthenticated: !!localStorage.getItem('token')
  }),

  getters: {
    // Validar se o usuário está autenticado (token e user existem)
    isLoggedIn: (state) => {
      return !!(state.token && state.user && state.isAuthenticated)
    },
    // Obter role do usuário (0 = comum, 1 = admin)
    userRole: (state) => {
      return state.user?.role || state.user?.tipo_usuario || null
    },
    // Verificar se é administrador
    isAdmin: (state) => {
      const role = state.user?.role || state.user?.tipo_usuario
      return role === 1 || role === '1'
    }
  },

  actions: {
    // 🔹 Método chamado no login
    login(userData, token) {
      this.user = userData
      this.token = token
      this.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', token)
    },
    // 🔹 Método chamado no logout
    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false

      // 🔸 Removendo dados salvos
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    checkAuth() {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user'))
      this.token = token
      this.user = user
      this.isAuthenticated = !!token && !!user
    },
    // 🔹 Validar token com o backend (chamada opcional)
    async validateToken() {
      try {
        const api = await import('../services/api').then(m => m.default)
        const response = await api.get('/user/validate')
        if (response.status === 200) {
          this.isAuthenticated = true
          return true
        }
      } catch (error) {
        // Token inválido, fazer logout
        this.logout()
        return false
      }
    }
  }
})