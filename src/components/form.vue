<template>
  <van-form ref="formRef" :label-width="props.labelWidth" @submit="onSubmit">
    <van-cell-group inset>
      <template v-if="(props.title ?? '') !== ''">
        <van-cell center :title="props.title" />
      </template>
      <template v-for="(item, index) in listData" :key="index">
        <template v-if="isShow(item)">
          <!-- 输入框 -->
          <template v-if="inputType.includes(item.type)">
            <van-field
              v-model="formData[item.name]"
              :name="item.name"
              :label="item.label"
              :rules="item.rules"
              :disabled="item.disabled"
              :readonly="item.readonly"
              :placeholder="`请输入${item.label}`"
              :type="item.type || 'input'"
              :maxlength="item.maxlength || 250"
              :label-align="item.type === 'textarea' ? 'top' : 'left'"
              :rows="item.type === 'textarea' ? 2 : 1"
              :autosize="item.type === 'textarea'"
              :show-word-limit="item.type === 'textarea'"
              @click="inputClick(item, index)"
            >
              <template #label v-if="props.labelConfig">
                <slot name="label" v-bind="item"></slot>
              </template>
              <template #input v-if="item.showInputSlot">
                <slot name="input" v-bind="item"></slot>
              </template>
              <template #right-icon v-if="item.showRightIconSlot">
                <slot name="rightIcon" v-bind="item"></slot>
              </template>
              <template #extra>
                <slot name="inputExtra" v-bind="{ formData, item }"></slot>
              </template>
            </van-field>
          </template>

          <!-- 下拉选择器、日期选择器、时间选择器 -->
          <template v-else-if="readonlyType.includes(item.type)">
            <van-field
              v-model="formData[`${item.name}_select_text`]"
              readonly
              :name="item.name"
              :label="item.label"
              :rules="item.rules"
              :placeholder="`请选择${item.label}`"
              @click="openPicker(item, index)"
            >
              <template #right-icon>
                <icon-right />
              </template>
              <template #label v-if="props.labelConfig">
                <slot name="select" v-bind="item"></slot>
              </template>
            </van-field>
            <van-popup v-model:show="pickerList[index]" position="bottom">
              <template v-if="item.type === 'select'">
                <van-picker
                  :columns="selectColumns(item, showColumns[item.name])"
                  :columns-field-names="item.columnsFieldNames"
                  @confirm="
                    ({ selectedOptions }) =>
                      selectConfirm({
                        selectedOptions,
                        item,
                        index,
                      })
                  "
                  @cancel="pickerList[index] = false"
                >
                  <template #title>
                    <van-search
                      class="w-[60%]"
                      v-model="searchData"
                      :placeholder="item.searchPlaceholder || '请输入搜索关键词'"
                      @update:model-value="(val) => searchChange(val, item)"
                      @clear="() => (showColumns[item.name] = cloneDeep(item.columns))"
                    />
                  </template>
                </van-picker>
              </template>

              <template v-else-if="item.type === 'date'">
                <van-date-picker
                  v-model="item.value"
                  :title="item.label"
                  :columns-type="item.dateType || ['year', 'month', 'day']"
                  :min-date="item.minDate || defaultDate.minDate"
                  :max-date="item.maxDate || defaultDate.maxDate"
                  @confirm="
                    ({ selectedOptions }) =>
                      selectConfirm({
                        selectedOptions,
                        item,
                        index,
                      })
                  "
                  @cancel="pickerList[index] = false"
                />
              </template>

              <template v-else-if="item.type === 'time'">
                <van-time-picker
                  v-model="item.value"
                  :title="item.label"
                  :columns-type="item.timeType || ['hour', 'minute', 'second']"
                  @confirm="
                    ({ selectedOptions }) =>
                      selectConfirm({
                        selectedOptions,
                        item,
                        index,
                      })
                  "
                  @cancel="pickerList[index] = false"
                />
              </template>

              <template v-else-if="item.type === 'rangeTime'">
                <van-picker-group
                  next-step-text="下一步"
                  :title="item.label"
                  :tabs="['开始时间', '结束时间']"
                  @confirm="
                    (v) =>
                      rangeSelected({
                        value: v,
                        item,
                        index,
                      })
                  "
                  @cancel="pickerList[index] = false"
                >
                  <van-time-picker v-model="item.value[0]" />
                  <van-time-picker
                    v-model="item.value[1]"
                    :min-time="`${item.value[0].join(':')}:00`"
                  />
                </van-picker-group>
              </template>

              <template v-else-if="item.type === 'rangeDate'">
                <van-picker-group
                  next-step-text="下一步"
                  :title="item.label"
                  :tabs="['选择日期', '选择时间']"
                  @confirm="
                    (v) =>
                      rangeSelected({
                        value: v,
                        item,
                        index,
                      })
                  "
                  @cancel="pickerList[index] = false"
                >
                  <van-date-picker
                    v-model="item.value[0]"
                    :min-date="item.minDate || defaultDate.minDate"
                    :max-date="item.maxDate || defaultDate.maxDate"
                  />
                  <van-time-picker v-model="item.value[1]" />
                </van-picker-group>
              </template>

              <template v-else-if="item.type === 'cascader'">
                <van-cascader
                  v-model="item.value"
                  :title="item.label"
                  :options="item.columns"
                  :field-names="item.columnsFieldNames"
                  @finish="
                    ({ selectedOptions }) =>
                      selectConfirm({
                        selectedOptions,
                        item,
                        index,
                      })
                  "
                  @close="pickerList[index] = false"
                />
              </template>
            </van-popup>
          </template>

          <!-- 单选按钮 -->
          <template v-else-if="item.type === 'radio'">
            <van-field :name="item.name" :label="item.label" :rules="item.rules">
              <template #input>
                <van-radio-group
                  v-model="formData[item.name]"
                  :direction="item.direction || 'horizontal'"
                  :shape="item.shape || 'dot'"
                >
                  <van-radio
                    icon-size="0.46rem"
                    v-for="(item02, index02) in item.range"
                    :key="index02"
                    :name="item02.value || item02"
                    @click="radioCilck(item, item02)"
                    >{{ item02.label || item02 }}</van-radio
                  >
                </van-radio-group>
              </template>
              <template #label v-if="props.labelConfig">
                <slot name="radio" v-bind="item"></slot>
              </template>
            </van-field>
          </template>

          <template v-else-if="item.type === 'checkbox'">
            <van-field :name="item.name" :label="item.label" :rules="item.rules">
              <template #input>
                <van-checkbox-group
                  v-model="formData[item.name]"
                  shape="square"
                  direction="horizontal"
                >
                  <van-checkbox
                    icon-size="0.44rem"
                    v-for="(item02, index02) in item.range"
                    :key="index02"
                    :name="item02.value || item02"
                    >{{ item02.label || item02 }}</van-checkbox
                  >
                </van-checkbox-group>
              </template>
            </van-field>
          </template>

          <!-- 多选按钮列表 -->
          <template v-else-if="item.type === 'checkboxCell'">
            <van-checkbox-group v-model="formData[item.name]" shape="square">
              <van-cell-group inset>
                <van-cell
                  center
                  clickable
                  v-for="(item02, index02) in item.range"
                  :key="index02"
                  :title="item02.label || item02"
                  @click="toggle(index02)"
                >
                  <template #title v-if="props.labelConfig">
                    <slot name="checkbox" v-bind="item02"></slot>
                  </template>
                  <template #right-icon>
                    <van-checkbox
                      :name="item02.value || item02"
                      :ref="(el) => (checkboxRefs[index02] = el)"
                      @click.stop
                    />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-checkbox-group>
          </template>

          <!-- 照片上传、其他 -->
          <template v-else-if="otherType.includes(item.type)">
            <van-field name="imgStr" label-width="100%" label-align="top" :label="item.label">
              <template #input>
                <div class="otherInput">
                  <template v-if="item.type === 'img'">
                    <ImgList
                      :ref="(el: any) => setRefMap(el, item.name)"
                      deletable
                      showUpload
                      :imgStr="formData[item.name]"
                      :maxCount="item.maxCount || 9"
                    />
                  </template>
                  <template v-else-if="item.type === 'other'">
                    <slot name="other" v-bind="item"></slot>
                  </template>
                </div>
              </template>
            </van-field>
          </template>
        </template>
      </template>
    </van-cell-group>

    <!-- 提交按钮 -->
    <div class="mt-[32px] btns" v-if="listData.length > 0 && props.showBtn">
      <template v-if="props.btns.length > 0">
        <van-row gutter="16">
          <van-col class="flex-1" v-for="(item, index) in btns" :key="index">
            <van-button :type="item.type" class="w-full" @click="btnClick(item)">
              {{ item.text }}
            </van-button>
          </van-col>
        </van-row>
      </template>
      <template v-else>
        <van-button type="primary" class="w-full" native-type="submit" :loading="btnLoading">
          {{ props.button }}
        </van-button>
      </template>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import api from '@/api/common'
