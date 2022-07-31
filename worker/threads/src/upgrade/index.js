import { spawn, Thread, Worker } from "threads"
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import { func1 } from "./upgrade.js"

const download = async () => {
  try {
    const worker = await spawn(new Worker("./upgrade"))
    await func1()
  } catch (error) {
    console.error('main:', error)
  }
}

download()
