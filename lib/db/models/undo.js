const mongoose = require('mongoose');
const util = require('./util');

const Schema = mongoose.Schema;

const UndoSchema = new Schema({
  key: Buffer,
  data: Buffer
});

UndoSchema.statics.saveUndos = function saveUndos(key, data, coin) {
  const Undo = this.model('Undo');
  return new Undo({
    key,
    data,
    version: coin.version,
    height: coin.height,
    coinbase: coin.coinbase,
    spent: coin.spent,
    output: coin.output
  }).save();
};

UndoSchema.statics.getUndos = function getUndos(key) {
  return new Promise((res, rej) => {
    return this.model('Undo').findOne({ key },
      (err, coins) => {
        if (err || !coins) {
          return rej(err);
        }
        return res(coins.data);
      });
  });
};

UndoSchema.statics.hasUndos = function hasUndos(key) {
  return new Promise((res, rej) => {
    return this.model('Undo').coung({ key }),
      (err, count) => {
        if (err) {
          return rej(err);
        } else {
          return res(count >= 1);
        }
      };
  });
};

UndoSchema.statics.removeUndos = function removeUndos(key) {
  return this.model('Undo').find({ key }).remove();
};

module.exports = mongoose.model('Undo', UndoSchema);
