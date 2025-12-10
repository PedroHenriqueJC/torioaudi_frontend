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
            formato_fim: new Date(payload.evento_fim).toISOString(),
            equipamentos: reservation.equipamentos || []
          })
          
          const response = await api.post('/eventos', payload)
          console.log('Resposta da API:', response.data)
          
          const eventoId = response.data.evento?.cod_evento
          
          // Vincular equipamentos se houver
          if (reservation.equipamentos && Array.isArray(reservation.equipamentos) && reservation.equipamentos.length > 0 && eventoId) {
            console.log('Processando equipamentos:', reservation.equipamentos);
            
            for (const equipamento of reservation.equipamentos) {
              try {
                if (!equipamento.cod_equipamento || !equipamento.quantidade) {
                  console.error('Equipamento inválido:', equipamento);
                  continue;
                }
                
                console.log('Adicionando equipamento ao evento:', {
                  evento_cod_evento: eventoId,
                  equipamento_cod_equipamento: equipamento.cod_equipamento,
                  quantidade: equipamento.quantidade
                });
                
                await api.post('/equipamento-evento', {
                  evento_cod_evento: eventoId,
                  equipamento_cod_equipamento: equipamento.cod_equipamento,
                  quantidade: equipamento.quantidade
                });
                
                console.log('Equipamento adicionado com sucesso');
              } catch (equipError) {
                console.error('Erro ao adicionar equipamento:', equipError);
                console.error('Detalhes do erro:', {
                  response: equipError.response?.data,
                  status: equipError.response?.status,
                  equipamento: equipamento
                });
                // Continue com os próximos equipamentos mesmo se um falhar
              }
            }
          }
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