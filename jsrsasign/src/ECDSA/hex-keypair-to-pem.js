import jsrsasign from 'jsrsasign'

const ec = new jsrsasign.KJUR.crypto.ECDSA({ 'curve': 'secp256k1' });
const keypairhex = ec.generateKeyPairHex();

const pubkeyhex = keypairhex.ecpubhex; // hexadecimal string of EC public key
console.log('pubkeyhex:', pubkeyhex)
const prvkeyhex = keypairhex.ecprvhex; // hexadecimal string of EC private key (=d)
console.log('prvkeyhex:', prvkeyhex)

const pubkey = new jsrsasign.KJUR.crypto.ECDSA({ name: "secp256k1" });
pubkey.setPublicKeyHex(pubkeyhex);

const pubkeypem = jsrsasign.KEYUTIL.getPEM(pubkey, "PKCS8PUB")
console.log(pubkeypem);

const prvkey = new jsrsasign.KJUR.crypto.ECDSA({ name: "secp256k1" });
prvkey.setPrivateKeyHex(prvkeyhex);

const prvkeypem = jsrsasign.KEYUTIL.getPEM(prvkey, "PKCS8PRV")
console.log(prvkeypem);

const ec1 = new jsrsasign.KJUR.crypto.ECDSA({ 'curve': 'secp256k1', 'prv': prvkeyhex });
const pubkeyhex1 = ec1.generatePublicKeyHex(); // hexadecimal string of EC public key

console.log('Match:', (pubkeyhex === pubkeyhex1))
