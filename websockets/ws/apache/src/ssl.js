'use strict'

import { createServer } from 'https'
import { WebSocket, WebSocketServer } from 'ws'
import { readFileSync } from 'fs'

import dotenv from 'dotenv'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envpath = resolve(__dirname, '.env')
dotenv.config({ path: envpath })
const { HOST, PORT, SECRET } = process.env

const server = createServer({
  cert: readFileSync('/etc/httpd/certs/nanoeditor.fumlersoft.dk.crt'),
  key: readFileSync('/etc/httpd/certs/nanoeditor.fumlersoft.dk.key')
})

const wss = new WebSocketServer({ server })

wss.on('connection', function connection (ws) {
  ws.on('message', function message (msg) {
    console.log(msg.toString())
  })
})

server.listen(PORT, HOST, function listening () {
  //
  // If the `rejectUnauthorized` option is not `false`, the server certificate
  // is verified against a list of well-known CAs. An 'error' event is emitted
  // if verification fails.
  //
  // The certificate used in this example is self-signed so `rejectUnauthorized`
  // is set to `false`.
  //
  const ws = new WebSocket(`wss://${HOST}:${PORT}`, {
    rejectUnauthorized: false
  })

  ws.on('open', function open () {
    ws.send('All glory to WebSockets!')
  })
})
