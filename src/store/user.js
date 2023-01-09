import { userLogin, getUserInfo } from '../api/user'
import { defineStore } from 'pinia'
import router from '../router/index'
import { ref, computed, watch } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    Id: '',
    Name: '',
    email: ''
  })
  const token = ref(window.localStorage.getItem('token') || '')

  const setUserInfo = val => {
    userInfo.value = val
  }

  const setToken = val => {
    token.value = val
  }

  /*獲取用戶信息*/
  const GetUserInfo = async () => {
    const res = await getUserInfo()
    if (res.data.code === 0) {
      setUserInfo(res.data.data)
      console.log(res.data.data)
    }
    return res
  }

  /*登入*/
  const Login = async loginInfo => {
    try {
      const res = await userLogin(loginInfo)
      if (res.data.code === 0) {
        setUserInfo(res.data.data.user)
        setToken(res.data.data.token)
        router.push('/home')
        return true
      }
    } catch (e) {
      console.log(e)
    }
  }

  //偵測token是否更新
  watch(
    () => token.value,
    () => {
      window.localStorage.setItem('token', token.value)
    }
  )
  return {
    userInfo,
    token,
    Login,
    GetUserInfo
  }
})
