import request from '../axios/index'

//獲取用戶路由
export function getUserMenuTree() {
    return request({
		url: '/menu/tree',
		method: 'get',
	})
}
