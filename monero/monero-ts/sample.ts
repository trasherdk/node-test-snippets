// import monero-ts (or import types individually)
import * as moneroTs from "monero-ts";
import assert from "node:assert";
import dotenv from "dotenv";

dotenv.config()
const {
  MONERO_HOST,
  MONERO_PORT_RPC_R
} = process.env

// connect to daemon
let daemon = await moneroTs.connectToDaemonRpc(`http://${MONERO_HOST}:${MONERO_PORT_RPC_R}`);
console.log('Connected:', await daemon.isConnected())

let height = await daemon.getHeight();        // 1523651
console.log('Chain height: %s', height)
/*
let txsInPool = await daemon.getTxPool();     // get transactions in the pool
console.log('Chain mempool: ', txsInPool)
*/
process.exit()

// create wallet from mnemonic phrase using WebAssembly bindings to monero-project
let walletFull = await moneroTs.createWalletFull({
  path: "sample_wallet_full",
  password: "supersecretpassword123",
  networkType: moneroTs.MoneroNetworkType.TESTNET,
  seed: "hefty value scenic...",
  restoreHeight: 573936,
  server: { // provide url or MoneroRpcConnection
    uri: "http://localhost:28081",
    username: "superuser",
    password: "abctesting123"
  }
});

// synchronize with progress notifications
await walletFull.sync(new class extends moneroTs.MoneroWalletListener {
  async onSyncProgress (height: number, startHeight: number, endHeight: number, percentDone: number, message: string) {
    // feed a progress bar?
  }
} as moneroTs.MoneroWalletListener);

// synchronize in the background every 5 seconds
await walletFull.startSyncing(5000);

// receive notifications when funds are received, confirmed, and unlocked
let fundsReceived = false;
await walletFull.addListener(new class extends moneroTs.MoneroWalletListener {
  async onOutputReceived (output: moneroTs.MoneroOutputWallet) {
    let amount = output.getAmount();
    let txHash = output.getTx().getHash();
    let isConfirmed = output.getTx().getIsConfirmed();
    let isLocked = output.getTx().getIsLocked();
    fundsReceived = true;
  }
});

// connect to wallet RPC endpoint and open wallet
let walletRpc = await moneroTs.connectToWalletRpc("http://localhost:28084", "rpc_user", "abc123");
await walletRpc.openWallet("sample_wallet_rpc", "supersecretpassword123");
let primaryAddress = await walletRpc.getPrimaryAddress(); // 555zgduFhmKd2o8rPUz...
let balance = await walletRpc.getBalance();   // 533648366742
let txs = await walletRpc.getTxs();           // get transactions containing transfers to/from the wallet

// send funds from RPC wallet to WebAssembly wallet
let createdTx = await walletRpc.createTx({
  accountIndex: 0,
  address: await walletFull.getAddress(1, 0),
  amount: BigInt("250000000000"), // send 0.25 XMR (denominated in atomic units)
  relay: false // create transaction and relay to the network if true
});
let fee = createdTx.getFee(); // "Are you sure you want to send... ?"
await walletRpc.relayTx(createdTx); // relay the transaction

// recipient receives unconfirmed funds within 5 seconds
await new Promise(function (resolve) { setTimeout(resolve, 5000); });
assert(fundsReceived);

// save and close WebAssembly wallet
await walletFull.close(true);
