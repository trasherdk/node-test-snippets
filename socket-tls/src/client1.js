const tls = require('tls')
const fs = require('fs')
const path = require('path')

const host = process.env.SERVER_HOST || '127.0.0.1'
const port = process.env.SERVER_PORT || 8000

const options = {
  ca: fs.readFileSync(path.resolve(__dirname, '../ca1/ca-crt.pem')),
  key: fs.readFileSync(path.resolve(__dirname, '../ca1/client-key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../ca1/client-crt.pem')),
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
