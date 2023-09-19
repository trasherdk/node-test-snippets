import cryptojs from 'crypto-js'
const { lib, AES, enc, mode: _mode } = cryptojs
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto'
const CRYPTO_IV_LENGTH = 16
const encryptionKey = "bf9917c19e0cb07477d9bc27b13c1470"
const message_to_encrypt = 'This is a secret message'


const encryptMessage_node_crypto = (message) => {
  const iv = randomBytes(CRYPTO_IV_LENGTH)
  const cipher = createCipheriv('aes-256-cbc', encryptionKey, iv)
  let encrypted = cipher.update(message, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return `${iv.toString('hex')}:${encrypted}`
}

const decryptMessage_node_crypto = (encrypted) => {
  const [ivHex, cipher] = encrypted.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const decipher = createDecipheriv('aes-256-cbc', encryptionKey, iv)
  const decrypted = decipher.update(cipher, 'base64', 'utf8')

  return decrypted + decipher.final('utf8')
}


const encryptMessage_cryptojs = (message) => {
  const iv = lib.WordArray.random(CRYPTO_IV_LENGTH);
  const encrypted = AES.encrypt(message, enc.Utf8.parse(encryptionKey), {
    keySize: 256, iv, mode: _mode.CBC
  })
  const cipherString = enc.Base64.stringify(encrypted.ciphertext);
  return `${iv.toString(enc.Hex)}:${cipherString}`;
}

const decryptMessage_cryptojs = (encrypted) => {
  const [ivHex, cipher] = encrypted.split(':')
  const decrypted = AES.decrypt(cipher, enc.Utf8.parse(encryptionKey), {
    keySize: 256, iv: enc.Hex.parse(ivHex), mode: _mode.CBC
  })
  return decrypted.toString(enc.Utf8)
}

const encrypted_node_crypto = encryptMessage_node_crypto(message_to_encrypt)
const decrypted_cryptojs = decryptMessage_cryptojs(encrypted_node_crypto)
const encrypted_cryptojs = encryptMessage_cryptojs(decrypted_cryptojs)
const decrypted_node_crypto = decryptMessage_node_crypto(encrypted_cryptojs)
console.log(decrypted_node_crypto)
