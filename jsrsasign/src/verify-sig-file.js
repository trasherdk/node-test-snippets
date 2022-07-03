import { readFileSync } from 'fs'
import rs from 'jsrsasign'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pubpem = readFileSync(resolve(__dirname, '../ca/server-crt.pem')).toString('utf8')
const sighex = readFileSync(resolve(__dirname, '../temp/message.txt.sig.bin')).toString('hex')
const msghex = readFileSync(resolve(__dirname, '../message.txt')).toString('hex')

const sig = new rs.KJUR.crypto.Signature({ alg: 'SHA256withRSAandMGF1' })
sig.init(pubpem)
sig.updateHex(msghex)
console.log(sig.verify(sighex)) // returns true
