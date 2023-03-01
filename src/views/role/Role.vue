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
                <!-- <a-button type="primary" @click="onEdit">修改</a-button> -->
                <a-button type="primary" @click="onDelete" danger>刪除</a-button>
            </a-space>
            <a-table rowKey="Id" :columns="data.columns" :data-source="data.list" :loading="data.loading"
                :row-selection="data.rowSelection"
                :pagination="{ current: data.pagination.current, showSizeChanger: true, pageSize: data.pagination.pageSize, pageSizeOptions: ['3', '10', '20', '30'], total: data.pagination.total, onChange: onPageChange }"
                :scroll="{ x: 1100, y: '65vh' }" class="ant-table-striped" size="middle"
                :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)" bordered>
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.dataIndex === 'name'">
                        <a @click="onEdit(record)">{{ text }}</a>
                    </template>
                    <template v-if="column.dataIndex === 'operation'">
                        <a v-if="record.Id != 12" @click="onOpenDraw(record)">
                            <SettingOutlined /> 設置權限
                        </a>
                        <span v-else>禁止設置</span>
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
                        <a-form-item label="角色名稱" name="name">
                            <a-input v-model:value="data.editForm.name" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="角色名稱(英)" name="enName">
                            <a-input v-model:value="data.editForm.enName" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
        <a-drawer v-model:visible="data.drawerVisible" class="custom-class" title="設置權限" placement="right"
            :width="data.drawerWidth" @after-visible-change="onAfterVisibleChange">
            <a-tabs v-model:activeKey="data.activeKey" size="small" type="card" animated :tabBarGutter="10">
                <a-tab-pane key="1">
                    <template #tab>
                        <span>
                            <AppstoreFilled />角色菜單
                        </span>
                    </template>
                    <Menu :id="data.settingAuthId" />
                </a-tab-pane>
                <a-tab-pane key="2">
                    <template #tab>
                        <span>
                            <ApiOutlined />角色api
                        </span>
                    </template>
                    <Api :id="data.settingAuthId" />
                </a-tab-pane>
                <!-- <a-tab-pane key="3" tab="其他">Content of Tab Pane 3</a-tab-pane> -->
            </a-tabs>
        </a-drawer>
    </div>
</template>

<script setup>

import { watch, reactive, ref, onMounted } from 'vue';
import moment from 'moment'
import { getRoleList, InsertRole, UpdateRole, GetRoleById, DeleteRole } from '../../api/role'
import { message, Modal } from 'ant-design-vue';

import Menu from './component/menu.vue'
import Api from './component/api.vue'

const data = reactive({
    searchform: {},
    editForm: {},
    pagination: {
        current: 1,
        pageSize: 10,
        total: undefined,
    },
    rowSelection: {
        checkStrictly: true,
        onChange: (selectedRowKeys) => {
            data.selectedRowKeys = selectedRowKeys
        },
    },
    rules: {
        name: [{ required: true, message: "請輸入角色名稱", trigger: "change" }],
        enName: [{ required: true, message: "請輸入角色名稱(英)", trigger: "change" }],
    },
    list: [],
    selectedRowKeys: [],
    columns: [{
        title: 'Id',
        dataIndex: 'Id',
        align: 'center',
        width: 40
    }, {
        title: '角色名稱',
        dataIndex: 'name',
        align: 'center',
        width: 140
    }, {
        title: '角色名稱(英)',
        dataIndex: 'enName',
        align: 'center',
        width: 140
    }, {
        title: '更新時間',
        dataIndex: 'updated',
        width: 200,
        customRender: text => {
            let m = moment(text.value).format('YYYY-MM-DD HH:mm:ss')
            return m == 'Invalid date' ? '' : m
        }
    }, {
        title: '創建時間',
        dataIndex: 'created',
        width: 200,
        customRender: text => {
            let m = moment(text.value).format('YYYY-MM-DD HH:mm:ss')
            return m == 'Invalid date' ? '' : m
        }
    }, {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        align: 'center',
        width: 80,
    }],
    modalTitle: "",
    action: "",
    activeKey: "1",
    settingAuthId: "",
    drawerWidth: 400,
    loading: false,
    modalVisible: false,
    drawerVisible: false
})

watch(() => data.activeKey, (a) => {
    if (a === "2") {
        data.drawerWidth = 500
    } else {
        data.drawerWidth = 400
    }
});

onMounted(() => {
    getList()
})

const getList = () => {
    data.loading = true
    let param = {
        pageNum: data.pagination.current,
        pageSize: data.pagination.pageSize,
    }
    getRoleList(param).then(res => {
        // console.log(res)
        data.pagination.total = res.data.data.total
        data.list = res.data.data.list
    }).finally(() => {
        data.loading = false
    })
}

const onEdit = (record) => {
    GetRoleById(record.Id).then(res => {
        // console.log(res.data.data)
        data.editForm = res.data.data
        data.modalVisible = true
        data.modalTitle = "修改Api"
        data.action = "2"
    })
}

const onCreate = () => {
    // message.info('onCreate')
    data.modalVisible = true
    data.modalTitle = "新建角色"
    data.action = "1"
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
                DeleteRole(ids).then(res => {
                    getList()
                    message.success('刪除成功')
                })
            },
        })
    }
}

const onClean = () => {
    data.searchform = {}
}

const editFormRef = ref()
const onSave = () => {
    // message.info('onSave')
    editFormRef.value.validate().then(() => {
        // message.info('saved')
        let dataf = {
            id: data.editForm.Id,
            name: data.editForm.name,
            enName: data.editForm.enName
        }
        switch (data.action) {
            case "1":
                InsertRole(dataf).then(res => {
                    data.modalVisible = false
                    reseteditForm()
                    getList()
                    message.success('新增成功！')
                })
                break;
            case "2":
                UpdateRole(dataf).then(res => {
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
    reseteditForm()
}

const onOpenDraw = (record) => {
    data.drawerVisible = true
    data.settingAuthId = record.Id
    console.log(data.settingAuthId)
}

const onAfterVisibleChange = () => {
    // message.info('onAfterVisibleChange')
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