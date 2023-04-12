//import fetch from 'node-fetch'
// const { json } = require("stream/consumers");

const data = {
  ZEUR: '0.0823',
  XXDG: '0.00000001',
  XXBT: '0.0000000100',
  XXMR: '10.2891328200',
  USDT: '0.00000000',
  XXRP: '0.00000000'
}

const totals = {}
Object.keys(data).map((key) => (totals[key] = 0))

console.log('totals:', totals)

const getAssetInfo = async (asset) => {
  console.log(`getAssetInfo("${asset}")`)
  const opts = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }
  const url = `https://api.kraken.com/0/public/Assets?asset=${asset}`

  try {
    const response = await fetch(url, opts)
    const json = await response.json()
    return json.result[asset]
  } catch (error) {
    reject(new Error(`Catched (${asset}): ${error}`))
  };
}

const main = async () => {
  const assets = {}
  console.log('Start main()')
  for await (const key of Object.keys(data)) {
    try {
      assets[key] = await getAssetInfo(key)
      console.log(key, assets[key])
    } catch (err) {
      console.log('main() catch:', err)
    }
  }
  console.log('End of main()')
}

await main()
console.log('After main()')
/*
Object.keys(data).forEach(async (key) => await getAssetInfo(key));
*/
console.log('End of program')
