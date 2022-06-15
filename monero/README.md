# Stuff regarding Monero & Ecosystem


## Monero Daemon

### ZMQ Interface

**Q:** [How do I properly subscribe to ZMQ events?](https://monero.stackexchange.com/q/13107/7574) :arrow_heading_up:

```js
const zmq = require("zeromq")

async function run() {
  const sock = new zmq.Subscriber

  sock.connect("tcp://192.168.1.8:18082")
  sock.subscribe("json-full")
  console.log("Subscriber connected")

  for await (const [topic, msg] of sock) {
    console.log("received a message related to:", topic, "containing message:", msg)
  }
}

run()
```

**A:**
```


ZeroMQ uses different types of sockets for request/response messages and publisher/subscriber messages.

The one you are trying to use, enabled by default on port 18082, is of type RESP, and can only be used for request/response. To use pub/sub, you need a separate socket of type PUB. This isn't enabled by default, but can be easily enabled by passing the --zmq-pub argument to monerod. For example, monerod --zmq-pub ipc://var/run/monerod.pub to use a local socket, or monerod --zmq-pub tcp://localhost:18085 to use a TCP socket.

Then simply use the same URI in your JavaScript client, and it should work.
```
