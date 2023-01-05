# Node.js TLS plain TLS sockets

This guide shows how to set up a bidirectional client/server authentication for plain TLS sockets.

**Newer versions of openssl are stricter about certificate purposes. Use [extensions](https://www.openssl.org/docs/manmaster/man5/x509v3_config.html) accordingly.**

## Prepare certificates

Run the script `./ca/gen-certs.sh` to generate valid client/server certificates.

`Node.js documentation`
[tls.createServer()](https://nodejs.org/api/tls.html#tlscreateserveroptions-secureconnectionlistener)
[tls.connect()](https://nodejs.org/api/tls.html#tlsconnectoptions-callback)

## Server code:

```javascript
import { createServer } from 'tls'
import { readFileSync } from 'fs'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../ca/server-key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../ca/server-crt.pem')),
  ca: fs.readFileSync(path.resolve(__dirname, '../ca/ca-crt.pem')),
  requestCert: true,
  rejectUnauthorized: true
}

const server = tls.createServer(options, (socket) => {
  console.log('server connected',
    socket.authorized ? 'authorized' : 'unauthorized')

  socket.on('error', (error) => {
    console.log(error)
  })

  socket.write('welcome!\n')
  socket.setEncoding('utf8')
  socket.pipe(process.stdout)
  socket.pipe(socket)
})

const host = process.env.SERVER_HOST || '127.0.0.1'
const port = process.env.SERVER_PORT || 8000

server.listen(port, host, () => {
  console.log('server bound to %s:%s', host, port)
})
```

## Client code:

```js
import { connect } from 'tls'
import { readFileSync } from 'fs'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const host = process.env.SERVER_HOST || '127.0.0.1'
const port = process.env.SERVER_PORT || 8000

const options = {
  ca: fs.readFileSync(path.resolve(__dirname, '../ca/ca-crt.pem')),
  key: fs.readFileSync(path.resolve(__dirname, '../ca/client-key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../ca/client-crt.pem')),
  host: host,
  port: port,
  rejectUnauthorized: true,
  requestCert: true
}

const socket = tls.connect(options, () => {
  console.log('client connected',
    socket.authorized ? 'authorized' : 'unauthorized')
  process.stdin.pipe(socket)
  process.stdin.resume()
})

socket.setEncoding('utf8')

socket.on('data', (data) => {
  console.log(data)
})

socket.on('error', (error) => {
  console.log(error)
})

socket.on('end', (data) => {
  console.log('Socket end event')
})
```

## Credits
And I found this thing at [Node.js TLS plain TLS sockets](https://gist.github.com/pcan/e384fcad2a83e3ce20f9a4c33f4a13ae)

See [the original post](https://engineering.circle.com/https-authorized-certs-with-node-js-315e548354a2#.24nmlit7w) by Anders Brownworth.

Thanks to [this StackOverflow answer](http://stackoverflow.com/a/23715832/4255183), too (I was using same CN for CA, Server and Client and I got the `DEPTH_ZERO_SELF_SIGNED_CERT` error).
