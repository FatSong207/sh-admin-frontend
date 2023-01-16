<template>
    <div>
        <a-space>
            <a-input v-model:value="data.keyWord" placeholder="功能名稱" style="width: 280px; margin-right: 50px;">
                <template #suffix>
                    <search-outlined style="color: rgba(0, 0, 0, 0.45)" @click="onSearch" />
                </template>
            </a-input>
            <a-button type="primary">查詢</a-button>
        </a-space>
        <a-table :columns="data.columns" :data-source="data.menuItem" :row-selection="rowSelection" rowKey="Id"
            size="middle" class="ant-table-striped"
            :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'title'">
                    <component :is="record.meta.icon" /> <span style="margin-left:5px">{{
                        record.meta.title
                    }}</span>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';
import { useRouterStore } from '../store/router'
import { getAllMenuTree } from '../api/menu'


export default {
    name: 'Module',
    setup() {
        const routerStore = useRouterStore()

        const data = reactive({
            keyWord: '',
            columns: [
                {
                    title: '名稱',
                    dataIndex: ['meta', 'title'],
                    key: 'title',
                }, {
                    title: '路徑',
                    dataIndex: 'path',
                    key: 'path'
                }, {
                    title: '組件位置',
                    dataIndex: 'component',
                    key: 'component'
                }, {
                    title: '排序',
                    dataIndex: 'sort',
                    key: 'sort',
                    defaultSortOrder: 'ascend',
                    sorter: (a, b) => a.sort - b.sort,
                }
            ],
            menuItem: []
        })

        onMounted(() => {
            getAllMenuTree().then(res => {
                console.log(res.data.data)
                data.menuItem = res.data.data
            })
        })

        const rowSelection = ref({
            checkStrictly: true,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows);
            },
        });

        const onSearch = () => {
            message.info('onSearch')
        }

        return {
            data,
            rowSelection,
            onSearch
        }
    }
}
</script>
<style scoped>
.ant-table-striped :deep(.table-striped) td {
    background-color: #fafafa;
}
</style>