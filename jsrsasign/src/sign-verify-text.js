import { readFileSync } from 'fs'
import jsrsasign from 'jsrsasign'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const Private = readFileSync(resolve(__dirname, '../ca/server-key.pem')).toString('utf8')
const Public = readFileSync(resolve(__dirname, '../ca/server-crt.pem')).toString('utf8')
const Payload = readFileSync(resolve(__dirname, '../message.txt'))
const payload = Payload.toString('utf8')

// sign
const sig = new jsrsasign.KJUR.crypto.Signature({ alg: 'SHA256withRSAandMGF1' })
const prikey = jsrsasign.KEYUTIL.getKey(Private)

sig.init(prikey)
sig.updateString(payload)
const sign = sig.sign()

// verify text
const sig2 = new jsrsasign.KJUR.crypto.Signature({ alg: 'SHA256withRSAandMGF1' })
const pubkey = jsrsasign.KEYUTIL.getKey(Public)
sig2.init(pubkey)
sig2.updateString(payload)
console.log('Verify text:', sig2.verify(sign))// true
