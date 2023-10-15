/**
 * Use either:
 * NODE_OPTIONS=--use-openssl-ca
 * or
 * node --use-openssl-ca node-fetch/fetch-head.js
 */

const fetch1 = async () => {
  const { ok } = await fetch('https://mydns-asus.fumlersoft.dk/nope.png', { method: 'HEAD' })
  console.log(ok)
}

const fetch2 = async () => {
  const { ok } = await fetch('https://mydns-asus.fumlersoft.dk/earth-64x64.png', { method: 'HEAD' })
  console.log(ok)
}

await fetch1()
console.log('==========================')
await fetch2()
