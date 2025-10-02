import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/login', name: 'login', component: () => import('../views/login.vue') },
    { path: '/cadastro', name: 'cadastro', component: () => import('../views/cadastro.vue') },
    { path: '/agendamento', name: 'agendamento', component: () => import('../views/agendamento.vue') },
    { path: '/equipamentos', name: 'equipamentos', component: () => import('../views/equipamentos.vue') },
    { path: '/adicionarEquipamento', name: 'adicionarEquipamento', component: () => import('../views/adicionarEquipamento.vue') },
    { path: '/editarEquipamento/:id', name: 'editarEquipamento', component: () => import('../views/editarEquipamento.vue') },
    { path: '/perfil', name: 'perfil', component: () => import('../views/perfil.vue') },
  ],
})

export default router
