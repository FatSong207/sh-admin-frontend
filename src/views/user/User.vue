<template>
    <div>
        <a-card class="searchcard">
            <a-form layout="inline">
                <a-space>
                    <a-form-item label="姓名">
                        <a-input v-model:value="data.searchform.name" allowClear>
                        </a-input>
                    </a-form-item>
                    <a-form-item label="角色">
                        <a-select ref="select" v-model:value="data.searchform.roleId" allowClear style="width:140px ;">
                            <a-select-option v-for="item in data.roleOption" :key="item.Id" :value="item.Id">
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="狀態">
                        <a-select ref="select" v-model:value="data.searchform.status" allowClear style="width:140px ;">
                            <a-select-option :value="1">啟用</a-select-option>
                            <a-select-option :value="2">禁用</a-select-option>
                        </a-select>
                    </a-form-item>

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
                <a-button type="primary" @click="onEdit">修改</a-button>
            </a-space>
            <a-table rowKey="id" :columns="data.columns" :data-source="data.list" :loading="data.loading"
                :row-selection="data.rowSelection"
                :pagination="{ current: data.pagination.current, showSizeChanger: true, pageSize: data.pagination.pageSize, pageSizeOptions: ['3', '10', '20', '30'], total: data.pagination.total, onChange: onPageChange }"
                :scroll="{ x: 1100, y: '65vh' }" class="ant-table-striped" size="middle"
                :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)" bordered>
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.dataIndex === 'status'">
                        <a-tag color="green" v-if="text == '1'">啟用</a-tag>
                        <a-tag color="red" v-else>禁用</a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'operation'">
                        <a @click="onOpenDraw(record)">
                            <MailOutlined />
                        </a>
                    </template>
                </template>
            </a-table>
        </a-card>
        <a-modal v-model:visible="data.modalVisible" title="修改" @ok="onSave" @cancel="onCancel" cancelText="取消"
            okText="保存" width="680px">
            <a-form ref="editFormRef" name="editForm" :model="data.editForm" layout="horizontal"
                :label-col="{ style: { width: '100px' } }" :wrapper-col="{ span: 12 }" :rules="data.rules">
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="角色" name="roleId">
                            <a-select ref="select" v-model:value="data.editForm.roleId" allowClear>
                                <a-select-option v-for="item in data.roleOption" :key="item.Id" :value="item.Id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="狀態" name="status">
                            <!-- <a-input v-model:value="data.editForm.status" /> -->
                            <a-switch v-model:checked="data.editForm.status" checked-children="啟用"
                                un-checked-children="禁用" :checkedValue="1" :unCheckedValue="0" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
        <a-drawer v-model:visible="data.drawerVisible" class="custom-class" title="通知信" placement="right" width="500"
            @close="onclose(e)">
            <a-descriptions bordered title="收件者" size="small" layout="vertical">
                <template #extra>
                    <a-button type="primary" @click="onSendMail" :loading="data.btnloading">寄出</a-button>
                </template>
                <a-descriptions-item label="姓名">{{ data.mailForm.name }}</a-descriptions-item>
                <a-descriptions-item label="信箱">{{ data.mailForm.email }}</a-descriptions-item>
            </a-descriptions>
            <a-form ref="mailFormRef" name="mailForm" :model="data.mailForm" style="margin-top: 20px;">
                <a-row>
                    <a-col :span="24">
                        <h3>內容</h3>
                        <h5>您好，{{ data.mailForm.name }} 先生/小姐：</h5>
                        <a-form-item>
                            <a-textarea v-model:value="data.mailForm.content" :auto-size="{ minRows: 4, maxRows: 5 }" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-drawer>
    </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import moment from 'moment'
import { reactive, ref, onMounted } from 'vue'
import { GetUserList, GetUserById, UpdateUser, SendMailToUser } from '../../api/user'
import { GetAllRole } from '../../api/role'

