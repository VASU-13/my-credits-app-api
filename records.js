
const mongoose = require('mongoose');

const transferSchema = mongoose.Schema({
  to: { type: String, required: true },
  from: { type: String, required: true },
  credit: { type: Number, required: true }
});


module.exports = mongoose.model('transferRecords', transferSchema);