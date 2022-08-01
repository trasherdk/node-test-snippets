import { spawn, Thread, Worker } from "threads"

const worker = await spawn(new Worker("./upgrade"))
const result = await worker.download('file.ext')

console.log('Result:', result)

await Thread.terminate(worker)
