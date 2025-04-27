import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import highlightPlugin from './utils/highlighter'

// 导入highlight.js样式
import 'highlight.js/styles/atom-one-light.css'

const app = createApp(App)

// 注册代码高亮插件
app.use(highlightPlugin)

app.mount('#app')
