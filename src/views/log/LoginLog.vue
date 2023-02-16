<template>
    <div>
        <a-card class="searchcard">
            <a-form layout="inline">
                <a-form-item label="響應">
                    <a-select ref="select" v-model:value="data.searchform.response" style="width: 120px" allowClear>
                        <a-select-option v-for="item in data.responseOption" :key="item.index" :value="item.value">
                            {{ item.label }}
                        </a-select-option>
                    </a-select>
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
        <a-card class="card">
            <!-- <a-space class="btnspace">
                <a-button @click="">刷新</a-button>
            </a-space> -->


            <a-table rowKey="Id" :columns="data.columns" :data-source="data.list" :loading="data.loading"
                :pagination="{ current: data.pagination.current, showSizeChanger: true, pageSize: data.pagination.pageSize, pageSizeOptions: ['3', '10', '20', '30'], total: data.pagination.total, onChange: onPageChange }"
                :scroll="{ y: '65vh' }" class="ant-table-striped" size="middle"
                :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)" bordered>
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.dataIndex === 'created'">
                        <a @click="onEdit(record)">{{ moment(text).format('YYYY-MM-DD HH:mm:ss') }}</a>
                    </template>
                    <template v-if="column.dataIndex === 'method'">
                        <a-tag v-if="text == 'GET'" color="green">GET</a-tag>
                        <a-tag v-if="text == 'POST'" color="blue">POST</a-tag>
                        <a-tag v-if="text == 'DELETE'" color="red">DELETE</a-tag>
                        <a-tag v-if="text == 'PUT'" color="yellow">PUT</a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'body'">
                        <!-- {{ text }} -->
                        <a-tooltip v-if="text">
                            <template #title>
                                <pre style="color: orange;font-size:5px;">{{ fmtBody(text) }}</pre>
                            </template>
                            <ExclamationCircleOutlined style="color:#08c ;" />
                        </a-tooltip>
                        <span v-else>無</span>
                    </template>
                    <template v-if="column.dataIndex === 'response'">
                        <!-- {{ text }} -->
                        <a-tooltip v-if="text.indexOf('success') != -1">
                            <a-tag color="green">成功登入</a-tag>
                            <!-- <template #title>
                            <pre style="color: orange;font-size:5px;">{{ fmtBody(text) }}</pre>
                        </template>
                        <ExclamationCircleOutlined style="color:#08c ;" /> -->
                        </a-tooltip>
                        <a-tooltip v-else>

                            <a-tag color="red">
                                失敗
                            </a-tag>
                            <template #title>
                                <pre style="color: orange;font-size:5px;">{{ fmtBody(text) }}</pre>
                            </template>
                        </a-tooltip>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { message } from 'ant-design-vue';
import moment from 'moment'
import { getLoginLogList } from '../../api/log'


const data = reactive({
    pagination: {
        current: 1,
        pageSize: 10,
        total: undefined,
    },
    searchform: {

    },
    responseOption: [{
        label: '登入成功',
        value: 'success'
    },
    {
        label: '登入失敗',
        value: 'failed'
    }],
    columns: [{
        title: '時間',
        dataIndex: 'created',
        width: 120,
        customRender: text => {
            let m = moment(text.value).format('YYYY-MM-DD HH:mm:ss')
            return m == 'Invalid date' ? '' : m
        }
    }, {
        title: 'email',
        dataIndex: 'email',
        width: 140
    }, {
        title: 'IP',
        dataIndex: 'ip',
        width: 140
    }, {
        title: '響應',
        dataIndex: 'response',
        width: 80,
        align: 'center'
    }, {
        title: '代碼',
        dataIndex: 'code',
        align: 'center',
        width: 80
    }],
    list: [],
    keyWord: "",
    disabled: false,
    loading: false
})

onMounted(() => {
    getList()
})

const getList = () => {
    data.loading = true
    let param = {
        response: data.searchform.response,
        pageNum: data.pagination.current,
        pageSize: data.pagination.pageSize,
    }
    getLoginLogList(param).then(res => {
        console.log(res)
        data.pagination.total = res.data.data.total
        data.list = res.data.data.list
    }).finally(() => {
        data.loading = false
    })
}

const onClean = () => {
    data.searchform = {}
}

const onSearch = () => {
    message.info("onSearch")
}

const onPageChange = (page, pageSize) => {
    message.info("onPageChange")
    data.pagination.current = page
    data.pagination.pageSize = pageSize
    getList()
}

const onEdit = (record) => {
    console.log(record)
}

const fmtBody = (value) => {
    try {
        return JSON.parse(value)
    } catch (err) {
        return value
    }
}


</script>

<style lang="scss">
.ant-table-striped :deep(.table-striped) td {
    background-color: #fafafa;
}

.searchcard {
    margin-bottom: 20px;
    width: 100%;
    box-shadow: 0 1px 16px 0 rgb(33 41 48 / 15%);
}
</style>