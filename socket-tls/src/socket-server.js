import { createServer } from 'tls'
import { readFileSync } from 'fs'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const options = {
  key: readFileSync(resolve(__dirname, '../ca/server-key.pem')),
  cert: readFileSync(resolve(__dirname, '../ca/server-crt.pem')),
  ca: readFileSync(resolve(__dirname, '../ca/ca-crt.pem')),
  requestCert: true,
  rejectUnauthorized: true
}

const server = createServer(options, (socket) => {
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
