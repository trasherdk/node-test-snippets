import {
  generateKeyPair,
  FlattenedSign,
  flattenedVerify,
  exportSPKI,
  importSPKI,
  exportPKCS8,
  importPKCS8
} from 'jose'

const algos = ['PS256', 'RS256']

const signverify = async (algo) => {
  let keyPair,
    publicKey,
    privateKey,
    keys,
    jws

  try {
    keyPair = await generateKeyPair(algo);
  } catch (error) {
    console.log('Error creating key-pairs for algo %s', algo, error);
  }

  try {
    publicKey = await exportSPKI(keyPair.publicKey);
    console.log(algo, publicKey);
  } catch (error) {
    console.log('Error exporting publicKey for algo %s', algo, error);
  }

  try {
    privateKey = await exportPKCS8(keyPair.privateKey);
    console.log(algo, privateKey);
  } catch (error) {
    console.log('Error exporting privateKey for algo %s', algo, error);
  }

  const payload = 'detached payload example'

  try {
    keys = {
      publicKey: await importSPKI(publicKey, algo),
      privateKey: await importPKCS8(privateKey, algo)
    }
  } catch (error) {
    console.log('Error importing Keys for algo : %s', algo, error);
  }

  try {
    jws = await new FlattenedSign(new TextEncoder().encode(payload))
      .setProtectedHeader({ alg: algo, b64: false, crit: ['b64'] })
      .sign(keys.privateKey)

    console.log('jws:', jws)
  } catch (error) {
    console.log('Error signing privateKey for algo %s', algo, error);
  }

  let result = {}

  try {
    result.unencoded = await flattenedVerify({ ...jws, payload: payload }, keys.publicKey)
    console.log('Cleartext (unencoded) for algo %s', algo, result.unencoded)
  } catch (error) {
    console.log('Error flattenedVerify (unencoded) for algo %s', algo, error.code)
  }
  try {
    result.encoded = await flattenedVerify({ ...jws, payload: new TextEncoder().encode(payload) }, keys.publicKey)
    console.log('Cleartext (encoded) for algo %s', algo, result.encoded)
  } catch (error) {
    console.log('Error flattenedVerify (encoded) for algo %s', algo, error.code)
  }

  return result
}

algos.forEach(algo => {
  console.log('Call signverify for algo %s', algo)
  signverify(algo)
    .then(result => console.log('After signverify for algo %s', algo, result))
    .catch(error => {
      console.log('Error after signverify for algo %s', algo, error)
    })
})
