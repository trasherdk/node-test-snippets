import { readFileSync } from 'fs'
import crypto from 'crypto'
import rs from 'jsrsasign'
import rsu from 'jsrsasign-util'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const Private = rsu.readFileUTF8(resolve(__dirname, '../ca/server-key.pem'))
const Public = rsu.readFileUTF8(resolve(__dirname, '../ca/server-crt.pem'))
const Payload = readFileSync(resolve(__dirname, '../message.txt'))

// const payload = rs.hextorstr(Payload)
const payload = Payload.toString('utf8')
console.log(' payload', payload)

console.log('sign by native')
const native = crypto.createSign('SHA256')
  .update(payload)
  .sign({
    key: Private,
    constding: crypto.constants.RSA_PKCS1_PSS_PADDING
  })

console.log('verify by native')
console.log('Verify native: ', crypto.createVerify('SHA256')
  .update(payload)
  .verify({
    key: Public,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING
  }, native)
)

console.log('verify by jsrsasign')
const sigobj = new rs.KJUR.crypto.Signature({
  alg: 'SHA256withRSAandMGF1',
  psssaltlen: -2
})

sigobj.init(Public)
sigobj.updateString(payload)
let valid
try {
  valid = sigobj.verify(native.toString('hex'))
  console.log('pure js: ', valid)
} catch (error) {
  console.log('sigobj.verify', error)
}
