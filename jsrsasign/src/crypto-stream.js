import { readFileSync } from 'fs'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'
const {
  createSign,
  createVerify
} = await import('node:crypto')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const Private = readFileSync(resolve(__dirname, '../ca/server-key.pem'))
const Public = readFileSync(resolve(__dirname, '../ca/server-crt.pem'))
const Payload = readFileSync(resolve(__dirname, '../message.txt'))
const payload = Payload.toString('utf8')

const sign = createSign('SHA256')
sign.write(payload)
sign.end()
const signature = sign.sign(Private, 'hex')

const verify = createVerify('SHA256')
verify.write(payload)
verify.end()
console.log(verify.verify(Public, signature, 'hex'))
// Prints: true
