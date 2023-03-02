import request from '../axios/index'

// user列表
export function GetUserList (param) {
  return request({
    url: '/user',
    method: 'get',
    params: param
  })
}

//根據id獲取實體
export function GetUserById (id) {
  return request({
    url: `/user/${id}`,
    method: 'get'
  })
}

//修改
export function UpdateUser (data) {
  return request({
    url: '/user',
    method: 'put',
    data: data
  })
}

//寄信
export function SendMailToUser (data) {
  return request({
    url: '/user/sendmail',
    method: 'post',
    data: data
  })
}
