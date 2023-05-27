import https from 'https'
import { readFileSync } from 'fs'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const options = {
  key: readFileSync(resolve(__dirname, '../ca/client-key.pem')),
  cert: readFileSync(resolve(__dirname, '../ca/client-crt.pem')),
  ca: readFileSync(resolve(__dirname, '../ca/ca-crt.pem')),
}

const host = '127.0.0.1'
const port = 8443

options.host = host
options.port = port
options.method = 'GET'
options.path = '/api'
let request = https.request(options, res => {
  if (res.statusCode !== 200) {
    console.error(`Did not get an OK from the server. Code: ${res.statusCode}`);
    res.resume();
    return;
  }

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('close', () => {
    console.log('Retrieved all data');
    console.log(JSON.parse(data));
  });
})

request.end();

request.on('error', (err) => {
  console.error(`Encountered an error trying to make a request: ${err.message}`);
});