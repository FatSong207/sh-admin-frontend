import request from '../axios/index'

// TaskJob列表
export function GetTaskJobList (param) {
  return request({
    url: '/taskjob',
    method: 'get',
    params: param
  })
}

// TaskJob變更狀態
export function UpdateTaskJobStatus (data) {
  return request({
    url: '/taskjob/status',
    method: 'put',
    data: data
  })
}

//根據id獲取實體
export function GetTaskJobById (id) {
  return request({
    url: `/taskjob/${id}`,
    method: 'get'
  })
}

// 修改TaskJob
export function UpdateTaskJob (data) {
  return request({
    url: '/taskjob',
    method: 'put',
    data: data
  })
}
