import request from '../axios/index'

// 登入
export function userLogin(param) {
    return request({
		url: '/login',
		method: 'post',
		data: param,
	})
}

//獲取用戶信息
export function getUserInfo() {
    return request({
		url: '/userinfo',
		method: 'get',
	})
}

// 註冊
export function userRegister(param) {
    return request({
		url: '/register',
		method: 'post',
		data: param,
	})
}

// 獲取驗證碼
export function getVerifyCode(param) {
    return request({
		url: '/verifycode',
		method: 'get',
		params: param,
	})
}

// 退出登录
export function userLogout(param) {
    return request({
		url: '/user/logout',
		method: 'delete',
		data: param,
	})
}

