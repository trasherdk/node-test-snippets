import { expose } from "threads/worker"

expose({
  async download (file) {
    return `Downloaded ${file}`
  }
})
