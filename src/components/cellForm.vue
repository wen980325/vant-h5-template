<template>
  <div class="rounded-[12px] bg-[#fff] py-[8px] overflow-hidden cellForm">
    <van-cell-group inset>
      <template v-for="(item, index) in props.list" :key="index">
        <template v-if="isShow(item)">
          <van-cell
            title-class="!text-color-[#666]"
            value-class="!flex-[2] !text-color-[var(--van-text-color)]"
            :center="!item.isSlot"
            :class="item.isSlot ? 'flex-col' : ''"
            v-if="(props.form[item.field] ?? '') !== '' || item.isEdit"
          >
            <template #title>
              <template v-if="item.isTitle">
                <slot name="title" v-bind="{ item, index }"></slot>
              </template>
              <template v-else>
                {{ item.name }}
              </template>
            </template>
            <template #value>
              <template v-if="item.isSlot">
                <slot name="value" v-bind="{ item, index }"></slot>
              </template>
              <template v-else-if="item.hiddenVal"></template>
              <template v-else>
                {{ props.form[item.field] }}
              </template>
            </template>
            <template #right-icon>
              <template v-if="item.isRightIcon">
                <slot name="rightIcon" v-bind="{ item, index }"></slot>
              </template>
            </template>
          </van-cell>
        </template>
      </template>
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { isBoolean, isFunction } from '@/utils/is.js'

const props = withDefaults(
  defineProps<{
    list?: any
    form?: any
  }>(),
  {
    list: [],
    form: {},
  }
)

// 判断是否需要展示
const isShow = (val: any) => {
  let ifShow = val.ifShow,
    isShow = true

  if ((ifShow ?? '') !== '') {
    if (isBoolean(ifShow)) {
      isShow = ifShow
    } else if (isFunction(ifShow)) {
      isShow = ifShow(props.form)
    }
  }

  return isShow
}
</script>

<style lang="less" scoped></style>
