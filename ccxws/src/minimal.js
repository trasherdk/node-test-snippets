import ccxt from 'ccxt'
import { KrakenClient } from 'ccxws'

async function processTradeData (trade) {
  console.log(trade)
}

async function main (ticker, exchange = new ccxt.kraken()) {
  const ws = new KrakenClient()
  ws.on('trade', (trade) => processTradeData(trade))
  const krakenMarkets = (await exchange.fetchMarkets())
    .filter(x => x.base === ticker)
    .map(x => ({ id: x.id, base: x.base, quote: x.quote }))
  for (const market of krakenMarkets) {
    ws.subscribeTrades(market)
  }
}

main('XMR')
