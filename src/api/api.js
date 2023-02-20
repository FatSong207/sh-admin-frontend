import request from '../axios/index'

// api列表
export function getApiList (param) {
  return request({
    url: '/api',
    method: 'get',
    params: param
  })
}

//根據id獲取實體
export function GetApiById (id) {
  return request({
    url: `/api/${id}`,
    method: 'get'
  })
}

//新增
export function InsertApi (data) {
  return request({
    url: '/api',
    method: 'post',
    data: data
  })
}

//修改
export function UpdateApi (data) {
  return request({
    url: '/api',
    method: 'put',
    data: data
  })
}

//刪除
export function DeleteApi (ids) {
  return request({
    url: `/api/${ids}`,
    method: 'delete'
  })
}
