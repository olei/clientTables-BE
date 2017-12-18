import crypto from 'crypto'

export function md5 (str) {
  let md5sum = crypto.createHash('md5')
  md5sum.update(str)
  return md5sum.digest('hex')
}

export function encryptAes (str, secret) {
  let cipher = crypto.createCipher('aes192', secret)
  let enc = cipher.update(str, 'utf8', 'hex')
  enc += cipher.final('hex')
  return enc
}

export function decryptAes (str, secret) {
  let decipher = crypto.createDecipher('aes192', secret)
  let dec = decipher.update(str, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}