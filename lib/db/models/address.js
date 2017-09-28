const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  key: Buffer
});

AddressSchema.statics.saveAddress = function saveAddress(key) {
  const Address = this.model('Address');

  return new Address({
    key
  }).save();
};

AddressSchema.statics.getAddress = function getAddress(key) {
  return new Promise((res, rej) => {
    return this.model('Address').findOne({ key },
      (err, addr) => {
        if (err || !addr) {
          return rej(err);
        }
        return res(addr);
      });
  });
};

AddressSchema.statics.removeAddress = function removeAddress(key) {
  return this.model('Address').find({ key }).remove();
};

module.exports = mongoose.model('Address', AddressSchema);
