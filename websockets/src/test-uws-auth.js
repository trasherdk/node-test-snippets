import { App, us_listen_socket_close } from 'uWebSockets.js'
import cookie from 'cookie'
import Jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const envpath = resolve(__dirname, '.env')

console.log('env:', envpath)
dotenv.config({ path: envpath })
const { JWT_SECRET, UWS_HOST, UWS_PORT } = process.env

const getCookie = (res, req, name) => {
  res.cookies ??= req.getHeader('cookie')
  return res.cookies && res.cookies.match(getCookie[name] ??= new RegExp(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`))?.[2]
}

const decodeJwtCookie = (res, req, name) => Jwt.verify(getCookie(res, req, name), JWT_SECRET);

const app = App()
const wsMap = new Map()
let id = 0
let listenSocket

app
  .ws('/*', {
    upgrade (res, req, context) {
      res.onAborted(() => {
        res.aborted = true
      })

      const _cookie = cookie.parse(req.getHeader('cookie'))
      // validate the cookie somehow
      try {
        res.user = decodeJwtCookie(res, req, 'cookieName')
      }
      catch {
        if (res.aborted) return
        return res.writeStatus('401').end()
      }

      return res.upgrade({ uid: res.user._id },
        req.getHeader('sec-websocket-key'),
        req.getHeader('sec-websocket-protocol'),
        req.getHeader('sec-websocket-extensions'),
        context
      )
    },
    open (ws) {
      ws.id = ++id;
      wsMap.set(ws.id, ws);
      console.log('open', ws.id);
    },
    close: (ws, code) => {
      wsMap.delete(ws.id);
      console.log('close', ws.id, code);
    }
    // ...more code
  })
  .any('/*', (res, req) => {
    // set cookie
    res.writeHeader('Set-Cookie', '_token=jwt; SameSite=Strict; HttpOnly')
    res.end('cookie sample')
  })
  .listen(UWS_HOST, UWS_PORT, token => {
    listenSocket = token
    if (token) console.log(`listening on ${UWS_HOST}:${UWS_PORT}`)
    else console.log(`failed to listen on ${UWS_HOST}:${UWS_PORT}`)
  })

