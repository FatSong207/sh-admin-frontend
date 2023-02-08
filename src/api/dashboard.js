import request from '../axios/index'

// 獲取ServerInfo
export function getServerInfo() {
    return request({
		url: '/system/serverinfo',
		method: 'get',
	})
}


// 获取数据汇总
export function getSummary(param) {
    return request({
		url: '/dashboard/sum',
		method: 'get',
		params: param,
	})
}