import { showFailToast, showConfirmDialog } from 'vant'
import { cloneDeep, merge } from 'lodash'
import { useLoading } from '@/hooks'
import { compressorImage } from '@/utils/compressor'
import { isBoolean, isFunction, isString } from '@/utils/is.js'

const { startLoading, stopLoading } = useLoading()

const emit = defineEmits(['onSubmit', 'inputClick', 'selectChange'])

const props = withDefaults(
  defineProps<{
    propsList?: any
    btns?: any
    editObj?: any
    showObj?: any
    labelWidth?: string
    title?: string
    button?: string
    loading?: boolean
    showToast?: boolean
    showBtn?: boolean
    showLoading?: boolean
    labelConfig?: boolean
    uploadImg?: boolean
    toastMessage?: string
  }>(),
  {
    propsList: [],
    btns: [],
    editObj: {},
    showObj: {},
    labelWidth: '2rem',
    title: '',
    button: '提交',
    loading: false,
    showToast: false,
    showBtn: true,
    showLoading: true,
    labelConfig: false,
    uploadImg: true,
    toastMessage: '确认提交吗？',
  }
)

const formRef = ref()
const imgObj = ref<any>({})
const btnLoading = ref(false)
const searchData = ref<any>('')
const listData = ref<any>([])
const pickerList = ref<any>([])
const checkboxRefs = ref<any>([])
const showColumns = ref<any>({})
const formData = ref<any>({})
const btnsObj = ref<any>({})
const inputType = reactive(['input', 'number', 'digit', 'textarea', 'password'])
const readonlyType = reactive(['select', 'date', 'rangeTime', 'rangeDate', 'time', 'cascader'])
const otherType = reactive(['img', 'other'])
const defaultDate = reactive({
  minDate: dayjs().subtract(2, 'year').startOf('year').toDate(),
  maxDate: dayjs().add(1, 'year').endOf('year').toDate(),
})

