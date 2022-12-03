import { readFileSync } from 'fs'
import jsrsasign from 'jsrsasign'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const Private = readFileSync(resolve(__dirname, '../ca/private-jwt-key.pem')).toString('utf8')
const Public = readFileSync(resolve(__dirname, '../ca/public-jwt-key.pem')).toString('utf8')

const tNow = jsrsasign.KJUR.jws.IntDate.get('now')
const tEnd = jsrsasign.KJUR.jws.IntDate.get('now + 1day')
const teamId = 'SEARCHADS.xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
const clientId = 'foo'
const keyId = 'xxxxxx-xxxx-xxxx-xxxxxxxxxxx'

const oHeader = {
  alg: 'ES256',
  kid: keyId
}

const oPayload = {
  iss: teamId,
  iat: tNow,
  exp: tEnd,
  aud: 'https://appleid.apple.com',
  sub: clientId,
  data: {
    alias: 'TrasherDK',
    ip: '1.2.3.4'
  }
}

const sHeader = JSON.stringify(oHeader)
const sPayload = JSON.stringify(oPayload)
let sResult
try {
  const sKey = jsrsasign.KEYUTIL.getKey(Private)
  sResult = jsrsasign.KJUR.jws.JWS.sign('ES256', sHeader, sPayload, sKey)

  console.log('sign:', sResult)

} catch (error) {
  console.log('sign:', error)
  process.exit()
}

let vResult
try {
  vResult = jsrsasign.KJUR.jws.JWS.verifyJWT(sResult, Public, {
    alg: ['ES256'],
    verifyAt: jsrsasign.KJUR.jws.IntDate.get('now')
  })

  console.log('verifyJWT:', vResult)

} catch (error) {
  console.log('verifyJWT:', error)
  process.exit()
}

let headerObj
let payloadObj
try {
  headerObj = jsrsasign.KJUR.jws.JWS.readSafeJSONString(jsrsasign.b64utoutf8(sResult.split('.')[0]))
} catch (error) {
  console.log('headerObj:', error)
  process.exit()
}

try {
  payloadObj = jsrsasign.KJUR.jws.JWS.readSafeJSONString(jsrsasign.b64utoutf8(sResult.split('.')[1]))
} catch (error) {
  console.log('payloadObj:', error)
  process.exit()
}

console.log('Header:', headerObj)
console.log('Payload:', payloadObj)
