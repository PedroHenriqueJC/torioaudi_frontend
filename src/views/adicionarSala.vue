<script setup>
import { ref, onMounted } from "vue"
import api from "@/services/api"
import '../assets/componentes.css'

const nome = ref("")
const descricao = ref("")
const capacidade = ref("")
const localizacao = ref("")
const mensagem = ref("")
const equipamentos = ref([])
const equipamentosSelecionados = ref({})

// Carregar equipamentos do banco de dados
async function carregarEquipamentos() {
  try {
    const res = await api.get("/equipamento")
    equipamentos.value = Array.isArray(res.data.data) ? res.data.data : 
                        Array.isArray(res.data) ? res.data : []
    
    // Inicializar objeto de equipamentos selecionados
    equipamentos.value.forEach(eq => {
      equipamentosSelecionados.value[eq.cod_equipamento] = {
        selecionado: false,
        quantidade: 1
      }
    })
  } catch (error) {
    console.error("Erro ao carregar equipamentos:", error)
    mensagem.value = "Erro ao carregar equipamentos"
  }
}

async function salvarSala() {
  if (!nome.value || !descricao.value || !capacidade.value || !localizacao.value) {
    mensagem.value = "Preencha todos os campos!"
    return
  }

  // Validar se há equipamentos selecionados
  const equipamentosParaAdicionar = Object.entries(equipamentosSelecionados.value)
    .filter(([_, eq]) => eq.selecionado && eq.quantidade > 0)

  try {
    const salaRes = await api.post("/salas", {
      nome_sala: nome.value,
      descricao_sala: descricao.value,
      capacidade_sala: capacidade.value,
      localizacao_sala: localizacao.value
    })

    const salaCodigo = salaRes.data.data?.cod_sala || salaRes.data?.cod_sala

    // Adicionar equipamentos à sala se houver selecionados
    if (equipamentosParaAdicionar.length > 0 && salaCodigo) {
      for (const [codEquipamento, equipamento] of equipamentosParaAdicionar) {
        await api.post("/sala-equipamento", {
          sala_cod_sala: salaCodigo,
          equipamento_cod_equipamento: codEquipamento,
          quantidade_equipamento: equipamento.quantidade
        })
      }
    }

    mensagem.value = "Sala cadastrada com sucesso!"
    
    // limpar formulário
    nome.value = ""
    descricao.value = ""
    capacidade.value = ""
    localizacao.value = ""
    Object.keys(equipamentosSelecionados.value).forEach(key => {
      equipamentosSelecionados.value[key] = { selecionado: false, quantidade: 1 }
    })
  } catch (error) {
    console.error("Erro ao salvar", error)
    mensagem.value = "Erro ao cadastrar sala."
  }
}

onMounted(() => {
  carregarEquipamentos()
})
</script>

<template>
  <div class="container">
    <div class="box">
      <h1>Adicionar Sala</h1>
      <form @submit.prevent="salvarSala">
        <div class="form-group">
          <label for="nome">Nome da sala:</label>
          <input id="nome" v-model="nome" type="text" placeholder="Ex: Laboratório de informática 01" />
        </div>

        <div class="form-group">
          <label for="descricao">Descrição:</label>
          <textarea id="descricao" v-model="descricao" placeholder="Ex: Laboratório para uso de computadores" rows="10"></textarea>
        </div>
        <div class="form-group">
          <label for="capacidade">Capacidade:</label>
          <input id="capacidade" v-model="capacidade" type="number" placeholder="Ex: 20" />
        </div>
        <div class="form-group">
            <label for="localizacao">Localização:</label>
            <textarea id="localizacao" v-model="localizacao" placeholder="Ex: Prédio A, 2º andar"></textarea>
        </div>

        <div class="form-group">
          <label>Equipamentos:</label>
          <div class="equipamentos-container">
            <div v-if="equipamentos.length === 0" class="sem-equipamentos">
              Nenhum equipamento disponível
            </div>
            <div v-for="equipamento in equipamentos" :key="equipamento.cod_equipamento" class="equipamento-item">
              <div class="equipamento-checkbox">
                <input 
                  type="checkbox" 
                  :id="`eq-${equipamento.cod_equipamento}`"
                  v-model="equipamentosSelecionados[equipamento.cod_equipamento].selecionado"
                />
                <label :for="`eq-${equipamento.cod_equipamento}`">
                  {{ equipamento.nome_equipamento }}
                </label>
              </div>
              <div v-if="equipamentosSelecionados[equipamento.cod_equipamento].selecionado" class="equipamento-quantidade">
                <label :for="`qty-${equipamento.cod_equipamento}`">Quantidade:</label>
                <input 
                  type="number" 
                  :id="`qty-${equipamento.cod_equipamento}`"
                  v-model.number="equipamentosSelecionados[equipamento.cod_equipamento].quantidade"
                  min="1"
                  placeholder="Quantidade"
                />
              </div>
            </div>
          </div>
        </div>

        <button class="botaoPadrao" type="submit">Adicionar</button>
      </form>

      <p v-if="mensagem" class="mensagem">{{ mensagem }}</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 110vh;
  color: #f0f0f0;
  justify-content: center;
  align-items: center ;
}

.box {
  background-color: #1f1f1f; /* grafite escuro */
  padding: 3rem;
  border-radius: 15px;
  width: 50%;
  text-align: center;
}

/*tituko*/
.box h1 {
  color: #f0f0f0; /* branco gelo */
  margin-bottom: 2rem;
  font-weight: 500;
  font-size: 2rem;
}

/*grupo*/
.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

/*labels*/
.form-group label {
  align-self: flex-start;
  color: #f0f0f0;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 1.1rem;
}

/*campos*/
.form-group input, textarea {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 2px solid #f0f0f0;
  background-color: #2b2b2b;
  color: #f0f0f0;
  font-size: 1.1rem;
}

.form-group input:focus, textarea:focus {
  outline: none;
  border-color: #cacaca;
}

.mensagem {
  margin-top: 15px;
  color: white;
}

.equipamentos-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sem-equipamentos {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 1rem;
}

.equipamento-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #2B2B2B;
  border-radius: 6px;
  border-left: 3px solid #0f7026;
}

.equipamento-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.equipamento-checkbox input[type="checkbox"] {
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  accent-color: #0f7026;
}

.equipamento-checkbox label {
  cursor: pointer;
  color: #f0f0f0;
  font-weight: 500;
  margin: 0;
  flex: 1;
}

.equipamento-quantidade {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: 2rem;
  padding: 0.5rem;
  background-color: #2b2b2b;
  border-radius: 4px;
}

.equipamento-quantidade label {
  color: #f0f0f0;
  font-weight: 500;
  white-space: nowrap;
  font-size: 0.95rem;
}

.equipamento-quantidade input {
  width: 80px;}
</style>
