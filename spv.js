'use strict';

const bcoin = require('.');
const Chain = bcoin.chain;
const Pool = bcoin.pool;
const WalletDB = bcoin.walletdb;

bcoin.set('main');

// SPV chains only store the chain headers.
const chain = Chain({
  dbname: 'spv',
  dbhost: 'localhost',
  location: process.env.HOME + '/spvchain',
  spv: true
});

const pool = new Pool({
  chain: chain,
  spv: true,
  maxPeers: 8
});

const walletdb = new WalletDB({ db: 'memory' });

(async () => {
  await pool.open();
  // await walletdb.open();

  //  const wallet = await walletdb.create();

  // console.log('Created wallet with address %s', wallet.getAddress('base58'));

  // Add our address to the spv filter.
  pool.watchAddress('19iVyH1qUxgywY8LJSbpV4VavjZmyuEyxV');

  // Connect, start retrieving and relaying txs
  await pool.connect();

  // Start the blockchain sync.
  pool.startSync();
})().catch((err) => {
  console.error(err.stack);
  process.exit(1);
});
