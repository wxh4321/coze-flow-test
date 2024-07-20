import { createApp } from 'vue'
import './index.css'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 公共样式引入
import './styles/variables.css'
import './styles/ui-rewrite.scss'
import './styles/common.scss'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)

app.config.performance = true
app.use(ElementPlus)
app.use(router)
app.use(createPinia())
app.mount('#root')
