<template>
  <div class="imgList">
    <template v-if="fileList.length > 0 || props.showUpload">
      <van-uploader
        v-model="fileList"
        multiple
        accept="image/*"
        image-fit="contain"
        :deletable="props.deletable"
        :show-upload="props.showUpload"
        :max-count="props.maxCount"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { getFileUrl } from '@/utils/common'

const props = withDefaults(
  defineProps<{
    imgStr?: string
    maxCount?: number
    deletable?: boolean
    showUpload?: boolean
  }>(),
  {
    imgStr: '',
    maxCount: 5,
    deletable: false,
    showUpload: false,
  }
)

const fileList: any = ref([])

const getFiles = () => fileList.value

const getData = async (str: string) => {
  if ((str ?? '') !== '') {
    let arr = str.split('?'),
      imgArr: any = []
    arr.map((v: any) => {
      imgArr.push({ url: getFileUrl(v), isImage: true, resetStr: v })
    })
    fileList.value = imgArr
  } else {
    fileList.value = []
  }
}

watch(
  () => props.imgStr,
  (str: string) => {
    getData(str)
  },
  { immediate: true }
)

defineExpose({ getFiles })
</script>

<style lang="less" scoped></style>
