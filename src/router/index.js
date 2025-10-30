import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      name: 'home', 
      component: Home 
    },
    { 
      path: '/login', 
      name: 'login', 
      component: () => import('../views/login.vue'),
      meta: { requiresGuest: true }
    },
    { 
      path: '/cadastro', 
      name: 'cadastro', 
      component: () => import('../views/cadastro.vue'),
      meta: { requiresGuest: true }
    },
    { 
      path: '/agendamento', 
      name: 'agendamento', 
      component: () => import('../views/agendamento.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/equipamentos', 
      name: 'equipamentos', 
      component: () => import('../views/equipamentos.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/adicionarEquipamento', 
      name: 'adicionarEquipamento', 
      component: () => import('../views/adicionarEquipamento.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/editarEquipamento/:id', 
      name: 'editarEquipamento', 
      component: () => import('../views/editarEquipamento.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/perfil', 
      name: 'perfil', 
      component: () => import('../views/perfil.vue'),
      meta: { requiresAuth: true }
    },
    { 
      path: '/salas', 
      name: 'salas', 
      component: () => import('../views/salas.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: () => import('../views/usuarios.vue'),
      meta: { requiresAuth: true
      }
    },
    {
      path: '/adicionarSala',
      name: 'adicionarSala',
      component: () => import('../views/adicionarSala.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/editarSala/:id',
      name: 'editarSala',
      component: () => import('../views/editarSala.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/carrinho',
      name: 'carrinho',
      component: () => import('../views/carrinho.vue'),
      meta: { requiresAuth: true }
    }
  ],
})


// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token')
//   const isAuthenticated = !!token

//   // Rota requer autenticação
//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next('/login')
//     return
//   }

//   // Rota é apenas para visitantes (login/cadastro)
//   if (to.meta.requiresGuest && isAuthenticated) {
//     next('/')
//     return
//   }

//   // Caso contrário, permite a navegação
//   next()
// })

export default router
