/**
 * Failed attemts with 'jsencrypt'
// import * as JSEncrypt from 'jsencrypt' // ReferenceError: window is not defined
// import JSEncrypt from 'jsencrypt' // SyntaxError: The requested module 'jsencrypt' does not provide an export named 'default'
// import { default as JSEncrypt } from 'jsencrypt' // SyntaxError: The requested module 'jsencrypt' does not provide an export named 'default'
// import { JSEncrypt } from 'jsencrypt' // SyntaxError: The requested module 'jsencrypt' does not provide an export named 'JSEncrypt'
// const JSEncrypt = await import('jsencrypt') // ReferenceError: window is not defined
**/
import JSEncrypt from 'node-jsencrypt'
import { readFileSync } from 'fs'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pubpem = readFileSync(resolve(__dirname, '../ca/server-crt.pem')).toString('utf8')
const keypem = readFileSync(resolve(__dirname, '../ca/server-key.pem')).toString('utf8')

const message = 'Secret message to encrypt'

const encrypt = new JSEncrypt()
encrypt.setPublicKey(pubpem)
const encrypted = encrypt.encrypt(message)


const decrypt = new JSEncrypt()
decrypt.setPrivateKey(keypem)
const uncrypted = decrypt.decrypt(encrypted)

if (message === uncrypted) {
  console.log(`All good: ${message} === ${uncrypted}`)
} else {
  console.error(`Not so good: ${message} !== ${uncrypted}`)
}
