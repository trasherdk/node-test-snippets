import * as zmq from 'zeromq'
import dotenv from 'dotenv'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// config()

const ENV_PATH = resolve(__dirname, `../../.env.${process.env.MONERO_NET}`)
console.info('Loading network specific config from %s', ENV_PATH)

dotenv.config({ path: ENV_PATH })
const { MONERO_HOST, MONERO_ZMQ_PORT, MONERO_NET } = process.env

const subscriber = zmq.socket('sub')

subscriber.on('bind', event => {
  console.log(`Socket bound to ${event.address}`)
  // ...
})

subscriber.on('message', (message) => {
  let messageClean = Buffer.from(message).toString()
  messageClean = messageClean.slice(messageClean.indexOf(':') + 1)
  console.log(messageClean)
  // console.log(message2.json-minimal-txpool_add);
})

subscriber.on('connect', (event) => {
  console.log('Subscriber connected to %s:%s', MONERO_HOST, MONERO_ZMQ_PORT)
})

// Port should be your monerod --zmq-pub port
console.log('Subscriber connecting to %s:%s on %s', MONERO_HOST, MONERO_ZMQ_PORT, MONERO_NET)

subscriber.connect(`tcp://${MONERO_HOST}:${MONERO_ZMQ_PORT}`)

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
