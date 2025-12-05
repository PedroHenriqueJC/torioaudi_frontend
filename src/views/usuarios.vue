<template>
    <div class="container">
        <h1>Gerenciar Usuários</h1>
        
        <div class="pesquisar-usuarios">
            <h2>Pesquisar Usuários</h2>
            <input 
                type="text" 
                v-model="busca" 
                placeholder="Busque por nome ou email" 
                class="search-bar"
            />
        </div>

        <div v-if="carregando" class="loading">Carregando usuários...</div>
        
        <div v-else-if="usuariosFiltrados.length">
            <table class="usuarios-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Tipo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="usuario in usuariosFiltrados" :key="usuario.cod_usuario">
                        <td>{{ usuario.nome_usuario }}</td>
                        <td>{{ usuario.email_usuario }}</td>
                        <td>{{ usuario.role_usuario === 1 ? 'Admin' : 'Usuário' }}</td>
                        <td class="acoes">
                            <button @click="abrirModalEdicao(usuario)" class="btn-editar">Editar</button>
                            <button @click="excluirUsuario(usuario.cod_usuario)" class="btn-excluir">Excluir</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <p v-else class="no-results">Nenhum usuário encontrado.</p>

        <!-- Modal de Edição -->
        <div v-if="mostrarModal" class="modal-overlay" @click="fecharModal">
            <div class="modal" @click.stop>
                <div class="modal-header">
                    <h2>Editar Usuário</h2>
                    <button @click="fecharModal" class="btn-fechar">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Nome:</label>
                        <input v-model="usuarioEmEdicao.nome_usuario" type="text" />
                    </div>
                    <div class="form-group">
                        <label>Email:</label>
                        <input v-model="usuarioEmEdicao.email_usuario" type="email" />
                    </div>
                    <div class="form-group">
                        <label>Tipo:</label>
                        <select v-model.number="usuarioEmEdicao.role_usuario">
                            <option :value="0">Usuário</option>
                            <option :value="1">Admin</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="fecharModal" class="btn-cancelar">Cancelar</button>
                    <button @click="salvarEdicao" class="btn-salvar">Salvar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/api';
import '../assets/componentes.css';

const busca = ref('');
const usuarios = ref([]);
const carregando = ref(false);
const mostrarModal = ref(false);
const usuarioEmEdicao = ref({
    cod_usuario: null,
    nome_usuario: '',
    email_usuario: '',
    role_usuario: 0
});

// Carregar todos os usuários ao montar o componente
async function carregarUsuarios() {
    carregando.value = true;
    try {
        const res = await api.get('/usuarios');
        console.log('Usuários carregados:', res.data);
        usuarios.value = Array.isArray(res.data.data) ? res.data.data : 
                        Array.isArray(res.data) ? res.data : [];
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        usuarios.value = [];
    } finally {
        carregando.value = false;
    }
}

// Filtrar usuários com base na busca
const usuariosFiltrados = computed(() => {
    if (!busca.value.trim()) {
        return usuarios.value;
    }
    
    const termo = busca.value.toLowerCase();
    return usuarios.value.filter(usuario => 
        usuario.nome_usuario?.toLowerCase().includes(termo) ||
        usuario.email_usuario?.toLowerCase().includes(termo)
    );
});

// Abrir modal para editar usuário
function abrirModalEdicao(usuario) {
    usuarioEmEdicao.value = {
        cod_usuario: usuario.cod_usuario,
        nome_usuario: usuario.nome_usuario,
        email_usuario: usuario.email_usuario,
        role_usuario: usuario.role_usuario
    };
    mostrarModal.value = true;
}

// Fechar modal
function fecharModal() {
    mostrarModal.value = false;
    usuarioEmEdicao.value = {
        cod_usuario: null,
        nome_usuario: '',
        email_usuario: '',
        role_usuario: 0
    };
}

// Contar quantos admins existem
function contarAdmins() {
    return usuarios.value.filter(u => u.role_usuario === 1).length;
}

