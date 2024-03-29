import { Worker } from 'node:worker_threads'

const worker = new Worker(new URL('./worker.js', import.meta.url), {
  workerData: [2, 2],
  execArgv: ['--loader', 'ts-node/esm'],
})

const calc = async () => {
  const result = await new Promise<number>((resolve, reject) => {
    worker.on('message', resolve)
    worker.on('error', reject)
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`))
      }
    })
  })
  return result
}

const result = await calc()
console.log('Result:', result)