const data = reactive({
    msg: "開發中",
    searchform: {},
    editForm: {},
    mailForm: {},
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
        roleId: [{ required: true, message: "請選擇角色", trigger: "change" }],
        status: [{ required: true, message: "請選擇狀態", trigger: "change" }],
    },
    columns: [{
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
        fixed: 'left',
        width: 100
    }, {
        title: '信箱',
        dataIndex: 'email',
        width: 240
    }, {
        title: '角色',
        dataIndex: 'roleName',
        align: 'center',
        width: 140
    }, {
        title: '狀態',
        dataIndex: 'status',
        align: 'center',
        width: 80
    }, {
        title: '創建時間',
        dataIndex: 'created',
        width: 200,
        customRender: text => {
            let m = moment.unix(text.value).format('YYYY-MM-DD HH:mm:ss')
            return m == 'Invalid date' ? '' : m
        }
    }, {
        title: '更新時間',
        dataIndex: 'updated',
        width: 200,
        customRender: text => {
            let m = moment.unix(text.value).format('YYYY-MM-DD HH:mm:ss')
            return m == 'Invalid date' ? '' : m
        }
    }, {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        align: 'center',
        width: 80,
    }],
    list: [],
    selectedRowKeys: [],
    roleOption: [],
    modalVisible: false,
    drawerVisible: false,
    loading: false,
    btnloading: false,
})

onMounted(async () => {
    await getList()
    await getAllRole()
})

const onClean = () => {
    // message.info('onClean')
    data.searchform = {}
}

const onPageChange = (page, pageSize) => {
    // message.info("onPageChange")
    data.pagination.current = page
    data.pagination.pageSize = pageSize
    getList()
}


const editFormRef = ref()
const onSave = async () => {
    editFormRef.value.validate().then(async () => {
        let dataf = {
            id: data.editForm.id,
            roleId: data.editForm.roleId,
            status: data.editForm.status
        }
        try {
            const res = await UpdateUser(dataf)
            data.modalVisible = false
            reseteditForm()
            getList()
            message.success('修改成功！')
        } catch (error) {
        }
    })
}

const onCancel = () => {
    // message.info('onCancel')
    reseteditForm()
}

const onOpenDraw = (record) => {
    console.log(record)
    data.mailForm.name = record.name
    data.mailForm.email = record.email
    data.drawerVisible = true
}

const onSendMail = async () => {
    data.btnloading = true
    try {
        let dataf = {
            name: data.mailForm.name,
            email: data.mailForm.email,
            content: data.mailForm.content
        }
        await SendMailToUser(dataf)
        //清除
        data.drawerVisible = false
        onclose()
        
        message.success('已成功寄出')
    } catch (error) {
    } finally {
        data.btnloading = false
    }
}

const onclose = () => {
    data.mailForm = {}
}

const onEdit = async () => {
    if (data.selectedRowKeys.length !== 1) {
        message.warning('請選擇一筆資料進行修改')
        return
    }
    try {
        const res = await GetUserById(data.selectedRowKeys[0])
        data.editForm.id = res.data.data.id
        data.editForm.roleId = res.data.data.roleId
        data.editForm.status = res.data.data.status

        data.modalVisible = true
    } catch (error) {
    } finally {
    }
}

const getList = async () => {
    data.loading = true
    let param = {
        name: data.searchform.name,
        roleId: data.searchform.roleId,
        status: data.searchform.status,
        pageNum: data.pagination.current,
        pageSize: data.pagination.pageSize,
    }
    try {
        const res = await GetUserList(param)
        console.log(res)
        data.pagination.total = res.data.data.total
        data.list = res.data.data.list
    } catch (error) {

    } finally {
        data.loading = false
    }

}

const getAllRole = async () => {
    try {
        const res = await GetAllRole()
        data.roleOption = res.data.data
    } catch (error) {
    }
}

/**
 * 清除編輯modal資料
 */
const reseteditForm = () => {
    data.editForm = {};
};
</script>

<style lang="scss" scoped>
.ant-table-striped :deep(.table-striped) td {
    background-color: #fafafa;
}
</style>
