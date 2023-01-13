<template>
  <a-sub-menu ref="subMenu" :index="routerInfo.name">
    <template #title>
      <div v-if="!isCollapse">
        <component :is="$antIcons[routerInfo.meta.icon]" />
        <span>{{ routerInfo.meta.title }}</span>
      </div>
      <template v-else>
        <component :is="$antIcons[routerInfo.meta.icon]" />
        <span>{{ routerInfo.meta.title }}</span>
      </template>
    </template>
    <slot />
  </a-sub-menu>
</template>

<script>

// import { DashboardOutlined, SmileOutlined, MehOutlined, ShoppingOutlined } from '@ant-design/icons-vue';
// import { CrownOutlined, MenuUnfoldOutlined, MenuFoldOutlined, QuestionCircleFilled } from '@ant-design/icons-vue';
// import { SmileFilled, BellFilled, MailOutlined, ClearOutlined } from '@ant-design/icons-vue';
// import { LogoutOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
export default {
  name: 'AsyncSubmenu',
  // components: {
  //   DashboardOutlined,
  //   SmileOutlined,
  //   MehOutlined,
  //   ShoppingOutlined,
  //   CrownOutlined,
  //   MenuUnfoldOutlined,
  //   MenuFoldOutlined,
  //   QuestionCircleFilled,
  //   SmileFilled,
  //   BellFilled,
  //   MailOutlined,
  //   ClearOutlined,
  //   LogoutOutlined,
  //   ExclamationCircleOutlined,
  // },
}
</script>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  routerInfo: {
    default: function () {
      return null
    },
    type: Object
  },
  isCollapse: {
    default: function () {
      return false
    },
    type: Boolean
  },

})

</script>

<style lang="scss" scoped>
// .el-sub-menu {
//   ::v-deep(.el-sub-menu__title) {
//     padding: 6px;
//     color: v-bind(normalText);
//   }
// }

.is-active:not(.is-opened) {
  ::v-deep(.el-sub-menu__title) .gva-subMenu {
    flex: 1;
    height: 100%;
    line-height: 44px;
    background: v-bind(activeBackground) !important;
    border-radius: 4px;
    box-shadow: 0 0 2px 1px v-bind(activeBackground) !important;

    i {
      color: v-bind(activeText);
    }

    span {
      color: v-bind(activeText);
    }
  }
}
</style>
