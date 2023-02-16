<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-transform" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>

</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#nprogress .bar {
  background: #476FFF !important;
}

.btnspace {
  margin-bottom: 10px;
  width: 100%;
}

.card {
    /* margin-bottom: 20px; */
    box-shadow: 0 1px 16px 0 rgb(33 41 48 / 15%);
}
</style>
