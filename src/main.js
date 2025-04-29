import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import highlightPlugin from './utils/highlighter'

// 导入自定义高亮样式
import './styles/custom-highlight.css'

const app = createApp(App)

// 注册代码高亮插件
app.use(highlightPlugin)

app.mount('#app')
