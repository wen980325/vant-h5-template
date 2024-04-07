import http from '@/utils/http'

export default {
  // 照片上传
  async commonUploadImage(file: any) {
    return await http.upload('/common/image', file)
  },
  // 文件下载
  async downloadFile(params: any) {
    return await http.get('/common/download', params, {
      responseType: 'blob',
    })
  },
  // 企业微信配置信息
  async scanConfig(url: string) {
    return await http.get(`/system/config?url=${url}`)
  },
}
