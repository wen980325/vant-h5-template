import http from '@/utils/http'

export default {
  // 用户登录
  async login(params: any) {
    return await http.get('/login', params)
  },
}
