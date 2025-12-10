<template>
    <div class="container">
        <div class="box">
            <h1>Meu Perfil</h1>
            
            <div class="profile-info">
                <div class="info-item">
                    <label>Nome:</label>
                    <p>{{ usuario.nome }}</p>
                </div>
                <div class="info-item">
                    <label>Email:</label>
                    <p>{{ usuario.email }}</p>
                </div>
                <!-- <div class="info-item">
                    <label>Tipo de Usuário:</label>
                    <p>{{ usuario.tipo }}</p>
                </div> -->
            </div>

            <div class="buttons">
                <router-link to="/editar-perfil" class="botaoVerde">Editar Perfil</router-link>
                <button @click="logout" class="botaoSair">Sair da Conta</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import '../assets/componentes.css'

const router = useRouter()
const authStore = useAuthStore()

const usuario = ref({
    nome: '',
    email: '',
    tipo: ''
})

onMounted(() => {
    if (authStore.user) {
        usuario.value.nome = authStore.user.nome_usuario || authStore.user.nome || 'N/A'
        usuario.value.email = authStore.user.email_usuario || authStore.user.email || 'N/A'
        
        // Determinar tipo de usuário
        const role = authStore.user.role || authStore.user.tipo_usuario
        usuario.value.tipo = role === 0 || role === '0' ? 'Usuário Comum' : role === 1 || role === '1' ? 'Administrador' : 'Desconhecido'
    } else {
        router.push('/login')
    }
})

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        authStore.logout()
        router.push('/login')
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

.botaVerde:hover{
    filter: brightness(1.3);
  transition: 0.3s;
}

.box {
    background-color: #1f1f1f;
    padding: 3rem;
    border-radius: 15px;
    width: 100%;
    max-width: 500px;
    text-align: center;
}

h1 {
    color: #f0f0f0;
    margin-bottom: 2rem;
    font-weight: 500;
    font-size: 2rem;
}

.profile-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
    text-align: left;
}

.info-item {
    padding: 1rem;
    background-color: #2b2b2b;
    border-radius: 8px;
    border-left: 4px solid #0f7026;
}

.info-item label {
    display: block;
    color: #999;
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
    text-transform: uppercase;
}

.info-item p {
    color: #f0f0f0;
    font-size: 1.1rem;
    margin: 0;
}

.buttons {
    display: flex;
    gap: 10px;
    flex-direction: column;
}

.botaoEditar {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
    font-size: 16px;
    transition: background-color 0.2s;
    display: inline-block;
}


.botaoSair {
    padding: 10px 20px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s;
}

</style>