const setRefMap = (el: any, k: number) => {
  if (el) {
    imgObj.value[k] = el
  }
}

// 判断是否需要展示
const isShow = (val: any) => {
  let ifShow = val.ifShow,
    isShow = true

  if ((ifShow ?? '') !== '') {
    if (isBoolean(ifShow)) {
      isShow = ifShow
    } else if (isFunction(ifShow)) {
      isShow = ifShow({ ...formData.value, ...props.showObj })
    }
  }

  return isShow
}

const inputClick = (item: any, index: number) => {
  if (!item.disabled) {
    emit('inputClick', { item, index })
  }
}

const radioCilck = (item: any, item02: any) => {
  let s = `${item.name}_selected`,
    v = item02.value || item02
  if (formData.value[s] && formData.value[s] === v) {
    formData.value[s] = false
    formData.value[item.name] = null
  } else {
    formData.value[s] = v
  }
}

const openPicker = (item: any, index: number) => {
  pickerList.value[index] = true
  searchData.value = ''
  showColumns.value[item.name] = item.columns ?? []
}

// 下拉选择器内容
const selectColumns = ({ columnsFieldNames }: any, val: any) =>
  val
    ? val.length > 0 && (columnsFieldNames ? val[0][columnsFieldNames.value] : val[0].value)
      ? val
      : val.map((v: string) => ({ value: v, text: v }))
    : []

