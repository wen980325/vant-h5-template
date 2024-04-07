<template>
  <div class="header">
    <van-nav-bar
      :title="barTitle"
      :left-arrow="showArrow"
      @click-left="routeBack"
    >
    </van-nav-bar>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const list = reactive(['index'])

const showArrow = computed(
  () => list.every((v: string) => route.name !== v) && (window.history.state.back ?? '') !== ''
)

const barTitle = computed(() => {
  let str: any = route.meta?.title ?? ''
  return str
})

const routeBack = () => {
  router.back()
}
</script>

<style lang="less" scoped>
.header {
  :deep(.van-nav-bar) {
    background-color: #fff;
    .van-nav-bar__title.van-ellipsis {
      max-width: 75%;
    }
  }
}
</style>
