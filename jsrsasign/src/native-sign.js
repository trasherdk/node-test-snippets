import { readFileSync } from 'fs'
import crypto from "crypto";
import rs from "jsrsasign";
import rsu from "jsrsasign-util"
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const clientPrivate = rsu.readFileUTF8(resolve(__dirname, '../ca/client-key.pem'))
const clientPublic = rsu.readFileUTF8(resolve(__dirname, '../ca/client-crt.pem'))
const clientPayload = rsu.readFileHexByBin(resolve(__dirname, '../message.txt'))

console.log('Client payload', clientPayload)

const payload = rs.hextorstr(clientPayload);

// console.log('Hex to rstr', payload)

// sign by native
const native = crypto.createSign("SHA256")
  .update(payload)
  .sign({
    key: clientPrivate,
    constding: crypto.constants.RSA_PKCS1_PSS_PADDING
  });

// verify by native
console.log('Verify native: ', crypto.createVerify("SHA256")
  .update(payload)
  .verify({
    key: clientPublic,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING
  },
    native)
);

// verify by jsrsasign
const sigobj = new rs.KJUR.crypto.Signature({
  alg: "SHA256withRSAandMGF1",
  psssaltlen: -2
});
sigobj.init(clientPublic);
sigobj.updateString(payload);
console.log("pure js: ", sigobj.verify(native.toString("hex")))
