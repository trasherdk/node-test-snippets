import async from 'async'
import { Piscina } from 'piscina'
import ProgressBar from 'progress'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'
import commandLineArgs from 'command-line-args'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.time('main')

import worker from './worker.mjs'

const piscina = new Piscina({
  // filename: resolve(__dirname, 'worker.mjs')
  filename: new URL('worker.mjs', import.meta.url).href
})

const argvOptions = commandLineArgs([
  { name: 'multi-thread', alias: 'm', type: Boolean },
  { name: 'iterations', alias: 'i', type: Number }
])

const files = []
for (let i = 0; i < (argvOptions.iterations || 1000); i++) {
  files.push(path.join(__dirname, 'temp', `${i}.txt`))
}

var bar = new ProgressBar(':bar', { total: files.length, width: 80 });

async.each(files, (file, cb) => {
  (async function () {
    try {
      const err = argvOptions['multi-thread']
        ? (await piscina.run(file))
        : worker(file)
      bar.tick()
      if (err) cb(Error(err)); else cb()
    } catch (err) {
      cb(Error(err))
    }
  })();
}, (err) => {
  if (err) {
    console.error('There was an error: ', err)
    process.exitCode = 1
  } else {
    bar.terminate()
    console.log('Success')
    console.timeEnd('main')
    process.exitCode = 0
  }
})
