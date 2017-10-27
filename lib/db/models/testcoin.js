const mongoose = require('mongoose');
const util = require('./util');

const Schema = mongoose.Schema;

const CoinSchema = new Schema({
  blockhash: String,
  txs: Array
});

CoinSchema.index({ blockhash: 1 });
CoinSchema.index({ 'txs.hash': 1 });

CoinSchema.statics.saveTestCoins = function saveTestCoins(blockhash, txs) {
  const TestCoin = this.model('TestCoin');
  return new TestCoin({
    blockhash: 'somehash',
    txs: txs
  }).save();
};

CoinSchema.statics.getTestCoins = function getTestCoins(key) {
  return new Promise((res, rej) => {
    return this.model('Coin').findOne({ key },
    (err, coins) => {
      if (err) {
        return rej(err);
      }
      return coins ? res(coins.data) : res(coins);
    });
  });
};

CoinSchema.statics.hasTestCoins = function hasTestCoins(key) {
  return new Promise((res, rej) => {
    return this.model('Coin')
      .findOne({ key })
      .count((err, count) => {
        err ? rej(err) : res(count >= 1);
      });
  });
};

CoinSchema.statics.hasTestDupeCoins = function hasTestDupeCoins(key, height) {
  return new Promise((res, rej) => {
    return this.model('Coin')
      .findOne({
        key: key,
        height: { $lte: height }
      })
      .count((err, count) => {
        err ? rej(err) : res(count >= 1);
      });
  });
};

CoinSchema.statics.removeTestCoins = function removeTestCoins(key) {
  return this.model('Coin').find({ key }).remove();
};

module.exports = mongoose.model('TestCoin', CoinSchema);
