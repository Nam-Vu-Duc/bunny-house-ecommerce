const mongoose = require('mongoose')

const Schema = mongoose.Schema

const product = new Schema({
  brand: { type: String, default: '' },
  name: { type: String, default: '' },
  price: { type: Number, default: 0 },
  description: { type: String, default: '' },
  details: { type: String, default: '' },
  image: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now},
  updatedAt: { type: Date, default: Date.now},
})

module.exports = mongoose.model('product', product);