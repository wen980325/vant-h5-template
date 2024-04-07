<template>
  <router-view />
</template>

<script setup lang="ts">
import debug from '@/utils/debug'

onMounted(() => {
  let { search } = window.location
  debug.config(search.includes('debug') ? '1' : '')
})
</script>

<style></style>