// 下拉选择器选中项
const selectConfirm = ({ selectedOptions, item, index }: any) => {
  let { columns, type, joinUnit, columnsFieldNames } = item,
    isSelect = columns && columns.length > 0,
    isDate = ['date', 'time'].includes(type),
    joinObj: any = {
      select: '/',
      date: '-',
      time: ':',
    }
  if (isSelect || isDate) {
    let setText = item.setText,
      name = item.name,
      setVal = (name: string, str: string) => {
        formData.value[name] = selectedOptions
          .map((v: any) => v[columnsFieldNames ? columnsFieldNames[str] : str])
          .join(joinUnit || joinObj[type] || '/')
      }

    setVal(name, setText ? 'text' : 'value')
    setVal(`${name}_select_text`, 'text')
    emit('selectChange', formData.value[name])
  }
  pickerList.value[index] = false
}

// 下拉选择器搜索
const searchChange = (val: any, { columns, name, columnsFieldNames }: any) => {
  let arr = cloneDeep(columns),
    { text, children } = columnsFieldNames || {},
    child = columnsFieldNames ? children : 'children',
    filterChildren = (v: any) => {
      if (v.hasOwnProperty(child)) {
        v[child] = v[child].filter((i: any) => filterChildren(i))
        if (v[child].length > 0) return true
      } else {
        return ((columnsFieldNames ? v[text] : v.text) || v).includes(val)
      }
    }

  showColumns.value[name] = val ? arr.filter((v: any) => filterChildren(v)) : arr
}

// 时间区间选择器选中
const rangeSelected = ({ value, item, index }: any) => {
  let { name, type } = item,
    joinObj: any = {
      rangeDate: [['-', ':'], ' '],
      rangeTime: [[':', ':'], '-'],
    },
    jionStr = (num: number) => value[num].selectedValues.join(joinObj[type][0][num]),
    setVal = (str: string) => {
      formData.value[str] = `${jionStr(0)}${joinObj[type][1]}${jionStr(1)}`
    }

  setVal(name)
  setVal(`${name}_select_text`)
  pickerList.value[index] = false
}

// 多选选中
const toggle = (index: number) => {
  nextTick(() => {
    checkboxRefs.value[index].toggle()
  })
}

const btnClick = async (val: any) => {
  btnsObj.value = Object.assign({}, val)
  formRef.value?.submit()
}

