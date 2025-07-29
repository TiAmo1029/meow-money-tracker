import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 1. 完整地导入 Vant 库
import Vant from 'vant';
// 2. 完整地导入 Vant 的所有 CSS 样式
import 'vant/lib/index.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 3. 全局注册 Vant 插件
app.use(Vant);

app.mount('#app')