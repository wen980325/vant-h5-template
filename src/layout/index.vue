<template>
  <div class="layout">
    <Header />
    <div class="content">
      <router-view v-slot="{ Component }">
        <keep-alive :include="includeList">
          <component :is="Component" :key="route.name"></component>
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './header.vue'

const route = useRoute()

const includeList: any = reactive([])

watch(
  () => route,
  (val) => {
    if (val.meta.keepAlive && !includeList.includes(val.name)) {
      includeList.push(val.name)
    }
  },
  { immediate: true, deep: true }
)
</script>

<style lang="less" scoped>
.layout {
  position: absolute;
  width: 100%;
  height: 100%;
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--van-nav-bar-height);
    z-index: 1;
  }
  .content {
    position: relative;
    margin-top: var(--van-nav-bar-height);
    height: calc(100% - var(--van-nav-bar-height));
    overflow-x: hidden;
    background-color: var(--van-bg-color);
  }
}
</style>
