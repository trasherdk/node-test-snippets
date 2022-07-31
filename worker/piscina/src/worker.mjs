import { setTimeout } from 'timers/promises'

export default async ({ a, b, port }) => {
  for (let n = a; n < b; n++) {
    await setTimeout(100)
    port.postMessage(n)
  }
  port.close()
};
