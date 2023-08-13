import tardis from 'tardis-dev'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const { streamNormalized, normalizeTrades, normalizeBookChanges } = tardis

const messages = streamNormalized({
  exchange: 'bitmex',
  symbols: ['XBTUSD']
  /**
  filters: [
    { channel: 'trade', symbols: ['XMREUR'] },
    { channel: 'orderBookL2', symbols: ['XMREUR'] }
  ]
   */
})

for await (const message of messages) {
  console.log(message)
}
