import request from '../axios/index'

// api列表
export function GetAuthorizeIds (roleid) {
  return request({
    url: `/roleauthorize/${roleid}`,
    method: 'get'
  })
}

//修改
export function UpdateRoleAuthorize (data) {
  return request({
    url: '/roleauthorize',
    method: 'put',
    data: data
  })
}
