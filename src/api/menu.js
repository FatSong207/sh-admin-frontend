import request from '../axios/index'


//根據id獲取實體
export function GetById (id) {
  return request({
    url: `/menu/${id}`,
    method: 'get'
  })
}

//新增
export function Insert (data) {
  return request({
    url: '/menu',
    method: 'post',
    data: data
  })
}

//修改
export function Update (data) {
  return request({
    url: '/menu',
    method: 'put',
    data: data
  })
}

//獲取用戶路由
export function getUserMenuTree () {
  return request({
    url: '/menu/tree',
    method: 'get'
  })
}

//獲取所有路由，用於功能模塊下的樹狀table顯示
export function getAllMenuTree () {
  return request({
    url: '/menu',
    method: 'get'
  })
}

// //獲取所有路由，用於功能模塊下的Cascader
export function getAllMenuTreeCas () {
  return request({
    url: '/menu/cascader',
    method: 'get'
  })
}
