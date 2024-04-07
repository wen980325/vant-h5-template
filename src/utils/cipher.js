import md5 from 'crypto-js/md5'

export function encryptByMd5(password) {
  return md5(password).toString()
}