const setData = async () => {
  if (!btnLoading.value) {
    btnLoading.value = true
    if (props.showLoading) startLoading()

    let files: any = imgObj.value ? Object.keys(imgObj.value) : [],
      filesList: any = [],
      filesObj: any = {},
      promiseArr: any = []

    if (files.length > 0) {
      files.map((v: any) => {
        let arr = imgObj.value[v]?.getFiles() || []
        arr.map((i: any) => {
          filesList.push({ name: v, value: i })
        })
      })
      if (filesList.length > 0) {
        filesList.map(({ name, value }: any, k: number) => {
          if (!filesObj[name]) {
            filesObj[name] = []
          }
          promiseArr[k] = new Promise(async (resolve: any, reject: any) => {
            if (value.file) {
              try {
                let file: any = await compressorImage(value.file, 'file', 0.3)
                if (props.uploadImg) {
                  let form = new FormData()
                  form.append('file', file)
                  let res = await api.commonUploadImage(form)
                  filesObj[name].push(res.data)
                  resolve()
                } else {
                  filesObj[name].push(file)
                  resolve()
                }
              } catch {
                reject()
              }
            } else if (value.resetStr) {
              filesObj[name].push(value.resetStr)
              resolve()
            } else {
              resolve()
            }
          })
        })
      }
    }

    Promise.all([...promiseArr])
      .then(() => {
        let form = merge({}, formData.value)

        if (btnsObj.value && Object.keys(btnsObj.value).length > 0) {
          form = { ...form, btnsObj: btnsObj.value }
        }

        if (filesList.length > 0) {
          let obj: any = {}
          Object.keys(filesObj).map((v: any) => {
            if (filesObj[v].every((i: any) => isString(i))) {
              obj[v] = filesObj[v].join('?')
            } else {
              obj[v] = filesObj[v]
            }
          })
          form = { ...form, ...obj }
        }

        emit('onSubmit', form)
      })
      .catch(() => {
        showFailToast('上传图片文件太大，请重新选取')
      })
      .finally(() => {
        btnLoading.value = false
      })
  }
}

// 提交
const onSubmit = async () => {
  if (props.showToast) {
    showConfirmDialog({ message: props.toastMessage })
      .then(() => {
        setData()
      })
      .catch(() => {
        btnLoading.value = false
      })
  } else {
    setData()
  }
}

// 获取传值
const getPropsList = (val: any) => {
  listData.value = []
  let list: any = [],
    columnsObj: any = {},
    pList: any = []

  val.map((v: any) => {
    let rules: any = [],
      rulesItem: any = []
    if (!v.notRequired && !v.disabled) {
      rulesItem = [
        {
          required: true,
          message: `${v.label}为必填项`,
          trigger: 'onSubmit',
        },
      ]
    }
    rules = rulesItem.concat(v.rules || [])

    list.push(Object.assign(v, { rules }))
    pList.push(false)
    columnsObj[v.name] = v.columns ?? []
  })

  showColumns.value = Object.assign({}, columnsObj)
  listData.value = list
  pickerList.value = pList
}

const setFormData = (str?: string) => {
  return formRef.value?.validate(str).then(() => formData.value)
}

const editFormData = (field: string, val: any) => {
  let list = cloneDeep(listData.value),
    key = list.findIndex((v: any) => v.name === field)
  if (key > -1) {
    formData.value[field] = val
    listData.value[key].value = val
  }
}

onBeforeUpdate(() => {
  checkboxRefs.value = []
})

watch(
  () => props.loading,
  (val) => {
    btnLoading.value = val
    if (val) {
      startLoading()
    } else {
      stopLoading()
    }
  },
  { immediate: true }
)
watch(
  () => props.editObj,
  (val) => {
    nextTick(() => {
      let keyArr = (val && Object.keys(val)) || [],
        filterArr = props.propsList.filter((v: any) =>
          keyArr.length > 0 ? keyArr.includes(v.name) || keyArr.includes(v.redirection) : true
        ),
        obj: any = {}

      if (filterArr.length > 0) {
        filterArr.map((v: any) => {
          if (val && val[v.name]) {
            obj[v.name] = val[v.name]
            if ((v.redirection ?? '') !== '') {
              obj[v.redirection] = val[v.redirection]
            } else if (v.type === 'radio') {
              obj[`${v.name}_selected`] = val[v.name]
            }
            v.value = val[v.name]
          } else {
            obj[v.name] = v.value
          }
        })

        getPropsList(filterArr)
        formData.value = Object.assign({}, obj)
        formRef.value?.resetValidation()
      }
    })
  },
  { immediate: true }
)

defineExpose({ setFormData, editFormData })
</script>

<style lang="less" scoped></style>
