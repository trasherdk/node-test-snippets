import { parentPort, workerData } from 'node:worker_threads'

const [a, b] = workerData
console.log('Worker: %s + %s', a, b)
parentPort?.postMessage(a + b)
