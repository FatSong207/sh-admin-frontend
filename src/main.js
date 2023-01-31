import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import router from './router/index'
import { store } from './store/index'
import '../src/style/index.scss'
import * as antIcons from '@ant-design/icons-vue'
import antdIcon from './assets/antdicon'

const app = createApp(App)
Object.keys(antIcons).forEach(k => {
  app.component(k, antIcons[k])
  // console.log(k)
  if (k.indexOf('Outlined') != -1) {
    //|| k.indexOf('Filled') != -1
    antdIcon.push({
      value: k,
      label: k,
      icon: k
    })
  }
})
app.config.globalProperties.$antIcons = antIcons

app
  .use(Antd)
  .use(router)
  .use(store)
  .mount('#app')
// console.log(app)
