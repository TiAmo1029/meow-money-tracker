import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index';
import { createPinia } from 'pinia';


// 1. 引入Vant的核心组件库
import Vant from 'vant';
// 2. 引入Vant的全局样式
import 'vant/lib/index.css';


const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Vant); // 3. 注册Vant插件

app.mount('#app');