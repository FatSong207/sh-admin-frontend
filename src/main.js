import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import router from './router/index'
import { store } from './store/index'
import '../src/style/index.scss'

createApp(App)
  .use(Antd)
  .use(router)
  .use(store)
  .mount('#app')
