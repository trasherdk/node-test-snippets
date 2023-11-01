import * as zmq from 'zeromq'
import dotenv from 'dotenv'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'
import BigNumber from 'bignumber.js';

const oneXMR = new BigNumber('1000000000000')

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// config()

const ENV_PATH = resolve(__dirname, `../../.env.${process.env.MONERO_NET || 'mainnet'}`)
console.info('Loading network specific config from %s', ENV_PATH)

dotenv.config({ path: ENV_PATH })
const { MONERO_HOST, MONERO_ZMQ_SUB_PORT, MONERO_NET } = process.env

const subscriber = zmq.socket('sub')
subscriber.monitor(100)
/**
 *  Monitor events
 *
var events = exports.events = {
  1:   "connect"       // zmq.ZMQ_EVENT_CONNECTED
, 2:   "connect_delay" // zmq.ZMQ_EVENT_CONNECT_DELAYED
, 4:   "connect_retry" // zmq.ZMQ_EVENT_CONNECT_RETRIED
, 8:   "listen"        // zmq.ZMQ_EVENT_LISTENING
, 16:  "bind_error"    // zmq.ZMQ_EVENT_BIND_FAILED
, 32:  "accept"        // zmq.ZMQ_EVENT_ACCEPTED
, 64:  "accept_error"  // zmq.ZMQ_EVENT_ACCEPT_FAILED
, 128: "close"         // zmq.ZMQ_EVENT_CLOSED
, 256: "close_error"   // zmq.ZMQ_EVENT_CLOSE_FAILED
, 512: "disconnect"    // zmq.ZMQ_EVENT_DISCONNECTED
}
*/
subscriber.on('bind', event => {
  console.log(`Socket bound to ${event.address}`)
  // ...
})

subscriber.on('connect', (event) => {
  console.log('Subscriber connected to %s:%s', MONERO_HOST, MONERO_ZMQ_SUB_PORT)
})

subscriber.on('connect_delay', (event) => {
  console.log('Subscriber connect delay on %s:%s', MONERO_HOST, MONERO_ZMQ_SUB_PORT)
})

subscriber.on('connect_retry', (event) => {
  console.log('Subscriber connect retry on %s:%s', MONERO_HOST, MONERO_ZMQ_SUB_PORT)
})

subscriber.on('listen', (event) => {
  console.log('ZMQ Listen on %s:%s', MONERO_HOST, MONERO_ZMQ_SUB_PORT)
})

subscriber.on('bind_error', (event) => {
  console.log('ZMQ Bind error on %s:%s', MONERO_HOST, MONERO_ZMQ_SUB_PORT)
})

subscriber.on('accept', (event) => {
  console.log('ZMQ accept on %s:%s', MONERO_HOST, MONERO_ZMQ_SUB_PORT)
})

subscriber.on('accept_error', (event) => {
  console.log('ZMQ accept error on %s:%s', MONERO_HOST, MONERO_ZMQ_SUB_PORT)
})

subscriber.on('close', (event) => {
  console.log('ZMQ close on %s:%s', MONERO_HOST, MONERO_ZMQ_SUB_PORT)
})

subscriber.on('close_error', (event) => {
  console.log('ZMQ close error on %s:%s', MONERO_HOST, MONERO_ZMQ_SUB_PORT)
})

// Port should be your monerod --zmq-pub port
console.log('Subscriber connecting to %s:%s on %s', MONERO_HOST, MONERO_ZMQ_SUB_PORT, MONERO_NET)

subscriber.on('message', (message) => {
  const messageStr = Buffer.from(message).toString()
  const messages = JSON.parse(messageStr.slice(messageStr.indexOf(':') + 1))
  messages.map((message) => {
    const fee = new BigNumber(message.fee)
    message.fee = parseFloat(fee.dividedBy(oneXMR))
    console.log(message)
  })
  // console.log(message2.json-minimal-txpool_add);
})

subscriber.connect(`tcp://${MONERO_HOST}:${MONERO_ZMQ_SUB_PORT}`)

subscriber.subscribe('json-minimal-txpool_add')

/*
export interface JsonMinimalTxpoolAdd {
  id: string //hash?
  blob_size: number
  weight: number
  fee: number
}

subscriber.on('message', (message) => {
  const messageClean = Buffer.from(message).toString() as unknown as JsonMinimalTxpoolAdd[];
  console.log(messageClean)
  // console.log(message2.json-minimal-txpool_add);
});
*/
