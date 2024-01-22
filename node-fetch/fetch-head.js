/**
 * Use either:
 * NODE_OPTIONS=--use-openssl-ca
 * or
 * node --use-openssl-ca node-fetch/fetch-head.js
 */
import { Agent } from "undici"
import { readFileSync } from 'fs'

const ca = readFileSync("certs/ca.crt")
const cert = readFileSync("certs/ghost-node.fumlersoft.dk.crt")
const key = readFileSync("certs/ghost-node.fumlersoft.dk.key")

const agent = new Agent({
  connect: {
    cert: cert,
    key: key,
    ca: ca
  }
})

const fetch1 = async () => {
  const res = await fetch('https://ns1.fumlersoft.dk/earth-64x64.png', {
    method: 'HEAD',
    dispatcher: agent
  })
  console.log('fetch1:', res)
}

const fetch2 = async () => {
  const res = await fetch('https://ns2.fumlersoft.dk/earth-64x64.png', {
    method: 'HEAD',
    dispatcher: agent
  })
  console.log('fetch2:', res)
}

await fetch1()
console.log('==========================')
await fetch2()
