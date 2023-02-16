import request from '../axios/index'

// 操作日誌列表
export function getLogList(param) {
    return request({
		url: '/logs',
		method: 'get',
		params: param,
	})
}

// 登入日誌列表
export function getLoginLogList(param) {
    return request({
		url: '/logs/loginlogs',
		method: 'get',
		params: param,
	})
}