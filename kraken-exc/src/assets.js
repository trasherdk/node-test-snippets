// import fetch from 'node-fetch'

const data = {
  ZEUR: '0.0823',
  XXDG: '0.00000001',
  XXBT: '0.0000000100',
  XXMR: '10.2891328200',
  USDT: '0.00000000',
  XXRP: '0.00000000',
};

const log = (msg) => {
  const doit = (callback) => {
    callback(msg);
  };
  doit(console.log);
};
const totals = {};
Object.keys(data).map((key) => (totals[key] = 0));

console.log('totals:', totals);

const getAssetInfo = async (asset) => {
  console.log(`getAssetInfo("${asset}")`);

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const opts = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  const url = `https://api.kraken.com/0/public/Assets?asset=${asset}`

  let info;
  try {
    const response = await fetch(url, opts)
    info = await response.json()
  } catch (error) {
    console.log(`Catched (${asset}): ${error}`);
    return {};
  };
  return info.result[asset];
};

const assets = {};
for (const key of Object.keys(data)) {
  assets[key] = await getAssetInfo(key);
  console.log(key, assets[key]);
}
console.log('End of program')

// Object.keys(data).forEach((key) => getAssetInfo(key));
