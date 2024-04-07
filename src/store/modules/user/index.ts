import { defineStore } from 'pinia'
import { assign, cloneDeep } from 'lodash'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userInfo: {
        userId: '', // 用户ID
        version: '', // 版本号
        token: '', // 密钥
        companyNo: '', // 公司号
        companyList: [], // 厂区列表
      } as any,
    }
  },
  getters: {
    // 获取用户信息
    getUserInfo(): any {
      let obj: any = {},
        newObj: any = {},
        companyNo = localStorage.getItem('companyCode')

      // 合并用户信息
      if (this.userInfo.userId) {
        obj = assign({}, this.userInfo)
      } else if (localStorage.getItem('userInfo')) {
        obj = assign({}, JSON.parse(localStorage.getItem('userInfo') ?? '{}'))
      }

      // 保存现有厂号
      if ((companyNo ?? '') !== '') {
        newObj = assign({}, { ...obj, companyNo })
      } else {
        newObj = assign({}, obj)
      }

      return newObj
    },
  },
  actions: {
    // 更新用户信息 - 登录用
    async updateInfo(val: any) {
      localStorage.clear()

      let obj = assign({}, val),
        { userId, companyNo, version, token } = obj

      if (userId) {
        localStorage.setItem('userInfo', JSON.stringify(obj))
        localStorage.setItem('companyCode', companyNo)
        localStorage.setItem('userId', userId)
        localStorage.setItem('version', version)
        localStorage.setItem('token', token)
        this.userInfo = assign({}, obj)
        return Promise.resolve()
      } else {
        return Promise.reject('用户令牌已失效，请重新登录')
      }
    },
  },
})
