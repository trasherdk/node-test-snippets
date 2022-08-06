import { parentPort, workerData } from 'node:worker_threads'

const [a, b] = workerData
console.log(`Worker: %d + %d`, a, b)
parentPort?.postMessage(a + b)
