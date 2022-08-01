import { Worker } from 'node:worker_threads'

const calc = async (a = 2, b = 2) => {
  const worker = new Worker(new URL('./worker.js', import.meta.url), {
    workerData: [a, b]
  })

  const result = await new Promise((resolve, reject) => {
    worker.on('message', resolve)
    worker.on('error', reject)
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`))
      }
    })
  })
  return await result
}

const result = await calc()
console.log('Calc:', result)
