<template>
    <div>
        <a-space style="margin-bottom: 20px">
            <a-input v-model:value="data.keyWord" placeholder="功能名稱" style="width: 280px; margin-right: 50px;">
                <template #suffix>
                    <search-outlined style="color: rgba(0, 0, 0, 0.45)" @click="onSearch" />
                </template>
            </a-input>
            <a-button type="primary">查詢</a-button>
            <a-button type="primary" @click="onCreate">新建</a-button>
        </a-space>
        <a-table :columns="data.columns" :data-source="data.menuItem" :row-selection="rowSelection" rowKey="Id"
            size="middle" class="ant-table-striped"
            :row-class-name="(_record, index) => (index % 2 === 1 ? 'table-striped' : null)" :loading="data.loading">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'title'">
                    <component :is="record.meta.icon" /> <span style="margin-left:5px">
                        <a @click="onEdit(record)">{{ record.chname }}</a>
                    </span>
                </template>
                <template v-if="column.key === 'menuType'">
                    <span>
                        <a-tag v-if="record.menuType == 1" color="green">功能模組</a-tag>
                        <a-tag v-if="record.menuType == 2" color="blue">菜單</a-tag>
                        <!-- {{ record.menuType === 1 ? '功能模組' : record.menuType === 2 ? '菜單' : '' }} -->
                    </span>
                </template>
            </template>
        </a-table>
        <a-modal v-model:visible="data.modalVisible" :title="data.modalTitle" @ok="onSave" @cancel="onCancel"
            cancelText="取消" okText="保存" width="880px" style="top: 80px;">
            <a-form ref="editFormRef" name="editForm" :model="data.editForm" layout="horizontal"
                :label-col="{ style: { width: '100px' } }" :wrapper-col="{ span: 16 }" :rules="data.rules">
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="模塊名稱" name="title">
                            <a-input v-model:value="data.editForm.title" placeholder="示範" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="模塊名稱(英)" name="name">
                            <a-input v-model:value="data.editForm.name" placeholder="example" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="16">
                        <a-form-item label="隸屬於" name="parentId">
                            <a-cascader v-model:value="data.parentId" :options="data.menuItemCas"
                                :fieldNames="{ label: 'chname', value: 'Id', children: 'children' }"
                                expand-trigger="hover" placeholder="選擇父級模組，若無選擇則為最上級菜單" change-on-select />
                            <!-- <a-input v-model:value="data.editForm.parentId"/> -->
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="類型" name="menuType">
                            <a-select ref="select" v-model:value="data.editForm.menuType" style="width: 120px"
                                :options="data.menuTypeOptions"></a-select>
                            <!-- <a-switch v-model:checked="data.editForm.type" checked-children="模組"
                                un-checked-children="菜單" /> -->
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="路由" name="path">
                            <a-input v-model:value="data.editForm.path" placeholder="/example" /><a-button type="link"
                                size="small" @click="genPath"><template #icon>
                                    <component is="IssuesCloseOutlined" />
                                </template>自動生成路由</a-button>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item v-if="data.editForm.menuType === 2" label="組件位置" name="component">
                            <a-input v-model:value="data.editForm.component" placeholder="views/Example.vue" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="排序" name="sort">
                            <a-input v-model:value="data.editForm.sort" style="width: 70px;" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="啟用" name="hidden">
                            <a-switch v-model:checked="data.editForm.hidden" checked-children="啟用"
                                un-checked-children="隱藏" :checkedValue="false" :unCheckedValue="true" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item label="圖示" name="icon">
                            <a-select v-model:value="data.editForm.icon" show-search placeholder="請選擇"
                                :options="data.iconSelect" :filter-option="true">
                                <!-- <a-select-option value="DashboardOutlined"> -->
                                <template #option="{ label, icon }">
                                    <component :is="icon" /> <span style="color: #57767B; float: right;"> {{
                                        label
                                    }}</span>
                                </template>
                                <!-- </a-select-option> -->
                            </a-select>
                            <component :is="data.editForm.icon"></component>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
import { message } from 'ant-design-vue';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouterStore } from '../store/router'
import { getAllMenuTree, getAllMenuTreeCas, Insert, GetById } from '../api/menu'
import antdIcon from '../assets/antdicon'
import { connect } from 'echarts';


