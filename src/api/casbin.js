import request from '../axios/index'

// 獲取casbin規則
export function GetAccessApiPathByRoleId (roleid) {
  return request({
    url: `/casbin/${roleid}`,
    method: 'get',
  })
}

// 修改casbin規則
export function UpdateCasbin (data) {
  return request({
    url: `/casbin`,
    method: 'put',
    data:data
  })
}