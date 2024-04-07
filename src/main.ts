import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import 'amfe-flexible'
import 'virtual:windi.css'
import 'vant/lib/index.css'
import '@/styles/index.less'
import '@vant/touch-emulator'

import { Table } from 'ant-design-vue'
import 'ant-design-vue/lib/table/style'

const app = createApp(App)

app.use(router)
app.use(store)

app.use(Table)

app.mount('#app')
