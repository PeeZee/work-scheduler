import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import store from './store/index.js'

store.dispatch('groups/fetchGroups')
store.dispatch('tasks/fetchTasks')
store.dispatch('events/fetchEvents')

import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

import './styles.css'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(FloatingVue)

app.mount('#app')
