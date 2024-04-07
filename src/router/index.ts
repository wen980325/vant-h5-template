import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { showFailToast, closeToast } from 'vant'
import { useUserStore } from '@/store'
import { layoutRoutes } from './layoutRoutes'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/layout/',
    component: () => import('@/layout/index.vue'),
    // 需要layout的页面
    children: layoutRoutes,
  },
  // 不需要layout的页面
  {
    path: '/index',
    name: 'index',
    meta: {
      title: '首页',
    },
    component: () => import('@/pages/home/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '账号登录',
    },
    component: () => import('@/pages/login/index.vue'),
  },
  {
    path: '/noData',
    name: 'noData',
    component: () => import('@/pages/login/noData.vue'),
  },
  // 替代vue2中的'*'通配符路径
  { path: '/:pathMatch(.*)*', redirect: '/' },
  { path: '/', redirect: '/index' },
]

const router = createRouter({
  // history: createWebHashHistory(), // history 模式则使用 createWebHistory()
  history: createWebHistory(), // history 模式则使用 createWebHistory()
  routes,
})

const list = ['index', 'login', 'noData']

router.beforeEach(async (to, from, next) => {
  closeToast()
  let info = useUserStore().getUserInfo
  if ((info.userId && info.version) || list.some((v: string) => to.name === v)) {
    let { metaTitle }: any = to.query
    if (metaTitle) {
      to.meta.title = `${to.meta.title}-${metaTitle}`
    }
  } else {
    showFailToast('用户令牌已失效，请重新登录')
    next({ path: '/login' })
    // setTimeout(() => {
    //   window.location.href = import.meta.env.VITE_APP_ROUTEBACK_URL
    // }, 600)
    return false
  }
})

export default router
