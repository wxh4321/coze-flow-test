import { createApp } from 'vue'
import './index.css'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue'
import { router } from './router'

const app = createApp(App)

app.config.performance = true
app.use(ElementPlus)
app.use(router)
app.use(createPinia())
app.mount('#root')
