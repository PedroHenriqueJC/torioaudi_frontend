import { defineStore } from 'pinia'
import api from '../services/api'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),

  getters: {
    cartItems: (state) => state.items,
    cartCount: (state) => state.items.length
  },

  actions: {
    addToCart(reservation) {
      this.items.push(reservation)
    },

    removeFromCart(index) {
      this.items.splice(index, 1)
    },

    clearCart() {
      this.items = []
    },

    async confirmReservations() {
      try {
        for (const reservation of this.items) {
          // Garantir que as datas estão no formato correto
          const payload = {
            nome_evento: reservation.nome_evento,
            descricao_evento: reservation.descricao_evento,
            evento_inicio: reservation.evento_inicio,
            evento_fim: reservation.evento_fim,
            usuario_cod_usuario: 1, // Valor fixo por enquanto
            sala_cod_sala: reservation.sala_cod_sala
          }
          
          // Log detalhado do payload para debug
          console.log('Enviando reserva:', {
            ...payload,
            formato_inicio: new Date(payload.evento_inicio).toISOString(),
            formato_fim: new Date(payload.evento_fim).toISOString()
          })
          
          const response = await api.post('/eventos', payload)
          console.log('Resposta da API:', response.data)
        }
        this.clearCart()
        return true
      } catch (error) {
        // Log the full error for debugging
        console.error('Error details:', {
          response: error.response?.data,
          status: error.response?.status,
          error: error
        })
        throw error // Propagate the error so we can show the specific validation message
      }
    }
  }
})