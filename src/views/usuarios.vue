<template>
    <div class="pesquisar-usuarios">
        <h2>Pesquisar Usuários : </h2>
        <input type="text" v-model="busca" placeholder="Busca de usuários" class="search-bar"/>
        <ul v-if="usuarios.length">
            <li v-for="usuario in usuarios" :key="usuario.id">
                {{ usuario.nome }} - {{ usuario.email }}
            </li>
        </ul>
        <p v-else>Nenhum usuário encontrado.</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'gerenciarUsuarios',
    data() {
        return {
            search: '',
            usuarios: [],
        };
    },
    methods: {
        async fetchUsuarios() {
            if (!this.search) {
                this.usuarios = [];
                return;
            }
            try {
                const response = await axios.get(
                    '/api/usuarios'
                );
                this.usuarios = response.data;
            } catch (error) {
                this.usuarios = [];
            }
        },
    },
};
</script>

<style scoped>
.pesquisar-usuarios {
    width: 100%;
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.search-bar {
    margin: 15px 0;
    padding: 5px;
    width: 100%;
    padding: 0.8rem;
    border-radius: 8px;
    background-color: #2b2b2b;
    color: #f0f0f0;
    font-size: 1.1rem;

}
ul {
    list-style: none;
    padding: 0;
}
li {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}
</style>