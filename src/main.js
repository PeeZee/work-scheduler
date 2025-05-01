import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles.css'
import store from './store'

import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(FloatingVue)

app.mount('#app')
