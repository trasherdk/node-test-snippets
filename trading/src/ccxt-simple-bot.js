/**
 * Copy from: https://github.com/Ballantines87/CEX-TradBot-Simple-Script-Node.js
*/

import dotenv from 'dotenv'
const ccxt = require('ccxt')
const axios = require('axios')

dotenv.config()


// funzione che esegue la call allo script
const tick = async () => {
  // destrutturo le variabili 'asset' e 'base' da 'config'
  const { asset, base, spread, allocation } = config

  // stringa che rappresenta il mercato
  const market = `${asset}/${base}`

  /* cancello l'ordine del "tick" precedente, supponendo variazioni rispetto all prec. rilevazione di mercato
  "orders" sarà un array */
  const orders = await exchangeClient.fetchOpenOrders(market)

  // cancello l'ordine committato, passandone l'ID
  orders.forEach(async order => {
    await binanceClient.cancelOrder(order.id)
  })

  /* API Coingecko per ottenere il prezzo medio per il trade
  uso una Promise perchè devo fare due API calls successive - prima BTC vs USD e poi vs USDC */
  const results = await Promise.all([
    // libera consultazione all'API di CG - non c'è bisogno della API_KEY
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd')
  ])

  // ottengo il prezzo di mercato di BTC/USD e lo divido per il valore corrente USDT/USD
  // per avere BTC/USDT
  const marketPrice = results[0].data.bitcoin.usd / results[1].data.tether.usd

  /* parametri del nuovo ordine
  ... prezzo di vend. e prezzo di acquisto... */
  const sellPrice = marketPrice * (1 + spread)
  const buyPrice = marketPrice * (1 - spread)

  // ... e buy/sell volumes che dipendono dalla mia posizione corrente

  // fetchBalance() restituisce per tutte le crypto su Binance...
  const balances = await binanceClient.fetchBalance()
  // estraggo la posizione solo per BTC e USDT
  const assetBalance = balances.free[asset] // BTC
  const baseBalance = balances.free[base] // USDT

  // calcolo il sell volume
  const sellVolume = assetBalance * allocation
  const buyVolume = (baseBalance * allocation) * marketPrice

  // creo i limit-buy e limit-sell orders su Binance
  await binanceClient.createLimitSellOrder(market, sellVolume, sellPrice)
  await binanceClient.createLimitBuyOrder(market, buyVolume, buyPrice)

  console.log(
    `Nuova variazione (tick) di mercato ${market}...
        Nuovo limit sell order creato per ${sellVolume} al prezzo di vendita ${sellPrice}
        Nuovo limit buy order creato per ${buyVolume} al prezzo di acquisto ${buyPrice}`
  )
}

// funzione per avviare l'intero processo
const run = () => {
  // object di configurazione
  const config = {

    /*
    1. 2. assets da tradare,
    3. % del portfolio che allochiamo per ogni trade
    4. % che applico al mid-rate per creare il buy/sell limit order (e.g. BTC mid-rate 10 --> sell limit-order 12 buy limit-order 8)
    5. intervallo in ms in cui lo script rivaluta la posizione (general ratelimit 1-2 volte/sec) */
    asset: 'BTC',
    base: 'USDT',
    allocation: 0.1,
    spread: 0.2,
    tickInterval: 2000
  }

  // JS object che rappresenta la connessione all'API dell'exchange
  const exchangeClient = new ccxt.binance({
    // necessaria per operazioni di trading
    apiKey: process.env.API_ENV,
    secret: process.env.API_SECRET
  })

  tick(config, exchangeClient)
  /* chiama la funzione tick ad intervalli regolari (2sec) con setInterval passando
  come argomenti 'config' e 'binanceClient' */
  setInterval(tick, config.tickInterval, config)
}

run()
