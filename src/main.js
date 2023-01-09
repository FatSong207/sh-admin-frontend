import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import router from './router/index'
import { store } from './store/index'

createApp(App)
  .use(Antd)
  .use(router)
  .use(store)
  .mount('#app')
