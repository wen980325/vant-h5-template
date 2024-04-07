/* eslint-disable @typescript-eslint/no-explicit-any */
import { showLoadingToast, showSuccessToast, closeToast } from 'vant'

export function useLoading() {
  const startLoading = (msg?: string) => {
    showLoadingToast({
      duration: 0,
      forbidClick: true,
      message: msg ?? 'Loading...',
    })
  }

  const stopLoading = (msg?: any) => {
    if ((msg ?? '') !== '') {
      showSuccessToast(msg)
    } else {
      closeToast()
    }
  }

  onBeforeUnmount(stopLoading)

  return { startLoading, stopLoading }
}
