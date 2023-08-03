const axios = require("axios").default;
const LWSClient = require("@mymonero/mymonero-lws-client");
const monerojs = require("monero-javascript");

let txHashList = [];

const lws = async () => {
  const options = {
    httpClient: axios,
    url: "https://your-lws-server.com",
  };
  const lwsClient = new LWSClient(options);

  const privateViewKey =
    "your private view key";
  const address =
    "your main address";
  const createAccount = true;

  await lwsClient.login(privateViewKey, address, createAccount);

  const txs = await lwsClient.getAddressTxs(privateViewKey, address);

  txHashList = txs.transactions.map((tx) => tx.hash);
};


const moneroJs = async () => {
  // create full monero wallet with monero-js
  let wallet = await monerojs.createWalletFull({
    server: { uri: "http://your-monerod-node-url.com:18081" },
    networkType: "mainnet",
    mnemonic:
      "your seed phrase here",
  });

  // scan transactions pulled from LWS server
  await wallet.scanTxs(txHashList)

  // get all transaction info
  console.log(await wallet.getTxs())

  // get actual wallet balance
  console.log(await wallet.getBalance())

  // send monero to 82xdyLTyYsdRtBT8f8mnaXSavLgAd8tun8FjvNfiqXgPSxoZAWz1xgTYGfMupyK8VPA2AHeppjcZDS46QrgjGf6VMRBLcMs
  await wallet.createTx({
    accountIndex: 0,
    address: "82xdyLTyYsdRtBT8f8mnaXSavLgAd8tun8FjvNfiqXgPSxoZAWz1xgTYGfMupyK8VPA2AHeppjcZDS46QrgjGf6VMRBLcMs",
    amount: "634140000"
  })
};


lws();
moneroJs();
