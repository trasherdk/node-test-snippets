import tardis from 'tardis-dev'

const { replayNormalized, normalizeTrades, normalizeBookChanges } = tardis // require('tardis-dev')

async function run () {
  const messages = replayNormalized(
    {
      exchange: 'bitmex',
      symbols: ['XBTUSD', 'ETHUSD'],
      from: '2019-05-01',
      to: '2019-05-02'
    },
    normalizeTrades,
    normalizeBookChanges
  )

  for await (const message of messages) {
    console.log(message)
  }
}

run()
