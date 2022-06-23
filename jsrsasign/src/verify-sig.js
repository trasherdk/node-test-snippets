import rs from 'jsrsasign'
import rsu from 'jsrsasign-util'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pubpem = rsu.readFileUTF8(resolve(__dirname, '../ca/server-crt.pem'))
const sighex = rsu.readFileHexByBin(resolve(__dirname, '../temp/message.txt.sig.bin'))
const msghex = rsu.readFileHexByBin(resolve(__dirname, '../message.txt'))

const sig = new rs.KJUR.crypto.Signature({ alg: 'SHA256withRSAandMGF1' })
sig.init(pubpem)
sig.updateHex(msghex)
console.log(sig.verify(sighex)) // returns true
