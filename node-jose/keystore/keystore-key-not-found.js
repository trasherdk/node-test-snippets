import jose from 'node-jose'

const RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs+RGarPqcaXUV3/FVDIU
EBljF1j1oaTABeb8MdaEs6q3I8TXDycghMFadb8tT0qhbFR6aF09bAMyWqaftVIH
3t6o0imYQ67Nnev2b8JY3X3L4ENvhtWC4JZxON16uSG4FTIGjyT39Lh78O7vEaag
Hcz6EYlX7Ekk0MIVywUZzpe6ITs5Lu1xC4Uv+CyrsXw0mbcPCapWiobUGrm7d6Wx
Yb8aJID/xyL68VHMKUG0yInFWybLAkhjTtQanmLZ+pe5xVQniW89u5iIEJQrtOS+
p2gEIsgdRXbgQNFExHK3g5NI3OHR8lxMgQs7cXCwFsuay5uYvzONxhQV8bxs3WMu
fQIDAQAB
-----END PUBLIC KEY-----`
const RSA_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCz5EZqs+pxpdRX
f8VUMhQQGWMXWPWhpMAF5vwx1oSzqrcjxNcPJyCEwVp1vy1PSqFsVHpoXT1sAzJa
pp+1Ugfe3qjSKZhDrs2d6/ZvwljdfcvgQ2+G1YLglnE43Xq5IbgVMgaPJPf0uHvw
7u8RpqAdzPoRiVfsSSTQwhXLBRnOl7ohOzku7XELhS/4LKuxfDSZtw8JqlaKhtQa
ubt3pbFhvxokgP/HIvrxUcwpQbTIicVbJssCSGNO1BqeYtn6l7nFVCeJbz27mIgQ
lCu05L6naAQiyB1FduBA0UTEcreDk0jc4dHyXEyBCztxcLAWy5rLm5i/M43GFBXx
vGzdYy59AgMBAAECggEBAIe5RT+gOtRAD3Ns3U7m8agr301wOvMYQCCz47ceaMS9
mquMCc5O8QP4de28rczTO/Nl0W0IXB0wVD9806aUG4gVaj4WT+FQ86WgsDAl67JB
BR9RAcYzNSmJmCcVQ1CGlkK3madKdyHWRvzC6PDiTI/vZQTyILoPfY1bweGJGa16
GpLlBw8xmhOBgxtn/qG3JIT4H7wxlmD7pS8+ZGTxRLBPLtdVmo5oaWapg9SSgg87
mZ6I8eY4omrnifTMaO+Xa0AeLVi+zhSwXBh2R85ks2R+dhGKsPvQGOITLkRoSy00
PK8+R7jZBmc7/1mORDjFz76rvt6+JGNto3LWAPUjYAECgYEA76IEqehcaryhTntF
p7LYljPEIzr+aJjNpu2ZLzW6Efcknbulzadvb/2/rwIhwBeeRzQCAndvN0Mlxlhp
7EhevAxly/vXWFqwwmi3oAIVH9TecVB3sBTnjaybaqlRErqhxec0V9sWGt0uCQiT
xnz0u0X5mNS3M1ypW9icoekYvAECgYEAwC2umjA6WVZGdGVkNuZpBSXMS1lIlU4G
eUIbpudWxn9S7cfmZnI738g96BrnjOLiG2OHkLQhP36D4XVVQK3R7RWxFMNtQuUM
1oTxgzw0jzYuhX63bBw1C+LlR7E1wTYV1ib7XDYwhnxD9u8yZFcs6Gyw3xbEh7dI
yjp1erBXYn0CgYA/dwx/J2AakLyz+Wf4QyCjnzAqGHy6nQWSWUkBvNv72BWlhMYj
0l1sLqsuoYToyBiOSRLjLliRLUJ65n2fK4eTjEEFpjxhVRuNUYiYYxTPKmSDZEle
pBqzZex/cjpbmHwx2sr9HbQcB0oi8Fea8Qsr8htpw6SFgNwFzDenlgGMAQKBgAP/
72ZeIpjBZu39Pjy2RvFIfBwFW7Ff0lqruY+buP6gn8U7J9xx/DUIIeG2zaLtBe+z
/ppQZXDA3VXP71pNQ9U/YlQgTSHbSo0cbzpgAmgIpKc6n+6sF56LtmHrmkbPLV0r
qoecyR3DcFavW8ki11hvCq9Z9fUtJ2KuHMvU57yxAoGBAJ7lWIXTemhJxZ0PRqhh
zUdvmVjD4KSgtlJ30WCKP6e82MMRAC/+w1xZ/mzjDgaTaNHgP9qaM42eGV72ytur
16jZp726GRJlr+n1mhwioP7JcOSw2L/zousMdpJO5Fj1GQtJzawpQ9tFI6QZUbHZ
CxQTfDnhmqKhtObckosCKyDu
-----END PRIVATE KEY-----`