export default {
    name: "Module",
    setup() {
        const routerStore = useRouterStore();
        const data = reactive({
            keyWord: "",
            parentId: [],
            menuTypeOptions: [{
                value: 1,
                label: "功能模組"
            }, {
                value: 2,
                label: "菜單"
            }],
            editForm: {
                title: "",
                name: "",
                component: "",
                path: "",
                parentId: "",
                menuType: "",
                sort: "",
                hidden: false,
                icon: "",
                meta: {}
            },
            rules: {
                title: [{ required: true, message: "請輸入名稱", trigger: "change" }],
                name: [{ required: true, message: "請輸入英文名稱", trigger: "change" }],
                component: [{ required: true, message: "請輸入組建位置", trigger: "change" }],
                path: [{ required: true, message: "請輸入路由", trigger: "change" }],
                menuType: [{ required: true, message: "請選擇類型", trigger: "change" }],
                // parentId: [{ required: true, message: '請輸入', trigger: 'blur' }],
                sort: [{ required: true, message: "請輸入排序", trigger: "change" }],
                icon: [{ required: true, message: "請選擇圖示", trigger: "change" }],
            },
            columns: [
                {
                    title: "名稱",
                    dataIndex: ["meta", "title"],
                    key: "title",
                    width: 200,
                },
                {
                    title: "類型",
                    dataIndex: 'menuType',
                    key: "menuType",
                    align: "center",
                    width: 120,
                },
                {
                    title: "路徑",
                    dataIndex: "path",
                    key: "path",
                    width: 230,
                },
                {
                    title: "組件位置",
                    dataIndex: "component",
                    key: "component"
                },
                {
                    title: "排序",
                    dataIndex: "sort",
                    key: "sort",
                    width: 80,
                    defaultSortOrder: "ascend",
                    align: "center"
                    // sorter: (a, b) => a.sort - b.sort,
                }
            ],
            menuItem: [],
            menuItemCas: [],
            modalVisible: false,
            loading: false,
            modalTitle: "",
            iconSelect: antdIcon
        });
        const editFormRef = ref();
        onMounted(() => {
            getAllMenu();
            getAllMenuTreeCas().then(res => {
                data.menuItemCas = res.data.data;
            });
        });
        watch(() => data.parentId, (a, b) => {
            // console.log(a, b);
            if (a && a.length > 0) {
                data.editForm.parentId = (a[a.length - 1]).toString();
            }
            else {
                data.editForm.parentId = "";
            }
        });
        const rowSelection = ref({
            checkStrictly: true,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows);
            },
        });
        const onSearch = () => {
            // message.info('onSearch')
            getAllMenu();
        };
        const onCreate = () => {
            data.modalTitle = "新增";
            data.modalVisible = true;
        };
        const onEdit = (record) => {
            // console.log(record).
            GetById(record.Id).then(res => {
                console.log(res);
                if (res.data.data.parentIds) {
                    var p = res.data.data.parentIds.split(",").filter(item => item != "").reverse().map(str => parseInt(str));
                    console.log(p);
                    data.parentId = p;
                }
                data.editForm.title = res.data.data.title;
                data.editForm.icon = res.data.data.icon;
                data.editForm.name = res.data.data.name;
                data.editForm.component = res.data.data.component;
                data.editForm.path = res.data.data.path;
                data.editForm.parentId = res.data.data.parentId;
                data.editForm.menuType = res.data.data.menuType;
                data.editForm.sort = res.data.data.sort;
                data.editForm.hidden = res.data.data.hidden;
                data.editForm.meta = {};
                data.modalVisible = true;
                data.modalTitle = "編輯";
            });
        };
        const onSave = () => {
            // message.error('onSave')
            editFormRef.value.validateFields().then(() => {
                if (data.editForm.sort) {
                    data.editForm.sort = parseInt(data.editForm.sort);
                }
                data.editForm.meta.title = data.editForm.title;
                data.editForm.meta.icon = data.editForm.icon;
                Insert(data.editForm).then(res => {
                    reseteditForm();
                    data.modalVisible = false;
                    getAllMenu();
                });
                message.info("操作成功！");
            });
        };
        const onCancel = () => {
            reseteditForm();
        };
        /**
         * 清除編輯modal資料
         */
        const reseteditForm = () => {
            data.editForm = {
                title: "",
                name: "",
                component: "",
                path: "",
                parentId: "",
                sort: "",
                hidden: false,
                icon: "",
                meta: {}
            };
            data.parentId = [];
        };
        /**
         * 資料過濾function 目前無使用
         * @param {*} input select輸入值
         * @param {*} option 当 option 符合筛选条件时，应返回 true，反之则返回 false。
         */
        const filterOption = (input, option) => {
            console.log(input, option)
            return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        };
        /**
         *  列表
         */
        const getAllMenu = () => {
            data.loading = true;
            getAllMenuTree().then(res => {
                data.menuItem = res.data.data;
            }).finally(() => {
                data.loading = false;
            });
        };
        /**
         * 自動生成路由
         */
        const genPath = () => {
            if (!data.editForm.name) {
                message.error('請先輸入模塊名稱(英)')
                return
            }
            if (!data.editForm.parentId) {
                data.editForm.path = "/" + data.editForm.name
            } else {
                let res = ""
                find(data.menuItem, data.parentId[0], res)
            }
        }
        /**
         * 傳入menulist並透過targetId從menulist找下層路由
         * @param {*} menuItems menulist(children)
         * @param {*} targetId 子路由的Id
         * @param {*} res 結果
         */
        const find = (menuItems, targetId, res) => {
            let menu = menuItems.filter(x => x.Id === targetId)[0] //根據targetId從menulist找下層路由
            if (menu) {
                res += "/" + menu.name
                if (menu.Id === data.parentId[data.parentId.length - 1]) { //最後一層(data.parentId的最後一個元素)
                    // console.log(res)
                    data.editForm.path = res + "/" + data.editForm.name //最終結果
                    return
                }
                if (menu.children) { //還不是最後要繼續往下找
                    let index = data.parentId.indexOf(menu.Id) + 1
                    find(menu.children, data.parentId[index], res)
                }
            }
        }
        return {
            data,
            rowSelection,
            editFormRef,
            onSearch,
            onCreate,
            onEdit,
            onSave,
            onCancel,
            genPath,
            filterOption
        };
    },
}
</script>
<style scoped>
.ant-table-striped :deep(.table-striped) td {
    background-color: #fafafa;
}
</style>