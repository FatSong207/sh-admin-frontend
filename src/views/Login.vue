<template>
    <a-form :model="formData" name="normal_login" class="login-form" @finish="onLogin"
        @finishFailed="onLoginFailed">
        <a-form-item name="email" :rules="[{ required: true, message: '請輸入EMail!' }]">
            <a-input v-model:value="formData.email" size="large" placeholder="EMail">
                <template #prefix>
                    <UserOutlined class="site-form-item-icon" />
                </template>
            </a-input>
        </a-form-item>
        <a-form-item name="password" :rules="[{ required: true, message: '請輸入密碼!' }]">
            <a-input-password v-model:value="formData.password" size="large" placeholder="密碼">
                <template #prefix>
                    <LockOutlined class="site-form-item-icon" />
                </template>
            </a-input-password>
        </a-form-item>
        <a-form-item>
            <a-form-item name="remember" no-style>
                <a-checkbox v-model:checked="formData.remember" style="float: left;">記住我</a-checkbox>
            </a-form-item>
            <a class="login-form-forgot" style="float: right;" @click="forgotPass">忘記密碼？</a>
        </a-form-item>
        <a-form-item>
            <a-button size="large" type="primary" html-type="submit" class="login-form-button" style="width: 100%">
                登入
            </a-button><br />
        </a-form-item>
        <a-form-item>
            尚未註冊？<a @click="toRegister"> 立即註冊</a>
        </a-form-item>
    </a-form>
</template>

<script>
import { reactive } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router'
import {useUserStore} from '../store/user'
import { userLogin } from '../api/user';
import { message } from 'ant-design-vue';

export default {
    components: {
        UserOutlined,
        LockOutlined,
    },
    setup() {
        const router = useRouter()

        // 用户登录
        const formData = reactive({
            email: 'opqr24680@gmail.com',
            password: '123456',
            remember: true,
        });
        const userStore = useUserStore()
        const onLogin = async() => {
            let param = {
                email: formData.email,
                password: formData.password
            }
            await userStore.Login(param)
            
            // userLogin(param).then((res) => {
            //     if (res.data.code == 0) {
            //         localStorage.setItem('uid', res.data.data.uid)
            //         localStorage.setItem('ver', res.data.data.ver)
            //         localStorage.setItem('token', res.data.data.token)
            //         router.push("/home")
            //     }
            //     if (res.data.code == 10002) {
            //         message.error('用户不存在');
            //     }
            //     if (res.data.code == 10003) {
            //         message.error('用户名或密码错误');
            //     }
            // })
        };
        const onLoginFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };

        // 忘记密码
        const forgotPass = () => {
            router.push("/pass")
        }

        // 用户注册
        const toRegister = () => {
            router.push("/register")
        }

        return {
            formData,
            onLogin,
            onLoginFailed,
            forgotPass,
            toRegister
        };
    }
};
</script>

<style scoped>
.site-form-item-icon {
    color: rgba(0, 0, 0, .45);
}
</style>