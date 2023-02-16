import request from '../axios/index'

// 獲取ServerInfo
export function getServerInfo() {
    return request({
		url: '/system/serverinfo',
		method: 'get',
	})
}

// 獲取dashboard
export function getDashboard() {
    return request({
		url: '/system/dashboard',
		method: 'get',
	})
}