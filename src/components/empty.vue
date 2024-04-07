<template>
  <div class="h-full bg-[#fff] p-[32px] pt-0 flex justify-center items-center">
    <van-empty :description="props.str" />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    str?: string
  }>(),
  {
    str: '暂无数据',
  }
)
</script>

<style lang="less" scoped></style>
