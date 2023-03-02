import request from '../axios/index'

// role列表
export function getRoleList (param) {
  return request({
    url: '/role',
    method: 'get',
    params: param
  })
}

//根據id獲取實體
export function GetRoleById (id) {
  return request({
    url: `/role/${id}`,
    method: 'get'
  })
}

//新增
export function InsertRole (data) {
  return request({
    url: '/role',
    method: 'post',
    data: data
  })
}

//修改
export function UpdateRole (data) {
  return request({
    url: '/role',
    method: 'put',
    data: data
  })
}

//刪除
export function DeleteRole (ids) {
  return request({
    url: `/role/${ids}`,
    method: 'delete'
  })
}

// All Role下拉
export function GetAllRole () {
  return request({
    url: '/role/all',
    method: 'get'
  })
}
