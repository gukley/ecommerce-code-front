import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'animate.css'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Toast, { 
    transition: "Vue-Toastification__fade",
    maxToasts: 5,
    timeout: 3000,
    position: "top-right",
})

app.mount('#app')
