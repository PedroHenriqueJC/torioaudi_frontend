// import { defineStore } from 'pinia'

// export const useAuthStore = defineStore('auth', {
//   state: () => ({
//     token: null,
//     usuario: null,
//   }),
//   getters: {
//     isLogged: (state) => !!state.token
//   },
//   actions: {
//     setAuth(token, usuario) {
//       this.token = token
//       this.usuario = usuario
//       // se quiser persistir, salve explicitamente aqui:
//       // localStorage.setItem('token', token)
//     },
//     logout() {
//       this.token = null
//       this.usuario = null
//       localStorage.removeItem('token') // limpe persistência se existir
//     }
//   }
// })






// src/stores/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null, 
    isAuthenticated: !!localStorage.getItem('token')
  }),

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
      this.isAuthenticated = !!token
    }
  }
})

// stores/auth.js