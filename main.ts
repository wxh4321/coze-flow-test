import { createApp } from 'vue'
import './index.css'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css';
import App from './App.vue'
import { router } from './router'
import './src/styles/variables.css'
import './src/styles/ui-rewrite.scss'
import './src/styles/common.scss'

const app = createApp(App)

app.config.performance = true
app.use(router)
app.use(createPinia())
app.mount('#root')
