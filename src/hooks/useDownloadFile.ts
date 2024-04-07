import { showToast } from 'vant'
import { useLoading } from '@/hooks'
import { judgeClient } from '@/utils/common'

export function useDownloadFile() {
  const { startLoading, stopLoading } = useLoading()

  const downloadFile = (res: any, name: string, type: string) => {
    if (res) {
      const link = document.createElement('a')
      const blob = new Blob([res], { type })
      link.style.display = 'none'
      link.target = '_blank'
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', name) //报表名称可自定义
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      showToast({
        message: '文件下载失败',
        position: 'top',
      })
    }
  }

  const obj: any = {
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pdf: 'application/pdf',
  }

  const dlFile = async (api: any, type: string, name: string) => {
    startLoading()
    try {
      let res = await api,
        str = judgeClient()
      downloadFile(res, str === 'IOS' ? name : `${name}.${type}`, obj[type])
      stopLoading('导出成功')
    } catch {}
  }

  return { dlFile }
}
