<template>
    <div>
        <a-card class="searchcard">
            <a-form layout="inline">
                <a-form-item label="查詢">
                    <a-input ref="select" v-model:value="data.searchform.keyword" allowClear />
                </a-form-item>
                <a-space>
                    <a-button shape="circle" @click="onClean">
                        <template #icon>
                            <ReloadOutlined />
                        </template>
                    </a-button>
                    <a-button type="primary" shape="circle" @click="getList">
                        <template #icon>
                            <SearchOutlined />
                        </template>
                    </a-button>
                </a-space>
            </a-form>
        </a-card>
        <a-card class="hcard">
            {{ data.msg }}
        </a-card>
    </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { reactive } from 'vue'

const data = reactive({
    msg: "開發中...",
    searchform: {},
})

const onClean = () => {
    message.info('onClean')
}

const getList = () => {
    message.info('getList')
}


</script>

<style lang="scss" scoped>

</style>