// Salvar edição do usuário
async function salvarEdicao() {
    try {
        // Validar campos obrigatórios
        if (!usuarioEmEdicao.value.nome_usuario.trim()) {
            alert('Nome é obrigatório!');
            return;
        }
        
        if (!usuarioEmEdicao.value.email_usuario.trim()) {
            alert('Email é obrigatório!');
            return;
        }
        
        // Verificar se está tentando remover o último admin
        const usuarioAnterior = usuarios.value.find(u => u.cod_usuario === usuarioEmEdicao.value.cod_usuario);
        
        if (usuarioAnterior.role_usuario === 1 && usuarioEmEdicao.value.role_usuario === 0) {
            // Tentando mudar de admin para usuário
            if (contarAdmins() === 1) {
                alert('Erro: Não é possível remover o último administrador do sistema!');
                return;
            }
        }
        
        const payload = {
            nome_usuario: usuarioEmEdicao.value.nome_usuario,
            email_usuario: usuarioEmEdicao.value.email_usuario,
            role_usuario: usuarioEmEdicao.value.role_usuario
        };
        
        const response = await api.put(`/user/${usuarioEmEdicao.value.cod_usuario}`, {
            nome_usuario: usuarioEmEdicao.value.nome_usuario,
            email_usuario: usuarioEmEdicao.value.email_usuario,
            role_usuario: usuarioEmEdicao.value.role_usuario
        });
        
        // Atualizar a lista de usuários
        await carregarUsuarios();
        fecharModal();
        alert('Usuário atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        alert('Erro: ' + (error.response?.data?.message || error.response?.data?.error || error.message));
    }
}

// Excluir usuário
async function excluirUsuario(codUsuario) {
    // Verificar se é um admin e se é o último
    const usuarioParaExcluir = usuarios.value.find(u => u.cod_usuario === codUsuario);
    
    if (usuarioParaExcluir.role_usuario === 1 && contarAdmins() === 1) {
        alert('Erro: Não é possível excluir o último administrador do sistema!');
        return;
    }
    
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        try {
            await api.delete(`/usuarios/${codUsuario}`);
            
            // Atualizar a lista de usuários
            await carregarUsuarios();
            alert('Usuário excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            alert('Erro ao excluir usuário. Tente novamente.');
        }
    }
}

onMounted(() => {
    carregarUsuarios();
});
</script>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

h1 {
    color: #f0f0f0;
    margin-bottom: 2rem;
}

.pesquisar-usuarios {
    width: 100%;
    padding: 1.5rem;
    margin-bottom: 2rem;
    background-color: #1f1f1f;
    border-radius: 8px;
}


.search-bar {
    width: 100%;
    padding: 0.8rem;
    border-radius: 8px;
    border: 2px solid #f0f0f0;
    background-color: #2b2b2b;
    color: #f0f0f0;
    font-size: 1.1rem;
    transition: border-color 0.3s;
}

.search-bar:focus {
    outline: none;
    border-color: #0f7026;
}

.loading {
    text-align: center;
    color: #999;
    font-style: italic;
    padding: 2rem;
}

.no-results {
    text-align: center;
    color: #999;
    padding: 2rem;
}

.usuarios-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #1f1f1f;
    border-radius: 8px;
    overflow: hidden;
}

.usuarios-table thead {
    background-color: #0f7026;
    color: white;
}

.usuarios-table th {
    padding: 1rem;
    text-align: left;
    font-weight: bold;
}

.usuarios-table td {
    padding: 1rem;
    color: #f0f0f0;
    border-bottom: 1px solid #333;
}

.usuarios-table tbody tr:hover {
    background-color: #2b2b2b;
}

.acoes {
    display: flex;
    gap: 0.5rem;
}

.btn-editar,
.btn-excluir,
.btn-cancelar,
.btn-salvar {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: bold;
    transition: background-color 0.3s;
}

.btn-editar {
    background-color: #0f7026;
    color: white;
}

.btn-editar:hover {
    background-color: #0d5a1f;
}

.btn-excluir {
    background-color: #c41e3a;
    color: white;
}

.btn-excluir:hover {
    background-color: #a01730;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background-color: #1f1f1f;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 500px;
    overflow: hidden;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background-color: #0f7026;
    color: white;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
}

.btn-fechar {
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    padding: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-fechar:hover {
    opacity: 0.8;
}

.modal-body {
    padding: 1.5rem;
    color: #f0f0f0;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #f0f0f0;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 0.8rem;
    border-radius: 4px;
    border: 2px solid #333;
    background-color: #2b2b2b;
    color: #f0f0f0;
    font-size: 1rem;
    box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #0f7026;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 1.5rem;
    background-color: #2b2b2b;
    border-top: 1px solid #333;
}

.btn-cancelar {
    background-color: #666;
    color: white;
}

.btn-cancelar:hover {
    background-color: #555;
}

.btn-salvar {
    background-color: #0f7026;
    color: white;
}

.btn-salvar:hover {
    background-color: #0d5a1f;
}
</style>