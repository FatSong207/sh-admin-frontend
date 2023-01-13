import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Index from '../views/Index.vue'
import { useUserStore } from '../store/user'
import { useRouterStore } from '../store/router'

let asyncRouterFlag = 0

const whiteList = ['Login', 'Pass', 'Register']

const getRouter = async userStore => {
  const routerStore = useRouterStore()
  await routerStore.SetAsyncRouter()
  await userStore.GetUserInfo()
  //這裡的asyncRouters是經過asyncRouterHandle()處理過的
  const asyncRouters = routerStore.asyncRouters
  asyncRouters.forEach(asyncRouter => {
    router.addRoute(asyncRouter)
  })
}

const routes = [
  {
    path: '/',
    component: Index,
    redirect: '/login',
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue')
      },
      {
        path: '/pass',
        name: 'Pass',
        component: () => import('../views/Pass.vue')
      },
      {
        path: '/404',
        name: 'Page404',
        component: () => import('../views/404.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

NProgress.configure({
  easing: 'ease',
  speed: 500,
  showSpinner: true
})

router.beforeEach(async (to, from) => {
  NProgress.start()

  const userStore = useUserStore()
  to.meta.matched = [...to.matched]
  const token = userStore.token
  if (whiteList.indexOf(to.name) > -1) {
    if (token) {
      if (!asyncRouterFlag && whiteList.indexOf(from.name) < 0) {
        asyncRouterFlag++
        await getRouter(userStore)
      }
      // token 可以解析但是却是不存在的用户 id 或角色 id 会导致无限调用
      if (userStore.userInfo?.authority?.defaultRouter != null) {
        return { name: userStore.userInfo.authority.defaultRouter }
      } else {
        // 强制退出账号
        userStore.ClearStorage()
        return {
          name: 'Login',
          query: {
            redirect: document.location.hash
          }
        }
      }
    } else {
      return true
    }
  } else {
    // 不在白名单中并且已经登录的时候
    if (token) {
      // 添加flag防止多次获取动态路由和栈溢出
      if (!asyncRouterFlag && whiteList.indexOf(from.name) < 0) {
        asyncRouterFlag++
        await getRouter(userStore)
        if (userStore.token) {
          return { ...to, replace: true }
        } else {
          return {
            name: 'Login',
            query: { redirect: to.href }
          }
        }
      } else {
        if (to.matched.length) {
          return true
        } else {
          return { path: '/layout/404' }
        }
      }
    }
    // 不在白名单中并且未登录的时候
    if (!token) {
      return {
        name: 'Login',
        query: {
          redirect: document.location.hash
        }
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
