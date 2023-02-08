import { userLogin, getUserInfo } from '../api/user'
import { getUserMenuTree } from '../api/menu'
import { defineStore } from 'pinia'
import router from '../router/index'
import { ref, computed, watch } from 'vue'
import { useRouterStore } from '../store/router'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    Id: '',
    Name: '',
    email: ''
  })
  const token = ref(window.localStorage.getItem('token') || '')
  const accessRoute = ref([])

  const setUserInfo = val => {
    userInfo.value = val
  }

  const setToken = val => {
    token.value = val
  }

  const setUserMenu = val => {
    accessRoute.value = val
  }

  /*獲取用戶信息*/
  const GetUserInfo = async () => {
    const res = await getUserInfo()
    // const roures = await getUserMenuTree()
    if (res.data.code === 0) {
      setUserInfo(res.data.data)
      // setUserMenu(roures.data.data)
      // console.log(roures.data.data)
      // console.log(res.data.data)
    }
    return res
  }

  /*登入*/
  const Login = async (loginInfo,remember) => {
    try {
      const res = await userLogin(loginInfo)
      if (res.data.code === 0) {
        setUserInfo(res.data.data.user)
        setToken(res.data.data.token)
        if (remember) {
          localStorage.setItem("email",loginInfo.email)
        }else{
          localStorage.removeItem("email")
        }
        const routerStore = useRouterStore()
        await routerStore.SetAsyncRouter()
        const asyncRouters = routerStore.asyncRouters
        asyncRouters.forEach(asyncRouter => {
          router.addRoute(asyncRouter)
        })
        // router.push('/home')
        await router.push({ name: 'Home' })
        return true
      }
    } catch (e) {
      console.log(e)
    }
  }

  /* 登出*/
  const LogOut = async () => {
    // const res = await jsonInBlacklist()
    // if (res.code === 0) {
    token.value = ''
    sessionStorage.clear()
    // localStorage.clear()
    router.push({ path: '/login', replace: true })
    window.location.reload()
    // }
  }

  /* 清理数据 */
  const ClearStorage = async () => {
    token.value = ''
    sessionStorage.clear()
    localStorage.clear()
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
    accessRoute,
    Login,
    LogOut,
    GetUserInfo,
    ClearStorage
  }
})
