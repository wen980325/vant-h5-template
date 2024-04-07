<template>
  <div ref="scrollTable" class="scrollTable h-full bg-[#fff] overflow-hidden">
    <a-table
      ref="tableDom"
      bordered
      :rowKey="props.rowKey"
      :dataSource="props.tableData"
      :columns="getColumns"
      :row-selection="
        (props.rowSelection ?? '') !== ''
          ? props.rowSelection === 0
            ? null
            : props.rowSelection
          : {
              selectedRowKeys: selectedRowKeys,
              getCheckboxProps: props.getCheckboxProps,
              onChange: onSelectChange,
            }
      "
      :pagination="
        props.pagination ? merge({}, { ...paginationConfig, ...props.pagination }) : false
      "
      :scroll="{ x: props.scrollX, y: props.cancelScrolling ? undefined : tableHeight }"
      :row-class-name="getName"
      :custom-row="props.customRow"
    >
      <template #headerCell="{ title, column }">
        <slot name="header" v-bind="{ title, column }"></slot>
      </template>
      <template #bodyCell="{ text, record, index, column }">
        <slot name="body" v-bind="{ text, record, index, column }"></slot>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { merge, cloneDeep, debounce } from 'lodash'

const props = withDefaults(
  defineProps<{
    rowKey?: string
    scrollX?: string
    cancelScrolling?: boolean
    showScrollListener?: boolean
    tableData?: any
    columns?: any
    rowSelection?: any
    pagination?: any
    getCheckboxProps?: any
    customRow?: any
  }>(),
  {
    rowKey: 'id',
    scrollX: 'max-content',
    cancelScrolling: false,
    showScrollListener: false,
    tableData: [],
    columns: [],
    rowSelection: null,
    pagination: {
      defaultPageSize: 15,
    },
    getCheckboxProps: (data: any) => {},
    customRow: (data: any) => {},
  }
)

const emit = defineEmits(['onSelectChange', 'scrollToBottom'])

// 监听窗口高度变化
const resizeObserver = new ResizeObserver(() => {
  getTableHeight()
})

const scrollTable = ref()
const tableDom = ref()
const dom = ref()
const tbody = ref()
const tableHeight = ref(0)
const selectedRowKeys = ref<any>([])
const isFirstSetData = ref(true)
const paginationConfig = reactive({
  defaultPageSize: 15,
  showSizeChanger: false,
  showTotal: (num: number) => `共 ${num} 条`,
})

watch(
  () => props.tableData,
  (val) => {
    if (val && val.length > 0 && isFirstSetData.value) {
      isFirstSetData.value = false
      nextTick(() => {
        getTableHeight()
      })
    }
  },
  { immediate: true }
)

const getColumns = computed(() =>
  props.columns ? props.columns.map((v: any) => ({ align: 'center', ...v })) : []
)

const getName = (record: any, index: number) => (index % 2 === 1 ? 'bg-[var(--van-bg-color)]' : '')

const getRowKeys = () => {
  return cloneDeep(selectedRowKeys.value)
}

const resetRowKeys = () => {
  selectedRowKeys.value = []
}

const onSelectChange = (val: any) => {
  selectedRowKeys.value = val
  nextTick(() => {
    emit('onSelectChange', cloneDeep(val))
  })
}

// 计算table高度
const getTableHeight = () => {
  nextTick(() => {
    let p = scrollTable.value?.offsetHeight ?? 0,
      h = (document.getElementsByClassName('ant-table-header')[0] as any)?.offsetHeight ?? 0,
      t = (document.getElementsByClassName('ant-table-pagination')[0] as any)?.offsetHeight ?? 0
    tableHeight.value = p - h - t
  })
}

const scrollTo = (obj: any) => {
  nextTick(() => {
    document.getElementsByClassName('ant-table-body')[0]?.scroll(obj)
  })
}

const getTableScroll = debounce(() => {
  if (dom.value && tbody.value && props.showScrollListener) {
    let a = tbody.value?.offsetHeight ?? 0,
      b = dom.value?.offsetHeight ?? 0,
      c = dom.value?.scrollTop ?? 0

    if (a - b > 0 && b + c + 20 > a) {
      emit('scrollToBottom')
    }
  }
}, 100)

onMounted(() => {
  resizeObserver.observe(scrollTable.value)
  nextTick(() => {
    dom.value = document
      .getElementsByClassName('scrollTable')[0]
      ?.getElementsByClassName('ant-table-body')[0]
    tbody.value = dom.value?.getElementsByClassName('ant-table-tbody')[0]
    if (props.showScrollListener) {
      dom.value?.addEventListener('scroll', getTableScroll)
    }
  })
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  dom.value?.removeEventListener('scroll', getTableScroll)
})

defineExpose({ getRowKeys, resetRowKeys, getTableHeight, scrollTo })
</script>

<style lang="less" scoped></style>
