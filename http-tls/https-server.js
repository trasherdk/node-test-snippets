const https = require('https')
const fs = require('fs')

const options = {
  key: fs.readFileSync('./pki/private/mylocaldomain.com.key'),
  cert: fs.readFileSync('./pki/issued/mylocaldomain.com.crt')
}

const port = 8443
https.createServer(options, (req, res) => {
  console.log('request')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'no-cache')
  res.writeHead(200)
  res.end(`
    <h3>echo on port: ${port}</h3>
    <div>Date: ${Date.now()}</div>
  `)
}).listen(port)

console.log('listening on:' + port)
