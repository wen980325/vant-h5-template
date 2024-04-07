export const getFileUrl = (url: string) => {
  let satoken = localStorage.getItem('token')
  return `${import.meta.env.VITE_APP_IMG_BASE_URL}/${url}${satoken ? '?satoken=' + satoken : ''}`
}

export const checkPhone = (value: string) => {
  let phoneReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
  if (!value) {
  } else {
    return phoneReg.test(value)
  }
}

export const checkIDCard = (value: string) => {
  let IDCardReg = /^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$/
  if (!value) {
  } else {
    return IDCardReg.test(value)
  }
}

export const judgeClient = () => {
  let u = navigator.userAgent
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // 判断是否是 android终端
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // 判断是否是 iOS终端
  if (isAndroid) {
    return 'Android'
  } else if (isIOS) {
    return 'IOS'
  } else {
    return 'PC'
  }
}

export const downloadByData = (data: BlobPart, filename: string, mime?: string, bom?: BlobPart) => {
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data]
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' })
  const blobURL = window.URL.createObjectURL(blob)
  const tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = blobURL
  tempLink.setAttribute('download', filename)
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank')
  }
  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)
  window.URL.revokeObjectURL(blobURL)
}

export const changeTitle = (str: string) => {
  setTimeout(function () {
    //利用iframe的onload事件刷新页面
    document.title = str
    let iframe = document.createElement('iframe')
    iframe.style.visibility = 'hidden'
    iframe.style.width = '1px'
    iframe.style.height = '1px'
    iframe.onload = function () {
      setTimeout(function () {
        document.body.removeChild(iframe)
      }, 0)
    }
    document.body.appendChild(iframe)
  }, 0)
}
