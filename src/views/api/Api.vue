<template>
    <div>
        <a-card class="searchcard">
            <a-form layout="inline">
                <a-form-item label="查詢">
                    <a-input ref="select" v-model:value="data.searchform.keyWord" style="width: 120px" allowClear>
                    </a-input>
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
            <a-space class="btnspace">
                <a-button type="primary" @click="onCreate">新建</a-button>
                <a-button type="primary" @click="onEdit">修改</a-button>
                <a-button type="primary" @click="onDelete" danger>刪除</a-button>
            </a-space>
            <a-table rowKey="Id" :columns="data.columns" :data-source="data.list" :loading="data.loading"
                :row-selection="data.rowSelection"
                :pagination="{ current: data.pagination.current, showSizeChanger: true, pageSize: data.pagination.pageSize, pageSizeOptions: ['3', '10', '20', '30'], total: data.pagination.total, onChange: onPageChange }"
                :scroll="{ y: '65vh' }" class="ant-table-striped" size="middle"
                :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)" bordered>
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.dataIndex === 'method'">
                        <a-tag v-if="text == 'GET'" color="green">GET</a-tag>
                        <a-tag v-if="text == 'POST'" color="blue">POST</a-tag>
                        <a-tag v-if="text == 'DELETE'" color="red">DELETE</a-tag>
                        <a-tag v-if="text == 'PUT'" color="yellow">PUT</a-tag>
                    </template>
                </template>
            </a-table>
        </a-card>
        <a-modal v-model:visible="data.modalVisible" :title="data.modalTitle" @ok="onSave" @cancel="onCancel"
            cancelText="取消" okText="保存" width="680px">
            <a-form ref="editFormRef" name="editForm" :model="data.editForm" layout="horizontal"
                :label-col="{ style: { width: '100px' } }" :wrapper-col="{ span: 12 }" :rules="data.rules">
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="Api路徑" name="path">
                            <a-input v-model:value="data.editForm.path" placeholder="/api/user/:id" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="Api方法" name="method">
                            <!-- <a-input v-model:value="data.editForm.method" placeholder="方法" /> -->
                            <a-select v-model:value="data.editForm.method">
                                <a-select-option value="GET">GET</a-select-option>
                                <a-select-option value="POST">POST</a-select-option>
                                <a-select-option value="PUT">PUT</a-select-option>
                                <a-select-option value="DELETE">DELETE</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="Api描述" name="description">
                            <a-input v-model:value="data.editForm.description" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="Api分組" name="apiGroup">
                            <a-input v-model:value="data.editForm.apiGroup" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import moment from 'moment'
import { getApiList, GetApiById, InsertApi, UpdateApi, DeleteApi } from '../../api/api'
import { message, Modal } from 'ant-design-vue';

const data = reactive({
    searchform: {},
    rowSelection: {
        checkStrictly: true,
        onChange: (selectedRowKeys) => {
            data.selectedRowKeys = selectedRowKeys
        },
    },
    editForm: {},
    // editFormRef: {},
    pagination: {
        current: 1,
        pageSize: 10,
        total: undefined,
    },
    rules: {
        path: [{ required: true, message: "請輸入Api路徑", trigger: "change" }],
        method: [{ required: true, message: "請輸入Api方法", trigger: "change" }],
        description: [{ required: true, message: "請輸入Api描述", trigger: "change" }],
        apiGroup: [{ required: true, message: "請輸入Api分組", trigger: "change" }]
    },
    list: [],
    selectedRowKeys: [],
    columns: [{
        title: '路徑',
        dataIndex: 'path',
        width: 250
    }, {
        title: '方法',
        dataIndex: 'method',
        align: 'center',
        width: 100
    }, {
        title: '描述',
        dataIndex: 'description',
    }, {
        title: '分組',
        dataIndex: 'apiGroup',
        align: 'center',
        width: 100
    }, {
        title: '創建時間',
        dataIndex: 'created',
        width: 200,
        customRender: text => {
            let m = moment(text.value).format('YYYY-MM-DD HH:mm:ss')
            return m == 'Invalid date' ? '' : m
        }
    }],
    loading: false,
    modalVisible: false,
    modalTitle: "",
    action: "1",
})

onMounted(() => {
    getList()
})

const getList = () => {
    data.loading = true
    let param = {
        pageNum: data.pagination.current,
        pageSize: data.pagination.pageSize,
    }
    getApiList(param).then(res => {
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

const onCreate = () => {
    // message.info('onCreate')
    data.modalVisible = true
    data.modalTitle = "新建Api"
    data.action = "1"
}

const onEdit = () => {
    if (data.selectedRowKeys.length !== 1) {
        message.warning('請選擇一筆資料進行修改')
        return
    }
    GetApiById(data.selectedRowKeys[0]).then(res => {
        console.log(res.data.data)
        data.editForm = res.data.data
        data.modalVisible = true
        data.modalTitle = "修改Api"
        data.action = "2"
    })

}

const onDelete = () => {
    if (data.selectedRowKeys.length === 0) {
        message.warning('請至少選擇一筆資料')
        return
    } else {
        Modal.confirm({
            title: '警告',
            // icon: createVNode(ExclamationCircleOutlined),
            content: '確定要刪除？',
            okText: '確認',
            cancelText: '取消',
            onOk() {
                let ids = data.selectedRowKeys
                DeleteApi(ids).then(res => {
                    getList()
                    message.success('刪除成功')
                })
            },
        })
    }
}

const editFormRef = ref()
const onSave = () => {
    editFormRef.value.validate().then(() => {
        // message.info('Saved!')
        let dataf = {
            id: data.editForm.Id,
            path: data.editForm.path,
            method: data.editForm.method,
            description: data.editForm.description,
            apiGroup: data.editForm.apiGroup
        }
        switch (data.action) {
            case "1":
                InsertApi(dataf).then(res => {
                    console.log(res)
                    data.modalVisible = false
                    reseteditForm()
                    getList()
                    message.success('新增成功！')
                })
                break;
            case "2":
                UpdateApi(dataf).then(res => {
                    data.modalVisible = false
                    reseteditForm()
                    getList()
                    message.success('修改成功！')
                })
                break;
            default:
                message.error('獲取action失敗，請重新整理')
                break;
        }

    })
}

const onCancel = () => {
    // message.info('onCancel')
    reseteditForm()
}

const onPageChange = (page, pageSize) => {
    // message.info("onPageChange")
    data.pagination.current = page
    data.pagination.pageSize = pageSize
    getList()
}

/**
 * 清除編輯modal資料
 */
const reseteditForm = () => {
    data.editForm = {};
};

</script>

<style lang="scss" scoped>

</style>