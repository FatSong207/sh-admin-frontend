import axios from 'axios'
import router from '../router/index'
import { message, notification } from 'ant-design-vue'
import { useUserStore } from '../store/user'

const host = window.location.hostname

switch (host) {
  case 'www.zocrm.cloud':
    axios.defaults.baseURL = 'https://www.zocrm.cloud/api'
    break
  default:
    axios.defaults.baseURL = 'http://127.0.0.1:5001/api'
    break
}

const request = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

request.interceptors.request.use(config => {
  const userStore = useUserStore()
  config.headers = {
    uid: userStore.userInfo.Id,
    token: userStore.token
  }
  // config.headers['uid'] = localStorage.getItem('uid')
  // config.headers['ver'] = localStorage.getItem('ver')
  // config.headers['token'] = localStorage.getItem('token')
  return config
})

request.interceptors.response.use(
  response => {
    // console.log(response)
    if (response.data.code == 1) {
      message.error('服務器異常！')
    } else if (response.data.code === 10041) {
      notification['error']({
        message: 'Token錯誤',
        description: '請重新登入!'
      })
      setTimeout(() => {
        router.push('/login')
      }, 500)
      return response
    } else if (response.data.code != 0) {
      message.error(response.data.message)
      return response
    }
    return response
  },
  error => {
    console.log(error)
    router.push('/error')
    return Promise.reject(error)
  }
)

export default request
