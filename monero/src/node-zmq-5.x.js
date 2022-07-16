import * as zmq from 'zeromq';
import { config } from 'dotenv'

config()
const { MONERO_HOST, MONERO_ZMQ_PORT } = process.env

const sock = zmq.socket('sub');

sock.on("bind", event => {
  console.log(`Socket bound to ${event.address}`)
  // ...
})

sock.on('message', (message) => {
  let messageClean = Buffer.from(message).toString()
  messageClean = messageClean.slice(messageClean.indexOf(':') + 1)
  console.log(messageClean)
  // console.log(message2.json-minimal-txpool_add);
})

sock.on('connect', (event) => {
  console.log('Subscriber connected to %s:%s', MONERO_HOST, MONERO_ZMQ_PORT)

})

// Port should be your monerod --zmq-pub port
console.log('Subscriber connecting to %s:%s', MONERO_HOST, MONERO_ZMQ_PORT)

sock.connect(`tcp://${MONERO_HOST}:${MONERO_ZMQ_PORT}`);

sock.subscribe('json-minimal-txpool_add');

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
