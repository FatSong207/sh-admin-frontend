<template>
    <div>
        <a-card class="card">
            <a-space class="btnspace">
                <!-- <a-button @click="alert('刷新')">刷新</a-button> -->
                <!-- <a-button type="primary" @click="onCreate">新建</a-button>
                <a-button type="primary" danger @click="onDelete">刪除</a-button> -->
                <a-button type="primary" @click="onEdit">修改</a-button>
            </a-space>
            <a-table :columns="data.columns" :data-source="data.list" :row-selection="data.rowSelection" rowKey="Id"
                size="middle" class="ant-table-striped" :scroll="{ x: 1100, y: '65vh' }"
                :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)" :loading="data.loading">
                <template #bodyCell="{ column, record, text }">
                    <template v-if="column.dataIndex === 'status'">
                        <span>
                            <a-tag v-if="text === 0" color="red">停用</a-tag>
                            <a-tag v-if="text === 1" color="success">啟用</a-tag>
                        </span>
                    </template>
                    <template v-if="column.dataIndex === 'operation'">
                        <a v-if="record.status === 1" style="color: red;" @click="onChangeStatus(record.Id, 0)">
                            <StopOutlined style="color: red;" /> 關閉任務
                        </a>
                        <a v-if="record.status === 0" @click="onChangeStatus(record.Id, 1)">
                            <CheckCircleOutlined /> 開啟任務
                        </a>
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
                        <a-form-item label="Cron表達式" name="cron">
                            <a-input v-model:value="data.editForm.cron" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import moment from 'moment'
import { ref, reactive, onMounted } from 'vue'
import { GetTaskJobList, UpdateTaskJobStatus, GetTaskJobById, UpdateTaskJob } from '../../api/taskjob'
const data = reactive({
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
        cron: [{ required: true, message: "請輸入cron表達式", trigger: "change" }],
    },
    list: [],
    selectedRowKeys: [],
    columns: [{
        title: '任務名稱',
        dataIndex: 'taskName',
        fixed: 'left',
        width: 140
    }, {
        title: '任務說明',
        dataIndex: 'description',
        width: 200
    }, {
        title: 'Cron表達式',
        dataIndex: 'cron',
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
            let m = moment(text.value).format('YYYY-MM-DD HH:mm:ss')
            return m == 'Invalid date' ? '' : m
        }
    }, {
        title: '更新時間',
        dataIndex: 'updated',
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
        width: 100,
    }],
    modalVisible: false,
    modalTitle: "修改任務",
})

onMounted(async () => {
    await getList()
})

const getList = async () => {
    data.loading = true
    let param = {
        pageNum: data.pagination.current,
        pageSize: data.pagination.pageSize,
    }
    try {
        const res = await GetTaskJobList(param)
        console.log(res)
        data.pagination.total = res.data.data.total
        data.list = res.data.data.list
    } catch (error) {

    } finally {
        data.loading = false
    }
}

const onEdit = async () => {
    if (data.selectedRowKeys.length !== 1) {
        message.warning('請選擇一筆資料進行修改')
        return
    }
    try {
        const res = await GetTaskJobById(data.selectedRowKeys[0])
        let taskJob = res.data.data
        data.editForm.id = taskJob.Id
        data.editForm.cron = taskJob.cron

        data.modalVisible = true

    } catch (error) {

    }
}

const editFormRef = ref()
const onSave = () => {
    editFormRef.value.validate().then(async () => {
        let dataf = {
            id: data.editForm.id,
            cron: data.editForm.cron
        }
        try {
            const res = await UpdateTaskJob(dataf)
            data.modalVisible = false
            reseteditForm()
            getList()
            message.success('修改成功！')
        } catch (error) {
        }
    })
}

const onCancel = () => {
    reseteditForm()
}

const onChangeStatus = async (Id, status) => {
    let dataf = {
        Id: Id,
        status: status
    }
    try {
        await UpdateTaskJobStatus(dataf)
        message.success("變更成功")
    } catch (error) {
    } finally {
        getList()
    }
}
/**
 * 清除編輯modal資料
 */
const reseteditForm = () => {
    data.editForm = {};
};
</script>

<style lang="scss" scoped></style>
