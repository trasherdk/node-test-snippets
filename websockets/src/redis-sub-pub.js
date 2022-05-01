//Redis Subscribe / Publish
const subscriber = redisClient.duplicate()
const publisher = redisClient.duplicate()

const wsMap = new Map();

void (async () => {
  try {
    await subscriber.subscribe('message', (data) => {
      data = JSON.parse(data)
      const ws = wsMap.get(data.sender);
      (ws || app).publish(data.topic, data.message);
    })
  } catch (e) {
    console.error(e)
  }
})()

APP.ws("/*", {
  idleTimeout: 16,
  compression: APP.SHARED_COMPRESSOR,

  open: async (ws) => {
    //join channel
    wsMap.set(ws.id, ws);
    ws.subscribe("hello")
  },
  close: async (ws) => {
    wsMap.delete(ws.id);
  },
  message: async (ws, message, isBinary) => {
    //Publish message
    await publisher.publish("message", JSON.stringify({ topic: "hello", message: "world" }))
  }
})
