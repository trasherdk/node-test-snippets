import { readFileSync } from 'fs'
import crypto from 'node:crypto'
import rs from 'jsrsasign'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const Private = readFileSync(resolve(__dirname, '../ca/server-key.pem')).toString('utf8')
const Public = readFileSync(resolve(__dirname, '../ca/server-crt.pem')).toString('utf8')
const Payload = readFileSync(resolve(__dirname, '../message.txt'))

const payload = Payload.toString('utf8')
console.log('* payload:', Payload.toString('utf8'), payload)

console.log('sign by native')
const signature = crypto.createSign('SHA256')
  .update(payload)
  .end()
  .sign({
    key: Private,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING
    // saltLength: -2
  })

const checker = crypto.createVerify('SHA256')
  .update(payload)
  .end()

let valid = checker.verify({
  key: Public,
  padding: crypto.constants.RSA_PKCS1_PSS_PADDING
  // saltLength: -2
}, signature)
console.log('verify by native', valid)

console.log('verify by jsrsasign')
const verifier = new rs.KJUR.crypto.Signature({
  alg: 'SHA256withRSAandMGF1',
  psssaltlen: -2
})

verifier.init(Public)
verifier.updateString(payload)

try {
  valid = verifier.verify(signature)
  console.log('KJUR js: ', valid)
} catch (error) {
  console.log('verifier.verify', error.message)
}
try {
  const sig2 = new rs.KJUR.crypto.Signature({ alg: 'SHA256withRSA' })
  const pubkey = rs.KEYUTIL.getKey(Public)
  sig2.init(pubkey)
  sig2.updateString(payload)
  console.log('pubkey:', sig2.verify(signature))
} catch (error) {
  console.log('sig2.verify', error.message)
}
