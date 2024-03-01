const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug)

const Schema = mongoose.Schema

const order = new Schema({
  products: [
    {
      name: String,
      quantity: Number
    }
  ],
  customerInfo: {
    name: String,
    phone: String,
    address: String,
    note: String
  },
  totalProductPrice: Number,
  status: { type: String, default: 'preparing' },
  deletedAt: {type: Date, default: null }
}, { timestamps: true })

module.exports = mongoose.model('order', order);
