import rs from "jsrsasign"
import rsu from "jsrsasign-util"
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

var pubpem = rsu.readFileUTF8(`${__dirname}/ca/server-crt.pem`);
var sighex = rsu.readFileHexByBin(`${__dirname}/temp/message.txt.sig.bin`);
var msghex = rsu.readFileHexByBin(`${__dirname}/message.txt`);

var sig = new rs.KJUR.crypto.Signature({ alg: "SHA256withRSAandMGF1" });
sig.init(pubpem);
sig.updateHex(msghex);
console.log(sig.verify(sighex)); // returns true
