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
const payload = Payload.toString('utf8')
/*
const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});
*/
const sign = createSign('SHA256');
sign.update(payload);
sign.end();
const signature = sign.sign(Private);

const verify = createVerify('SHA256');
verify.update(payload);
verify.end();
console.log(verify.verify(Public, signature));
// Prints: true
