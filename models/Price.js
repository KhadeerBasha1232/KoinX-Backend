const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  currency: String,
  price: Number,
  fetchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Price', priceSchema);
