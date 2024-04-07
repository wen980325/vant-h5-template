import { closeToast, showConfirmDialog } from 'vant'
import { useLoading } from '@/hooks'

export function useReport() {
  let router: any = {}

  onMounted(() => (router = useRouter()))

  const { startLoading, stopLoading } = useLoading()
  const setReportData = async ({
    api,
    params,
    message, // 接口请求成功后的提示
    backRoute, // 接口请求成功后的跳转路径
    backRouteQuery,
    afterConfig, // 接口请求成功后的配置项
    showToast,
    toastConfig,
  }: any) => {
    const setData = async () => {
      startLoading()
      try {
        let res = await api(params),
          text = message || res.data || '操作成功'

        if (afterConfig) {
          closeToast()
          let { confirm, cancel, afterClick } = afterConfig
          if (confirm && cancel) {
            showConfirmDialog({
              message: text,
              confirmButtonText: confirm.text,
              cancelButtonText: cancel.text,
            })
              .then(() => {
                confirm.click()
              })
              .catch(() => {
                cancel.click()
              })
          } else if (afterClick) {
            stopLoading(text)
            setTimeout(() => {
              afterClick()
            }, 600)
          }
        } else {
          stopLoading(text)
          setTimeout(() => {
            if (backRoute || backRouteQuery) {
              router.replace(backRoute ?? backRouteQuery)
            } else {
              router.back(res.data)
            }
          }, 600)
        }
      } catch {}
    }

    if (showToast) {
      stopLoading()
      showConfirmDialog({ message: toastConfig?.message ?? '确认提交吗？' })
        .then(() => {
          setData()
        })
        .catch(() => {})
    } else {
      setData()
    }
  }

  return { setReportData }
}
