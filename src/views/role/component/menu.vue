<template>
    <div>
        <a-space style="margin-bottom: 10px;">
            <a-button type="primary" @click="onSave">保存</a-button>
        </a-space>
        <a-card :loading="data.loading">
            <a-tree v-if="data.menuItem.length" v-model:checkedKeys="data.checkedKeys" checkable
                :tree-data="data.menuItem" :fieldNames="{ title: 'chname', key: 'Id' }" :defaultExpandAll="true"
                checkStrictly>
                <template #title="{ chname, Id }">
                    <span>
                        {{ chname }}
                    </span>
                </template>
            </a-tree>
        </a-card>
    </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { reactive, onMounted, watch } from 'vue';
import { getAllMenuTree } from '../../../api/menu'
import { GetAuthorizeIds, UpdateRoleAuthorize } from '../../../api/role_authorize'

const props = defineProps({
    id: {
        default: function () {
            return {}
        },
        type: Number
    }
})

watch(() => props.id, (a) => {
    if (a) {
        // console.log(a)
        getTreeData()
    }
});

const data = reactive({
    msg: "測試",
    menuItem: [],
    checkedKeys: [],
})

onMounted(() => {
    getAllMenu()
})

const getAllMenu = () => {
    data.loading = true
    getAllMenuTree().then(res => {
        data.menuItem = res.data.data;
        getTreeData()
        // console.log(data.menuItem)
    }).finally(() => {
        data.loading = false
    });
};

const getTreeData = () => {
    GetAuthorizeIds(props.id).then(res => {
        // console.log(res.data.data)
        data.checkedKeys = res.data.data
        // console.log(typeof(data.checkedKeys[0]))
    })
}

const onSave = () => {
    // message.info('onSave')
    data.loading = true
    let dataf = {
        roleId: props.id,
        authorizeIds: data.checkedKeys.checked ? data.checkedKeys.checked : data.checkedKeys //參考antd a-tree data.checkedKeys資料型態會改變所以要加判斷
    }
    UpdateRoleAuthorize(dataf).then(res => {
        // console.log(res)
        getTreeData()
        message.success('修改成功')
    }).finally(() => {
        data.loading = false
    })
}



</script>

<script>

export default {
    name: 'Menu'
}
</script>

<style lang="scss" scoped>

</style>