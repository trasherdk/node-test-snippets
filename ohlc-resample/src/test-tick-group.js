import { tickGroupToOhlcv } from 'ohlc-resample'

const ticks = []
let time = 1671417731 // 2022-12-19 02:42:11 UTC
let count = 0
let volume = 0

while (count < 5) {
  ticks.push({
    time: time + (count * 60),
    price: count + 1,
    quantity: count + 2
  })
  volume += count + 2
  count++
}

ticks[2] = {
  time: time + (2 * 60),
  price: undefined,
  quantity: undefined
}

const result = tickGroupToOhlcv(time, ticks)

console.log(result)
