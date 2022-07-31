import { expose } from "threads/worker"

const tasks = {
  download: async () => {
    let device
    try {
      device = await navigator.usb.requestDevice()
    } catch (error) {
      console.error('upgrade:', error)
    }
    //await download from server...
    console.log(`Saving to device: ${device}`)
  }
}

expose(tasks)

const func1 = async () => {
  // Do something
  await tasks.download()
}

export { func1 }
