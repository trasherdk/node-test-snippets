import { App, us_listen_socket_close } from 'uWebSockets.js'
import fs from 'fs'
import dotenv from 'dotenv'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envpath = resolve(__dirname, '.env')

console.log('env:', envpath)
dotenv.config({ path: envpath })
const { JWT_SECRET, UWS_HOST, UWS_PORT } = process.env

let listenSocket

const app = App({
  key_file_name: "misc/key.pem",
  cert_file_name: "misc/cert.pem",
  passphrase: "1234"
})

app
  .post("/audio.mp3", (res, req) => {
    console.log("Posted to " + req.getUrl());
    const fileStream = fs.createWriteStream(
      path.resolve("./examples/audio.mp3")
    );
    res.onData((chunk, isLast) => {
      /* Buffer must be a copy, not reference */
      fileStream.write(Buffer.concat([Buffer.from(chunk)]));

      if (isLast) {
        fileStream.end();
        res.end("File Uploaded");
      }
    });

    res.onAborted(() => {
      /* Request was prematurely aborted, stop reading */
      fileStream.destroy();
      console.log("Eh, okay. Thanks for nothing!");
    });
  })
  .any('/*', (res, req) => {
    // default response + requested url
    res.writeHeader('Set-Cookie', '_token=jwt; SameSite=Strict; HttpOnly')
    res.end(`default response [${req.getUrl()}]`)
  })
  .listen(UWS_HOST, UWS_PORT, token => {
    listenSocket = token
    if (token) console.log(`listening on ${UWS_HOST}:${UWS_PORT}`)
    else console.log(`failed to listen on ${UWS_HOST}:${UWS_PORT}`)
  });
