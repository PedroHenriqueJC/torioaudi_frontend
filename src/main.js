import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Navbar from './components/navbar.vue'

const app = createApp(App)
const pinia = createPinia()

app.component('Navbar', Navbar)
app.use(pinia)
app.use(router)

app.mount('#app')
