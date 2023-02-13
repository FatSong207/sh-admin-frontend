<template>
    <div>
        <a-space style="margin-bottom: 20px; width: 100%;">
            <a-input v-model:value="data.keyWord" placeholder="" style="width: 280px; margin-right: 50px;">
                <template #suffix>
                    <search-outlined style="color: rgba(0, 0, 0, 0.45)" @click="onSearch" />
                </template>
            </a-input>
            <!-- <a-button type="primary" @click="onCustomers">全部客户</a-button> -->
            <a-button @click="getList">刷新</a-button>
            <!-- <a-button type="primary" @click="onDelete" :disabled="data.disabled" danger>删除</a-button> -->
            <!-- <a-button type="primary" @click="onCreate">新建</a-button> -->
        </a-space>


        <a-table rowKey="Id" :columns="data.columns" :data-source="data.list" :loading="data.loading"
            :pagination="{ current: data.pagination.current, showSizeChanger: true, pageSize: data.pagination.pageSize, pageSizeOptions: ['3', '10', '20', '30'], total: data.pagination.total, onChange: onPageChange }"
            :scroll="{ y: '65vh' }" class="ant-table-striped"
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
                <!-- <template v-if="column.dataIndex === 'address'">
                    <span>{{ record.region + " " + record.address }}</span>
                </template> -->
            </template>
        </a-table>
    </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { message } from 'ant-design-vue';
import moment from 'moment'
import { getLogList } from '../../api/log'


const data = reactive({
    pagination: {
        current: 1,
        pageSize: 10,
        total: undefined,
    },
    columns: [{
        title: '使用者',
        dataIndex: 'user_id',
        align: 'center',
        fixed: 'left',
        width: 80
    }, {
        title: '時間',
        dataIndex: 'created',
        width: 200,
        customRender: text => {
            let m = moment(text.value).format('YYYY-MM-DD HH:mm:ss')
            return m == 'Invalid date' ? '' : m
        }
    }, {
        title: 'IP',
        dataIndex: 'ip',
        width: 140
    }, {
        title: '路徑',
        dataIndex: 'path',
        width: 140
    }, {
        title: '方法',
        dataIndex: 'method',
        width: 100
    }, {
        title: 'Body',
        dataIndex: 'body',
        ellipsis: true
    }, {
        title: '響應代碼',
        dataIndex: 'code',
        width: 100
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
    let param = {
        name: data.keyWord,
        pageNum: data.pagination.current,
        pageSize: data.pagination.pageSize,
    }
    getLogList(param).then(res => {
        console.log(res)
        data.pagination.total = res.data.data.total
        data.list = res.data.data.list
    })
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


</script>

<style lang="scss" scoped>
.ant-table-striped :deep(.table-striped) td {
    background-color: #fafafa;
}
</style>