const claims = {
    propA: 'x',
    propB: 'y',
    propC: 'z'
};

async function works () {
    const KS1 = await jose.JWK.createKeyStore(); //keystore for public key
    await KS1.add(RSA_PUBLIC_KEY, 'pem');

    const KS2 = await jose.JWK.createKeyStore(); //keystore for private key
    await KS2.add(RSA_PRIVATE_KEY, 'pem');

    const publicKey = await KS1.get('IG1TN8d3rwpIdfjpoDHCrcYGKP6KOBt6uG6dEEN2lQA');
    const privateKey = await KS2.get('IG1TN8d3rwpIdfjpoDHCrcYGKP6KOBt6uG6dEEN2lQA');
    /*
        const publicKeyInfo = await KS1.toJSON(true);
        console.log("Public key info: ", publicKeyInfo);

        const privateKeyInfo = await KS2.toJSON(true);
        console.log("Private key info: ", privateKeyInfo);

        publicKeySignature = await publicKey.thumbprint();
        console.log("publicKey signature (hex): ", publicKeySignature); //.toString('hex'));
        console.log("publicKey signature (base64): ", publicKeySignature.toString('base64'));

        privateKeySignature = await privateKey.thumbprint()
        console.log("privateKey signature (hex): ", privateKeySignature); //.toString('hex'));
        console.log("privateKey signature (base64): ", privateKeySignature.toString('base64'));
    */
    const token = await jose.JWE
        .createEncrypt({ format: 'compact' }, publicKey)
        .update(Buffer.from(JSON.stringify(claims)))
        .final();
    console.log("token: ", token);

    const result = await jose.JWE
        .createDecrypt(privateKey)
        .decrypt(token);
    console.log("header: ", JSON.stringify(result.header));
    console.log("payload (string): ", result.payload.toString());

    /*
        console.log("this works, too:")

        return jose.JWE
        .createEncrypt({ format: 'compact' }, publicKey)
        .update(Buffer.from(JSON.stringify(claims)))
        .final()
        .then(token => {
            console.log("token: ", token);
            jose.JWE
                .createDecrypt(privateKey)
                .decrypt(token)
                .then(result => {
                    console.log("header: ", result.header);
                    console.log("payload (string): ", result.payload.toString());
                });
        });
    */
}


async function fails () {
    const KS1 = await jose.JWK.createKeyStore();
    await KS1.add(RSA_PUBLIC_KEY, 'pem');
    await KS1.add(RSA_PRIVATE_KEY, 'pem');

    const publicKey = await KS1.get('IG1TN8d3rwpIdfjpoDHCrcYGKP6KOBt6uG6dEEN2lQA');

    const publicKeyInfo = await KS1.toJSON(true);
    console.log("Public key info: ", publicKeyInfo);

    const publicKeySignature = await publicKey.thumbprint();
    console.log("publicKey signature (hex): ", publicKeySignature.toString('hex'));
    console.log("publicKey signature (base64): ", publicKeySignature.toString('base64'));

    const token = await jose.JWE
        .createEncrypt({ format: 'compact' }, publicKey)
        .update(Buffer.from(JSON.stringify(claims)))
        .final();
    console.log("token: ", token);

    const result = await jose.JWE
        .createDecrypt(KS1)
        .decrypt(token);
    console.log("header: ", result.header);
    console.log("payload (string): ", result.payload.toString());
    console.log("payload (json): ", JSON.parse(result.payload.toString()));

    /*
        console.log("this fails, too:")

        return jose.JWE
                .createEncrypt({ format: 'compact' }, publicKey)
                .update(Buffer.from(JSON.stringify(claims)))
                .final()
                .then(token => {
                    console.log("token: ", token);
                    jose.JWE
                        .createDecrypt(KS1)
                        .decrypt(token)
                        .then(result => {
                            console.log("header: ", result.header);
                            console.log("payload (string): ", result.payload.toString());
                        });
                });
     */
}

works();
//fails(); // node_modules\node-jose\lib\jwe\decrypt.js:176: reject(new Error("no key found"));
