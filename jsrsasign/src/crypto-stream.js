const {
  generateKeyPairSync,
  createSign,
  createVerify
} = await import('node:crypto');
import { readFileSync, writeFileSync } from 'fs'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const Private = readFileSync(resolve(__dirname, '../ca/server-key.pem'))
const Public = readFileSync(resolve(__dirname, '../ca/server-crt.pem'))
const Payload = readFileSync(resolve(__dirname, '../message.txt'))

/*
const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'sect239k1'
});
*/
const sign = createSign('SHA256');
sign.write(Payload.toString('utf8'));
sign.end();
const signature = sign.sign(Private, 'hex');

const verify = createVerify('SHA256');
verify.write(Payload.toString('utf8'));
verify.end();
console.log(verify.verify(Public, signature, 'hex'));
// Prints: true
