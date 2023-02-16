<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider width="180" class="sider" v-model:collapsed="data.collapsed" :trigger="null" collapsible>
      <div class="logo">
        <div><img src="../assets/shlogo3.svg"
            style="width: 32px;height: 32px;filter: drop-shadow(2px 2px 6px #79bbff);" />
        </div>
        <div v-if="data.collapsed == false" class="title">SH<b style="color: #1283FF;">ADM</b></div>
      </div>
      <a-menu style="border-right: none; height: 100%;" :selectedKeys="[$route.path]" mode="inline" theme="light"
        :open-keys="openKeys" @openChange="onOpenChange">
        <template v-for="item in menuItem">
          <aside-component v-if="!item.hidden" :key="item.path" :is-collapse="data.collapsed" :router-info="item" />
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <div>
          <menu-unfold-outlined v-if="data.collapsed" class="trigger"
            @click="() => (data.collapsed = !data.collapsed)" />
          <menu-fold-outlined v-else class="trigger" @click="() => (data.collapsed = !data.collapsed)" />
        </div>
        <div style="display: flex;align-items: right;justify-items:right;">
          <!-- <a-tooltip title="帮助">
            <a-button type="text" shape="circle">
              <template #icon>
                <QuestionCircleFilled style="color: #909399; font-size: 18px;" />
              </template>
            </a-button>
          </a-tooltip> -->
          <a-tooltip title="消息">
            <a-button type="text" shape="circle">
              <template #icon>
                <BellFilled style="color: #909399; font-size: 20px;" />
              </template>
            </a-button>
          </a-tooltip>
          <!-- 个人信息 -->
          <a-dropdown>
            <a-avatar class="avatar" :size="28">{{ data.firstName }}</a-avatar>
            <template #overlay>
              <a-menu>
                <!-- <a-menu-item key="0">
                  <a @click="onMail">
                    <MailOutlined /> 修改邮箱
                  </a>
                </a-menu-item> -->
                <!-- <a-menu-item key="1">
                  <a @click="onDelete">
                    <ClearOutlined /> 注销账号
                  </a>
                </a-menu-item> -->
                <a-menu-divider />
                <a-menu-item key="2">
                  <a @click="onLogout">
                    <LogoutOutlined /> 登出
                  </a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <div :style="{ padding: '8px 0px 0px 18px', }">
        <a-breadcrumb>
          <a-breadcrumb-item v-for="item, index in matched" :key="index">
            <span v-if="item.meta.title === '底層'">
              <router-link to="/dashboard">
                <HomeOutlined />
              </router-link>
            </span>
            <span v-else> {{ item.meta.title }}</span>
          </a-breadcrumb-item>
        </a-breadcrumb>
        <!-- <a-breadcrumb :routes="matched">
          <template #itemRender="{ route, paths }">
            <span v-if="matched.indexOf(route) === matched.length - 1">
              {{ route.meta.title }}
            </span>
            <router-link v-else :to="route.path">
              {{ route.meta.title }}
            </router-link>
          </template>
        </a-breadcrumb> -->
      </div>
      <a-layout-content :style="{ margin: '10px', }"
        class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { reactive, onMounted, computed, toRefs } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../store/user';
import { useRouterStore } from '../store/router'
import AsideComponent from './aside/asideComponent/index.vue'

export default {
  name: 'Home',
  components: {
    AsideComponent,
  },
  setup() {

    const userStore = useUserStore()
    const routerStore = useRouterStore()
    const route = useRoute()
    // const router = useRouter()

    const data = reactive({
      collapsed: false,
      firstName: ''
    })
    const menuItem = reactive(routerStore.asyncRouters[0].children)
    const state = reactive({
      rootSubmenuKeys: [],
      openKeys: [],
      selectedKeys: [],
    });

    const matched = computed(() => route.matched)
    data.firstName = computed(() => {
      return userStore.userInfo.Name.charAt(0)
    })

    // 初始化数据
    onMounted(() => {
      // userInfo()
      let tempArr = []
      menuItem.filter(x => x.parentId === "0").forEach(r => {
        tempArr.push(r.name)
      });
      state.rootSubmenuKeys = tempArr
    })

    // 点击退出账号
    const onLogout = () => {
      userStore.LogOut()
      // userLogout().then((res) => {
      //   if (res.data.code == 0) { router.push('/') }
      // })
    }

    //menu行為
    const onOpenChange = openKeys => {
      const latestOpenKey = openKeys.find(key => state.openKeys.indexOf(key) === -1);
      if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        state.openKeys = openKeys;
      } else {
        state.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    };

    return {
      data,
      ...toRefs(state),
      menuItem,
      matched,
      onLogout,
      onOpenChange,
    };
  },
}
</script>

<style scoped>
.sider {
  background: #fff;
  border-right: 0.5px solid #F0F2F5;
  box-shadow: 0.5px 0.5px 5px #c2c5c9;
}

.header {
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 2px 2.5px 0 rgb(0 0 0/20%);
  height: 50px;
}

.content {
  /* box-shadow: 0 2px 12px 0 rgb(0 0 0/10%); */
  border-radius: 5px;
  /* padding: 20px; */
}

.trigger {
  font-size: 18px;
  padding: 0 8px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #476FFF;
}

.logo {
  height: 14px;
  margin: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  color: #fff;
  background-color: #87d068;
  cursor: pointer;
  margin-left: 10px;
}

.popover {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}

.title {
  font-size: 20px;
  color: rgba(31, 31, 31, 0.85);
  font-weight: 620;
  margin-left: 10px;
  overflow: hidden;
}
</style>