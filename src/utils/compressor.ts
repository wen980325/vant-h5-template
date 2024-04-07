import Compressor from 'compressorjs'

export async function compressorImage(image: any, backType: string, quality: number) {
  return new Promise((resolve, reject) => {
    new Compressor(image, {
      quality: quality || 0.8,
      success(result) {
        let file = new File([result], image.name, { type: image.type })
        if (!backType || backType == 'blob') {
          resolve(result)
        } else if (backType == 'file') {
          if (file.size / 1024 / 1024 > 30) {
            reject('上传图片文件太大，请重新选取')
          } else {
            resolve(file)
          }
        } else {
          resolve(file)
        }
      },
      error(err) {
        reject(err)
      },
    })
  })
}
