import request from '../axios/index'

// 獲取ServerInfo
export function getServerInfo() {
    return request({
		url: '/system/serverinfo',
		method: 'get',
	})
}
