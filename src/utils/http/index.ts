/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { closeToast, showFailToast } from 'vant'
import service, { AxiosRequestConfig } from './axios'
export * from './types'

export const request = <T = any>(config: any): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    const { VITE_APP_ROUTEBACK_URL } = import.meta.env
    await service[config.serviceNum || 0].fun
      .request(config)
      .then((res: any) => {
        // 一些业务处理
        if (res.code && !config?.hideToast) {
          showFailToast(res.message)
          if (res.code === 401) {
            let { pathname, search } = window.location
            localStorage.clear()
            localStorage.setItem('replaceUrl', `${pathname}${search}`)
            setTimeout(() => {
              window.location.href = VITE_APP_ROUTEBACK_URL
            }, 600)
          }
        } else {
          resolve(res.data)
        }
      })
      .catch((err: any) => {
        if (config?.hideToast) {
          closeToast()
        } else if (err.message) {
          showFailToast(err.message)
        }
        reject(err)
      })
  })
}

const http = {
  get<T = any>(url: string, params = {}, config?: any): Promise<T> {
    return request({ url, params, ...config, method: 'GET' })
  },
  post<T = any>(url: string, data = {}, config?: any): Promise<T> {
    return request({ url, data, ...config, method: 'POST' })
  },
  put<T = any>(url: string, data = {}, config?: any): Promise<T> {
    return request({ url, data, ...config, method: 'PUT' })
  },
  delete<T = any>(url: string, data = {}, config?: any): Promise<T> {
    return request({ url, data, ...config, method: 'DELETE' })
  },
  // 上传文件，指定 'Content-Type': 'multipart/form-data'
  upload<T = any>(url: string, data = {}, config?: any): Promise<T> {
    return request({
      url,
      data,
      ...config,
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export default http
