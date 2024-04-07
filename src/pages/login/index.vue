<template>
  <div class="login w-full h-full"></div>
</template>

<script setup lang="ts">
import api from '@/api/login'
import { showFailToast } from 'vant'
import { cloneDeep } from 'lodash'
import { useLoading } from '@/hooks'
import { useUserStore } from '@/store'

const { startLoading, stopLoading } = useLoading()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// 获取用户登录信息
const getMineData = async () => {
  let { code }: any = route.query,
    url = cloneDeep(localStorage.getItem('replaceUrl') ?? '')

  if (code) {
    startLoading()
    try {
      let { data } = await api.login({ code })
      await userStore.updateInfo(data)
      stopLoading('登录成功')
    } catch (err: any) {
      showFailToast(err)
    } finally {
      setTimeout(() => {
        router.replace((url ?? '') !== '' ? url : '/')
      }, 600)
    }
  } else {
    router.replace('/')
  }
}

onMounted(() => {
  getMineData()
})
</script>

<style lang="less" scoped></style>
