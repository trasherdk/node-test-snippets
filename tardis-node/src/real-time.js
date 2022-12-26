import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const tardisPath = resolve(__dirname, '../../node_modules/tardis-node/dist/index.js')
console.log('Path:', tardisPath)
// import { replayNormalized, streamNormalized, normalizeTrades, compute, computeTradeBars } from '../../node_modules/tardis-node/dist/index.js'
import { tardis, streamNormalized } from 'tardis-node'
// const { streamNormalized } = tardis
// import * as tardis from 'tardis-node'
// const { replayNormalized, streamNormalized, normalizeTrades, compute, computeTradeBars } = tardis

const messages = streamNormalized({
  exchange: 'kraken',
  filters: [
    { channel: 'trade', symbols: ['XMREUR'] },
    { channel: 'orderBookL2', symbols: ['XMREUR'] }
  ]
})

for await (const message of messages) {
  console.log(message)
}
