import { generateKeyPair, exportSPKI, SignJWT, importSPKI, jwtVerify } from 'jose';

const ALGO_RS256 = 'RS256';
const ALGO_ES256 = 'ES256';

async function errorDemo (algo) {
  console.log(`Demonstration using algo ${algo}`);

  // Prepare key pair
  try {
    var keyPair = await generateKeyPair(algo);
    var pubkey = await exportSPKI(keyPair.publicKey);
    console.log(pubkey);
  } catch (error) {
    console.error(`Error creating/exporting key-pairs for algo ${algo}`);
  }

  // Create token, sign with private key
  let payload = {
    user: 'JohnDoe',
    groups: ['Group A', 'Group B']
  }

  let jwt = new SignJWT(payload);
  jwt.setProtectedHeader({ alg: algo });
  jwt.setIssuedAt();
  jwt.setIssuer('DeputyAuth');
  jwt.setAudience('Microservices');
  jwt.setExpirationTime('1h');

  try {
    var signedToken = await jwt.sign(keyPair.privateKey);
  } catch (error) {
    console.error(`Error signing token for algo ${algo}`);
  }

  //Verify the token using the previously exported public key -- This would normally be fetched via HTTP
  try {
    var importedPubkey = await importSPKI(pubkey);
    var extractedPayload = await jwtVerify(signedToken, importedPubkey); // compactVerify => jwtVerify
    console.log(`Token is valid for algo ${algo} : ` + extractedPayload.payload.toString());
  } catch (error) {
    console.error(`Token is invalid for algo ${algo} -- error: ${error}`);
  }
}

async function showDemos () {
  await errorDemo(ALGO_RS256);
  await errorDemo(ALGO_ES256);
}

showDemos();