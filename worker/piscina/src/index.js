'use strict';

import { Piscina } from 'piscina'
import ProgressBar from 'progress'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const piscina = new Piscina({
  // filename: resolve(__dirname, 'worker.js')
  filename: new URL('worker.mjs', import.meta.url).href
});

// Illustrates using a MessageChannel to allow the worker to
// notify the main thread about current progress.

async function task (a, b) {
  const bar = new ProgressBar(':bar [:current/:total]', { total: b });
  const mc = new MessageChannel();
  mc.port2.onmessage = () => bar.tick();
  mc.port2.unref();
  return await piscina.runTask({ a, b, port: mc.port1 }, [mc.port1]);
  // return await piscina.run({ a, b, port: mc.port1 }, [mc.port1]);
}

Promise.all([
  task(0, 50),
  task(0, 25),
  task(0, 90)
]).catch((err) => console.error(err));
