<template>
  <div class="carrinho">
    <div class="header-carrinho">
      <h2>Carrinho</h2>
    <p>Confirme suas reservas aqui:</p>
    </div>
    
    <div v-if="cartItems.length === 0" class="empty-cart">
      <p>Seu carrinho está vazio!</p>
      <br>
      <router-link to="/agendamento" class="botaoPadrao">Fazer uma reserva</router-link>
    </div>

    <div v-else class="cart-items">
      <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
        <div class="item-details">
          <div v-if="editIndex !== index">
            <h3>{{ item.nome_evento }}</h3>
            <p><strong>Sala:</strong> {{ item.sala.nome_sala }}</p>
            <p><strong>Data:</strong> {{ formatDate(item.data) }}</p>
            <p><strong>Horário:</strong> {{ item.horaInicio }} - {{ item.horaFim }}</p>
            <p>{{ item.descricao_evento }}</p>
          </div>

          <form v-else @submit.prevent="saveEdit(index)" class="edit-form">
            <div class="form-row">
              <label>Título</label>
              <input type="text" v-model="editedItem.nome_evento" required />
            </div>
            <div class="form-row">
              <label>Data</label>
              <input type="date" v-model="editedItem.data" required />
            </div>
            <div class="form-row time-row">
              <div>
                <label>Início</label>
                <input type="time" v-model="editedItem.horaInicio" required />
              </div>
              <div>
                <label>Fim</label>
                <input type="time" v-model="editedItem.horaFim" required />
              </div>
            </div>
            <div class="form-row">
              <label>Descrição</label>
              <textarea v-model="editedItem.descricao_evento"></textarea>
            </div>

            <div class="form-row">
              <label>Equipamentos</label>
              <div class="equipamentos-container">
                <div v-if="allEquipamentos.length === 0" class="sem-equipamentos">Nenhum equipamento disponível</div>
                <div v-for="eq in allEquipamentos" :key="eq.cod_equipamento" class="equipamento-item">
                  <div class="equipamento-checkbox">
                    <input type="checkbox" :id="`edit-eq-${eq.cod_equipamento}`" v-model="equipamentosSelecionados[eq.cod_equipamento].selecionado" />
                    <label :for="`edit-eq-${eq.cod_equipamento}`">{{ eq.nome_equipamento }}</label>
                  </div>
                  <div v-if="equipamentosSelecionados[eq.cod_equipamento] && equipamentosSelecionados[eq.cod_equipamento].selecionado" class="equipamento-quantidade">
                    <label :for="`edit-qty-${eq.cod_equipamento}`">Quantidade:</label>
                    <input type="number" :id="`edit-qty-${eq.cod_equipamento}`" v-model.number="equipamentosSelecionados[eq.cod_equipamento].quantidade" min="1" />
                  </div>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-confirm">Salvar</button>
              <button type="button" @click="cancelEdit" class="btn-clear">Cancelar</button>
            </div>
          </form>
        </div>
        <div class="item-actions">
          <button v-if="editIndex !== index" @click="editItem(index)" class="btn">Editar</button>
          <button @click="removeItem(index)" class="btn-remove">Remover</button>
        </div>
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
import '../assets/componentes.css'

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
      ,editIndex: -1,
      editedItem: null
      ,allEquipamentos: [],
      equipamentosSelecionados: {}
    }
  },

  async mounted() {
    // carregar lista de equipamentos para permitir edição no carrinho
    await this.carregarEquipamentos()
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

    async carregarEquipamentos() {
      try {
        const api = await import('@/services/api').then(m => m.default)
        const res = await api.get('/equipamento')
        this.allEquipamentos = Array.isArray(res.data.data) ? res.data.data : Array.isArray(res.data) ? res.data : []

        // inicializar mapa caso ainda não exista (evitar undefined no template)
        const novo = {}
        this.allEquipamentos.forEach(eq => {
          novo[eq.cod_equipamento] = { selecionado: false, quantidade: 1 }
        })
        // mesclar sem sobrescrever seleções existentes
        this.equipamentosSelecionados = Object.assign(novo, this.equipamentosSelecionados || {})
      } catch (err) {
        console.error('Erro ao carregar equipamentos (carrinho):', err)
      }
    },

    editItem(index) {
      // deep copy to avoid mutating the original until saved
      this.editIndex = index
      this.editedItem = JSON.parse(JSON.stringify(this.cartItems[index]))
      // ensure date and time fields exist for the inputs
      if (!this.editedItem.data && this.editedItem.evento_inicio) {
        this.editedItem.data = this.editedItem.data || this.editedItem.evento_inicio.split('T')[0]
      }
      if (!this.editedItem.horaInicio && this.editedItem.evento_inicio) {
        this.editedItem.horaInicio = this.editedItem.horaInicio || new Date(this.editedItem.evento_inicio).toISOString().substr(11,5)
      }
      if (!this.editedItem.horaFim && this.editedItem.evento_fim) {
        this.editedItem.horaFim = this.editedItem.horaFim || new Date(this.editedItem.evento_fim).toISOString().substr(11,5)
      }

      // Inicializar seleção de equipamentos com base no item atual
      // Garantir que a lista de equipamentos esteja carregada
      if (!this.allEquipamentos || this.allEquipamentos.length === 0) {
        // tentar carregar caso ainda não tenha sido carregada
        this.carregarEquipamentos()
      }

      // reset map
      const novoMap = {}
      this.allEquipamentos.forEach(eq => {
        novoMap[eq.cod_equipamento] = { selecionado: false, quantidade: 1 }
      })

      if (Array.isArray(this.editedItem.equipamentos)) {
        this.editedItem.equipamentos.forEach(e => {
          const id = e.cod_equipamento || e.equipamento_cod_equipamento || e.cod
          if (id !== undefined && novoMap[id]) {
            novoMap[id].selecionado = true
            novoMap[id].quantidade = Number(e.quantidade) || Number(e.quantidade) === 0 ? Number(e.quantidade) : Number(e.quantidade_equipamento) || 1
          }
        })
      }

      this.equipamentosSelecionados = novoMap
    },

    cancelEdit() {
      this.editIndex = -1
      this.editedItem = null
    },

    saveEdit(index) {
      // Basic validation
      if (!this.editedItem.nome_evento || !this.editedItem.data || !this.editedItem.horaInicio || !this.editedItem.horaFim) {
        alert('Preencha título, data e horário antes de salvar.')
        return
      }

      // Recreate ISO datetimes based on local date and time (keep same timezone handling as reserva)
      const formatDateTime = (date, time) => {
        const [year, month, day] = date.split('-').map(Number)
        const [hours, minutes] = time.split(':').map(Number)
        const dateUTC = new Date(Date.UTC(year, month - 1, day, hours, minutes))
        dateUTC.setHours(dateUTC.getHours() - 3)
        return dateUTC.toISOString()
      }

      const inicioISO = formatDateTime(this.editedItem.data, this.editedItem.horaInicio)
      const fimISO = formatDateTime(this.editedItem.data, this.editedItem.horaFim)


      // apply changes back to the cart store item
      const updated = JSON.parse(JSON.stringify(this.editedItem))
      updated.evento_inicio = inicioISO
      updated.evento_fim = fimISO
      // keep fields used in UI
      updated.data = this.editedItem.data
      updated.horaInicio = this.editedItem.horaInicio
      updated.horaFim = this.editedItem.horaFim

      // Recolher equipamentos selecionados no editor
      const equipamentosSelecionadosArr = []
      for (const [cod, dados] of Object.entries(this.equipamentosSelecionados || {})) {
        if (dados && dados.selecionado && Number(dados.quantidade) > 0) {
          equipamentosSelecionadosArr.push({ cod_equipamento: cod, quantidade: Number(dados.quantidade) })
        }
      }
      updated.equipamentos = equipamentosSelecionadosArr

      // replace item in store
      this.cartStore.items.splice(index, 1, updated)

      this.editIndex = -1
      this.editedItem = null
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
.header-carrinho {
  margin-top: 20px;
  text-align: start;
  margin-bottom: 20px;
  width: 100%;
  padding: 20px;
  background-color: #1a1a1a;
  border-radius: 8px;
}

.carrinho {
  height: 100vh;
  padding: 20px;
  width: 100%;
  margin: 0 auto;
}

.empty-cart {
  border-radius: 8px;
  text-align: center;
  padding: 40px;
  background-color: #1a1a1a;
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

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: flex;
  flex-direction: column;
}

.time-row {
  display: flex;
  gap: 10px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
