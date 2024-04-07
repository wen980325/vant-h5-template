import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios'
import JSONbig from 'json-bigint'
import type { Response } from './types'

axios.defaults.timeout = 1000 * 60
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 创建axios实例
const service = import.meta.env.VITE_APP_API_BASE_URL.split(',').map((baseURL: string) => ({
  fun: axios.create({
    // 根据不同env设置不同的baseURL
    baseURL,
    transformResponse: [
      function (data) {
        try {
          return JSONbig.parse(data)
        } catch (err) {
          return data
        }
      },
    ],
  }),
}))

const switchCode = ({ code, message }: any) => {
  let c = code,
    errMessage = ''
  switch (code) {
    case 0:
      break
    case 401:
      errMessage = message
      break
    case -401:
      c = 401
      errMessage = message
      break
    default:
      errMessage = message
      break
  }
  return { code: c, message: errMessage }
}

const getRequestKey = (config: AxiosRequestConfig) => {
  let { method, url, params, data } = config
  // axios中取消请求及阻止重复请求的方法
  // 参数相同时阻止重复请求：
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
  // 请求方法相同，参数不同时阻止重复请求
  // return [method, url].join('&')
}

/**
 * @description 添加请求信息 **/
let pendingRequest = new Map()

function addPendingRequest(config: AxiosRequestConfig) {
  // console.log(config.url)
  let requestKey = getRequestKey(config)
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingRequest.has(requestKey)) {
        pendingRequest.set(requestKey, cancel)
      }
    })
}

/**
 * @description 取消重复请求 **/
function removePendingRequest(config: AxiosRequestConfig) {
  let requestKey = getRequestKey(config)
  if (pendingRequest.has(requestKey)) {
    // 如果是重复的请求，则执行对应的cancel函数
    let cancel = pendingRequest.get(requestKey)
    // cancel(requestKey)
    cancel('')
    // 将前一次重复的请求移除
    pendingRequest.delete(requestKey)
  }
}

service.map(async (v: any) => {
  // axios实例拦截请求
  await v.fun.interceptors.request.use(
    (config: any) => {
      // 检查是否存在重复请求，若存在则取消已发的请求
      removePendingRequest(config)
      // 把当前请求信息添加到pendingRequest对象中
      addPendingRequest(config)

      let token = localStorage.getItem('token'),
        version = localStorage.getItem('version'),
        obj: any = Object.assign({}, config)
      obj.headers = {
        ...config.headers,
        version,
        'X-Access-Token': token,
      }

      return obj
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )
  // axios实例拦截响应
  await v.fun.interceptors.response.use(
    // 2xx时触发
    (response: AxiosResponse<Response>) => {
      // 对响应数据做点什么
      removePendingRequest(response.config || {})
      // response.data就是后端返回的数据，结构根据你们的约定来定义
      let obj = switchCode(response?.data || { code: '', message: '' })
      if (obj.message) {
        return Promise.resolve(obj)
      } else {
        return response
      }
    },
    // 非2xx时触发
    (error: any) => {
      let obj = switchCode(error?.response?.data || { code: '', message: '' })
      if (obj.message) {
        return Promise.resolve(obj)
      } else {
        return Promise.reject(error)
      }
    }
  )
})

export type { AxiosResponse, AxiosRequestConfig }

export default service
