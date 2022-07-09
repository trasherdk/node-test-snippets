import * as zmq from 'zeromq'
import { config } from 'dotenv'

config()
const { MONERO_HOST, MONERO_ZMQ_PORT } = process.env

const sock = new zmq.Subscriber()

const onMessage = (message) => {
  let messageClean = Buffer.from(message).toString()
  messageClean = messageClean.slice(messageClean.indexOf(':') + 1)
  console.log(messageClean)
  // console.log(message2.json-minimal-txpool_add);
}

const onConnect = (event) => {
  console.log('Connected to %s', event.address)

  // sock.subscribe('json-minimal-txpool_add')
  // sock.subscribe('json')
}

const onHandshake = (event) => {
  console.log('Handshake from %s', event.address)

  // sock.subscribe('json-minimal-txpool_add')
  sock.subscribe('json')
}

// Port should be your monerod --zmq-pub port
console.log('Connecting to %s:%s', MONERO_HOST, MONERO_ZMQ_PORT)

sock.connect(`tcp://${MONERO_HOST}:${MONERO_ZMQ_PORT}`)
sock.subscribe('json-minimal-txpool_add')

for await (Event of sock.events) {
  switch (Event.type) {
    case 'bind':
      console.log(`Socket bound to ${Event.address}`)
      break
    case 'connect':
      onConnect(Event)
      break
    case 'handshake':
      onHandshake(Event)
      break
    case 'message':
      onMessage(Event)
      break
    default:
      console.log('Event %s from %s', Event.type, Event.address)
  }
}
/*
export interface JsonMinimalTxpoolAdd {
  id: string //hash?
  blob_size: number
  weight: number
  fee: number
}

sock.on('message', (message) => {
  const messageClean = Buffer.from(message).toString() as unknown as JsonMinimalTxpoolAdd[];
  console.log(messageClean)
  // console.log(message2.json-minimal-txpool_add);
});
*/
