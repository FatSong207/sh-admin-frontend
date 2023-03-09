<template>
    <div>
        <a-space style="margin-bottom: 10px;">
            <a-button type="primary" @click="onSave">保存</a-button>
        </a-space>
        <a-card :loading="data.loading">
            <a-tree v-if="data.apiItem.length" v-model:checkedKeys="data.checkedKeys" checkable
                :tree-data="data.apiItem" :fieldNames="{ title: 'description', key: 'onlyId' }"
                :defaultExpandAll="true">
                <template #title="{ description, onlyId }">
                    <span>
                        {{ description }}
                    </span>
                </template>
            </a-tree>
        </a-card>
    </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { reactive, onMounted, watch } from 'vue';
import { getAllApiTree } from '../../../api/api'
import { GetAccessApiPathByRoleId, UpdateCasbin } from '../../../api/casbin'
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
    apiItem: [],
    checkedKeys: [],
})

onMounted(() => {
    getAllApi()
})

const getAllApi = async () => {
    data.loading = true
    try {
        const res = await getAllApiTree()
        // console.log(res.data)
        data.apiItem = buildApiTree(res.data.data);

        const res2 = await GetAccessApiPathByRoleId(props.id)
        // console.log(res2)
        data.checkedKeys = res2.data.data
    } catch (error) {

    } finally {
        data.loading = false
    }




};

const buildApiTree = (apis) => {
    const apiObj = {}
    apis &&
        apis.forEach(item => {
            item.onlyId = 'p:' + item.path + 'm:' + item.method
            if (Object.prototype.hasOwnProperty.call(apiObj, item.apiGroup)) {
                apiObj[item.apiGroup].push(item)
            } else {
                Object.assign(apiObj, { [item.apiGroup]: [item] })
            }
        })
    const apiTree = []
    for (const key in apiObj) {
        const treeNode = {
            onlyId: key,
            description: key + '组',
            children: apiObj[key]
        }
        apiTree.push(treeNode)
    }
    return apiTree
}

const onSave = async () => {
    data.loading = true
    let casbinInfos = []
    data.checkedKeys && data.checkedKeys.forEach(item => {
        // console.log(item.split("m:"))
        if (item.split("m:").length === 2) {
            let casbinInfo = {
                path: item.split("m:")[0].substring(2),
                method: item.split("m:")[1]
            }
            casbinInfos.push(casbinInfo)
        }
    })

    let dataf = {
        roleId: props.id.toString(),
        casbinInfo: casbinInfos
    }
    try {
        await UpdateCasbin(dataf)
        message.success('修改成功')
    } catch (error) {
    } finally {
        data.loading = false
    }
}



</script>

<script>

export default {
    name: 'Api'
}
</script>

<style lang="scss" scoped>

</style>