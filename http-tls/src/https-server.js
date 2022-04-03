const https = require('https')
const fs = require('fs')
const path = require('path')

const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../ca/server-key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../ca/server-crt.pem')),
  ca: fs.readFileSync(path.resolve(__dirname, '../ca/ca-crt.pem')),
}

const host = '127.0.0.1'
const port = 8443

https.createServer(options, (req, res) => {
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
