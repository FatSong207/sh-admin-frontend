<template>
    <a-spin :spinning="spin" size="large" :tip="tip">
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
                    <a-checkbox v-model:checked="formData.remember" style="float: left;">記住帳號</a-checkbox>
                </a-form-item>
                <!-- <a class="login-form-forgot" style="float: right;" @click="forgotPass">忘記密碼？</a> -->
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
    </a-spin>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'

export default {
    components: {
        UserOutlined,
        LockOutlined,
    },
    setup() {
        const router = useRouter()
        onMounted(() => {
            let email = localStorage.getItem("email")
            if (email) {
                formData.email = email
                formData.remember = true
            }
        })
        // 用户登录
        const formData = reactive({
            email: '',
            password: '',
            remember: false,
        });
        const userStore = useUserStore()
        const spin = ref(false)
        const tip = ref('')
        const onLogin = async () => {
            spin.value = true
            tipRun()
            let param = {
                email: formData.email,
                password: formData.password
            }
            await userStore.Login(param, formData.remember)
            spin.value = false

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
        const tipRun = () => {
            tip.value = "登入中"
            let i = 0;
            setInterval(() => {
                tip.value += "."
                i++
                if (i % 4 === 0) {
                    tip.value = "登入中"
                }
            }, 500);
        }
        const onLoginFailed = errorInfo => {
            console.log('Failed:', errorInfo);
        };

        // 忘记密码
        const forgotPass = () => {
            router.push({ name: 'Pass' })
        }

        // 用户注册
        const toRegister = () => {
            router.push({ name: 'Register' })
        }

        return {
            formData,
            spin,
            tip,
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