<template>
  <component :is="menuComponent" v-if="!routerInfo.hidden" :is-collapse="isCollapse" :router-info="routerInfo">
    <template v-if="routerInfo.children && routerInfo.children.length">
      <AsideComponent v-for="item in routerInfo.children" :key="item.name" :is-collapse="false" :router-info="item" />
    </template>
  </component>
</template>

<script>
export default {
  name: 'AsideComponent',
}
</script>

<script setup>
import MenuItem from './menuItem.vue'
import AsyncSubmenu from './asyncSubmenu.vue'
import { computed } from 'vue'
const props = defineProps({
  routerInfo: {
    type: Object,
    default: () => null,
  },
  isCollapse: {
    default: function () {
      return false
    },
    type: Boolean
  }
})

const menuComponent = computed(() => {
  if ((props.routerInfo.children && props.routerInfo.children.filter(item => !item.hidden).length) || props.routerInfo.menuType === 1) {
    return AsyncSubmenu
  } else {
    return MenuItem
  }
})

</script>

