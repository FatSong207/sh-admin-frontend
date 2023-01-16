import request from '../axios/index'

//獲取用戶路由
export function getUserMenuTree() {
    return request({
		url: '/menu/tree',
		method: 'get',
	})
}

//獲取所有路由，用於功能模塊下的樹狀table顯示
export function getAllMenuTree() {
    return request({
		url: '/menu',
		method: 'get',
	})
}