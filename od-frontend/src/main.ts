import './assets/main.css'

import { createApp } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Add the necessary CSS
import 'bootstrap-italia/dist/css/bootstrap-italia.min.css'
// import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app = createApp(App)

app.use(createPinia())
app.use(createBootstrap()) // Important
app.use(router)

app.mount('#app')
