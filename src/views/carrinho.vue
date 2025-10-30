<template>
  <div class="carrinho">
    <h2>Carrinho de Reservas</h2>
    
    <div v-if="cartItems.length === 0" class="empty-cart">
      <p>Seu carrinho está vazio</p>
      <router-link to="/agendamento" class="btn">Fazer uma reserva</router-link>
    </div>

    <div v-else class="cart-items">
      <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
        <div class="item-details">
          <h3>{{ item.nome_evento }}</h3>
          <p><strong>Sala:</strong> {{ item.sala.nome_sala }}</p>
          <p><strong>Data:</strong> {{ formatDate(item.data) }}</p>
          <p><strong>Horário:</strong> {{ item.horaInicio }} - {{ item.horaFim }}</p>
          <p>{{ item.descricao_evento }}</p>
        </div>
        <button @click="removeItem(index)" class="btn-remove">Remover</button>
      </div>

      <div class="cart-actions">
        <button @click="confirmReservations" class="btn-confirm" :disabled="isProcessing">
          {{ isProcessing ? 'Processando...' : 'Confirmar Reservas' }}
        </button>
        <button @click="clearCart" class="btn-clear">Limpar Carrinho</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '../stores/cart'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Carrinho',
  
  setup() {
    const cartStore = useCartStore()
    return {
      cartStore
    }
  },

  data() {
    return {
      isProcessing: false
    }
  },

  computed: {
    cartItems() {
      return this.cartStore.cartItems
    }
  },

  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },

    removeItem(index) {
      this.cartStore.removeFromCart(index)
    },

    clearCart() {
      if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        this.cartStore.clearCart()
      }
    },

    async confirmReservations() {
      this.isProcessing = true
      try {
        await this.cartStore.confirmReservations()
        alert('Reservas confirmadas com sucesso!')
        this.$router.push('/agendamento')
      } catch (error) {
        console.error('Error details:', error.response?.data)
        
        // Handle different types of error responses
        if (error.response?.status === 422) {
          // Validation error
          const errors = error.response.data.errors || {}
          const errorMessages = []
          
          for (const field in errors) {
            errorMessages.push(`${field}: ${errors[field].join(', ')}`)
          }
          
          alert(`Erros de validação:\n\n${errorMessages.join('\n')}`)
        } else if (error.response?.data?.message) {
          // General error message from the server
          alert(`Erro: ${error.response.data.message}`)
        } else {
          // Unexpected error
          alert('Ocorreu um erro ao processar as reservas. Verifique os dados e tente novamente.')
        }
      } finally {
        this.isProcessing = false
      }
    }
  }
})
</script>

<style scoped>
.carrinho {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.empty-cart {
  text-align: center;
  padding: 40px;
}

.cart-item {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  margin: 0 0 10px 0;
}

.btn-remove {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.cart-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-confirm {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-confirm:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-clear {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn {
  background-color: #007bff;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 4px;
  display: inline-block;
}
</style>
