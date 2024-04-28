"use strict";

import ccxt from 'ccxt';
import * as util from './utils.ts';

const exchange = new ccxt.kraken();

await exchange.loadMarkets();

const orderbook = await exchange.fetchOrderBook('XMR/EUR', 10)
const asks = util.groupByTicketSize(orderbook.asks, 0.05)

//console.log(asks)
for (let i = 0; i < 10; i++) {
	console.log(orderbook.asks[i], orderbook.bids[i])
}
