import { connect } from 'tls'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const host = process.env.SERVER_HOST || '127.0.0.1'
const port = process.env.SERVER_PORT || 8000

const options = {
  ca: readFileSync(resolve(__dirname, '../ca/ca-crt.pem')),
  key: readFileSync(resolve(__dirname, '../ca/client-key.pem')),
  cert: readFileSync(resolve(__dirname, '../ca/client-crt.pem')),
  host: host,
  port: port,
  rejectUnauthorized: true,
  requestCert: true
}

const socket = connect(options, () => {
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
