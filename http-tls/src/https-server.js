import { createServer } from 'https'
import { readFileSync } from 'fs'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'
import util from 'util'

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
  console.log('request', util.inspect(req.url, false, 3))
  const ts = +Date.now()
  const hr = +process.hrtime().join('')
  console.log(ts, hr)
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.writeHead(200)
  const response = JSON.stringify({
    server: `${host}:${port}`,
    time: ts,
    time36: ts.toString('36'),
    hires: hr,
    hires36: hr.toString('36')
  })
  res.end(response)
}).listen(port, host, () => {
  console.log(`listening on: ${host}:${port}`)
})
