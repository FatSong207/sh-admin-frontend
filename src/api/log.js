import request from '../axios/index'

// 列表
export function getLogList(param) {
    return request({
		url: '/logs',
		method: 'get',
		params: param,
	})
}
