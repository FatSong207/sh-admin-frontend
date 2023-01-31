import { asyncRouterHandle } from '../utils/asyncRouter'

import { getUserMenuTree } from '../api/menu'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import Error from '../views/Error.vue'
import Home from '../views/Home.vue'

const routerListArr = []
const keepAliveRoutersArr = []

const formatRouter = (routes, routeMap) => {
  routes &&
    routes.forEach(item => {
      if (
        (!item.children || item.children.every(ch => ch.hidden)) &&
        (item.name !== '404' || item.name !== '403') &&
        !item.hidden
      ) {
        routerListArr.push({ label: item.meta.title, value: item.name })
      }
      item.meta.btns = item.btns
      item.meta.hidden = item.hidden
      routeMap[item.name] = item
      if (item.children && item.children.length > 0) {
        formatRouter(item.children, routeMap)
      }
    })
}

export const useRouterStore = defineStore('router', () => {
  const asyncRouters = ref([])
  const routerList = ref(routerListArr)
  const keepAliveRouters = ref(keepAliveRoutersArr)
  const routeMap = {}
  // 後端獲取路由
  const SetAsyncRouter = async () => {
    const baseRouter = [
      {
        path: '/',
        name: 'Home',
        component: 'views/Home.vue',
        redirect: '/dashboard',
        meta: {
          title: '底層'
        },
        children: []
      },
    ]
    const asyncRouterRes = await getUserMenuTree()
    // console.log('asyncRouterRes123', asyncRouterRes)
    const asyncRouter = asyncRouterRes.data.data
    // console.log(asyncRouter, 'asyncRouter')
    asyncRouter &&
      asyncRouter.push(
        {
          path: '*',
          redirect: '/404',
          hidden: true,
          meta: {
            hidden: true
          }
        },
        {
          path: '*',
          redirect: '/403',
          hidden: true,
          meta: {
            hidden: true
          }
        }
      )
    formatRouter(asyncRouter, routeMap)
    baseRouter[0].children = asyncRouter
    baseRouter.push({
      path: '/:catchAll(.*)',
      redirect: '/404'
    })
    //檢查是否匹配
    asyncRouterHandle(baseRouter)
    asyncRouters.value = baseRouter
    routerList.value = routerListArr
    return true
  }

  return {
    asyncRouters,
    routerList,
    SetAsyncRouter,
    routeMap
  }
})
