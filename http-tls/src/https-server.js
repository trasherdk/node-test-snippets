import { createServer } from 'https'
import { readFileSync } from 'fs'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const options = {
  key: readFileSync(resolve(__dirname, '../ca/server-key.pem')),
  cert: readFileSync(resolve(__dirname, '../ca/server-crt.pem')),
  ca: readFileSync(resolve(__dirname, '../ca/ca-crt.pem')),
}

const host = '127.0.0.1'
const port = 8443

createServer(options, (req, res) => {
  console.log('request')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.writeHead(200)
  res.end(`
    <h3>echo on port: ${host}:${port}</h3>
    <div>Date: ${Date.now()}</div>
  `)
}).listen(port, host, () => {
  console.log(`listening on: ${host}:${port}`)
})
