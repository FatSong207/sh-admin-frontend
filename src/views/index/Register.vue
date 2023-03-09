<template>
    <a-form ref="registerFormRef" :model="data.editForm" layout="vertical" @finish="onRegister" :rules="data.rules">
        <a-form-item name="name">
            <a-input v-model:value="data.editForm.name" size="large" placeholder="姓名">
                <template #addonBefore>
                    <UserOutlined />
                </template>
            </a-input>
        </a-form-item>
        <a-form-item name="email">
            <a-input v-model:value="data.editForm.email" size="large" placeholder="信箱">
                <template #addonBefore>
                    <MailOutlined />
                </template>
            </a-input>
        </a-form-item>
        <a-form-item name="code">
            <a-input v-model:value="data.editForm.code" size="large" style="width: 55%;" placeholder="驗證碼">
                <template #addonBefore>
                    <VerifiedOutlined />
                </template>
            </a-input>
            <a-button @click="onGetCode" size="large" style="width: 40%;float: right;" :loading="data.loading"
                :disabled="data.disabled"><span v-if="data.buttonText === 's後再次發送'">{{ data.time }}</span>
                {{ data.buttonText }}</a-button>
        </a-form-item>
        <a-form-item name="password1">
            <a-input-password v-model:value="data.editForm.password1" size="large" placeholder="密碼">
                <template #addonBefore>
                    <LockOutlined />
                </template>
            </a-input-password>
        </a-form-item>
        <a-form-item name="password2">
            <a-input-password v-model:value="data.editForm.password2" size="large" placeholder="確認密碼">
                <template #addonBefore>
                    <LockOutlined />
                </template>
            </a-input-password>
        </a-form-item>
        <a-form-item>
            <a-button type="primary" html-type="submit" size="large" style="width: 50%;">註冊</a-button>
            <a-button type="link" style="width: 50%;" @click="onLogin">返回登入</a-button>
        </a-form-item>
    </a-form>
</template>

<script>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { userRegister, getVerifyCode } from '../../api/user';
import { message } from 'ant-design-vue';

export default {
    setup() {
        const router = useRouter()

        const data = reactive({
            editForm: {
                name: "",
                email: "",
                code: "",
                password1: "",
                password2: ""
            },
            rules: {
                name: [{ required: true, message: '請輸入姓名!' }],
                email: [{
                    required: true,
                    message: '請輸入信箱!',
                    trigger: 'blur',
                }, {
                    pattern: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/,
                    message: '信箱格式不正確',
                    trigger: 'change',
                }],
                code: [{ required: true, message: '請輸入驗證碼!' }],
                password1: [{ required: true, message: '請輸入密碼!' }],
                password2: [{ required: true, message: '請輸入密碼!' }],
            },
            loading: false,
            disabled: false,
            buttonText: "獲取驗證碼",
            time: 60,
            timer: 0
        })
        const registerFormRef = ref()
        const onRegister = () => {
            registerFormRef.value.validateFields().then(() => {
                if (data.editForm.password1 != data.editForm.password2) {
                    message.warn('密碼不一致');
                    return
                }
                let param = {
                    name: data.editForm.name,
                    email: data.editForm.email,
                    code: data.editForm.code,
                    password: data.editForm.password2,
                }
                console.log('驗證通過')
                userRegister(param).then((res) => {
                    if (res.data.code == 0) {
                        message.success('註冊成功');
                        onLogin()
                    }
                    // if (res.data.code == 10001) {
                    //     // message.warn('此信箱已被註冊過');
                    // }
                    // if (res.data.code == 10005) {
                    //     // message.error('驗證碼錯誤');
                    // }
                })
            })
        };

        // 獲取驗證碼
        const onGetCode = () => {
            if (data.editForm.email == '') {
                message.warn('信箱不能為空')
                return
            }
            data.loading = true
            let param = {
                email: data.editForm.email
            }
            getVerifyCode(param).then((res) => {
                if (res.data.code == 0) {
                    data.loading = false
                    data.disabled = true
                    data.buttonText = 's後再次發送'
                    timeChange()
                }
                if (res.data.code == 10004) {
                    data.loading = false
                }
            })
        }

        const timeChange = () => {
            data.timer = setInterval(() => {
                if (data.time) {
                    data.time--
                } else {
                    data.disabled = false
                    data.buttonText = '獲取驗證碼'
                    data.time = 60
                    clearInterval(data.timer)
                }
            }, 1000)
        }

        // 跳转到登录页面
        const onLogin = () => {
            router.push("/login")
        }

        return {
            data,
            registerFormRef,
            onRegister,
            onLogin,
            onGetCode,
        };
    },
}
</script>

<style scoped>

</style>